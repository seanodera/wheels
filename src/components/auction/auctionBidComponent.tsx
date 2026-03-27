import {CarAuction, type User} from "@/types";
import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    NotificationOutlined,
    SendOutlined,
    UserOutlined
} from "@ant-design/icons";
import {deduceTimingValues, supabase, toMoneyFormat} from "@/utils";
import {App, Avatar, Button, Divider, InputNumber, Typography} from "antd";
import {formatDate} from "date-fns";
import {useEffect, useRef, useState} from "react";
import {makeBidAsync, refreshAuctionAsync, startConversationAsync, useAppDispatch, useAppSelector} from "@/store";
import {useNavigate} from "react-router";

const {Title, Text} = Typography
export default function AuctionBidComponent({listing, viewCount}: { listing: CarAuction; viewCount?: number }) {
    const dispatch = useAppDispatch();
    const {message} = App.useApp();
    const placingBid = useAppSelector((state) => state.auction.placingBid);
    const currentUserId = useAppSelector((state) => state.authentication.user?.id ?? null);
    const [countDown, setCountDown] = useState("");
    const [myBid, setMyBid] = useState<number>(0);
    const [hasEnded, setHasEnded] = useState(false);
    const navigate = useNavigate();
    const lastCurrentBidRef = useRef<number | null>(null);
    const pendingBidRef = useRef<number | null>(null);

    const topBidder = listing.bids ? listing.bids[listing.bids.length - 1]?.user as User | undefined : undefined;
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
        const previousBid = lastCurrentBidRef.current;

        if (previousBid !== null && currentBid > previousBid) {
            if (pendingBidRef.current === currentBid) {
                pendingBidRef.current = null;
            } else {
                void message.info(`Current bid updated to KSH ${toMoneyFormat(currentBid)}`);
            }
        }

        lastCurrentBidRef.current = currentBid;
    }, [currentBid, message]);

    useEffect(() => {
        if (!listing.auctionId || !listing.id) {
            return;
        }

        const channel = supabase
            .channel(`auction-${listing.auctionId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "auctions",
                    filter: `id=eq.${listing.auctionId}`
                },
                (payload) => {
                    const nextCurrentBid = Number((payload.new as {current_bid?: number | string}).current_bid ?? 0);
                    if (pendingBidRef.current !== null && nextCurrentBid === pendingBidRef.current) {
                        return;
                    }

                    void dispatch(refreshAuctionAsync(String(listing.id)));
                }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [currentUserId, dispatch, listing.auctionId, listing.id]);

    useEffect(() => {
        if (!listing.id || hasEnded) {
            return;
        }

        const interval = window.setInterval(() => {
            void dispatch(refreshAuctionAsync(String(listing.id)));
        }, 5000);

        return () => {
            window.clearInterval(interval);
        };
    }, [dispatch, hasEnded, listing.id]);

    const handleMessageDealer = async () => {
        if (!listing?.sellerId) {
            return;
        }

        await dispatch(startConversationAsync({
            dealerId: String(listing.sellerId),
            dealerName: String(listing.seller.name),
            dealerAvatar: "profile" in listing.seller ? listing.seller.profile : undefined,
            vehicleId: String(listing.id),
            vehicleTitle: `${listing.year} ${listing.brand} ${listing.model}`,
            subject: `Auction inquiry for ${listing.year} ${listing.brand} ${listing.model}`
        })).unwrap();

        navigate("/messages");
    };

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
                    <Title className={'leading-none my-0!'} level={5}>{listing.bids ? listing.bids.length : 0}</Title>
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
                <Button
                    icon={<SendOutlined/>}
                    size={'large'}
                    type={'primary'}
                    onClick={() => void handleMessageDealer()}
                >
                    Message Dealer
                </Button>
                {/*<Button icon={<StarOutlined/>} size={'large'} color={'default'} variant={'outlined'}>*/}
                {/*    Watch*/}
                {/*</Button>*/}
                <Button icon={<NotificationOutlined/>} size={'large'} color={'default'} variant={'outlined'}>
                    Notify Me
                </Button>
            </div>
        </div>
    </div>
}
