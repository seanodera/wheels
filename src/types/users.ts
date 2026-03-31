export interface User {
    id: string;
    name: string;
    email: string;
    profile?: string;
}

export interface CommentItem {
    id: string;
    user: User;
    text: string;
    timestamp: string;
    replies?: CommentItem[];
}

export interface MiniDealer{
    id: string;
    name: string;
    profile?: string;
    listingCount: number;
    soldCount: number;
    views: number;
}
