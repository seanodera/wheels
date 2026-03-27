import {useEffect, useRef, useState} from "react";
import {Avatar, Badge, Button, Empty, Grid, Input, Spin, Typography} from "antd";
import {ArrowLeftOutlined, SendOutlined} from "@ant-design/icons";
import {clearCurrentConversation, fetchConversationsAsync, markConversationRead, sendMessageAsync, setCurrentConversation, useAppDispatch, useAppSelector} from "@/store";
import type {Conversation} from "@/types";
import {formatDate} from "date-fns";

const {Title, Text} = Typography;
const {useBreakpoint} = Grid;

function getCustomerParticipant(conversation: Conversation) {
    return conversation.participants.find((participant) => participant.role === "customer");
}

function getDealerParticipant(conversation: Conversation) {
    return conversation.participants.find((participant) =>
        participant.role === "salesperson"
        || participant.role === "dealer_admin"
        || participant.role === "manager"
    );
}

export default function MessagesScreen() {
    const dispatch = useAppDispatch();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const screens = useBreakpoint();
    const isMobile = !screens.lg;
    const [draftMessage, setDraftMessage] = useState("");

    const {hasMore, loading, page, conversations, currentConversation} = useAppSelector(state => state.messages);
    const currentMessageCount = currentConversation?.messages?.length ?? 0;

    const handleLoadMore = () => {
        if (!hasMore || loading) return;

        dispatch(fetchConversationsAsync({page: page + 1}));
    };

    function setActiveConversation(id: string) {
        dispatch(setCurrentConversation(id));
    }

    useEffect(() => {
        dispatch(fetchConversationsAsync({page: 1}));
    }, [dispatch]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    handleLoadMore();
                }
            },
            {
                rootMargin: "120px 0px"
            }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loading, page]);

    useEffect(() => {
        if (!currentConversation) return;

        dispatch(markConversationRead(currentConversation.id));

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        });
    }, [dispatch, currentConversation?.id, currentMessageCount]);

    const handleSendMessage = async () => {
        if (!currentConversation || !draftMessage.trim()) {
            return;
        }

        await dispatch(sendMessageAsync({
            conversationId: currentConversation.id,
            content: draftMessage
        }));
        setDraftMessage("");
    };

    const showConversationList = !isMobile || !currentConversation;
    const showChatPane = !isMobile || Boolean(currentConversation);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden px-3 py-2 sm:px-4 md:px-6 lg:px-8">
            <div className="shrink-0 pb-4 sm:pb-6">
                <Title level={3} className="mb-1!">
                    Messages
                </Title>
                <Text type="secondary">
                    Chat with vehicle buyers and sellers
                </Text>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-lg lg:flex-row lg:gap-6">
                {/* Sidebar */}
                {showConversationList ? (
                <div className="flex min-h-0 w-full flex-col rounded-2xl! bg-white p-2 shadow-lg transition-all duration-300 dark:bg-dark lg:w-[320px] lg:shrink-0">
                    <div className="mb-2 shrink-0 px-2 lg:hidden">
                        <Text strong>Conversations</Text>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-1">
                        {conversations.map((conversation) => {
                            const dealer = conversation.participants.find((participant) => participant.role !== "customer");

                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() => setActiveConversation(conversation.id)}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors sm:px-4 ${
                                        currentConversation && currentConversation.id === conversation.id
                                            ? "bg-accent/50 hover:bg-accent/60"
                                            : "hover:bg-accent/20"
                                    }`}
                                >
                                    <Badge count={conversation.unreadCountForCustomer} size="small">
                                        <Avatar src={dealer?.avatar}>
                                            {dealer?.displayName?.[0] ?? "C"}
                                        </Avatar>
                                    </Badge>

                                    <div className="min-w-0 flex-1">
                                        <Text strong className="block truncate">
                                            {dealer?.displayName ?? "Customer"}
                                        </Text>

                                        <Text type="secondary" className="block truncate text-xs">
                                            {conversation.vehicleTitle ?? conversation.subject ?? "Vehicle inquiry"}
                                        </Text>

                                        <Text className="line-clamp-1! block text-xs">
                                            {conversation.lastMessagePreview ?? conversation.lastMessage?.content ?? "  "}
                                        </Text>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                        {hasMore ? <div ref={loadMoreRef} className="h-4 w-full shrink-0"/> : null}
                    </div>

                    {loading && hasMore ? (
                        <div className="shrink-0 py-3 text-center">
                            <Spin size="small"/>
                        </div>
                    ) : null}
                </div>
                ) : null}

                {/* Chat Area */}
                {showChatPane && currentConversation ? (
                    (() => {
                        const customer = getCustomerParticipant(currentConversation);
                        const dealer = getDealerParticipant(currentConversation);

                        return <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl! bg-white shadow-lg transition-all duration-300 dark:bg-dark">
                        {/* Chat Header */}
                        <div className="flex shrink-0 items-center gap-3 px-4 py-4 shadow-md sm:px-6">
                            {isMobile ? (
                                <Button
                                    type="text"
                                    icon={<ArrowLeftOutlined/>}
                                    onClick={() => dispatch(clearCurrentConversation())}
                                />
                            ) : null}
                            <Avatar src={dealer?.avatar}>
                                {dealer?.displayName?.[0] ?? "D"}
                            </Avatar>

                            <div className="min-w-0 flex flex-col">
                                <Text strong className="truncate">
                                    {dealer?.displayName ?? "Dealer"}
                                </Text>
                                <Text type="secondary" className="truncate text-xs">
                                    {currentConversation.vehicleTitle ?? currentConversation.subject ?? "Vehicle inquiry"}
                                </Text>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-6">
                            {currentConversation.messages && currentConversation.messages.length !== 0 ? (
                                currentConversation.messages.map((msg) => {
                                    const isMine = msg.senderParticipantId === customer?.id;

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`max-w-[85%] rounded-lg px-4 py-2 sm:max-w-[75%] lg:max-w-[60%] ${
                                                isMine
                                                    ? "self-end bg-primary text-white"
                                                    : "self-start bg-gray-100 text-black"
                                            }`}
                                        >
                                            <div className="wrap-break-word">{msg.content}</div>

                                            <div className="mt-1 text-xs opacity-70">
                                                {formatDate(msg.createdAt, 'dd MMM hh:mm')}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <Empty description="No messages yet" />
                            )}
                            <div ref={messagesEndRef}/>
                        </div>

                        {/* Message Input */}
                        <div className="flex shrink-0 gap-2 p-3 sm:p-4">
                            <Input
                                size="large"
                                placeholder="Type your message..."
                                value={draftMessage}
                                onChange={(event) => setDraftMessage(event.target.value)}
                                onPressEnter={() => void handleSendMessage()}
                            />

                            <Button
                                type="primary"
                                size="large"
                                icon={<SendOutlined />}
                                onClick={() => void handleSendMessage()}
                            />
                        </div>
                    </div>
                    })()
                ) : showConversationList ? (
                    <Empty
                        className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl! bg-white text-center shadow-lg transition-all duration-300 dark:bg-dark"
                        description="Your messages will appear here"
                    />
                ) : null}
            </div>
        </div>
    );
}
