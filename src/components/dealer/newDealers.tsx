import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import CustomCarousel from "@/components/common/customCarousel.tsx";
import {useAppSelector} from "@/store/hooks.ts";


export default function NewDealers() {
    const {newDealers} = useAppSelector((state) => state.wheels);
    return <div className={'px-4 lg:px-16'}>
        <CustomCarousel items={4} title={'Newly Joined Dealers'} description={'Discover new Dealers'}>
            {newDealers.map((dealer, index) => <DealerItem className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === newDealers.length - 1  ? "pr-0" : ""}`} `} key={dealer.id} dealer={dealer}/>)}

        </CustomCarousel>

    </div>
}
