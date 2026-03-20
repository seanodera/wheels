
import CustomCarousel from "@/components/customCarousel.tsx";
import CarouselItem from "@/components/common/carouselItem.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function AuctionBanner() {
    const {endingSoon, auctions} = useAppSelector((state) => state.auction);
    const featured = (endingSoon.length ? endingSoon : auctions).slice(0, 9);

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
