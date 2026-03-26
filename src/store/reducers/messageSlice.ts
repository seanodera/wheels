import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Conversation, ConversationParticipant, Message} from "@/types";
import type {RootState} from "@/store";
import {keysToCamelCase, normalizeError} from "@/utils";
import {supabase} from "@/utils/supabase.ts";

interface MessageState {
    currentConversation?: Conversation;
    conversations: Conversation[];
    page: number;
    totalConversations: number;
    hasMore: boolean;
    loading: boolean;
    fetchedPages: number[];
    hasError: boolean;
    errorMessage: string;
}

interface FetchConversationResult {
    conversations: Conversation[];
    page: number;
    total: number;
}

interface ReceivedMessagePayload {
    conversation: Conversation;
    message: Message;
}

type RawConversationRow = Record<string, unknown> & {
    participants?: Record<string, unknown>[];
    messages?: Record<string, unknown>[];
};

const initialState: MessageState = {
    hasMore: false,
    conversations: [],
    errorMessage: "",
    fetchedPages: [],
    hasError: false,
    loading: false,
    page: 0,
    totalConversations: 0
};

function mapParticipants(input: unknown): ConversationParticipant[] {
    return Array.isArray(input)
        ? input.map((participant) => keysToCamelCase<ConversationParticipant>(participant))
        : [];
}

function mapMessages(input: unknown): Message[] | undefined {
    if (!Array.isArray(input)) {
        return undefined;
    }

    return input
        .map((message) => keysToCamelCase<Message>(message))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function mapConversation(row: RawConversationRow): Conversation {
    const mapped = keysToCamelCase<Omit<Conversation, "participants" | "messages">>(row);
    return {
        ...mapped,
        participants: mapParticipants(row.participants),
        messages: mapMessages(row.messages)
    };
}

function upsertConversation(
    conversations: Conversation[],
    conversation: Conversation
) {
    return [
        conversation,
        ...conversations.filter((item) => item.id !== conversation.id)
    ];
}

async function fetchConversationSummaries(
    customerId: string,
    page: number,
    limit: number
): Promise<FetchConversationResult> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const response = await supabase
        .from("conversations")
        .select(`
            *,
            participants:conversation_participants(*),
            last_message:messages!conversations_last_message_id_fkey(*)
        `, {count: "exact"})
        .eq("customer_user_id", customerId)
        .order("last_message_at", {ascending: false, nullsFirst: false})
        .range(start, end);

    if (response.error) {
        throw new Error(response.error.message);
    }

    const conversations = (response.data ?? []).map((row) => {
        const mapped = mapConversation(row as RawConversationRow);
        const lastMessage = Array.isArray((row as Record<string, unknown>).last_message)
            ? undefined
            : keysToCamelCase<Message>((row as Record<string, unknown>).last_message);

        return {
            ...mapped,
            lastMessage
        };
    });

    return {
        conversations,
        page,
        total: response.count ?? conversations.length
    };
}

async function fetchConversationById(
    customerId: string,
    conversationId: string
): Promise<Conversation> {
    const conversationResponse = await supabase
        .from("conversations")
        .select(`
            *,
            participants:conversation_participants(*),
            last_message:messages!conversations_last_message_id_fkey(*)
        `)
        .eq("id", conversationId)
        .eq("customer_user_id", customerId)
        .single();

    if (conversationResponse.error) {
        throw new Error(conversationResponse.error.message);
    }

    const messagesResponse = await supabase
        .from("messages")
        .select(`
            *,
            attachments:message_attachments(*),
            references:message_references(*)
        `)
        .eq("conversation_id", conversationId)
        .is("deleted_at", null)
        .order("created_at", {ascending: true});

    if (messagesResponse.error) {
        throw new Error(messagesResponse.error.message);
    }

    const conversation = mapConversation({
        ...(conversationResponse.data as RawConversationRow),
        messages: messagesResponse.data ?? []
    });

    const lastMessage = Array.isArray((conversationResponse.data as Record<string, unknown>).last_message)
        ? undefined
        : keysToCamelCase<Message>((conversationResponse.data as Record<string, unknown>).last_message);

    return {
        ...conversation,
        lastMessage
    };
}

