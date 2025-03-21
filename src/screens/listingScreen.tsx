import {Avatar, Button, Divider, InputNumber, Typography} from "antd";
import {
    ArrowUpOutlined,
    ClockCircleOutlined,
    MessageOutlined, NotificationOutlined,
    PlusOutlined,
    SendOutlined,
    StarOutlined, UserOutlined
} from "@ant-design/icons";
import {CarAuction, CarItem, Dealer, User} from "@/types.ts";
import {toMoneyFormat} from "@/utils.ts";
import {formatDate} from "date-fns";
import CommentsComponent from "@/components/auction/commentComponent.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import {AuctionDescription} from "@/screens/auctionScreen.tsx";
import {Link, useParams} from "react-router-dom";
import {useMemo, useState} from "react";
import {generateCarAuction, generateCarListing, generateDealers} from "@/data/generator.ts";
import ListingComponent from "@/components/listingComponent.tsx";

const {Title, Text} = Typography;
export default function ListingScreen() {
    const {id} = useParams<{ id: string }>();
    const [auctions] = useState<CarAuction[]>(Array.from({length: 20}, (_, id) => generateCarAuction(id)));
    const [listings] = useState<CarItem[]>(Array.from({length: 20}, (_, id) => generateCarListing(id,generateDealers(Number(id)))));
    const [myBid, setMyBid] = useState<number>(0);
    // Ensure id is a valid number before generating the auction
    const listing: CarItem | null = useMemo(() => {
        if (!id || isNaN(Number(id))) return null;
        const carListing = generateCarListing(Number(id), generateDealers(Number(id)));
        setMyBid(carListing.price)
        return carListing;
    }, [id]);

    if (!listing) {
        return <div className="text-center py-10">Invalid listing item</div>;
    }
    return <div className="py-4 px-4 lg:px-16 text-current">
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
        <div className="grid grid-cols-3 lg:grid-cols-5 grid-rows-4 gap-2">
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
        <div className={'grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 '}>
            <div className={'lg:col-span-3 space-y-8'}>
                <div className={'bg-dark-400/30 rounded-lg'}>
                    <div className={'p-8'}>
                        <div className={' grid grid-cols-2 md:grid-cols-4 gap-8'}>
                            <div>
                                <Title className={'leading-none !my-0 '} type={'secondary'}
                                       level={5}><ClockCircleOutlined/> Date Posted</Title>
                                <Title className={'leading-none !my-0'}
                                       level={5}>{formatDate(listing.createdAt, 'HH:MM dd mmm yy')}</Title>
                            </div>
                            <div>
                                <Title className={'leading-none !my-0 '} type={'secondary'}
                                       level={5}><ArrowUpOutlined/> Price</Title>
                                <Title className={'leading-none !my-0'}
                                       level={5}>KSH {toMoneyFormat(listing.price)}</Title>
                            </div>
                            <div>
                                <Title className={'leading-none !my-0 '} type={'secondary'} level={5}>Negotiable</Title>
                                <Title className={'leading-none !my-0'} level={5}>{}</Title>
                            </div>
                            <div>
                                <Title className={'leading-none !my-0 '} type={'secondary'}
                                       level={5}><MessageOutlined/> Comments</Title>
                                <Title className={'leading-none !my-0'} level={5}>{listing.comments.length}</Title>
                            </div>
                        </div>
                        <div className={'flex flex-col md:flex-row justify-between gap-4 py-4'}>
                            <div>

                                <Title level={2}>KSH {toMoneyFormat(listing.price)}</Title>
                            </div>
                            <div>
                                <div className={'grid grid-cols-2 gap-x-4 gap-y-1'}>
                                    <Title level={5} className={'leading-none !my-0 '}>Seller</Title>
                                    <Text
                                        className={'leading-none !my-0'}><Avatar size={'small'} icon={
                                        <UserOutlined/>}/> {(listing.seller as Dealer).name || (listing.seller as User).username}
                                    </Text>
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
                    <div className="bg-dark-400 rounded-b-lg p-8 flex flex-col md:flex-row justify-between gap-2 items-center">
                        <Title level={5}>Make an Offer</Title>
                        <div className={'flex gap-2 items-center'}>
                            <InputNumber
                                value={myBid}
                                step={50000}
                                placeholder={'Enter Bid'}
                                variant="outlined"
                                size="large"
                                className="text-lg !max-w-sm !w-full"
                                prefix={'KSH'}
                                formatter={(value) => toMoneyFormat(value || 0)}
                                onChange={(e) => setMyBid(e || listing.price + 50000)}
                            />
                            <Button type="primary" size="large" className="text-lg block">
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
                                    const videoId = video.split("v=")[ 1 ]?.split("&")[ 0 ]; // Extract YouTube video ID
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
                {(listing.seller as Dealer).name && <DealerComponent dealer={listing.seller as Dealer}/>}
                <Title className={'!my-4'} level={4}>Auctions Ending Soon</Title>
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'}>
                    {auctions.sort((a, b) => new Date(a.ending).getTime() - new Date(b.ending).getTime()).slice(0, 8).map((listing) => (
                        <AuctionItem key={listing.id} listing={listing}/>
                    ))}
                </div>
                <Title className={'!my-4'} level={4}>New Listing</Title>
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
                    {listings.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, 8).map((listing) => (
                        <ListingComponent key={listing.id} listing={listing}/>
                    ))}
                </div>
            </div>
        </div>
    </div>
}

export function DealerComponent({dealer}: { dealer: Dealer }) {

    return (<Link to={`/dealers/${dealer.id}`} className={'flex flex-col items-center justify-center gap-2 bg-dark-400/50 hover:bg-dark-400/70 cursor-alias rounded-xl p-8'}>
        <Title level={3}>Dealer Profile</Title>
        <Avatar size={'large'} className={'!h-20 !w-20'} src={dealer.profile} shape={'circle'}/>
        <Title level={5}>{dealer.name}</Title>
        <div className={'flex gap-4 items-center'}>
            <div><Title className={'!leading-none !my-0 text-center'}>{dealer.listing_count}</Title>
                <Text className={'!leading-none !mt-0 !mb-4 text-center'} type={'secondary'}>Listings</Text></div>
            <div><Title className={'!leading-none !my-0 text-center'}>{dealer.sold_count}</Title>
                <Text className={'!leading-none !mt-0 !mb-4 text-center'} type={'secondary'}>Sold Vehicles</Text></div>
            <div><Title className={'!leading-none !my-0 text-center'}>{dealer.views}</Title>
                <Text className={'!leading-none !mt-0 !mb-4 text-center'} type={'secondary'}>Views</Text></div>


        </div>
    </Link>)
}
