import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import CustomCarousel from "@/components/customCarousel.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function PopularDealers() {
    const {popularDealers} = useAppSelector((state) => state.wheels);
    const dealers = popularDealers.slice(0, 6);
    return <div className={'px-4 lg:px-16'}>
        <CustomCarousel items={4} autoPlay>
            {dealers.map((dealer, index) => <DealerItem square className={`px-4 mb-16 text-dark ${index === 0 ? "pl-0 pr-8" : `${index % 3 === 0 || index === dealers.length - 1  ? "pr-0 pl-8" : ""}`} `} key={dealer.id} dealer={dealer}/>)}
        </CustomCarousel>
    </div>
}
