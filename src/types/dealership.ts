import type {Address} from "./common";

export interface Dealership {
    id: string;
    name: string;
    images: string[];
    profile?: string;
    banner?: string;
    email: string;
    phone: string;
    type: 'individual' | 'company';
    locations: Address[];
    rating: number;
    description: string;
    phoneNumber: string;
    listingCount: number;
    auctionCount: number;
    soldCount: number;
    views: number;
}

export interface DealerUser {
    id: string;
    dealerId: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'employee';
    email: string;
    profile?: string;
}
