
import { useState } from "react";
import { CarAuction } from "@/types.ts";
import AuctionItem from "@/components/auctionItem.tsx";
import {generateCarAuction} from "@/data/generator.ts";


export default function Auctions() {
    const [listings] = useState<CarAuction[]>(Array.from({ length: 20 }, (_, id) => generateCarAuction(id)));

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-8 py-4 px-16">
            {listings.map((listing) => (
                <AuctionItem key={listing.id} listing={listing} />
            ))}
        </div>
    );
}
