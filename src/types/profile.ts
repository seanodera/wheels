interface RecentLogin {
    device: string;
    location: string;
    date: Date;
}

export interface Profile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    profilePicture?: string;
    createdAt: string;
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
    security: {
        twoFactorAuth: boolean;
        recentLogins: RecentLogin[];
    };
}

export interface AuctionBid {
    id: number;
    car: string;
    bidAmount: number;
    status: "pending" | "won" | "lost";
}

export interface Transaction {
    id: string;
    type: "purchase" | "bid-payment" | "withdrawal" | "deposit";
    amount: number;
    date: Date;
    status: "completed" | "pending" | "failed";
}

export interface PaymentMethod {
    type: "M-Pesa" | "Credit Card" | "Bank Transfer";
    number?: string;
    last4?: string;
}
