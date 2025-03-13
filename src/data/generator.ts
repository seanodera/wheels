import { faker } from "@faker-js/faker";

export function generateCarAuction(id: number) {
    const vehicle = faker.vehicle;
    return {
        id,
        images: Array.from({ length: 12 }, () => faker.image.urlPicsumPhotos({ grayscale: false })),
        name: "Luxury Sports Car",
        currentBid: faker.number.int({ min: 10000, max: 100000 }),
        startingBid: faker.number.int({ min: 100, max: 5000 }),
        ending: faker.date.soon({ days: 7 }).toISOString(),
        year: faker.number.int({ min: 2015, max: 2024 }),
        brand: vehicle.manufacturer(),
        model: vehicle.model(),
        millage: faker.number.int({ min: 500, max: 100000 }),
        transmission: faker.helpers.arrayElement(["Automatic", "Manual", "Other"]),
        engine: `${faker.number.float({ min: 1.5, max: 6.5, multipleOf: 0.1 })}L ${faker.vehicle.fuel()}`,
        capacity: faker.number.int({ min: 2, max: 7 }).toString(),
        drivetrain: faker.helpers.arrayElement(["FWD", "RWD", "AWD", "4WD"]),
        body: vehicle.type(),
        vin: vehicle.vin(),
        titleStatus: faker.helpers.arrayElement(["Clean", "Salvage", "Rebuilt"]),
        color: faker.color.human(),
        interior: `${faker.color.human()} Leather`,
        bids: [],
        comments: [],
        description: {
            general: "A well-maintained luxury sports car.",
            highlights: "Low mileage, premium interior.",
            equipment: "BOSE sound system, adaptive cruise control.",
            modifications: "Aftermarket exhaust system.",
            knownFlaws: "Minor scratch on rear bumper.",
            serviceHistory: "Full dealership service records.",
            ownershipHistory: "Single owner.",
            sellerNotes: "Car is in excellent condition, ready for a new owner."
        },
        video: [],
        tags: ["Luxury", "Sports", "Low Mileage"]
    };
}
