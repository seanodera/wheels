export interface CarAuction {
    id: number;
    images: string[];
    name: string;
    currentBid: number;
    startingBid: number;
    ending: string; // ISO string format for date
    year: number;
    brand: string;
    model: string;
    millage: number;
    transmission: 'Automatic' | 'Manual' | 'Other'; // If there are more options, update accordingly
    engine: string;
    capacity: string;
    drivetrain: string;
    body: string;
    vin: string;
    titleStatus: string;
    color: string;
    interior: string;
    bids: Bid[];
    comments: CommentItem[];
    description: CarDescription;
    video: string[]; // Assuming video URLs
    tags: string[];
    seller: User;
}

export interface CarDescription {
    general: string;
    highlights: string;
    equipment: string;
    modifications: string;
    knownFlaws: string;
    serviceHistory: string;
    ownershipHistory: string;
    sellerNotes: string;
}

export interface Bid {
    id: number;
    userId: number;
    user: User;
    amount: number;
    timestamp: string; // ISO format
}

export interface CommentItem {
    id: number;
    user: User;
    text: string;
    timestamp: string;
    replies?: CommentItem[];

}

export interface User {
    id: number;
    username: string;
    email: string;
    profile?: string;
}
