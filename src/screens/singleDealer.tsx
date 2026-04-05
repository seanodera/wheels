import {Avatar, Button, Empty, Tag, Typography} from "antd";
import {
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    SendOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import CustomCarousel from "@/components/common/customCarousel.tsx";
import ListingComponent from "@/components/listings/listingComponent.tsx";
import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router";
import type {CarAuction, CarItem, Dealership} from "@/types";
import {isCarAuction, supabase} from "@/utils";
import {keysToCamelCase} from "@/utils/caseConverter.ts";
import AuctionItem from "@/components/auction/auctionItem.tsx";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import {useAppDispatch} from "@/store/hooks.ts";
import {startConversationAsync} from "@/store";

const {Title, Text, Paragraph} = Typography;

function formatLocation(dealer: Dealership) {
    const firstLocation = dealer.locations?.[0];
    if (!firstLocation) return "Location not specified";

    return [firstLocation.subCounty, firstLocation.county, firstLocation.country]
        .filter(Boolean)
        .join(", ");
}

function isListing(item: CarItem | CarAuction): item is CarItem {
    return !isCarAuction(item);
}

export default function SingleDealer() {
    const {id} = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [dealer, setDealer] = useState<Dealership | null>(null);
    const [inventory, setInventory] = useState<(CarItem | CarAuction)[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Missing dealer id");
            return;
        }

        const loadDealer = async () => {
            setLoading(true);
            setError(null);
            try {
                const [dealerResponse, listingsResponse] = await Promise.all([
                    supabase
                        .from("dealerships")
                        .select("*")
                        .eq("id", id)
                        .maybeSingle(),
                    supabase
                        .from("vehicles")
                        .select("*,auction:auctions(*), listing:listings(*)")
                        .eq("published", true)
                        .eq("seller_id", id)
                        .order("created_at", {ascending: false})
                        .limit(16),
                ]);

                if (dealerResponse.error) {
                    setError(dealerResponse.error.message);
                    return;
                }

                if (!dealerResponse.data) {
                    setError("Dealer not found");
                    return;
                }

                if (listingsResponse.error) {
                    setError(listingsResponse.error.message);
                    return;
                }

                setDealer(keysToCamelCase<Dealership>(dealerResponse.data));

                const data = (listingsResponse.data ?? [])
                    .map((listing) => {
                        if (!listing) return undefined;

                        if (listing.type === "auction" && listing.auction) {
                            return keysToCamelCase<CarAuction>({
                                ...listing,
                                ...listing.auction,
                            });
                        }

                        if (listing.type === "listing" && listing.listing) {
                            return keysToCamelCase<CarItem>({
                                ...listing,
                                ...listing.listing,
                            });
                        }

                        return undefined;
                    })
                    .filter((item): item is CarAuction | CarItem => Boolean(item));

                setInventory(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                    return;
                }

                setError("Failed to load dealer profile");
            } finally {
                setLoading(false);
            }
        };

        void loadDealer();
    }, [id]);

    const imageSet = useMemo(() => {
        if (!dealer) return [];
        return dealer.images?.length ? [dealer.banner,...dealer.images] : dealer.banner ? [dealer.banner] : dealer.profile ? [dealer.profile] : [];
    }, [dealer]);

    const liveAuctions = useMemo(() => inventory.filter(isCarAuction), [inventory]);
    const listedCars = useMemo(() => inventory.filter(isListing), [inventory]);
    const featuredInventory = useMemo(() => inventory.slice(0, 4), [inventory]);
    const locationText = useMemo(() => dealer ? formatLocation(dealer) : "Location not specified", [dealer]);
    const dealerType = dealer?.type === "company" ? "Dealer" : "Individual";

    const handleMessageDealer = async () => {
        if (!dealer) {
            return;
        }

        await dispatch(startConversationAsync({
            dealerId: dealer.id,
            dealerName: dealer.name,
            dealerAvatar: dealer.profile,
            subject: `Message for ${dealer.name}`,
        })).unwrap();

        navigate("/messages");
    };

    if (loading) {
        return <LoadingScreen/>;
    }

    if (error || !dealer) {
        return <Empty description={error || "Failed to load dealer profile"}/>;
    }

    return (
        <div className="px-4 py-4 text-current lg:px-8 xl:px-12">
            <div className="mx-auto flex w-full flex-col gap-6">
                <div className="flex flex-col gap-4 rounded-2xl bg-light-accent glass-card p-5 dark:bg-dark md:flex-row md:items-end md:justify-between md:p-6">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Text className="text-[11px]! uppercase tracking-[0.38em]">
                                Dealer Profile
                            </Text>
                            <Tag className="m-0 rounded-full px-3 py-0.5">
                                {dealerType}
                            </Tag>
                            {dealer.verified && (
                                <Tag color="green" className="m-0 rounded-full px-3 py-0.5">
                                    Verified
                                </Tag>
                            )}
                        </div>

                        <Title className="mb-0! mt-3! leading-none" level={2}>
                            {dealer.name}
                        </Title>
                        <Text className="mt-3 block">
                            {locationText}
                        </Text>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto">
                        <Button
                            icon={<SendOutlined/>}
                            size="large"
                            type="primary"
                            className="h-11 rounded-full px-5"
                            onClick={() => void handleMessageDealer()}
                        >
                            Message Dealer
                        </Button>
                        <Button
                            icon={<ShopOutlined/>}
                            size="large"
                            color="default"
                            variant="outlined"
                            className="h-11 rounded-full border-black/15 bg-white/70 px-5"
                            onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"})}
                        >
                            View Inventory
                        </Button>
                    </div>
                </div>

                {imageSet.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl">
                        <CustomCarousel items={1}>
                            {imageSet.filter(Boolean).map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    className="aspect-[2.4/1] w-full object-cover object-center"
                                    alt={`${dealer.name} ${index + 1}`}
                                />
                            ))}
                        </CustomCarousel>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-black/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5 md:p-8">
                        <Text className="block text-sm text-black/60 dark:text-white/65">
                            Dealer media will appear here once photos are available.
                        </Text>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px] 2xl:gap-12 2xl:grid-cols-6">
                    <div className="order-1 space-y-6 2xl:col-span-4">
                        <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5 md:p-6">
                            <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                About The Seller
                            </Text>
                            <Title level={4} className="mb-2! text-black dark:text-white">
                                Built for buyers looking for credible stock and direct contact.
                            </Title>
                            <Paragraph className="mb-0! text-base leading-7 text-black/70 dark:text-white/72">
                                {dealer.description || "This seller has not added a public description yet. Browse the current stock below and open a direct conversation for availability, pricing, and inspection details."}
                            </Paragraph>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                                <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                    Total Listings
                                </Text>
                                <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                    {dealer.listingCount ?? listedCars.length}
                                </Title>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                                <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                    Live Auctions
                                </Text>
                                <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                    {dealer.auctionCount ?? liveAuctions.length}
                                </Title>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                                <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                    Vehicles Sold
                                </Text>
                                <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                    {dealer.soldCount ?? 0}
                                </Title>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                                <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                    Profile Views
                                </Text>
                                <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                    {dealer.views ?? 0}
                                </Title>
                            </div>
                        </div>

                        {featuredInventory.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <Title level={4} className="mb-0! text-black dark:text-white">
                                            Featured Stock
                                        </Title>
                                        <Text className="text-sm text-black/60 dark:text-white/65">
                                            A quick look at the latest vehicles currently visible on this profile.
                                        </Text>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
                                    {featuredInventory.map((item) => isCarAuction(item) ? (
                                        <AuctionItem key={item.id} listing={item}/>
                                    ) : (
                                        <ListingComponent key={item.id} listing={item}/>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <Title level={4} className="mb-0! text-black dark:text-white">
                                    Listings
                                </Title>
                                <Text className="text-sm text-black/60 dark:text-white/65">
                                    Dealer-managed vehicles available for direct purchase and offer conversations.
                                </Text>
                            </div>

                            {listedCars.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 dark:border-white/10 dark:bg-white/5">
                                    <Empty description="No direct listings available from this seller right now."/>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                                    {listedCars.map((listing) => (
                                        <ListingComponent listing={listing} key={listing.id}/>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Title level={4} className="mb-0! text-black dark:text-white">
                                    Live Auctions
                                </Title>
                                <Text className="text-sm text-black/60 dark:text-white/65">
                                    Auction inventory currently open for bidding from this same seller profile.
                                </Text>
                            </div>

                            {liveAuctions.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 dark:border-white/10 dark:bg-white/5">
                                    <Empty description="No live auctions are running from this seller at the moment."/>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                                    {liveAuctions.map((auction) => (
                                        <AuctionItem listing={auction} key={auction.id}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="order-2 space-y-6 2xl:col-span-2 xl:sticky xl:top-6 xl:self-start">
                        <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10 bg-light-accent glass-card dark:bg-dark md:p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16! w-16!" size={64} src={dealer.profile}>
                                    {dealer.name?.[0]}
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <Tag className="m-0 rounded-full px-3 py-0.5">
                                            {dealerType}
                                        </Tag>
                                        {dealer.verified && (
                                            <Tag color="green" className="m-0 rounded-full px-3 py-0.5">
                                                Verified
                                            </Tag>
                                        )}
                                    </div>
                                    <Title level={4} className="mb-1! text-black dark:text-white">
                                        {dealer.name}
                                    </Title>
                                    <Text className="block text-sm text-black/60 dark:text-white/65">
                                        {locationText}
                                    </Text>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SendOutlined/>}
                                    className="rounded-full"
                                    onClick={() => void handleMessageDealer()}
                                >
                                    Start Conversation
                                </Button>
                                <Button
                                    size="large"
                                    color="default"
                                    variant="outlined"
                                    icon={<PhoneOutlined/>}
                                    className="rounded-full"
                                >
                                    {dealer.phoneNumber || dealer.phone || "Phone unavailable"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5 md:p-6">
                            <div>
                                <Title className="mb-0! text-black dark:text-white" level={4}>
                                    Dealer Snapshot
                                </Title>
                                <Text className="text-sm text-black/60 dark:text-white/65">
                                    Quick profile details buyers usually check before reaching out.
                                </Text>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                        Contact Email
                                    </Text>
                                    <Text className="flex items-center gap-2 text-sm text-black dark:text-white">
                                        <MailOutlined/> {dealer.email || "Not provided"}
                                    </Text>
                                </div>
                                <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                        Coverage
                                    </Text>
                                    <Text className="flex items-center gap-2 text-sm text-black dark:text-white">
                                        <EnvironmentOutlined/> {locationText}
                                    </Text>
                                </div>
                                <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                        Trust Signal
                                    </Text>
                                    <Text className="flex items-center gap-2 text-sm text-black dark:text-white">
                                        <SafetyCertificateOutlined/> {dealer.verified ? "Verified seller profile" : "Verification pending"}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
