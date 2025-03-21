
import DealerBanner from "@/components/dealer/banner.tsx";
import NewDealers from "@/components/dealer/newDealers.tsx";
import PopularDealers from "@/components/dealer/popularDealers.tsx";
import {Button, Typography} from "antd";

const {Title, Text} = Typography;
export default function DealerScreen() {
    // const [dealers ] = useState<Dealer[]>(Array.from({length: 20}, (_, id) => generateDealers(id)));
    return <div className={'space-y-24 pt-8 pb-24'}>
        <DealerBanner/>
        <NewDealers/>
        <PopularDealers/>
        <div className={'mx-auto max-w-5xl p-24 aspect-[20/8] rounded-lg bg-gradient-to-br from-primary-800 to-secondary-700 flex flex-col justify-center items-center space-y-6'}>
            <Title level={1}>Are You A Dealer</Title>
            <Text>Join and sell your cars to more people and host auctions</Text>
            <Button size={'large'} type={'primary'} ghost>Join Us</Button>
        </div>
    </div>
}


