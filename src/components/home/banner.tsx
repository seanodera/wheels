import {generateCarAuction, generateCarListing} from "@/data/generator.ts";
import CustomCarousel from "@/components/customCarousel.tsx";
import {faker} from "@faker-js/faker";
import CarouselItem from "@/components/common/carouselItem.tsx";


export default function HomeBanner() {
    const featured = Array.from({length: 9}, (_, id) => faker.datatype.boolean()? generateCarAuction(id) : generateCarListing(id));

    return (
        <div className="px-4 lg:px-16 w-screen pt-4">
            <CustomCarousel items={1} autoPlay>
                {featured.map((car) => (
                    <CarouselItem key={car.id} featured={car}/>
                ))}
            </CustomCarousel>
        </div>
    );
}

