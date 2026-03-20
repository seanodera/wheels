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

export interface Dealer {
    id: string;
    accountType: "individual" | "company";
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profile?: string;
    phone: string;
    rating: string;
    reviews: CommentItem[];
    images: string[];
    description: string;
    listingCount: number;
    auctionCount: number;
    soldCount: number;
    views: number;
    location: {
        latitude: number;
        longitude: number;
        street: string;
        city: string;
        state: string;
        country: string;
        location: string;
        district: string;
    };
}
