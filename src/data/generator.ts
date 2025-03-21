import {faker} from "@faker-js/faker";
import {Bid, CarAuction, CarItem, CommentItem, Dealer} from "@/types.ts";

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[ currentIndex ], array[ randomIndex ]] = [array[ randomIndex ], array[ currentIndex ]];
    }
    return array;
}

// Generate bids that increase over time, starting from `startingBid`
function generateBids(startingBid: number, currentBid: number, auctionEnd: Date): Bid[] {
    const bidCount = faker.number.int({min: 5, max: 15}); // Random number of bids
    let bidAmount = startingBid;
    const timeStep = Math.floor((auctionEnd.getTime() - Date.now()) / bidCount); // Time increment per bid
    let lastBidTime = Date.now() - timeStep; // Start from past

    return Array.from({length: bidCount}, (_, i) => {
        const userId = faker.number.int({min: 2, max: 100});
        bidAmount += faker.number.int({min: 500, max: 5000}); // Increment bid amount
        lastBidTime += faker.number.int({min: 10 * 60 * 1000, max: 6 * 60 * 60 * 1000}); // Random time gaps

        return {
            id: i,
            userId,
            user: {
                id: userId,
                username: faker.internet.username(),
                email: faker.internet.email(),
            },
            amount: Math.min(bidAmount, currentBid), // Ensure we don’t exceed current bid
            timestamp: new Date(lastBidTime).toISOString(),
        };
    });
}

// Generate comments
function generateComments(): CommentItem[] {
    return Array.from({length: 7}, (_, i) => ({
        id: i,
        userId: faker.number.int({min: 2, max: 100}),
        user: {
            id: faker.number.int({min: 2, max: 100}),
            username: faker.internet.username(),
            email: faker.internet.email(),
        },
        text: faker.lorem.sentence(),
        timestamp: faker.date.recent().toISOString(),
    }));
}

// Generate car auction
export function generateCarAuction(id: number): CarAuction {
    const vehicle = faker.vehicle;
    const startingBid = faker.number.int({min: 700000, max: 4000000});
    const currentBid = faker.number.int({min: startingBid + 50000, max: startingBid + 5000000});
    const auctionEnd = faker.date.soon({days: 7});

    return {
        id,
        images: shuffle(Array.from({length: 29}, (_, index) => `/images/vehicle-${index + 1}.jpg`)),
        name: "Luxury Sports Car",
        currentBid,
        startingBid,
        ending: auctionEnd.toISOString(),
        year: faker.number.int({min: 2015, max: 2024}),
        brand: vehicle.manufacturer(),
        model: vehicle.model(),
        millage: faker.number.int({min: 500, max: 100000}),
        transmission: faker.helpers.arrayElement(["Automatic", "Manual", "Other"]),
        engine: `${faker.number.float({min: 1.5, max: 6.5, multipleOf: 0.1})}L ${faker.vehicle.fuel()}`,
        capacity: faker.number.int({min: 2, max: 7}).toString(),
        drivetrain: faker.helpers.arrayElement(["FWD", "RWD", "AWD", "4WD"]),
        body: vehicle.type(),
        vin: vehicle.vin(),
        titleStatus: faker.helpers.arrayElement(["Clean", "Salvage", "Rebuilt"]),
        color: faker.color.human(),
        interior: `${faker.color.human()} Leather`,
        bids: generateBids(startingBid, currentBid, auctionEnd),
        comments: generateComments(),
        description: {
            general: faker.lorem.paragraphs(2),
            highlights: faker.lorem.paragraphs(2),
            equipment: faker.lorem.paragraphs(2),
            modifications: faker.lorem.paragraphs(2),
            knownFlaws: faker.lorem.paragraphs(2),
            serviceHistory: faker.lorem.paragraphs(2),
            ownershipHistory: faker.lorem.paragraphs(2),
            sellerNotes: faker.lorem.paragraphs(2),
        },
        video: [],
        tags: ["Luxury", "Sports", "Low Mileage"],
        seller: {
            id: faker.number.int({min: 2, max: 8}),
            username: faker.internet.username(),
            email: faker.internet.email(),
        },
        createdAt: faker.date.recent({days: 4}).toISOString(),
    };
}

export function generateDealers(id: number): Dealer {
    const location = faker.location
    return {
        auction_count: faker.number.int({min: 0, max: 100}),
        description: faker.lorem.paragraph(40),
        listing_count: faker.number.int({min: 8, max: 100}),
        sold_count: faker.number.int({min: 0, max: 100}),
        views: faker.number.int({min: 0, max: 100}),
        email: faker.internet.email(),
        id: id,
        images: shuffle(Array.from({length: 9}, (_, index) => `/images/vehicle-${index + 1}.jpg`)),
        location: {
            city: location.city(),
            country: location.country(),
            district: location.county(),
            latitude: location.latitude(),
            location: location.secondaryAddress(),
            longitude: location.longitude(),
            state: location.state(),
            street: location.street()
        },
        name: faker.company.name(),
        phone: faker.phone.number(),
        rating: (faker.number.int({min: 0, max: 100}) / 10).toFixed(1),
        reviews: generateComments(),
        profile: `/images/vehicle-${faker.number.int({min: 1, max: 30})}.jpg`

    }
}

export function generateCarListing(id: number, dealer?: Dealer):CarItem {
    const vehicle = faker.vehicle;
    return {
        sellerId: dealer? dealer.id : faker.number.int({min: 0, max: 100}),
        id,
        images: shuffle(Array.from({length: 29}, (_, index) => `/images/vehicle-${index + 1}.jpg`)),
        name: "Luxury Sports Car",
        year: faker.number.int({min: 2015, max: 2024}),
        brand: vehicle.manufacturer(),
        model: vehicle.model(),
        millage: faker.number.int({min: 500, max: 100000}),
        transmission: faker.helpers.arrayElement(["Automatic", "Manual", "Other"]),
        engine: `${faker.number.float({min: 1.5, max: 6.5, multipleOf: 0.1})}L ${faker.vehicle.fuel()}`,
        capacity: faker.number.int({min: 2, max: 7}).toString(),
        drivetrain: faker.helpers.arrayElement(["FWD", "RWD", "AWD", "4WD"]),
        body: vehicle.type(),
        vin: vehicle.vin(),
        titleStatus: faker.helpers.arrayElement(["Clean", "Salvage", "Rebuilt", "Import", "New"]),
        color: faker.color.human(),
        interior: `${faker.color.human()} Leather`,
        comments: generateComments(),
        description: {
            general: faker.lorem.paragraphs(2),
            highlights: faker.lorem.paragraphs(2),
            equipment: faker.lorem.paragraphs(2),
            modifications: faker.lorem.paragraphs(2),
            knownFlaws: faker.lorem.paragraphs(2),
            serviceHistory: faker.lorem.paragraphs(2),
            ownershipHistory: faker.lorem.paragraphs(2),
            sellerNotes: faker.lorem.paragraphs(2),
        },
        video: [],
        tags: ["Luxury", "Sports", "Low Mileage"],
        seller: dealer? dealer :{
            id: faker.number.int({min: 2, max: 8}),
            username: faker.internet.username(),
            email: faker.internet.email(),
        },
        createdAt: faker.date.recent({days: 4}).toISOString(),
        price: faker.number.int({min: 700000, max: 4000000})
    };
}
