import CustomCarousel from "@/components/customCarousel.tsx";
import {Dealer} from "@/types.ts";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import {useState} from "react";
import {generateDealers} from "@/data/generator.ts";


export default function PopularDealers() {
    const [dealers ] = useState<Dealer[]>(Array.from({length: 20}, (_, id) => generateDealers(id)));

    return <CustomCarousel title={'Popular Dealers'} description={'The well known dealers'} items={4}>
        {dealers.map((dealer: Dealer, index) => <DealerItem className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === dealers.length - 1  ? "pr-0" : ""}`} `} key={index} dealer={dealer}/>)}
    </CustomCarousel>
}
