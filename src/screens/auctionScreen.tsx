import {useParams} from "react-router";
import {useEffect, useMemo, useRef, useState} from "react";
import type {CarAuction, CarItem} from "@/types";
import {Button, Empty, Typography} from "antd";
import {SendOutlined, StarOutlined} from "@ant-design/icons";
import {startCase} from "lodash";
import AuctionItem from "@/components/auctionItem.tsx";
import {trackVehicleView} from "@/utils";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchAuctionsAsync, setCurrentAuctionAsync} from "@/store/reducers/auctionSlice.ts";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import AuctionBidComponent from "@/components/auction/auctionBidComponent.tsx";
import {DealerComponent} from "@/components/dealer/dealerComponent.tsx";
import ImageSection from "@/components/common/imageSection.tsx";

const {Title, Text, Paragraph} = Typography;

const asMileage = (listing: CarAuction) =>
    Number((listing as unknown as { millage?: number | string }).millage ?? listing.mileage ?? 0);

export default function AuctionScreen() {
    const {id} = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const {
        currentAuction,
        currentAuctionLoading,
        endingSoon,
        newlyListed,
        error,
        auctionsFetched
    } = useAppSelector((state) => state.auction);
    const [viewCount, setViewCount] = useState<number>(0);
    const userId = useAppSelector((state) => state.authentication.user?.id ?? null);
    const trackedVehicleId = useRef<string | null>(null);
    const listing = currentAuction;

    useEffect(() => {
        if (!id || currentAuction && currentAuction.id === id) return;
        dispatch(setCurrentAuctionAsync(id));
        if (!auctionsFetched) {
            dispatch(fetchAuctionsAsync());
        }
    }, [auctionsFetched, currentAuction, dispatch, id]);

    useEffect(() => {
        setViewCount(Number(listing?.views ?? 0));
    }, [listing?.id, listing?.views]);

    useEffect(() => {
        if (!listing?.id || !listing?.sellerId) return;
        if (trackedVehicleId.current === String(listing.id)) return;
        trackedVehicleId.current = String(listing.id);

        void trackVehicleView({
            vehicleId: String(listing.id),
            dealerId: String(listing.sellerId),
            userId
        }).then((nextViews) => {
            if (typeof nextViews === "number") {
                setViewCount(nextViews);
            }
        });
    }, [listing?.id, listing?.sellerId, userId]);

    const relatedEndingSoon = useMemo(
        () => endingSoon.filter((item: CarAuction) => String(item.id) !== String(listing?.id)).slice(0, 8),
        [endingSoon, listing?.id]
    );
    const relatedNewlyListed = useMemo(
        () => newlyListed.filter((item: CarAuction) => String(item.id) !== String(listing?.id)).slice(0, 8),
        [newlyListed, listing?.id]
    );

    if (currentAuctionLoading) {
        return <LoadingScreen/>;
    }

    if (!id || !listing) {
        return <Empty description={error || "Invalid auction item"}/>;
    }

    const mileage = asMileage(listing);

    return (
        <div className="px-4 py-4 text-current lg:px-8 xl:px-12">
            <div className="mx-auto flex w-full max-w-360 flex-col gap-6">
                <div className="flex flex-col gap-4 rounded-2xl bg-[#f8f4ec] glass-card dark:bg-dark p-5 md:flex-row md:items-end md:justify-between md:p-6">
                    <div className="min-w-0">
                        <Text className="text-[11px]! uppercase tracking-[0.38em]">
                            Live Auction
                        </Text>
                        <Title className="mb-0! mt-2! leading-none " level={2}>
                            {listing.year} {listing.brand} {listing.model}
                        </Title>
                        <Text className="mt-3 block ">
                            {mileage} KM · {listing.engine} · {listing.transmission} · {listing.drivetrain}
                        </Text>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto">
                        <Button
                            icon={<StarOutlined/>}
                            size={'large'}
                            color={'default'}
                            variant={'outlined'}
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                        >
                            Watch
                        </Button>
                        <Button
                            icon={<SendOutlined/>}
                            size={'large'}
                            color={'default'}
                            variant={'outlined'}
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                        >
                            Share
                        </Button>
                    </div>
                </div>

                <ImageSection listing={listing}/>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
                    <div className="order-1 space-y-6">
                        <AuctionBidComponent listing={listing} viewCount={viewCount}/>

                        <div className="rounded-[28px] border bg-[#f8f4ec] glass-card dark:bg-dark p-5 md:p-7">
                            <Title level={4} className="mb-6! ">
                                Description
                            </Title>
                            <AuctionDescription listing={listing}/>
                        </div>

                        {listing.video.length > 0 && (
                            <div className="rounded-[28px] border border-black/10 bg-white p-5 md:p-7">
                                <Title level={4} className="mb-6! text-black">
                                    Videos
                                </Title>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {listing.video.map((video: string, index: number) => (
                                        <video
                                            src={video}
                                            key={index}
                                            controls
                                            className="w-full rounded-2xl bg-black"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {relatedNewlyListed.length > 0 && (
                            <div className="space-y-4">
                                <Title className="mb-0! text-black" level={4}>
                                    New Listings
                                </Title>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
                                    {relatedNewlyListed.map((auction: CarAuction) => (
                                        <AuctionItem key={auction.id} listing={auction}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="order-2 space-y-6 xl:sticky xl:top-6 xl:self-start">
                        {listing.seller.name && <DealerComponent dealer={listing.seller} listing={listing}/>}

                        {relatedEndingSoon.length > 0 && (
                            <div className="space-y-4 rounded-[28px] border border-black/10 bg-[#f8f4ec] p-5 md:p-6">
                                <Title className="mb-0! text-black" level={4}>
                                    Ending Soon
                                </Title>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                                    {relatedEndingSoon.map((auction: CarAuction) => (
                                        <AuctionItem key={auction.id} listing={auction}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

export function AuctionDescription({listing}: { listing: CarAuction | CarItem }) {
    const {description} = listing;

    return (
        <div className="space-y-8">
            {Object.entries(description).map(([key, value]) =>
                value ? (
                    <div key={key}>
                        <Title level={4}>{startCase(key)}</Title>
                        <Paragraph>{String(value)}</Paragraph>
                    </div>
                ) : null
            )}
        </div>
    );
}
