import { Carousel, Typography } from "antd";
import { CarAuction } from "@/types.ts";
import { HighlightBackground } from "@/components/common.tsx";
import {generateCarAuction} from "@/data/generator.ts";


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
                <div className="absolute top-0 left-0 right-0 p-4 h-full w-full bg-dark/30">
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
                                    {featured.millage} miles · {featured.engine}
                                </Text>
                            </div>
                        </div>
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
