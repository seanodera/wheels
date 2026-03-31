import {AuctionBid, CarAuction} from "@/types";
import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    NotificationOutlined,
    ReloadOutlined,
    UserOutlined
} from "@ant-design/icons";
import {deduceTimingValues, supabase, toMoneyFormat} from "@/utils";
import {App, Avatar, Button, InputNumber, theme, Typography} from "antd";
import {formatDate, formatDistanceToNow} from "date-fns";
import {useEffect, useRef, useState} from "react";
import {fetchTopBidder, makeBidAsync, refreshAuctionAsync, useAppDispatch, useAppSelector} from "@/store";
import {animate, motion} from "framer-motion";

const {Title, Text} = Typography
export default function AuctionBidComponent({listing, viewCount}: { listing: CarAuction; viewCount?: number }) {
    const dispatch = useAppDispatch();
    const {message} = App.useApp();
    const placingBid = useAppSelector((state) => state.auction.placingBid);
    const currentUserId = useAppSelector((state) => state.authentication.user?.id ?? null);
    const [countDown, setCountDown] = useState("");
    const [myBid, setMyBid] = useState<number>(0);
    const [hasEnded, setHasEnded] = useState(false);
    const pendingBidRef = useRef<number | null>(null);

    const currentBid = Number(listing.currentBid) || 0;
    const topBidder = listing.bids?.[0];

    const minBid = currentBid + 50000;

    useEffect(() => {
        setMyBid(minBid);
    }, [minBid]);

    useEffect(() => {
        const updateCountdown = () => {
            if (!listing) return;
            const {diff, days, hours, minutes} = deduceTimingValues(new Date(listing.ending));

            if (diff <= 0) {
                setCountDown("Ended");
                setHasEnded(true);
                return;
            }

            setHasEnded(false);
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
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [listing]);


    useEffect(() => {
        if (!listing.auctionId || !listing.id) {
            return;
        }

        const channel = supabase
            .channel(`auction-${listing.auctionId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "auction_bids",
                    filter: `auction_id=eq.${listing.auctionId}`,
                },
                async (payload) => {
                    // console.log(payload,listing)
                    dispatch(fetchTopBidder(payload.new.auction_id))
                    // console.log(res)

                    void message.info(`Current bid updated to KSH ${toMoneyFormat(payload.new.amount ?? 0)}`);
                }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [currentUserId, dispatch, listing.auctionId, listing.id, message]);


    const handlePlaceBid = async () => {
        if (hasEnded) {
            void message.error("This auction has already ended");
            return;
        }

        if (myBid < minBid) {
            void message.error(`Minimum bid is KSH ${toMoneyFormat(minBid)}`);
            setMyBid(minBid);
            return;
        }

        pendingBidRef.current = myBid;

        try {
            await dispatch(makeBidAsync(myBid)).unwrap();
            void message.success(`Bid placed at KSH ${toMoneyFormat(myBid)}`);
        } catch (error) {
            pendingBidRef.current = null;
            void message.error(error instanceof Error ? error.message : String(error));
        }
    };

    return <div className={'glass-card w-full bg-white dark:bg-dark rounded-lg'}>
        <div className={'p-8'}>
            <div className={'grid grid-cols-2 lg:grid-cols-3 gap-4'}>
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
                    <Title className={'leading-none my-0!'} level={5}>{listing.totalBids ?? 0}</Title>
                </div>
            </div>
            <div className={'flex flex-col lg:flex-row justify-between gap-4 py-4'}>
                <div>
                    <div className={'flex gap-2 items-center mb-2 '}>
                        <Title className={'leading-none my-0!'} level={4}>Current Bid</Title>
                    </div>
                    {/*<CountUp end={currentBid} prefix={'KSH'}/>*/}
                    {/*<Timer type={'countup'} value={currentBid}/>*/}
                    <div className={'flex gap-2 items-center mb-2 '}>
                        <Title className={'leading-none! mb-2!'}><AnimatedBid value={currentBid}/></Title>
                        <Button size={'large'} type={'link'} icon={<ReloadOutlined/>}
                                onClick={() => dispatch(refreshAuctionAsync(listing.id))}/>
                    </div>
                    <AnimatedTopBidder topBidder={topBidder}/>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3">
                        <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                            Seller
                        </Text>
                        <div className="flex items-center gap-2">
                            <Avatar size="small" icon={<UserOutlined/>}/>
                            <Text className="leading-none! text-black">
                                {String(listing.seller.name)}
                            </Text>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3">
                        <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                            Ending
                        </Text>
                        <Text className="leading-none! text-black">
                            {formatDate(new Date(listing.ending), "eee, MMM dd hh:mm bb")}
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3">
                        <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] text-black/45">
                            Views
                        </Text>
                        <Title level={5} className="mb-0! leading-none! text-black">
                            {viewCount ?? listing.views ?? 0}
                        </Title>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3">
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
        <div className="border-t border-black/10  p-5 md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="flex w-full flex-col gap-2 sm:flex-row">
                    <InputNumber
                        min={minBid}
                        value={myBid}
                        step={50000}
                        placeholder={'Enter Bid'}
                        variant="outlined"
                        size="large"
                        className="w-full! sm:max-w-sm"
                        prefix={'KSH'}
                        formatter={(value) => toMoneyFormat(Number(value || 0))}
                        onChange={(value) => setMyBid(Number(value || minBid))}
                        disabled={hasEnded || placingBid}
                    />
                    <Button
                        type="primary"
                        size="large"
                        className="rounded-full px-6"
                        onClick={() => void handlePlaceBid()}
                        disabled={hasEnded}
                        loading={placingBid}
                    >
                        {hasEnded ? "Auction Ended" : "Place Bid"}
                    </Button>
                </div>

                <div className="flex w-full xl:w-auto">
                    <Button
                        icon={<NotificationOutlined/>}
                        size={'large'}
                        color={'default'}
                        variant={'outlined'}
                        className="px-5 xl:w-auto"
                    >
                        Notify Me
                    </Button>
                </div>
            </div>
        </div>
    </div>
}


export function AnimatedBid({value}: { value: number; }) {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);
    const [flash, setFlash] = useState(false);
    const {token} = theme.useToken()

    useEffect(() => {
        const prev = prevValueRef.current;

        if (value !== prev) {
            // 🔢 count animation
            const controls = animate(prev, value, {
                duration: 0.6,
                ease: "easeOut",
                onUpdate: (v) => setDisplayValue(Math.floor(v))
            });

            // 🌊 flash effect
            setFlash(true);
            const timeout = setTimeout(() => setFlash(false), 600);

            prevValueRef.current = value;

            return () => {
                controls.stop();
                clearTimeout(timeout);
            };
        }
    }, [value]);

    return (
        <motion.span
            className={'dark:text-white text-black'}
            animate={{
                color: flash ? "#00e5ff" : token.colorText, // AntD primary blue
                scale: flash ? [1, 1.05, 1] : 1
            }}
            transition={{duration: 0.6}}
            style={{display: "inline-block"}}
        >
            KSH {toMoneyFormat(displayValue)}
        </motion.span>
    );
}

export function AnimatedTopBidder({topBidder}: { topBidder?: AuctionBid }) {
    const [flash, setFlash] = useState(false);
    const prevBidderRef = useRef<string | null>(null);

    const bidderKey = topBidder
        ? `${topBidder.userId}-${topBidder.createdAt}-${topBidder.amount}`
        : null;

    useEffect(() => {
        if (!bidderKey) return;

        if (prevBidderRef.current && prevBidderRef.current !== bidderKey) {
            setFlash(true);
            const timeout = setTimeout(() => setFlash(false), 600);
            prevBidderRef.current = bidderKey;

            return () => clearTimeout(timeout);
        }

        prevBidderRef.current = bidderKey;
    }, [bidderKey]);

    if (!topBidder) {
        return null;
    }

    return (
        <motion.div
            className="mb-4 flex items-center gap-2 ps-3"
            animate={{
                opacity: flash ? [0.7, 1] : 1,
                scale: flash ? [1, 1.03, 1] : 1
            }}
            transition={{duration: 0.6}}
        >
            <Avatar
                size="small"
                icon={!topBidder.user?.profilePicture && <UserOutlined/>}
                src={topBidder.user?.profilePicture}
            />
            <Text
                type="secondary"
                className="leading-none! my-0!"
                style={{color: flash ? "#00e5ff" : undefined}}
            >
                {topBidder.user? `${topBidder.user.firstName} ${topBidder.user.lastName}  ` : 'Anonymous'}
                {formatDistanceToNow(topBidder.createdAt, {addSuffix: true, includeSeconds: true})}
            </Text>
        </motion.div>
    );
}
