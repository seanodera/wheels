import {CarAuction} from "@/types";
import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    NotificationOutlined,
    ReloadOutlined,
    UserOutlined
} from "@ant-design/icons";
import {deduceTimingValues, supabase, toMoneyFormat} from "@/utils";
import {App, Avatar, Button, Divider, InputNumber, theme, Typography} from "antd";
import {formatDate, formatDistanceToNow} from "date-fns";
import {useEffect, useMemo, useRef, useState} from "react";
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

    const topBidder = useMemo(() => {
        return listing.bids && listing.bids.length !== 0 ? listing.bids[listing.bids.length - 1] : undefined
    }, [listing]);
    const currentBid = Number(listing.currentBid) || 0;
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
                    console.log(payload)
                    const res = await dispatch(fetchTopBidder(listing.auctionId)).unwrap()
                    console.log(res)

                    void message.info(`Current bid updated to KSH ${toMoneyFormat(res.bid.amount ?? 0)}`);}
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

    return <div className={'glass-card bg-white dark:bg-dark rounded-lg'}>
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
                      <Button size={'large'} type={'link'} icon={<ReloadOutlined/>} onClick={() => dispatch(refreshAuctionAsync(listing.id))}/>
                  </div>
                    <div>
                        {topBidder && (
                            <div className={'flex gap-2 items-center mb-4 ps-3'}>
                                <Avatar size={'small'} icon={!topBidder.user?.profilePicture && <UserOutlined/>} src={topBidder.user?.profilePicture}/>
                                <Text type={'secondary'} className={'leading-none! my-0!'}>

                                {topBidder.user?.firstName} {topBidder.user?.lastName}  {formatDistanceToNow(topBidder.createdAt, {addSuffix: true})}
                                </Text>

                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className={'grid grid-cols-2 gap-x-4 gap-y-1'}>
                        <Title level={5} className={'leading-none my-0! '}>Seller</Title>
                        <Text className={'leading-none my-0!'}>
                            <Avatar size={'small'} icon={<UserOutlined/>}/> {String(listing.seller.name)}
                        </Text>
                        <Title level={5} className={'leading-none my-0! '}>Ending</Title>
                        <Text className={'leading-none my-0!'}>
                            {formatDate(new Date(listing.ending), "eee, MMM dd hh:mm bb")}
                        </Text>
                        <Title level={5} className={'leading-none my-0! '}>Views</Title>
                        <Text className={'leading-none my-0!'}>{viewCount ?? listing.views ?? 0}</Text>
                        <Title level={5} className={'leading-none my-0! '}>Watching</Title>
                        <Text className={'leading-none my-0!'}>{listing.favorites ?? 0}</Text>
                    </div>
                </div>
            </div>
        </div>
        <div className="dark:bg-dark rounded-b-lg p-8 flex xl:flex-row flex-col justify-between gap-2 items-center">
            <div className={'flex w-full  gap-2 items-center'}>
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
                    disabled={hasEnded || placingBid}
                />
                <Button
                    type="primary"
                    size="large"
                    className="text-lg block"
                    onClick={() => void handlePlaceBid()}
                    disabled={hasEnded}
                    loading={placingBid}
                >
                    {hasEnded ? "Auction Ended" : "Place Bid"}
                </Button>
            </div>
            <Divider orientation={'vertical'}/>
            <div className={'flex w-full xl:justify-between gap-2 items-center'}>
                <Button icon={<NotificationOutlined/>} size={'large'} color={'default'} variant={'outlined'}>
                    Notify Me
                </Button>
            </div>
        </div>
    </div>
}


export function AnimatedBid({ value }: {
    value: number;
}) {
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
            transition={{ duration: 0.6 }}
            style={{ display: "inline-block" }}
        >
            KSH {toMoneyFormat(displayValue)}
        </motion.span>
    );
}