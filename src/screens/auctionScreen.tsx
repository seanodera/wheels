import {useParams} from "react-router";
import {useEffect, useMemo, useRef, useState} from "react";
import type {CarAuction, CarItem} from "@/types";
import {Button, Empty, Typography} from "antd";
import {SendOutlined, StarOutlined} from "@ant-design/icons";
import {startCase} from "lodash";
import AuctionItem from "@/components/auctionItem.tsx";
import {trackVehicleView} from "@/utils";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchAuctionsAsync, fetchTopBidder, setCurrentAuctionAsync} from "@/store/reducers/auctionSlice.ts";
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
        dispatch(setCurrentAuctionAsync(id)).then(res => {
            if (res.meta.requestStatus === 'fulfilled' && res.payload && typeof res.payload !== 'string'){
                dispatch(fetchTopBidder(res.payload.auctionId))
            }
        });
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

    console.log(currentAuction, currentAuctionLoading);
    if (currentAuctionLoading) {
        return <LoadingScreen/>;
    }

    if (!id || !listing) {
        return <Empty description={error || "Invalid auction item"}/>;
    }

    const mileage = asMileage(listing);

    return (
        <div className="py-4 px-4 lg:px-16 text-current">
            <div className={'flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-4 gap-4'}>
                <div>
                    <Title className={'leading-none my-0!'} level={3}>
                        {listing.year} {listing.brand} {listing.model}
                    </Title>
                    <Text className={'leading-none my-0!'}>
                        {mileage} KM · {listing.engine} · {listing.transmission} . {listing.drivetrain}
                    </Text>
                </div>
                <div className={'flex gap-2'}>
                    <Button icon={<StarOutlined/>} size={'large'} color={'default'} variant={'outlined'}>Watch</Button>
                    <Button icon={<SendOutlined/>} size={'large'} color={'default'} variant={'outlined'}>Share</Button>
                </div>
            </div>
            <ImageSection listing={listing}/>
            <div className={'grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 '}>
                <div className={'lg:col-span-3 space-y-8'}>
                    <AuctionBidComponent listing={listing} viewCount={viewCount}/>

                    <AuctionDescription listing={listing}/>
                    <div>
                        {listing.video.length > 0 && (
                            <div>
                                <Title level={4}>Videos</Title>
                                <div className="grid grid-cols-2 gap-4">
                                    {listing.video.map((video: string, index: number) => {
                                        return (
                                            <video src={video} key={index}/>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {relatedNewlyListed.length > 0 && (<div>
                        <Title className={'my-4!'} level={4}>New Listing</Title>
                        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}>
                            {relatedNewlyListed.map((auction: CarAuction) => (
                                <AuctionItem key={auction.id} listing={auction}/>
                            ))}
                        </div>
                    </div>)}
                </div>
                <div className={'col-span-2'}>
                    {(listing.seller).name && <DealerComponent dealer={listing.seller} listing={listing}/>}
                    {relatedEndingSoon.length > 0 && (<>
                        <Title className={'my-4!'} level={4}>Auctions Ending Soon</Title>
                        <div className={'grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'}>
                            {relatedEndingSoon.map((auction: CarAuction) => (
                                <AuctionItem key={auction.id} listing={auction}/>
                            ))}
                        </div>
                    </>)}

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
