import { Carousel, Typography } from "antd";
import { CarAuction } from "@/types.ts";
import { HighlightBackground } from "@/components/common.tsx";
import { faker } from '@faker-js/faker';


const { Title, Text } = Typography;

export default function HomeBanner() {
    const featured: CarAuction[] = [
        {
            id: 0,
            images: Array.from({ length: 12 }, () => faker.image.urlPicsumPhotos({grayscale: false})),
            name: "Luxury Sports Car",
            currentBid: 20000,
            startingBid: 200,
            ending: new Date().toISOString(),
            year: 2020,
            brand: "Porsche",
            model: "911",
            millage: 2000,
            transmission: "Automatic",
            engine: "3.0L Twin-Turbo",
            capacity: "2",
            drivetrain: "RWD",
            body: "Coupe",
            vin: "123456789",
            titleStatus: "Clean",
            color: "Red",
            interior: "Black Leather",
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
        }
    ];

    return (
        <div className="aspect-[20/7] w-screen">
            <Carousel autoplay>
                {featured.map((car) => (
                    <CarouselItem key={car.id} featured={car} />
                ))}
            </Carousel>
        </div>
    );
}

function CarouselItem({ featured }: { featured: CarAuction }) {
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-2 p-4">
            <div className="col-span-2 row-span-2 relative">
                <img
                    src={featured.images[0] || "/placeholder.jpg"}
                    className="w-full h-full object-fill rounded-lg aspect-video"
                    alt={`${featured.brand} ${featured.model}`}
                />
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                    <HighlightBackground>Featured</HighlightBackground>
                    <div>
                        <Title level={5} className="text-white">
                            {featured.year} {featured.brand} {featured.model}
                        </Title>
                        <Text type={'secondary'}>{featured.millage} miles · {featured.engine}</Text>
                    </div>
                </div>
            </div>

            {featured.images.slice(1, 5).map((img, index) => (
                <img
                    key={index}
                    src={img || "/placeholder.jpg"}
                    alt={`${featured.brand} ${featured.model}`}
                    className="w-full h-full object-cover rounded-lg aspect-video"
                />
            ))}
        </div>
    );
}
