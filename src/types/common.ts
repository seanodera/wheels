export interface Address {
    id: string;
    label?: string; // “Home”, “Work”, etc.
    country: string;
    county: string;
    subCounty?: string;
    city?: string;
    street?: string;
    postalCode?: string;
    isDefault?: boolean;
}


export interface MessageReference {
    type: "vehicle" | "offer";
    id: string;
}

export interface MessageAttachment {
    id: string;
    url: string;
    name: string;
    size?: number;
}

export interface Message {
    id: string;

    conversationId: string;

    senderId: string;
    receiverId: string;

    content: string;

    type?: "text" | "image" | "file" | "system";

    attachments?: MessageAttachment[];

    references?: MessageReference[];

    createdAt: string;

    readAt?: string;
}

export interface Conversation {
    id: string;

    buyerId: string;
    sellerId: string;

    vehicleId: string;
    vehicleTitle: string;

    buyerName: string;
    sellerName: string;

    buyerAvatar?: string;
    sellerAvatar?: string;

    messages?: Message[];

    lastMessage?: Message;

    unreadCount?: number;

    updatedAt: string;
}

export interface Location {
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