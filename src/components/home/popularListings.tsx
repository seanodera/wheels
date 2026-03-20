import CustomCarousel from "@/components/customCarousel.tsx";
import {useAppSelector} from "@/store/hooks.ts";
import ListingComponent from "@/components/listingComponent.tsx";

export default function PopularListings(){
    const {popularListings} = useAppSelector(state => state.wheels);
    return <CustomCarousel title={'Popular Listings'} description={'Everybody is looking at them!'} items={5}>
        {popularListings.map((item,index) =>
            <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === popularListings.length - 1  ? "pr-0" : ""}`} `}>
                {<ListingComponent key={item.id} listing={item}/>}
            </div>
        )}
    </CustomCarousel>
}


