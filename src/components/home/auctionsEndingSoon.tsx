import CustomCarousel from "@/components/customCarousel.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import {useState} from "react";
import {CarAuction} from "@/types.ts";
import {generateCarAuction} from "@/data/generator.ts";


export default function AuctionsEndingSoon() {
    const [listings] = useState<CarAuction[]>(Array.from({length: 20}, (_, id) => generateCarAuction(id)));
    return <CustomCarousel title={'Auctions Ending Soon'} description={'Get right in before time runs out'} items={4}>
        {listings.sort((a, b) => new Date(a.ending).getTime() - new Date(b.ending).getTime()).slice(0,8).map((listing,index) => (
            <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === listings.length - 1  ? "pr-0" : ""}`} `}>
                <AuctionItem key={listing.id} listing={listing}/>
            </div>
        ))}
    </CustomCarousel>
}
