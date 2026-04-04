import CustomCarousel from "@/components/common/customCarousel.tsx";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function NewDealers(){
    const {newDealers} = useAppSelector(state => state.wheels);
    return <CustomCarousel title={'New Dealers'} description={'Recently joined dealers'} items={5}>
        {newDealers.map((dealer, index) => <DealerItem className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === newDealers.length - 1  ? "pr-0" : ""}`} `} key={dealer.id} dealer={dealer}/>)}
    </CustomCarousel>;
}
