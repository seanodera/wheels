import {useParams} from "react-router";
import {useEffect, useMemo, useRef, useState} from "react";
import type {CarAuction, CarItem} from "@/types";
import {Button, Empty, Typography} from "antd";
import {PlusOutlined, SendOutlined, StarOutlined} from "@ant-design/icons";
import {startCase} from "lodash";
import AuctionItem from "@/components/auctionItem.tsx";
import {trackVehicleView} from "@/utils";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {
    clearCurrentAuction,
    fetchAuctionsAsync,
    setCurrentAuctionAsync
} from "@/store/reducers/auctionSlice.ts";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import AuctionBidComponent from "@/components/auction/auctionBidComponent.tsx";

const {Title, Text, Paragraph} = Typography;

const asMileage = (listing: CarAuction) =>
    Number((listing as unknown as {millage?: number | string}).millage ?? listing.mileage ?? 0);

export default function AuctionScreen() {
    const {id} = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const {
        currentAuction,
        currentAuctionLoading,
        endingSoon,
        newlyListed,
        error
    } = useAppSelector((state) => state.auction as {
        currentAuction: CarAuction | null;
        currentAuctionLoading: boolean;
        endingSoon: CarAuction[];
        newlyListed: CarAuction[];
        error: string | null;
    });
    const [viewCount, setViewCount] = useState<number>(0);
    const userId = useAppSelector((state) => state.authentication.user?.id ?? null);
    const trackedVehicleId = useRef<string | null>(null);
    const listing = currentAuction;

    useEffect(() => {
        if (!id) return;
        dispatch(setCurrentAuctionAsync(id));
        dispatch(fetchAuctionsAsync());
        return () => {
            dispatch(clearCurrentAuction());
        };
    }, [dispatch, id]);

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
            <div className="grid grid-cols-3 lg:grid-cols-5 grid-rows-4 gap-2">
                <div className="col-span-3 row-span-4 relative">
                    <img
                        src={listing.images[0] || "/placeholder.jpg"}
                        className="w-full h-full object-cover rounded-lg aspect-video"
                        alt={`${listing.brand} ${listing.model}`}
                    />
                </div>

                {listing.images.slice(1, 8).map((img: string, index: number) => (
                    <img
                        key={index}
                        src={img || "/placeholder.jpg"}
                        alt={`${listing.brand} ${listing.model}`}
                        className="w-full h-full object-cover rounded-lg aspect-video"
                    />
                ))}
                <div className={'w-full h-full object-cover rounded-lg aspect-video bg-cover'}
                     style={{backgroundImage: `url("${listing.images[9]}")`}}>
                    <div className={'w-full h-full flex flex-col justify-center items-center rounded-lg bg-dark/70'}>
                        <Title level={5}>{Math.max(0, listing.images.length - 8)} More Images</Title>
                        <Button className={'aspect-square'} type={'text'} variant={'outlined'} ghost
                                icon={<PlusOutlined className={'text-xl'}/>} shape={'round'} size={'large'}/>
                    </div>
                </div>
            </div>
            <div className={'grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 '}>
                <div className={'lg:col-span-3 space-y-8'}>
                    <AuctionBidComponent listing={listing} viewCount={viewCount}/>
                    {/*                value={myBid}*/}
                    {/*                step={50000}*/}
                    {/*                placeholder={'Enter Bid'}*/}
                    {/*                variant="outlined"*/}
                    {/*                size="large"*/}
                    {/*                className="text-lg max-w-sm! w-full!"*/}
                    {/*                prefix={'KSH'}*/}
                    {/*                formatter={(value) => toMoneyFormat(Number(value || 0))}*/}
                    {/*                onChange={(value) => setMyBid(Number(value || minBid))}*/}
                    {/*            />*/}
                    {/*            <Button type="primary" size="large" className="text-lg block">*/}
                    {/*                Place Bid*/}
                    {/*            </Button>*/}
                    {/*        </div>*/}
                    {/*        <Divider orientation={'vertical'}/>*/}
                    {/*        <div className={'flex w-full xl:justify-between gap-2 items-center'}>*/}
                    {/*            <Button*/}
                    {/*                icon={<SendOutlined/>}*/}
                    {/*                size={'large'}*/}
                    {/*                type={'primary'}*/}
                    {/*                onClick={() => void handleMessageDealer()}*/}
                    {/*            >*/}
                    {/*                Message Dealer*/}
                    {/*            </Button>*/}
                    {/*            /!*<Button icon={<StarOutlined/>} size={'large'} color={'default'} variant={'outlined'}>*!/*/}
                    {/*            /!*    Watch*!/*/}
                    {/*            /!*</Button>*!/*/}
                    {/*            <Button icon={<NotificationOutlined/>} size={'large'} color={'default'} variant={'outlined'}>*/}
                    {/*                Notify Me*/}
                    {/*            </Button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
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
                    {relatedEndingSoon.length > 0 && (<>
                        <Title className={'my-4!'} level={4}>Auctions Ending Soon</Title>
                        <div className={'grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'}>
                            {relatedEndingSoon.map((auction: CarAuction) => (
                                <AuctionItem key={auction.id} listing={auction}/>
                            ))}
                        </div></>)}

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