export const fetchConversationsAsync = createAsyncThunk<
    FetchConversationResult,
    {
        page?: number;
        limit?: number;
    },
    { state: RootState; rejectValue: string }
>(
    "messages/fetch",
    async ({page = 1, limit = 20}, {getState, rejectWithValue}) => {
        try {
            const userId = getState().authentication.user?.id;
            if (!userId) {
                return rejectWithValue("No authenticated user");
            }

            return await fetchConversationSummaries(userId, page, limit);
        } catch (error) {
            return rejectWithValue(normalizeError(error, "Failed to fetch conversations"));
        }
    }
);

export const setCurrentConversation = createAsyncThunk<
    Conversation,
    string,
    { state: RootState; rejectValue: string }
>(
    "messages/setCurrentConversation",
    async (id, {getState, rejectWithValue}) => {
        try {
            const userId = getState().authentication.user?.id;
            if (!userId) {
                return rejectWithValue("No authenticated user");
            }

            return await fetchConversationById(userId, id);
        } catch (error) {
            return rejectWithValue(normalizeError(error, "Failed to load conversation"));
        }
    }
);

export const sendMessageAsync = createAsyncThunk<
    Message,
    { conversationId: string; content: string },
    { state: RootState; rejectValue: string }
>(
    "messages/sendMessage",
    async ({conversationId, content}, {getState, rejectWithValue}) => {
        try {
            const trimmedContent = content.trim();
            if (!trimmedContent) {
                return rejectWithValue("Message cannot be empty");
            }

            const state = getState();
            const userId = state.authentication.user?.id;
            const currentConversation = state.messages.currentConversation;

            if (!userId || !currentConversation || currentConversation.id !== conversationId) {
                return rejectWithValue("Conversation is not available");
            }

            const authResponse = await supabase.auth.getUser();
            if (authResponse.error) {
                return rejectWithValue(authResponse.error.message);
            }

            const authUserId = authResponse.data.user?.id;
            if (!authUserId) {
                return rejectWithValue("Session expired. Please log in again.");
            }

            const sender = currentConversation.participants.find((participant) =>
                participant.userId === authUserId
                && participant.role === "customer"
            );

            if (!sender) {
                return rejectWithValue("No user participant found for this conversation");
            }

            const insertResponse = await supabase
                .from("messages")
                .insert({
                    conversation_id: conversationId,
                    sender_participant_id: sender.id,
                    content: trimmedContent,
                    type: "text",
                    visibility: "all"
                })
                .select("*")
                .single();

            if (insertResponse.error) {
                return rejectWithValue(insertResponse.error.message);
            }

            const message = keysToCamelCase<Message>(insertResponse.data);

            const updateResponse = await supabase
                .from("conversations")
                .update({
                    last_message_id: message.id,
                    last_message_preview: message.content,
                    last_message_at: message.createdAt,
                    updated_at: message.createdAt,
                    unread_count_for_customer: (currentConversation.unreadCountForCustomer ?? 0) + 1
                })
                .eq("id", conversationId)
                .eq("customer_user_id", userId);

            if (updateResponse.error) {
                return rejectWithValue(updateResponse.error.message);
            }

            return message;
        } catch (error) {
            return rejectWithValue(normalizeError(error, "Failed to send message"));
        }
    }
);

export const receiveMessageAsync = createAsyncThunk<
    ReceivedMessagePayload,
    string,
    { state: RootState; rejectValue: string }
