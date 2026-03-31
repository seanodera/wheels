import type {CommentItem} from "./users";
import type {Dealership} from "@/types/dealership.ts";
import {Profile} from "@/types/profile.ts";

export interface CarDescription {
    general: string;
    highlights?: string;
    equipment?: string;
    modifications?: string;
    knownFlaws?: string;
    serviceHistory?: string;
    ownershipHistory?: string;
    sellerNotes?: string;
}

export interface BaseCar {
    id: string;
    type: "auction" | "listing";
    images: string[];
    name: string;
    year: number;
    brand: string;
    model: string;
    mileage: number;
    transmission:
        | "Automatic"
        | "Manual"
        | "CVT"
        | "Semi-Automatic"
        | "Other";
    fuelType:
        | "Petrol"
        | "Diesel"
        | "Hybrid"
        | "Electric"
        | "Plug-in Hybrid";
    engine?: string;
    capacity?: string;
    drivetrain?: string;
    condition?: "new" | "used" | "salvage";
    owners?: number;
    body: string;
    vin?: string;
    titleStatus: string;
    color: string;
    interior?: string;
    interiorColor?: string;
    doors?: number;
    seats?: number;
    horsepower?: number;
    torque?: number;
    imported?: boolean;
    warranty?: boolean;
    verified?: boolean;
    featured?: boolean;
    views?: number;
    leadCount?: number;
    watchCount?: number;
    favorites?: number;
    comments?: CommentItem[];
    description: CarDescription;
    video: string[];
    tags: string[];
    createdAt: string;
    seller: Dealership;
    isDealer?: boolean;
    published?:boolean;
    active?: "active" | "inactive" | "sold" | "pending" | "expired" | "live" | "draft";
    sellerId: string;
}

export interface CarItem extends BaseCar {
    type: "listing";
    price: number;
    negotiable?: boolean;
}

export interface CarAuction extends BaseCar {
    auctionId: string;
    vehicleId: string;
    type: "auction";
    startingBid: number;
    currentBid: number;
    reservePrice?: number;
    ending: string;
    bids?: AuctionBid[];
    totalBids: number;
}

export interface ListingFilters {
    brand?: string;
    model?: string;
    body?: string;
    transmission?: CarItem["transmission"];
    minPrice?: number;
    maxPrice?: number;
    query?: string;
}

export interface AuctionBid {
    id: string;
    auctionId: string;
    userId: string;
    amount: number;
    createdAt: string;
    vehicleId: string;
    user?: Profile;
}