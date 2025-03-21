import {Button, Carousel, Typography} from "antd";
import {useRef, useState} from "react";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {Dealer} from "@/types.ts";
import {generateDealers} from "@/data/generator.ts";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";

const {Title, Text} = Typography;
export default function NewDealers() {
    const carouselRef = useRef<any| null>(null);

    // const venues: Venue[] = useAppSelector((state) => state.venue.trendingVenues);
    const handlePrev = () => {
        if (carouselRef.current) {
            carouselRef.current.prev();
        }
    };

    const handleNext = () => {
        if (carouselRef.current) {
            carouselRef.current.next();
        }
    };
    const [dealers ] = useState<Dealer[]>(Array.from({length: 20}, (_, id) => generateDealers(id)));
    return <div className={'px-16'}>
        <div className={"flex justify-between items-center mb-2"}>
            <div>
                <Title level={3} className={"text-current mb-0"}>
                    Newly Joined Dealers
                </Title>
                <Text className={"text-current"}>
                    Discover new Dealers
                </Text>
            </div>
            <Button type={"primary"} ghost>
                View All
            </Button>
        </div>
        <Carousel       ref={carouselRef}
                        className={"!gap-4"}
                        slidesToShow={4}
                        slidesToScroll={4}
                        autoplay={false}
                        infinite
                        swipe>
            {dealers.map((dealer: Dealer, index) => <DealerItem className={`px-4 text-dark ${index === 0 ? "pl-0" : `${index % 4 === 0 || index === dealers.length - 1  ? "pr-0" : ""}`} `} key={index} dealer={dealer}/>)}
        </Carousel>
        <div className="flex justify-end items-center gap-4">
            <Button shape="circle" icon={<LeftOutlined/>} onClick={handlePrev} />
            <Button shape="circle" icon={<RightOutlined/>} onClick={handleNext} />
        </div>
    </div>
}

