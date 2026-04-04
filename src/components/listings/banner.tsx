
import CustomCarousel from "@/components/common/customCarousel.tsx";
import CarouselItem from "@/components/common/carouselItem.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function ListingBanner(){
    const {popularListings, newListings, listings} = useAppSelector((state) => state.listing);
    const featured = (popularListings.length ? popularListings : newListings.length ? newListings : listings).slice(0, 9);

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
