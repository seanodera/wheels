import {Avatar, Button, Empty, Tabs, Typography} from "antd";
import {useEffect, useMemo, useState, type ReactNode} from "react";
import {useLocation, useNavigate} from "react-router";
import {formatDate} from "date-fns";
import {UserOutlined} from "@ant-design/icons";
import ListingComponent from "@/components/listingComponent.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import type {CarAuction, CarItem} from "@/types";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {
    asyncFetchBiddingAuctions,
    asyncFetchCompletedAuctions,
    asyncFetchSavedVehicles,
    asyncFetchWatchedAuctions
} from "@/store/reducers/authenticationSlice.ts";
import {isCarAuction} from "@/utils";

const {Title, Text} = Typography;

function ProfileField({label, value}: { label: string; value: ReactNode }) {
    return (
        <div className="rounded-2xl border border-black/10 bg-black/3 px-4 py-3">
            <Text className="mb-1 block text-[11px]! uppercase tracking-[0.22em] ">
                {label}
            </Text>
            <Text className="block text-black">{value}</Text>
        </div>
    );
}

function MarketplaceGrid({children}: { children: ReactNode }) {
    return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

function EmptyMarketplace({description}: { description: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-black/10 p-10">
            <Empty description={description}/>
        </div>
    );
}

export default function ProfileScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.authentication.user);
    const [activeTab, setActiveTab] = useState("saved-listings");

    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash) {
            setActiveTab(hash);
        }
    }, [location.hash]);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [navigate, user]);

    const tabItems = useMemo(
        () => [
            {key: "saved-listings", label: "Saved Listings", children: <SavedListings/>},
            {key: "saved-auctions", label: "Saved Auctions", children: <SavedAuctions/>},
            {key: "watched-auctions", label: "Watched Auctions", children: <WatchedAuctions/>},
            {key: "bidding-auctions", label: "Bidding Auctions", children: <BiddingAuctions/>},
            {key: "completed-auctions", label: "Completed Auctions", children: <CompletedAuctions/>}
        ],
        []
    );

    const onTabChange = (key: string) => {
        setActiveTab(key);
        navigate(`#${key}`, {replace: true});
    };

    if (!user) {
        return null;
    }

    return (
        <div className="px-4 py-6 lg:px-8 xl:px-12">
            <div className="mx-auto flex w-full  flex-col gap-6">
                <section className="rglass-card w-full bg-white dark:bg-dark rounded-2xl p-5 md:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <Avatar
                                src={user.profilePicture}
                                icon={!user.profilePicture && <UserOutlined className="text-5xl"/>}
                                size={72}
                                className=" shrink-0 object-cover "
                            />

                            <div className="space-y-4">
                                <div>
                                    <Text className="text-[11px]! uppercase tracking-[0.38em] text-black/45">
                                        Account
                                    </Text>
                                    <Title level={2} className="mb-0! mt-2! text-black">
                                        {user.firstName} {user.lastName}
                                    </Title>
                                    <Text className="mt-2 block text-black/65">
                                        Joined {formatDate(user.createdAt, "MMM yyyy")}
                                    </Text>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                                    <ProfileField label="First Name" value={user.firstName}/>
                                    <ProfileField label="Last Name" value={user.lastName}/>
                                    <ProfileField label="Email" value={user.email}/>
                                    <ProfileField label="Phone" value={user.phone || "-"} />
                                </div>
                            </div>
                        </div>

                        <Button type="primary" ghost className="h-11 rounded-full px-5">
                            Edit Profile
                        </Button>
                    </div>
                </section>

                <section className="glass-card w-full bg-white dark:bg-dark rounded-2xl p-4 md:p-6">
                    <Tabs activeKey={activeTab} onChange={onTabChange} items={tabItems}/>
                </section>
            </div>
        </div>
    );
}

export function SavedListings() {
    const listings = useAppSelector((state) => state.authentication.marketplace.savedVehicles);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!listings) {
            dispatch(asyncFetchSavedVehicles());
        }
    }, [dispatch, listings]);

    if (!listings) {
        return <EmptyMarketplace description="Loading saved listings"/>;
    }

    const savedListings = listings.filter((value): value is CarItem => !isCarAuction(value));

    if (!savedListings.length) {
        return <EmptyMarketplace description="No saved listings yet"/>;
    }

    return (
        <MarketplaceGrid>
            {savedListings.map((listing) => <ListingComponent listing={listing} key={listing.id}/>)}
        </MarketplaceGrid>
    );
}

export function SavedAuctions() {
    const listings = useAppSelector((state) => state.authentication.marketplace.savedVehicles);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!listings) {
            dispatch(asyncFetchSavedVehicles());
        }
    }, [dispatch, listings]);

    if (!listings) {
        return <EmptyMarketplace description="Loading saved auctions"/>;
    }

    const savedAuctions = listings.filter((value): value is CarAuction => isCarAuction(value));

    if (!savedAuctions.length) {
        return <EmptyMarketplace description="No saved auctions yet"/>;
    }

    return (
        <MarketplaceGrid>
            {savedAuctions.map((listing) => <AuctionItem listing={listing} key={listing.id}/>)}
        </MarketplaceGrid>
    );
}

export function WatchedAuctions() {
    const auctions = useAppSelector((state) => state.authentication.marketplace.watchedAuctions);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!auctions) {
            dispatch(asyncFetchWatchedAuctions());
        }
    }, [auctions, dispatch]);

    if (!auctions) {
        return <EmptyMarketplace description="Loading watched auctions"/>;
    }

    if (!auctions.length) {
        return <EmptyMarketplace description="No watched auctions yet"/>;
    }

    return (
        <MarketplaceGrid>
            {auctions.map((auction) => <AuctionItem listing={auction} key={auction.id}/>)}
        </MarketplaceGrid>
    );
}

export function BiddingAuctions() {
    const auctions = useAppSelector((state) => state.authentication.marketplace.biddingAuctions);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!auctions) {
            dispatch(asyncFetchBiddingAuctions());
        }
    }, [auctions, dispatch]);

    if (!auctions) {
        return <EmptyMarketplace description="Loading bidding auctions"/>;
    }

    if (!auctions.length) {
        return <EmptyMarketplace description="No active bids yet"/>;
    }

    return (
        <MarketplaceGrid>
            {auctions.map((auction) => <AuctionItem listing={auction} key={auction.id}/>)}
        </MarketplaceGrid>
    );
}

export function CompletedAuctions() {
    const auctions = useAppSelector((state) => state.authentication.marketplace.completedAuctions);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!auctions) {
            dispatch(asyncFetchCompletedAuctions());
        }
    }, [auctions, dispatch]);

    if (!auctions) {
        return <EmptyMarketplace description="Loading completed auctions"/>;
    }

    if (!auctions.length) {
        return <EmptyMarketplace description="No completed auctions yet"/>;
    }

    return (
        <MarketplaceGrid>
            {auctions.map((auction) => <AuctionItem listing={auction} key={auction.id}/>)}
        </MarketplaceGrid>
    );
}
