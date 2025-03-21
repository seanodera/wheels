import {useState} from "react";
import {Dealer} from "@/types.ts";
import {generateDealers} from "@/data/generator.ts";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import CustomCarousel from "@/components/customCarousel.tsx";


export default function PopularDealers() {

    const [dealers ] = useState<Dealer[]>(Array.from({length: 20}, (_, id) => generateDealers(id)));
    return <div className={'px-4 lg:px-16'}>
        <CustomCarousel items={4} autoPlay>
            {dealers.slice(0,6).map((dealer: Dealer, index) => <DealerItem square className={`px-4 mb-16 text-dark ${index === 0 ? "pl-0 pr-8" : `${index % 3 === 0 || index === dealers.length - 1  ? "pr-0 pl-8" : ""}`} `} key={index} dealer={dealer}/>)}
        </CustomCarousel>
    </div>
}