>(
    "messages/receiveMessage",
    async (messageId, {getState, rejectWithValue}) => {
        try {
            const userId = getState().authentication.user?.id;
            if (!userId) {
                return rejectWithValue("No authenticated user");
            }

            const messageResponse = await supabase
                .from("messages")
                .select(`
                    *,
                    attachments:message_attachments(*),
                    references:message_references(*)
                `)
                .eq("id", messageId)
                .single();

            if (messageResponse.error) {
                return rejectWithValue(messageResponse.error.message);
            }

            const message = keysToCamelCase<Message>(messageResponse.data);
            const conversation = await fetchConversationById(userId, message.conversationId);

            return {
                conversation,
                message
            };
        } catch (error) {
            return rejectWithValue(normalizeError(error, "Failed to receive message"));
        }
    }
);

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearCurrentConversation(state) {
            state.currentConversation = undefined;
        },
        markConversationRead(state, action: PayloadAction<string>) {
            const conversation = state.conversations.find((item) => item.id === action.payload);
            if (!conversation) return;
            conversation.unreadCountForCustomer = 0;
            if (state.currentConversation?.id === action.payload) {
                state.currentConversation = {
                    ...state.currentConversation,
                    unreadCountForCustomer: 0
                };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversationsAsync.pending, (state) => {
                state.loading = true;
                state.hasError = false;
            })
            .addCase(fetchConversationsAsync.fulfilled, (state, action) => {
                const {conversations, page, total} = action.payload;
                state.loading = false;

                if (page === 1) {
                    state.conversations = conversations;
                    state.fetchedPages = [1];
                    state.page = 1;
                    state.totalConversations = total;
                    state.hasMore = conversations.length < total;
                    return;
                }

                if (state.fetchedPages.includes(page)) {
                    return;
                }

                state.page = page;
                state.totalConversations = total;
                state.conversations.push(...conversations.filter((conversation) =>
                    !state.conversations.some((existing) => existing.id === conversation.id)
                ));
                state.fetchedPages.push(page);
                state.hasMore = state.conversations.length < total;
            })
            .addCase(fetchConversationsAsync.rejected, (state, action) => {
                state.loading = false;
                state.hasError = true;
                state.errorMessage = (action.payload as string) ?? action.error.message ?? "Failed to fetch conversations";
            })
            .addCase(setCurrentConversation.pending, (state) => {
                state.loading = true;
                state.hasError = false;
                state.errorMessage = "";
            })
            .addCase(setCurrentConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConversation = action.payload;
                state.conversations = upsertConversation(state.conversations, action.payload);
            })
            .addCase(setCurrentConversation.rejected, (state, action) => {
                state.loading = false;
                state.hasError = true;
                state.errorMessage = (action.payload as string) ?? action.error.message ?? "Failed to load conversation";
            })
            .addCase(sendMessageAsync.pending, (state) => {
                state.hasError = false;
                state.errorMessage = "";
            })
            .addCase(sendMessageAsync.fulfilled, (state, action) => {
                if (!state.currentConversation) {
                    return;
                }

                const updatedConversation: Conversation = {
                    ...state.currentConversation,
                    messages: [...(state.currentConversation.messages ?? []), action.payload],
                    lastMessage: action.payload,
                    lastMessageId: action.payload.id,
                    lastMessagePreview: action.payload.content,
                    lastMessageAt: action.payload.createdAt,
                    updatedAt: action.payload.createdAt,
                    unreadCountForCustomer: (state.currentConversation.unreadCountForCustomer ?? 0) + 1
                };

                state.currentConversation = updatedConversation;
                state.conversations = upsertConversation(state.conversations, updatedConversation);
            })
            .addCase(sendMessageAsync.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = (action.payload as string) ?? action.error.message ?? "Failed to send message";
            })
            .addCase(receiveMessageAsync.fulfilled, (state, action) => {
                const {conversation} = action.payload;
                state.conversations = upsertConversation(state.conversations, conversation);
                if (state.currentConversation?.id === conversation.id) {
                    state.currentConversation = conversation;
                }
            })
            .addCase(receiveMessageAsync.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = (action.payload as string) ?? action.error.message ?? "Failed to receive message";
            });
    }
});

export const {
    clearCurrentConversation,
    markConversationRead
} = messageSlice.actions;

export default messageSlice;
