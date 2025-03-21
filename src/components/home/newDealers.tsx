import CustomCarousel from "@/components/customCarousel.tsx";
import {useState} from "react";
import {Dealer} from "@/types.ts";
import {generateDealers} from "@/data/generator.ts";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";


export default function NewDealers(){
    const [dealers ] = useState<Dealer[]>(Array.from({length: 20}, (_, id) => generateDealers(id)));
    return <CustomCarousel title={'New Dealers'} description={'Recently joined dealers'} items={5}>
        {dealers.map((dealer: Dealer, index) => <DealerItem className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === dealers.length - 1  ? "pr-0" : ""}`} `} key={index} dealer={dealer}/>)}
    </CustomCarousel>;
}
