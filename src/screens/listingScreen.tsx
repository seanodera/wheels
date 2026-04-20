import {Avatar, Button, Empty, InputNumber, Typography} from "antd";
import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    NotificationOutlined,
    SendOutlined,
    StarOutlined,
    UserOutlined
} from "@ant-design/icons";
import type {CarItem} from "@/types";
import {toMoneyFormat, trackVehicleView} from "@/utils";
import {formatDate} from "date-fns";
import AuctionItem from "@/components/auction/auctionItem.tsx";
import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import ListingComponent from "@/components/listings/listingComponent.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {clearCurrentListing, fetchListingAsync, fetchListingByIdAsync} from "@/store/reducers/listingSlice.ts";
import {fetchAuctionsAsync, setRelatedAuctionReferenceId} from "@/store/reducers/auctionSlice.ts";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import {DealerComponent} from "@/components/dealer/dealerComponent.tsx";
import ImageSection from "@/components/common/imageSection.tsx";
import {VehicleDescription} from "@/components/common/vehicleDescription.tsx";
import {VehicleDetails} from "@/components/common/vehicleDetails.tsx";
import {usePostHog} from "@posthog/react";

const {Title, Text} = Typography;

export default function ListingScreen() {
    const {id} = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const {
        currentListing,
        relatedListings,
        currentListingLoading
    } = useAppSelector((state) => state.listing);
    const relatedEndingSoon = useAppSelector((state) => state.auction.relatedEndingSoon);
    const [myBid, setMyBid] = useState<number>(0);
    const [viewCount, setViewCount] = useState<number>(0);
    const userId = useAppSelector((state) => state.authentication.user?.id ?? null);
    const trackedVehicleId = useRef<string | null>(null);
    const listing: CarItem | undefined = currentListing;
    const posthog = usePostHog();

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(fetchListingByIdAsync(id));
        dispatch(fetchListingAsync({page: 1, pageSize: 24}));
        dispatch(fetchAuctionsAsync());

        return () => {
            dispatch(clearCurrentListing());
            dispatch(setRelatedAuctionReferenceId(null));
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (listing) {
            setMyBid(listing.price);
        }
    }, [listing]);

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
            userId,
            posthogDistinctId: posthog?.get_distinct_id() ?? null,
            eventName: "listing_viewed",
            eventProperties: {
                listing_id: listing.id,
                vehicle_id: listing.id,
                vehicle: `${listing.year} ${listing.brand} ${listing.model}`,
                brand: listing.brand,
                model: listing.model,
                year: listing.year,
                price: listing.price,
                negotiable: listing.negotiable,
                dealer: listing.seller?.name
            },
            capture: posthog?.capture.bind(posthog)
        }).then((nextViews) => {
            if (typeof nextViews === "number") {
                setViewCount(nextViews);
            }
        });
    }, [listing, posthog, userId]);

    useEffect(() => {
        dispatch(setRelatedAuctionReferenceId(listing?.id ? String(listing.id) : null));
    }, [dispatch, listing?.id]);

    if (currentListingLoading) {
        return <LoadingScreen/>;
    }

    if (!id || !listing) {
        return <Empty description="No listing found"/>;
    }

    return (
        <div className="px-4 py-4 text-current lg:px-8 xl:px-12">
            <div className="mx-auto flex w-full flex-col gap-6">
                <div className="flex flex-col gap-4 rounded-2xl bg-light-accent glass-card dark:bg-dark p-5 md:flex-row md:items-end md:justify-between md:p-6">
                    <div className="min-w-0">
                        <Text className="text-[11px]! uppercase tracking-[0.38em]">
                            Premium Listing
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
                            size="large"
                            color="default"
                            variant="outlined"
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                            onClick={() => posthog?.capture('listing_watched', {listing_id: listing.id, vehicle: `${listing.year} ${listing.brand} ${listing.model}`})}
                        >
                            Watch
                        </Button>
                        <Button
                            icon={<SendOutlined/>}
                            size="large"
                            color="default"
                            variant="outlined"
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                        >
                            Share
                        </Button>
                    </div>
                </div>

                <ImageSection listing={listing}/>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px] 2xl:gap-12 2xl:grid-cols-6">
                    <div className="order-1 space-y-6 2xl:space-y-12 2xl:col-span-4 xl:sticky xl:top-6 xl:self-start">
                        <div className="rounded-2xl border bg-light-accent glass-card dark:bg-dark">
                            <div className="p-5 md:p-7">
                                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                                    <div>
                                        <Title className="leading-none my-0! " type="secondary" level={5}>
                                            <ClockCircleOutlined/> Date Posted
                                        </Title>
                                        <Title className="leading-none my-0!" level={5}>
                                            {formatDate(new Date(listing.createdAt), "eee, MMM dd yyyy • hh:mm a")}
                                        </Title>
                                    </div>
                                    <div>
                                        <Title className="leading-none my-0! " type="secondary" level={5}>
                                            <ArrowUpOutlined/> Asking Price
                                        </Title>
                                        <Title className="leading-none my-0!" level={5}>
                                            KSH {toMoneyFormat(listing.price)}
                                        </Title>
                                    </div>
                                    <div>
                                        <Title className="leading-none my-0! " type="secondary" level={5}>
                                            Offer Flexibility
                                        </Title>
                                        <Title className="leading-none my-0!" level={5}>
                                            {listing.negotiable ? "Negotiable" : "Fixed price"}
                                        </Title>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between gap-4 py-4 lg:flex-row">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <Title className="leading-none my-0!" level={4}>Current Asking Price</Title>
                                        </div>
                                        <Title level={1} className="leading-none! mb-2!">
                                            KSH {toMoneyFormat(listing.price)}
                                        </Title>
                                        <Text className="block max-w-md text-black/55 dark:text-white/60">
                                            Send a direct offer to the seller and start the conversation around this vehicle.
                                        </Text>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-black/10 bg-black/3 dark:bg-white/40 glass-card px-4 py-3">
                                            <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                                                Seller
                                            </Text>
                                            <div className="flex items-center gap-2">
                                                <Avatar size="small" icon={<UserOutlined/>}/>
                                                <Text className="leading-none! text-black">
                                                    {listing.seller.name}
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-black/10 bg-black/3 dark:bg-white/40 glass-card px-4 py-3">
                                            <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                                                Posted
                                            </Text>
                                            <Text className="leading-none! text-black">
                                                {formatDate(new Date(listing.createdAt), "eee, MMM dd")}
                                            </Text>
                                        </div>

                                        <div className="rounded-2xl border border-black/10 bg-black/3 dark:bg-white/40 glass-card px-4 py-3">
                                            <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                                                Views
                                            </Text>
                                            <Title level={5} className="mb-0! leading-none! text-black">
                                                {viewCount}
                                            </Title>
                                        </div>

                                        <div className="rounded-2xl border border-black/10 bg-black/3 dark:bg-white/40 glass-card px-4 py-3">
                                            <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                                                Watching
                                            </Text>
                                            <Title level={5} className="mb-0! leading-none! text-black">
                                                {listing.favorites ?? 0}
                                            </Title>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="border-t border-black/10 p-5 md:p-6">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                    <div className="flex w-full flex-col gap-2 sm:flex-row">
                                        <InputNumber
                                            min={0}
                                            value={myBid}
                                            step={50000}
                                            placeholder="Enter Your Offer"
                                            variant="outlined"
                                            size="large"
                                            className="w-full! sm:max-w-sm"
                                            prefix="KSH"
                                            formatter={(value) => toMoneyFormat(Number(value || 0))}
                                            onChange={(value) => setMyBid(Number(value || listing.price))}
                                        />
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="rounded-full px-6"
                                            onClick={() => posthog?.capture('listing_offer_sent', {
                                                listing_id: listing.id,
                                                vehicle: `${listing.year} ${listing.brand} ${listing.model}`,
                                                offer_amount: myBid,
                                                asking_price: listing.price,
                                            })}
                                        >
                                            Send Offer
                                        </Button>
                                    </div>

                                    <div className="flex w-full xl:w-auto">
                                        <Button
                                            icon={<NotificationOutlined/>}
                                            size="large"
                                            color="default"
                                            variant="outlined"
                                            className="px-5 xl:w-auto"
                                        >
                                            Track Listing
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <VehicleDetails listing={listing}/>


                        <VehicleDescription listing={listing}/>

                        {listing.video.length > 0 && (
                            <div className="rounded-2xl border border-black/10 bg-white p-5 md:p-7 dark:bg-dark">
                                <Title level={4} className="mb-6! text-black dark:text-white">
                                    Videos
                                </Title>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {listing.video.map((video, index: number) => {


                                        return (
                                            <a
                                                key={index}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block overflow-hidden rounded-2xl"
                                            >
                                                <img
                                                    src={video.thumbnail}
                                                    alt={`Video ${index + 1}`}
                                                    className="w-full object-cover"
                                                />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {relatedListings.length > 0 && (
                            <div className="space-y-4">
                                <Title className="mb-0! text-black" level={4}>
                                    Related Listings
                                </Title>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
                                    {relatedListings.map((item) => (
                                        <ListingComponent key={item.id} listing={item}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="order-2 space-y-6 2xl:col-span-2 xl:sticky xl:top-6 xl:self-start">
                        {listing.seller.name && <DealerComponent dealer={listing.seller} listing={listing}/>}

                        {relatedEndingSoon.length > 0 && (
                            <div className="space-y-4 rounded-2xl p-5 md:p-6">
                                <Title className="mb-0! text-black" level={4}>
                                    Auctions Ending Soon
                                </Title>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
                                    {relatedEndingSoon.map((item) => (
                                        <AuctionItem key={item.id} listing={item}/>
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
