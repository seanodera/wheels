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
    createdAt: string;
}


export interface CarItem{
    id: number;
    images: string[];
    name: string;
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
    comments: CommentItem[];
    description: CarDescription;
    video: string[]; // Assuming video URLs
    tags: string[];
    seller: User|Dealer;
    sellerId: number;
    createdAt: string;
    price: number;
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

export interface Dealer {
    id: number;
    name: string;
    email: string;
    profile?: string;
    phone: string;
    rating: string;
    reviews: CommentItem[];
    images: string[];
    description: string;
    listing_count: number;
    auction_count: number;
    sold_count: number;
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


export interface Profile {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    profilePicture?: string;
    createdAt: Date;

    // address: {
    //     city: string;
    //     country: string;
    //     zipCode?: string;
    // };

    verification: {
        emailVerified: boolean;
        phoneVerified: boolean;
        kycVerified: boolean;
    };

    preferences: {
        currency: string;
        language: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };

    // wishlist: CarListing[];
    // bids: AuctionBid[];
    // listings: CarListing[];
    // transactions: Transaction[];

    // wallet: {
    //     balance: number;
    //     paymentMethods: PaymentMethod[];
    // };

    security: {
        twoFactorAuth: boolean;
        recentLogins: RecentLogin[];
    };
}

// Interfaces for related objects


export interface AuctionBid {
    id: number;
    car: string;
    bidAmount: number;
    status: "pending" | "won" | "lost";
}

export interface Transaction {
    id: number;
    type: "purchase" | "bid-payment" | "withdrawal" | "deposit";
    amount: number;
    date: Date;
    status: "completed" | "pending" | "failed";
}

export interface PaymentMethod {
    type: "M-Pesa" | "Credit Card" | "Bank Transfer";
    number?: string;  // For M-Pesa
    last4?: string;  // For Credit Card
}

interface RecentLogin {
    device: string;
    location: string;
    date: Date;
}
