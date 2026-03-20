import CustomCarousel from "@/components/customCarousel.tsx";
import CarouselItem from "@/components/common/carouselItem.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function HomeBanner() {
    const {featuredListings} = useAppSelector(state => state.wheels)
    return (
        <div className="px-4 lg:px-16 w-screen pt-4">
            <CustomCarousel items={1} autoPlay>
                {featuredListings.map((car) => (
                    <CarouselItem key={car.id} featured={car}/>
                ))}
            </CustomCarousel>
        </div>
    );
}

