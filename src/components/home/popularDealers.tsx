import CustomCarousel from "@/components/common/customCarousel.tsx";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function PopularDealers() {
    const {popularDealers} = useAppSelector(state => state.wheels);
    return <CustomCarousel title={'Popular Dealers'} description={'The well known dealers'} items={4}>
        {popularDealers.map((dealer, index) => <DealerItem className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === popularDealers.length - 1  ? "pr-0" : ""}`} `} key={dealer.id} dealer={dealer}/>)}
    </CustomCarousel>
}
