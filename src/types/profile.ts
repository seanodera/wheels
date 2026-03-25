interface RecentLogin {
    device: string;
    location: string;
    date: string;
}

export interface VerificationStatus {
    emailVerified: boolean;
    phoneVerified: boolean;
    kycVerified: boolean;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
}

export interface UserPreferences {
    currency: string;
    language: string;
    notifications: NotificationPreferences;
}

export interface SecuritySettings {
    twoFactorAuth: boolean;
    recentLogins: RecentLogin[];
}

export interface Profile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    profilePicture?: string;
    createdAt: string;
    verification: VerificationStatus;
    preferences: UserPreferences;
    security: SecuritySettings;
}

export interface AuctionBidSummary {
    id: string;
    auctionId: string;
    bidAmount: number;
    createdAt: string;
    status: "pending" | "won" | "lost";
}

export interface Transaction {
    id: string;
    type: "purchase" | "bid-payment" | "withdrawal" | "deposit";
    amount: number;
    date: string;
    status: "completed" | "pending" | "failed";
}

export interface PaymentMethod {
    type: "M-Pesa" | "Credit Card" | "Bank Transfer";
    number?: string;
    last4?: string;
}

export interface UserMarketplaceActivity {
    savedListings: string[];
    savedAuctions: string[];
    watchedAuctions: string[];
    biddingAuctions: string[];
    bids: AuctionBidSummary[];
    transactions?: Transaction[];
    paymentMethods?: PaymentMethod[];
}
