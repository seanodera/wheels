import {useState} from "react";
import {BaseCar} from "@/types";
import {Image, Typography} from "antd";

const {Text, Title} = Typography;

function ImageSection({listing}: { listing: BaseCar }) {
    const images = listing.images.filter(Boolean);
    const gallery = images.length > 0 ? images : ["/placeholder.jpg"];
    const [activeIndex, setActiveIndex] = useState(0);

    const safeIndex = Math.min(activeIndex, gallery.length - 1);
    const activeImage = gallery[safeIndex];
    const carName = `${listing.brand} ${listing.model}`;
    const thumbnailLimit = 5;
    const visibleThumbnails = gallery.slice(0, thumbnailLimit);
    const hiddenImageCount = Math.max(gallery.length - thumbnailLimit, 0);

    return (
        <section className="">
            <div className="flex flex-col gap-4">

                <Image
                    src={activeImage}
                    alt={carName}
                    className="lg:aspect-20/7! aspect-video! rounded-xl w-full! object-cover object-center!"
                />

                <div className="flex gap-2">
                    {visibleThumbnails.map((img, index) => {
                        const isActive = index === safeIndex;

                        return (
                            <div
                                key={`${img}-${index}`}
                                onClick={() => setActiveIndex(index)}
                                className={`w-1/5 overflow-hidden rounded-xl transition max-md:h-20 lg:aspect-video ${
                                    isActive
                                        ? "border-2 border-accent"
                                        : "border border-black/10"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${carName} image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        );
                    })}

                    {hiddenImageCount > 0 && (
                        <div
                            onClick={() => setActiveIndex(thumbnailLimit)}
                            className={`flex-1 aspect-video! flex flex-col items-center justify-center rounded-xl border transition ${
                                safeIndex >= thumbnailLimit
                                    ? "border-primary bg-dark text-white"
                                    : "border-dark/10 bg-white/70 text-black"
                            }`}
                        >
                            <Text
                                className={`text-[11px]! uppercase tracking-[0.32em] ${
                                    safeIndex >= thumbnailLimit
                                        ? "text-white/70"
                                        : "text-dark/55"
                                }`}
                            >
                                Private View
                            </Text>
                            <Title level={3} className="mb-0! mt-2! text-current">
                                +{hiddenImageCount}
                            </Title>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ImageSection
