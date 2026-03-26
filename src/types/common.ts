export interface Address {
    country: string;
    county: string;
    subCounty: string;
    area: string;
    street: string;
    building?: string;
    latitude: number;
    longitude: number;
    name?: string;
}

export type ConversationStatus =
    | "open"
    | "waiting_on_customer"
    | "waiting_on_dealer"
    | "negotiating"
    | "won"
    | "lost"
    | "closed"
    | "archived";

export type ParticipantRole =
    | "customer"
    | "dealer_admin"
    | "salesperson"
    | "manager"
    | "system";

export type MessageType =
    | "text"
    | "image"
    | "file"
    | "system"
    | "offer"
    | "note";

export type MessageVisibility = "all" | "dealer_only";

export type OfferStatus =
    | "pending"
    | "countered"
    | "accepted"
    | "rejected"
    | "withdrawn"
    | "expired";

export interface MessageReference {
    type: "vehicle" | "offer" | "inspection" | "appointment" | "payment";
    id: string;
}

export interface MessageAttachment {
    id: string;
    url: string;
    name: string;
    mimeType?: string;
    size?: number;
    kind?: "document" | "image" | "invoice" | "inspection" | "other";
}

export interface ConversationParticipant {
    id: string;
    conversationId: string;
    userId?: string;
    role: ParticipantRole;
    displayName: string;
    avatar?: string;
    isActive: boolean;
    joinedAt: string;
    lastReadMessageId?: string;
    lastReadAt?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderParticipantId: string;
    type: MessageType;
    content: string;
    visibility: MessageVisibility;
    attachments?: MessageAttachment[];
    references?: MessageReference[];
    createdAt: string;
    editedAt?: string;
    deletedAt?: string;
    replyToMessageId?: string;
}

export interface ConversationOffer {
    id: string;
    conversationId: string;
    vehicleId: string;
    createdByParticipantId: string;
    amount: number;
    currency: string;
    status: OfferStatus;
    note?: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationEvent {
    id: string;
    conversationId: string;
    actorParticipantId?: string;
    type:
        | "conversation_created"
        | "participant_added"
        | "participant_removed"
        | "assigned"
        | "offer_created"
        | "offer_countered"
        | "offer_accepted"
        | "offer_rejected"
        | "vehicle_sold"
        | "status_changed";
    payload?: Record<string, unknown>;
    createdAt: string;
}

export interface Conversation {
    id: string;
    dealerId: string;
    customerUserId?: string;
    vehicleId?: string;
    listingId?: string;
    auctionId?: string;
    vehicleTitle?: string;
    subject?: string;
    status: ConversationStatus;
    assignedUserId?: string;
    participants: ConversationParticipant[];
    messages?: Message[];
    lastMessage?: Message;
    lastMessageId?: string;
    lastMessagePreview?: string;
    lastMessageAt?: string;
    unreadCountForDealer?: number;
    unreadCountForCustomer?: number;
    createdAt: string;
    updatedAt: string;
}


