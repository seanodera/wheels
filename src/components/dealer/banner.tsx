import {generateDealers} from "@/data/generator.ts";
import {useState} from "react";
import {Dealer} from "@/types.ts";
import {Carousel, ConfigProvider, Typography} from "antd";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";

const {Title} = Typography;
export default function DealerBanner() {
    const [dealers ] = useState<Dealer[]>(Array.from({length: 20}, (_, id) => generateDealers(id)));
    return <div className={'px-16'}>
        {/*<Title className={'p-4 !leading-none !my-0'} level={1}>Dealers</Title>*/}
        <Title className={'!leading-none !my-0'} level={3}>Featured Dealers</Title>
        <ConfigProvider theme={{
            "token": {
                "colorPrimary": "#00e5ff",
            },

        }}>
            <Carousel autoplay  dots={{className: '!text-primary !fill-primary'}} className={"mt-4 !gap-4"} arrows slidesToShow={3}>
                {dealers.slice(0,6).map((dealer: Dealer, index) => <DealerItem square className={`px-4 mb-16 text-dark ${index === 0 ? "pl-0 pr-8" : `${index % 3 === 0 || index === dealers.length - 1  ? "pr-0 pl-8" : ""}`} `} key={index} dealer={dealer}/>)}
            </Carousel>
        </ConfigProvider>
    </div>
}
