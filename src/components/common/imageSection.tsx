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
        <section className="shadow-md ">
            <div className="flex flex-col gap-4">

                <Image
                    src={activeImage}
                    alt={carName}
                    className="aspect-20/7! rounded-xl w-full! object-cover object-center!"
                />

                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {visibleThumbnails.map((img, index) => {
                        const isActive = index === safeIndex;

                        return (
                            <div
                                key={`${img}-${index}`}
                                onClick={() => setActiveIndex(index)}
                                className={`overflow-hidden rounded-2xl transition ${
                                    isActive
                                        ? "border-accent border-2"
                                        : "border-black/10 text-black/55"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${carName} image ${index + 1}`}
                                    preview={false}
                                    className="aspect-video! h-full! w-full! rounded-2xl object-cover object-center!"
                                />
                            </div>
                        );
                    })}

                    {hiddenImageCount > 0 && (
                        <div
                            onClick={() => setActiveIndex(thumbnailLimit)}
                            className={`flex aspect-video flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                                safeIndex >= thumbnailLimit
                                    ? "border-primary bg-dark text-white"
                                    : "border-dark/10 bg-white/70 text-black"
                            }`}
                        >
                            <Text
                                className={`text-[11px]! uppercase tracking-[0.32em] ${
                                    safeIndex >= thumbnailLimit ? "text-white/70" : "text-dark/55"
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
