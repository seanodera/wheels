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
    comments: Comment[];
    description: CarDescription;
    video: string[]; // Assuming video URLs
    tags: string[];
}

interface CarDescription {
    general: string;
    highlights: string;
    equipment: string;
    modifications: string;
    knownFlaws: string;
    serviceHistory: string;
    ownershipHistory: string;
    sellerNotes: string;
}

interface Bid {
    userId: number;
    amount: number;
    timestamp: string; // ISO format
}

interface Comment {
    userId: number;
    text: string;
    timestamp: string; // ISO format
}
