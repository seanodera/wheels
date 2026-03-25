import {useParams} from "react-router";
import {useEffect, useMemo, useRef, useState} from "react";
import type {CarAuction, CarItem, Dealership, MiniDealership, User} from "@/types";
import {Avatar, Button, Divider, Empty, InputNumber, Typography} from "antd";
import {startCase} from "lodash";
import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    NotificationOutlined,
    PlusOutlined,
    SendOutlined,
    StarOutlined,
    UserOutlined
} from "@ant-design/icons";
import AuctionItem from "@/components/auctionItem.tsx";
import {deduceTimingValues, toMoneyFormat, trackVehicleView} from "@/utils";
import {formatDate} from "date-fns";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {clearCurrentAuction, fetchAuctionsAsync, setCurrentAuctionAsync} from "@/store/reducers/auctionSlice.ts";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";

const {Title, Text, Paragraph} = Typography;

const sellerDisplayName = (seller: User | Dealership | MiniDealership) => {
    if ("username" in seller && seller.username) return seller.username;
    if ("name" in seller && seller.name) return seller.name;
    return seller.name;
};

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
    const [myBid, setMyBid] = useState<number>(0);
    const [countDown, setCountDown] = useState("");
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
        if (!listing) return;
        setMyBid(Number(listing.currentBid) + 50000);
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
            userId
        }).then((nextViews) => {
            if (typeof nextViews === "number") {
                setViewCount(nextViews);
            }
        });
    }, [listing?.id, listing?.sellerId, userId]);

    useEffect(() => {
        const updateCountdown = () => {
            if (!listing) return;
            const {diff, days, hours, minutes} = deduceTimingValues(new Date(listing.ending));

            if (diff <= 0) {
                setCountDown("Ended");
                return;
            }

            if (days > 0) {
                setCountDown(`${days} day${days > 1 ? "s" : ""}`);
                return;
            }
            if (hours > 0) {
                setCountDown(`${hours} hour${hours > 1 ? "s" : ""}`);
                return;
            }
            setCountDown(`${minutes} min${minutes > 1 ? "s" : ""}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, [listing]);

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

    console.log(listing);
    const topBidder = listing.bids? listing.bids[listing.bids.length - 1]?.user as User | undefined : undefined;
    const currentBid = Number(listing.currentBid) || 0;
    const minBid = currentBid + 50000;
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
                    <div className={'bg-white dark:bg-dark rounded-lg'}>
                        <div className={'p-8'}>
                            <div className={'grid grid-cols-2 lg:grid-cols-4 gap-4'}>
                                <div>
                                    <Title className={'leading-none my-0! '} type={'secondary'} level={5}>
                                        <ClockCircleOutlined/> Time Left
                                    </Title>
                                    <Title className={'leading-none my-0!'} level={5}>{countDown}</Title>
                                </div>
                                <div>
                                    <Title className={'leading-none my-0! '} type={'secondary'} level={5}>
                                        <ArrowUpOutlined/> Highest Bid
                                    </Title>
                                    <Title className={'leading-none my-0!'} level={5}>
                                        KSH {toMoneyFormat(currentBid)}
                                    </Title>
                                </div>
                                <div>
                                    <Title className={'leading-none my-0! '} type={'secondary'} level={5}># Bids</Title>
                                    <Title className={'leading-none my-0!'} level={5}>{listing.bids? listing.bids.length : 0}</Title>
                                </div>
                            </div>
                            <div className={'flex flex-col lg:flex-row justify-between gap-4 py-4'}>
                                <div>
                                    <div className={'flex gap-2 items-center mb-4'}>
                                        <Title className={'leading-none my-0!'} level={4}>Current Bid</Title>
                                        {topBidder && (
                                            <Text className={'leading-none my-0!'}>
                                                <Avatar size={'small'} icon={<UserOutlined/>}/> Current bidder
                                            </Text>
                                        )}
                                    </div>
                                    <Title level={2}>KSH {toMoneyFormat(currentBid)}</Title>
                                </div>
                                <div>
                                    <div className={'grid grid-cols-2 gap-x-4 gap-y-1'}>
                                        <Title level={5} className={'leading-none my-0! '}>Seller</Title>
                                        <Text className={'leading-none my-0!'}>
                                            <Avatar size={'small'} icon={<UserOutlined/>}/> {String(sellerDisplayName(listing.seller))}
                                        </Text>
                                        <Title level={5} className={'leading-none my-0! '}>Ending</Title>
                                        <Text className={'leading-none my-0!'}>
                                            {formatDate(new Date(listing.ending), "eee, MMM dd hh:mm bb")}
                                        </Text>
                                        <Title level={5} className={'leading-none my-0! '}>Views</Title>
                                        <Text className={'leading-none my-0!'}>{viewCount}</Text>
                                        <Title level={5} className={'leading-none my-0! '}>Watching</Title>
                                        <Text className={'leading-none my-0!'}>{listing.favorites ?? 0}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-400 rounded-b-lg p-8 flex lg:flex-row flex-col justify-between gap-2 items-center">
                            <div className={'flex gap-2 items-center'}>
                                <InputNumber
                                    min={minBid}
                                    value={myBid}
                                    step={50000}
                                    placeholder={'Enter Bid'}
                                    variant="outlined"
                                    size="large"
                                    className="text-lg max-w-sm! w-full!"
                                    prefix={'KSH'}
                                    formatter={(value) => toMoneyFormat(Number(value || 0))}
                                    onChange={(value) => setMyBid(Number(value || minBid))}
                                />
                                <Button type="primary" size="large" className="text-lg block">
                                    Place Bid
                                </Button>
                            </div>
                            <Divider orientation={'vertical'}/>
                            <div className={'flex gap-2 items-center'}>
                                <Button icon={<StarOutlined/>} size={'large'} color={'default'} variant={'outlined'}>
                                    Watch
                                </Button>
                                <Button icon={<NotificationOutlined/>} size={'large'} color={'default'} variant={'outlined'}>
                                    Notify Me
                                </Button>
                            </div>
                        </div>
                    </div>
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
                        <Paragraph>{value}</Paragraph>
                    </div>
                ) : null
            )}
        </div>
    );
}
