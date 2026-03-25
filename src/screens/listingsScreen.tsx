import ListingBanner from "@/components/listings/banner.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import ListingComponent from "@/components/listingComponent.tsx";
import CustomCarousel from "@/components/customCarousel.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchListingAsync} from "@/store/reducers/listingSlice.ts";
import type {CarItem} from "@/types";
import {isCarAuction} from "@/utils";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";


export default function ListingsScreen(){
    const dispatch = useAppDispatch();
    const {popularListings, newListings, loading} = useAppSelector((state) => state.listing);
    const itemsToShow = 5;

    useEffect(() => {
        if (!popularListings.length && !newListings.length) {
            dispatch(fetchListingAsync({page: 1, pageSize: 24}));
        }
    }, [dispatch, newListings.length, popularListings.length]);

    if (loading && !popularListings.length && !newListings.length) {
        return <LoadingScreen/>;
    }

    return <div className={'space-y-8 pb-8'}>
        <ListingBanner/>
        <CustomCarousel className={'px-4 lg:px-16'} title={'Popular Listings'} description={'Everybody is looking at them!'} items={itemsToShow}>
            {popularListings.map((item: CarItem, index: number) =>
                <div key={`popular-${item.id}-${index}`} className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % itemsToShow === 0 || index === popularListings.length - 1  ? "pr-0" : ""}`} `}>
                    {isCarAuction(item) ? <AuctionItem listing={item}/> : <ListingComponent listing={item}/>}
                </div>
            )}
        </CustomCarousel>
        <CustomCarousel className={'px-4 lg:px-16'} title={'Newly Listed'} description={'Get them fresh'} items={itemsToShow}>
            {newListings.map((item: CarItem, index: number) =>
                <div key={`new-${item.id}-${index}`} className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % itemsToShow === 0 || index === newListings.length - 1  ? "pr-0" : ""}`} `}>
                    {isCarAuction(item) ? <AuctionItem listing={item}/> : <ListingComponent listing={item}/>}
                </div>
            )}
        </CustomCarousel>
    </div>
}
