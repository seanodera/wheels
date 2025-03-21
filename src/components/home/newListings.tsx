import CustomCarousel from "@/components/customCarousel.tsx";
import {isCarAuction} from "@/components/common.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import ListingComponent from "@/components/listingComponent.tsx";
import {faker} from "@faker-js/faker";
import {generateCarAuction, generateCarListing} from "@/data/generator.ts";

export default function NewListings() {
    const featured = Array.from({length: 9}, (_, id) => faker.datatype.boolean()? generateCarAuction(id) : generateCarListing(id));

    return <CustomCarousel title={'Newly Listed'} description={'Get them fresh'} items={5}>
        {featured.map((item,index) =>
            <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === featured.length - 1  ? "pr-0" : ""}`} `}>
                {isCarAuction(item) ? <AuctionItem listing={item}/> : <ListingComponent listing={item}/>}
            </div>
        )}
    </CustomCarousel>
}
