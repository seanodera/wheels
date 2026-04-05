import {useState} from "react";
import {BaseCar} from "@/types";
import {Image, Masonry, Modal, Typography} from "antd";

const {Text, Title} = Typography;

function ImageSection({listing}: { listing: BaseCar }) {
    const images = listing.images.filter(Boolean);
    const gallery = images.length > 0 ? images : ["/placeholder.jpg"];
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExtrasOpen, setIsExtrasOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    const safeIndex = Math.min(activeIndex, gallery.length - 1);
    const activeImage = gallery[safeIndex];
    const carName = `${listing.brand} ${listing.model}`;
    const thumbnailLimit = 4;
    const visibleThumbnails = gallery.slice(0, thumbnailLimit);
    const hiddenImageCount = Math.max(gallery.length - thumbnailLimit, 0);

    const openPreview = (index: number) => {
        setPreviewIndex(index);
        setIsPreviewOpen(true);
    };

    return (
        <section className="">
            <div className="flex flex-col gap-4">
                <button
                    type="button"
                    onClick={() => openPreview(safeIndex)}
                    className="overflow-hidden rounded-xl"
                >
                    <img
                        src={activeImage}
                        alt={carName}
                        className="lg:aspect-20/7 aspect-video w-full object-cover object-center"
                    />
                </button>

                <div className="flex overflow-x-scroll gap-2">
                    {visibleThumbnails.map((img, index) => {
                        const isActive = index === safeIndex;

                        return (
                            <button
                                type="button"
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
                            </button>
                        );
                    })}

                    {hiddenImageCount > 0 && (
                        <button
                            type="button"
                            onClick={() => setIsExtrasOpen(true)}
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
                        </button>
                    )}
                </div>
            </div>

            <Modal
                open={isExtrasOpen}
                onCancel={() => setIsExtrasOpen(false)}
                footer={null}
                title={<Title level={4}>Gallery</Title> }
                width={{
                    xs: '100%',
                    sm: '100%',
                    md: '100%',
                    lg: '100%',
                    xl: '80%',
                    xxl: '60%',
                }}

                classNames={{

                    container: 'glass-card rounded-2xl! max-w-full bg-light-accent! dark:bg-dark!',
                    header: "bg-transparent border-b border-black/10 dark:border-white/10",
                    body: "bg-transparent pt-5 overflow-hidden",
                }}
            >
                <div className="max-h-[90vh] overflow-y-auto pr-1">
                    <Masonry
                        columns={{xs: 2, sm: 2, md: 2, lg: 3}}
                        gutter={16}
                        items={[...gallery,...gallery,...gallery,...gallery,...gallery,].map((img, index) => ({
                            key: `${img}-${index}`,
                            data: {img, index},
                        }))}
                        itemRender={({data}) => (
                            <button
                                type="button"
                                onClick={() => openPreview(data.index)}
                                className="block w-full overflow-hidden rounded-2xl border border-black/10 bg-white/60 transition-transform duration-300 hover:scale-[1.02] dark:border-white/10 dark:bg-white/5"
                            >
                                <img
                                    src={data.img}
                                    alt={`${carName} image ${data.index + 1}`}
                                    className="w-full rounded-2xl object-cover"
                                />
                            </button>
                        )}
                    />
                </div>
            </Modal>

            <div className="hidden">
                <Image.PreviewGroup
                    preview={{
                        visible: isPreviewOpen,
                        current: previewIndex,
                        onOpenChange: (open) => setIsPreviewOpen(open),
                        onChange: (current) => setPreviewIndex(current),
                    }}
                >
                    {gallery.map((img, index) => (
                        <Image
                            key={`${img}-preview-${index}`}
                            src={img}
                            alt={`${carName} image ${index + 1}`}
                        />
                    ))}
                </Image.PreviewGroup>
            </div>
        </section>
    );
}

export default ImageSection
