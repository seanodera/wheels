import CustomCarousel from "@/components/customCarousel.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function AuctionsEndingSoon() {
    const {auctionsEndingSoon} = useAppSelector(state => state.wheels);
    return <CustomCarousel title={'Auctions Ending Soon'} description={'Get right in before time runs out'} items={4}>
        {auctionsEndingSoon.map((listing,index) => (
            <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === auctionsEndingSoon.length - 1  ? "pr-0" : ""}`} `}>
                <AuctionItem key={listing.id} listing={listing}/>
            </div>
        ))}
    </CustomCarousel>
}
