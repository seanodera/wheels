import CustomCarousel from "@/components/customCarousel.tsx";
import ListingComponent from "@/components/listingComponent.tsx";
import {useAppSelector} from "@/store/hooks.ts";

export default function NewListings() {
const {newListings} = useAppSelector(state => state.wheels);
    return <CustomCarousel title={'Newly Listed'} description={'Get them fresh'} items={5}>
        {newListings.map((item,index) =>
            <div className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === newListings.length - 1  ? "pr-0" : ""}`} `}>
                {<ListingComponent key={item.id} listing={item}/>}
            </div>
        )}
    </CustomCarousel>
}
