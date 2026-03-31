import {Typography} from "antd";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import CustomCarousel from "@/components/customCarousel.tsx";
import {useAppSelector} from "@/store/hooks.ts";

const {Title} = Typography;
export default function DealerBanner() {
    const {popularDealers} = useAppSelector((state) => state.wheels);
    const dealers = popularDealers.slice(0, 6);
    return <div className={'px-4 md:px-16'}>
        {/*<Title className={'p-4 !leading-none !my-0'} level={1}>Dealers</Title>*/}
        <Title className={'leading-none! my-0!'} level={3}>Featured Dealers</Title>


            <CustomCarousel items={3} autoPlay>
                {dealers.map((dealer, index) => <DealerItem square className={`px-4 mb-16 text-dark ${index === 0 ? "pl-0 pr-8" : `${index % 3 === 0 || index === dealers.length - 1  ? "pr-0 pl-8" : ""}`} `} key={dealer.id} dealer={dealer}/>)}
            </CustomCarousel>

    </div>
}
