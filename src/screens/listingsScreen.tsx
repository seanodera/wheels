import ListingBanner from "@/components/listings/banner.tsx";
import {isCarAuction} from "@/components/common.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import ListingComponent from "@/components/listingComponent.tsx";
import CustomCarousel from "@/components/customCarousel.tsx";
import {generateCarListing} from "@/data/generator.ts";


export default function ListingsScreen(){
    const popularListings = Array.from({length: 9}, (_, id) => generateCarListing(id));
    const newListings = Array.from({length: 9}, (_, id) => generateCarListing(id));
    const itemsToShow = 5;


    return <div className={'space-y-8 pb-8'}>
        <ListingBanner/>
        <CustomCarousel title={'Popular Listings'} description={'Everybody is looking at them!'} items={itemsToShow}>
            {popularListings.map((item,index) =>
                <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % itemsToShow === 0 || index === popularListings.length - 1  ? "pr-0" : ""}`} `}>
                    {isCarAuction(item) ? <AuctionItem listing={item}/> : <ListingComponent listing={item}/>}
                </div>
            )}
        </CustomCarousel>
        <CustomCarousel title={'Newly Listed'} description={'Get them fresh'} items={itemsToShow}>
            {newListings.map((item,index) =>
                <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % itemsToShow === 0 || index === newListings.length - 1  ? "pr-0" : ""}`} `}>
                    {isCarAuction(item) ? <AuctionItem listing={item}/> : <ListingComponent listing={item}/>}
                </div>
            )}
        </CustomCarousel>
    </div>
}
