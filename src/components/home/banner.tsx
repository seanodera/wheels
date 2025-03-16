import { Carousel, Typography } from "antd";
import { CarAuction } from "@/types.ts";
import { HighlightBackground } from "@/components/common.tsx";
import {generateCarAuction} from "@/data/generator.ts";
import {useEffect, useState} from "react";
import {ClockCircleOutlined} from "@ant-design/icons";
import {toMoneyFormat} from "@/utils.ts";


const { Title, Text } = Typography;
const featured = Array.from({ length: 3 }, (_, id) => generateCarAuction(id));
export default function HomeBanner() {


    return (
        <div className="px-4 lg:px-16 w-screen pt-4">
            <Carousel arrows autoplay>
                {featured.map((car) => (
                    <CarouselItem key={car.id} featured={car} />
                ))}
            </Carousel>
        </div>
    );
}

function CarouselItem({ featured }: { featured: CarAuction }) {

    const [countDown, setCountDown] = useState("");

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const endTime = new Date(featured.ending).getTime();
            const diff = endTime - now;

            if (diff <= 0) {
                setCountDown("Ended");
                return;
            }

            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                setCountDown(`${days} day${days > 1 ? "s" : ""}`);
            } else if (hours > 0) {
                setCountDown(`${hours} hour${hours > 1 ? "s" : ""}`);
            } else {
                setCountDown(`${minutes} min${minutes > 1 ? "s" : ""}`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [featured.ending]);
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-2">
            <div className="col-span-2 row-span-2 relative">
                {/* Main Image */}
                <img
                    src={featured.images[0] || "/placeholder.jpg"}
                    className="w-full h-full object-cover rounded-lg aspect-video"
                    alt={`${featured.brand} ${featured.model}`}
                />

                {/* Text Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 h-full w-full flex justify-between flex-col bg-dark/30">
                    <div className={'w-full flex items-center justify-between'}>
                        <HighlightBackground>Featured</HighlightBackground>
                        <div className="relative">
                            {/* Background Blur Layer */}
                            <div className="absolute inset-0 rounded-md blur-md"></div>

                            {/* Content with Blending Mode */}
                            <div className="relative text-white p-2">
                                <Title level={5} className="leading-none !my-0">
                                    {featured.year} {featured.brand} {featured.model}
                                </Title>
                                <Text type={'secondary'} className="leading-none !my-0">
                                    {featured.millage} KM · {featured.engine}
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div className="bg-dark flex gap-2 px-2 py-1 rounded-md max-w-max">
                    <span className="flex items-center gap-1">
                        <Text className={'leading-none my-0'} type="secondary">
                            <ClockCircleOutlined />
                        </Text>
                        <Text  className="leading-none my-0 font-medium">{countDown}</Text>
                    </span>
                        <span>
                        <Text className={'leading-none my-0'} type="secondary">Bid</Text>
                        <Text className="leading-none my-0 font-medium"> KSH {toMoneyFormat(featured.currentBid, true)}</Text>
                    </span>
                    </div>
                    </div>
            </div>

            {/* Thumbnails */}
            {featured.images.slice(1, 5).map((img, index) => (
                <img
                    key={index}
                    src={img || "/placeholder.jpg"}
                    alt={`${featured.brand} ${featured.model}`}
                    className="w-full h-full object-cover rounded-lg aspect-video"
                />
            ))}
        </div>
    );
}
