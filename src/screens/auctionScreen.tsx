import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {App, Button, Empty, Typography} from "antd";
import {SendOutlined, StarOutlined} from "@ant-design/icons";
import AuctionItem from "@/components/auction/auctionItem.tsx";
import {trackVehicleView, watchAuction} from "@/utils";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchAuctionsAsync, setCurrentAuctionAsync} from "@/store/reducers/auctionSlice.ts";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import AuctionBidComponent from "@/components/auction/auctionBidComponent.tsx";
import {DealerComponent} from "@/components/dealer/dealerComponent.tsx";
import ImageSection from "@/components/common/imageSection.tsx";
import {VehicleDetails} from "@/components/common/vehicleDetails.tsx";
import {VehicleDescription} from "@/components/common/vehicleDescription.tsx";
import {usePostHog} from "@posthog/react";

const {Title, Text} = Typography;


export default function AuctionScreen() {
    const {message} = App.useApp();
    const {id} = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const {
        currentAuction,
        currentAuctionLoading,
        relatedEndingSoon,
        relatedNewlyListed,
        error,
        auctionsFetched
    } = useAppSelector((state) => state.auction);
    const [viewCount, setViewCount] = useState<number>(0);
    const [watchCount, setWatchCount] = useState<number>(0);
    const [watching, setWatching] = useState(false);
    const userId = useAppSelector((state) => state.authentication.user?.id ?? null);
    const trackedVehicleId = useRef<string | null>(null);
    const listing = currentAuction;
    const posthog = usePostHog();

    useEffect(() => {
        if (!id || currentAuction && currentAuction.id === id) return;
        dispatch(setCurrentAuctionAsync(id));
        if (!auctionsFetched) {
            dispatch(fetchAuctionsAsync());
        }
    }, [auctionsFetched, currentAuction, dispatch, id]);

    useEffect(() => {
        setViewCount(Number(listing?.views ?? 0));
        setWatchCount(Number(listing?.watchCount ?? 0));
    }, [listing?.id, listing?.views]);

    useEffect(() => {
        if (!listing?.id || !listing?.sellerId) return;
        if (trackedVehicleId.current === String(listing.id)) return;
        trackedVehicleId.current = String(listing.id);

        void trackVehicleView({
            vehicleId: String(listing.id),
            dealerId: String(listing.sellerId),
            userId,
            posthogDistinctId: posthog?.get_distinct_id() ?? null,
            eventName: "auction_viewed",
            eventProperties: {
                auction_id: listing.id,
                vehicle_id: listing.id,
                vehicle: `${listing.year} ${listing.brand} ${listing.model}`,
                brand: listing.brand,
                model: listing.model,
                year: listing.year,
                current_bid: listing.currentBid,
                dealer: listing.seller?.name
            },
            capture: posthog?.capture.bind(posthog)
        }).then((nextViews) => {
            if (typeof nextViews === "number") {
                setViewCount(nextViews);
            }
        });
    }, [listing, posthog, userId]);

    if (currentAuctionLoading) {
        return <LoadingScreen/>;
    }

    if (!id || !listing) {
        return <Empty description={error || "Invalid auction item"}/>;
    }

    const listingWithWatchCount = {
        ...listing,
        watchCount
    };

    const handleWatchAuction = async () => {
        if (!userId) {
            message.error("Log in to watch this auction");
            return;
        }

        if (watching) return;

        setWatching(true);
        const result = await watchAuction({
            auctionId: String(listing.auctionId),
            vehicleId: String(listing.id),
            dealerId: String(listing.sellerId),
            eventProperties: {
                auction_id: listing.auctionId,
                vehicle_id: listing.id,
                vehicle: `${listing.year} ${listing.brand} ${listing.model}`,
                brand: listing.brand,
                model: listing.model,
                year: listing.year,
                current_bid: listing.currentBid,
                dealer: listing.seller?.name
            },
            capture: posthog?.capture.bind(posthog)
        });

        setWatching(false);

        if (!result) {
            message.error("Unable to watch this auction");
            return;
        }

        setWatchCount(result.watchCount);
        message.success(result.inserted ? "Auction watch added" : "You are already watching this auction");
    };


    return (
        <div className="px-4 py-4 text-current lg:px-8 xl:px-12">
            <div className="mx-auto flex w-full flex-col gap-6">
                <div
                    className="flex flex-col gap-4 rounded-2xl bg-light-accent glass-card dark:bg-dark p-5 md:flex-row md:items-end md:justify-between md:p-6">
                    <div className="min-w-0">
                        <Text className="text-[11px]! uppercase tracking-[0.38em]">
                            Live Auction
                        </Text>
                        <Title className="mb-0! mt-2! leading-none " level={2}>
                            {listing.year} {listing.brand} {listing.model}
                        </Title>
                        <Text className="mt-3 block ">
                            {listing.mileage} KM · {listing.engine} · {listing.transmission} · {listing.drivetrain}
                        </Text>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto">
                        <Button
                            icon={<StarOutlined/>}
                            size={'large'}
                            color={'default'}
                            variant={'outlined'}
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                            loading={watching}
                            onClick={handleWatchAuction}
                        >
                            Watch
                        </Button>
                        <Button
                            icon={<SendOutlined/>}
                            size={'large'}
                            color={'default'}
                            variant={'outlined'}
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                            onClick={() => posthog?.capture('auction_shared', {auction_id: listing.id, vehicle: `${listing.year} ${listing.brand} ${listing.model}`})}
                        >
                            Share
                        </Button>
                    </div>
                </div>

                <ImageSection listing={listing}/>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px] 2xl:gap-12 2xl:grid-cols-6">
                    <div className="order-1 space-y-6 2xl:space-y-12 2xl:col-span-4 xl:sticky xl:top-6 xl:self-start">
                        <AuctionBidComponent listing={listingWithWatchCount} viewCount={viewCount}/>

                        <VehicleDetails listing={listingWithWatchCount}/>

                        <VehicleDescription listing={listingWithWatchCount}/>

                        {listing.video.length > 0 && (
                            <div className="rounded-2xl border border-black/10 bg-white p-5 md:p-7">
                                <Title level={4} className="mb-6! text-black">
                                    Videos
                                </Title>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {listing.video.map((video, index: number) => (
                                        <video
                                            src={video.url}
                                            key={index}
                                            controls
                                            className="w-full rounded-2xl bg-black"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={'block lg:hidden'}>{listing.seller.name && <DealerComponent dealer={listing.seller} listing={listingWithWatchCount}/>}
                        </div>

                        {relatedNewlyListed.length > 0 && (
                            <div className="space-y-4">
                                <Title className="mb-0! text-black" level={4}>
                                    New Listings
                                </Title>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
                                    {relatedNewlyListed.map((auction) => (
                                        <AuctionItem key={auction.id} listing={auction}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="order-2 space-y-6 2xl:col-span-2  xl:sticky xl:top-6 xl:self-start">
                        <div className={'hidden lg:block'}>{listing.seller.name && <DealerComponent dealer={listing.seller} listing={listingWithWatchCount}/>}
                        </div>
                        {relatedEndingSoon.length > 0 && (
                            <div className="space-y-4">
                                <Title className="mb-0! text-black" level={4}>
                                    Ending Soon
                                </Title>
                                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                                    {relatedEndingSoon.map((auction) => (
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
