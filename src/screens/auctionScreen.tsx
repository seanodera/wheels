import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {CarAuction} from "@/types.ts";
import {generateCarAuction} from "@/data/generator.ts";
import {Avatar, Button, Divider, InputNumber, Typography} from "antd";
import { startCase } from "lodash";

import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    MessageOutlined, NotificationOutlined,
    PlusOutlined,
    SendOutlined,
    StarOutlined,
    UserOutlined
} from "@ant-design/icons";
import AuctionItem from "@/components/auctionItem.tsx";
import {deduceTimingValues, toMoneyFormat} from "@/utils.ts";
import {formatDate} from "date-fns";
import CommentsComponent from "@/components/auction/commentComponent.tsx";

const {Title, Text, Paragraph} = Typography;
export default function AuctionScreen() {
    const {id} = useParams<{ id: string }>();
    const [listings] = useState<CarAuction[]>(Array.from({length: 20}, (_, id) => generateCarAuction(id)));
    const [myBid, setMyBid] = useState<number>(0);
    // Ensure id is a valid number before generating the auction
    const listing: CarAuction | null = useMemo(() => {
        if (!id || isNaN(Number(id))) return null;
        const auction = generateCarAuction(Number(id));
        setMyBid(auction.currentBid + 50000)
        return auction;
    }, [id]);

    const [countDown, setCountDown] = useState("");

    useEffect(() => {
        const updateCountdown = () => {
            if (listing) {

                const {diff, days, hours, minutes} = deduceTimingValues(new Date(listing.ending))


                if (diff <= 0) {
                    setCountDown("Ended");
                    return;
                }


                if (days > 0) {
                    setCountDown(`${days} day${days > 1 ? "s" : ""}`);
                } else if (hours > 0) {
                    setCountDown(`${hours} hour${hours > 1 ? "s" : ""}`);
                } else {
                    setCountDown(`${minutes} min${minutes > 1 ? "s" : ""}`);
                }
            }
        };


        updateCountdown();

        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [listing, listing?.ending]);

    if (!listing) {
        return <div className="text-center py-10">Invalid auction item</div>;
    }

    return (
        <div className="py-4 px-4 lg:px-16 text-current">
            <div className={'flex justify-between items-center w-full pb-4'}>
                <div>
                    <Title className={'leading-none !my-0'}
                           level={3}>{listing.year} {listing.brand} {listing.model}</Title>
                    <Text className={'leading-none !my-0'}>{listing.millage} KM
                        · {listing.engine} · {listing.transmission} . {listing.drivetrain}</Text>
                </div>
                <div className={'flex gap-2'}>
                    <Button icon={<StarOutlined/>} size={'large'} color={'default'} variant={'outlined'}>Watch</Button>
                    <Button icon={<SendOutlined/>} size={'large'} color={'default'} variant={'outlined'}>Share</Button>
                </div>
            </div>
            <div className="grid grid-cols-5 grid-rows-4 gap-2">
                <div className="col-span-3 row-span-4 relative">
                    {/* Main Image */}
                    <img
                        src={listing.images[ 0 ] || "/placeholder.jpg"}
                        className="w-full h-full object-cover rounded-lg aspect-video"
                        alt={`${listing.brand} ${listing.model}`}
                    />
                </div>

                {listing.images.slice(1, 8).map((img, index) => (
                    <img
                        key={index}
                        src={img || "/placeholder.jpg"}
                        alt={`${listing.brand} ${listing.model}`}
                        className="w-full h-full object-cover rounded-lg aspect-video"
                    />
                ))}
                <div className={'w-full h-full object-cover rounded-lg aspect-video bg-cover'}
                     style={{backgroundImage: `url("${listing.images[ 9 ]}")`}}>
                    <div className={'w-full h-full flex flex-col justify-center items-center rounded-lg bg-dark/70'}>
                        <Title level={4}>{listing.images.length - 8} More Images</Title>
                        <Button className={'aspect-square'} type={'text'} variant={'outlined'} ghost
                                icon={<PlusOutlined className={'text-xl'}/>} shape={'round'} size={'large'}/>
                    </div>
                </div>
            </div>
            <div className={'grid grid-cols-5 gap-8 py-8'}>
                <div className={'col-span-3 space-y-8'}>
                    <div className={'bg-dark-400/30 rounded-lg'}>
                        <div className={'p-8'}>
                            <div className={' grid grid-cols-4'}>
                                <div>
                                    <Title className={'leading-none !my-0 '} type={'secondary'}
                                           level={5}><ClockCircleOutlined/> Time Left</Title>
                                    <Title className={'leading-none !my-0'} level={5}>{countDown}</Title>
                                </div>
                                <div>
                                    <Title className={'leading-none !my-0 '} type={'secondary'}
                                           level={5}><ArrowUpOutlined/> Highest Bid</Title>
                                    <Title className={'leading-none !my-0'}
                                           level={5}>KSH {toMoneyFormat(listing.currentBid)}</Title>
                                </div>
                                <div>
                                    <Title className={'leading-none !my-0 '} type={'secondary'} level={5}># Bids</Title>
                                    <Title className={'leading-none !my-0'} level={5}>{listing.bids.length}</Title>
                                </div>
                                <div>
                                    <Title className={'leading-none !my-0 '} type={'secondary'}
                                           level={5}><MessageOutlined/> Comments</Title>
                                    <Title className={'leading-none !my-0'} level={5}>{listing.comments.length}</Title>
                                </div>
                            </div>
                            <div className={'flex justify-between gap-4 py-4'}>
                                <div>
                                    <div className={'flex gap-2 items-center mb-4'}><Title
                                        className={'leading-none !my-0'}
                                        level={4}>Current Bid</Title> <Text
                                        className={'leading-none !my-0'}><Avatar size={'small'} icon={
                                        <UserOutlined/>}/> {listing.bids[ listing.bids.length - 1 ].user.username}
                                    </Text>
                                    </div>
                                    <Title level={2}>KSH {toMoneyFormat(listing.currentBid)}</Title>
                                </div>
                                <div>
                                    <div className={'grid grid-cols-2 gap-x-4 gap-y-1'}>
                                        <Title level={5} className={'leading-none !my-0 '}>Seller</Title>
                                        <Text
                                            className={'leading-none !my-0'}><Avatar size={'small'} icon={
                                            <UserOutlined/>}/> {listing.seller.username}</Text>
                                        <Title level={5} className={'leading-none !my-0 '}>Ending</Title>
                                        <Text
                                            className={'leading-none !my-0'}> {formatDate(listing.ending, 'eee, MMM dd hh:mm bb')}</Text>
                                        <Title level={5} className={'leading-none !my-0 '}>Views</Title>
                                        <Text
                                            className={'leading-none !my-0'}> {600}</Text>
                                        <Title level={5} className={'leading-none !my-0 '}>Watching</Title>
                                        <Text
                                            className={'leading-none !my-0'}>{50}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-400 rounded-b-lg p-8 flex justify-between gap-2 items-center">
                            <div className={'flex gap-2 items-center'}>
                                <InputNumber
                                    min={listing.currentBid + 50000}
                                    value={myBid}
                                    step={50000}
                                    placeholder={'Enter Bid'}
                                    variant="outlined"
                                    size="large"
                                    className="text-lg !w-sm"
                                    prefix={'KSH'}
                                    formatter={(value) => toMoneyFormat(value || 0)}
                                    onChange={(e) => setMyBid(e || listing.currentBid + 50000)}
                                />
                                <Button type="primary" ghost size="large" className="text-lg">
                                    Place Bid
                                </Button>
                            </div>
                            <Divider type={'vertical'}/>
                            <div className={'flex gap-2 items-center'}>
                                <Button icon={<StarOutlined/>} size={'large'} color={'default'}
                                        variant={'outlined'}>Watch</Button>
                                <Button icon={<NotificationOutlined/>} size={'large'} color={'default'}
                                        variant={'outlined'}>Notify Me</Button>
                            </div>
                        </div>
                    </div>
                    <AuctionDescription listing={listing}/>
                    <div>
                        {listing.video.length > 0 && (
                            <div>
                                <Title level={4}>Videos</Title>
                                <div className="grid grid-cols-2 gap-4">
                                    {listing.video.map((video, index) => {
                                        const videoId = video.split("v=")[1]?.split("&")[0]; // Extract YouTube video ID
                                        return (
                                            <a
                                                key={index}
                                                href={video}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <img
                                                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                    alt={`Video ${index + 1}`}
                                                    className="w-full rounded-lg shadow-lg"
                                                />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <CommentsComponent listing={listing}/>
                    </div>
                </div>
                <div className={'col-span-2'}>
                    <Title className={'!my-4'} level={4}>Auctions Ending Soon</Title>
                    <div className={'grid grid-cols-2 gap-8'}>
                        {listings.slice(0,8).map((listing) => (
                            <AuctionItem key={listing.id} listing={listing}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}






export function AuctionDescription({ listing }: { listing: CarAuction }) {
    const { description } = listing;

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
