import {Tabs, Typography, Card, Avatar, Button, Empty} from "antd";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {formatDate} from "date-fns";
import {UserOutlined} from "@ant-design/icons";
import ListingComponent from "@/components/listingComponent.tsx";
import {CarItem} from "@/types";
import AuctionItem from "@/components/auctionItem.tsx";
import {
asyncFetchCompletedAuctions, asyncFetchUserAuctions,
    asyncFetchWishlist
} from "@/store/reducers/authenticationSlice.ts";
import {isCarAuction} from "@/utils";

const {Title, Text} = Typography;

export default function ProfileScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("active-listings");
    const user = useAppSelector((state) => state.authentication.user);
    // Update active tab based on URL hash
    useEffect(() => {
        const hash = location.hash.replace("#", ""); // Remove #
        if (hash) setActiveTab(hash);
    }, [location.hash]);

    // Update URL when tab changes
    const onTabChange = (key: string) => {
        setActiveTab(key);
        navigate(`#${key}`, {replace: true}); // Update the anchor in URL
    };

    const tabItems = [
        {key: "saved-listings", label: "Saved Listings", children: <SavedListings/>},
        {key: "saved-auctions", label: "Saved Auctions", children: <SavedAuctions/>},
        {key: "your-auctions", label: "Your Auctions", children: <YourAuctions/>},
        {key: "completed-auctions", label: "Completed Auctions", children: <CompletedAuctions/>},
        {key: "ongoing-bids", label: "Ongoing Bids", children: <OngoingBids/>},
    ];
    useEffect(() => {
        if (!user){
            navigate("/");
        }
    }, [navigate, user]);

    if (!user){
        return <div>

        </div>
    }

    return (
        <div className={'px-16'}>
            <div className={'flex flex-col items-center justify-center w-full py-16'}>
                <div className={'flex justify-between items-start gap-8 max-w-7xl w-full'}>
                    <div className={'flex justify-start gap-8'}>
                        <Avatar src={user.profilePicture} icon={!user.profilePicture && <UserOutlined className={'text-7xl'}/>} className={'!h-36 !w-36 object-cover'}/>
                        <div className={'py-4 grid grid-cols-3 gap-8'}>
                            <div>
                                <Title className={' leading-none !my-0'} level={5}>{user.firstName}</Title>
                                <Text className={'block'} type={'secondary'}>First Name</Text></div>
                            <div><Title className={' leading-none !my-0'} level={5}>{user.lastName}</Title> <Text
                                className={'block'} type={'secondary'}>Last Name</Text></div>
                            {/*<div><Title className={' leading-none !my-0'} level={5}>{user.username}</Title> <Text*/}
                            {/*    className={'block'} type={'secondary'}>Username</Text></div>*/}
                            <div><Title className={' leading-none !my-0 block'}
                                        level={5}>{user.email}</Title><Text className={'block'}
                                                                                     type={'secondary'}>Email</Text>
                            </div>
                            <div><Title className={' leading-none !my-0 block'} level={5}>{user.phone? user.phone : ' - '}</Title><Text
                                className={'block'} type={'secondary'}>Phone</Text></div>
                            <div><Text className={' leading-none !my-0 block'} type={'secondary'}>Joined {formatDate(user.createdAt,'MMM yyyy')}</Text></div>
                        </div>
                    </div>
                    <Button type={'primary'} ghost>Edit Profile</Button>text-center
                </div>
            </div>
            <Tabs className={'!sticky'} activeKey={activeTab} onChange={onTabChange} items={tabItems}/>

        </div>
    );
}



export function SavedListings() {
    const listings = useAppSelector(state => state.authentication.wishlist);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!listings){
            dispatch(asyncFetchWishlist())
        }
    }, [dispatch, listings]);
    if (!listings){
        return <Empty/>
    }
    return <div className={'grid grid-cols-5 gap-8'}>
        {listings.filter((value) => !isCarAuction(value)).map((listing, index) => <ListingComponent listing={listing as CarItem} key={index} />)}
    </div>;
}


export function SavedAuctions() {
    const listings = useAppSelector(state => state.authentication.wishlist);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!listings){
            dispatch(asyncFetchWishlist())
        }
    }, [dispatch, listings]);
    if (!listings){
        return <div className={'text-center'}>There is no saved Auction Yet</div>
    }
    return <div className={'grid grid-cols-5 gap-8'}>
        {listings.filter((value) => isCarAuction(value)).map((listing, index) => <AuctionItem listing={listing} key={index} />)}
    </div>;
}

export function YourAuctions() {
    const auctions = useAppSelector(state => state.authentication.auctions);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!auctions){
            dispatch(asyncFetchUserAuctions())
        }
    }, [auctions, dispatch]);
    console.log(auctions);
    if (!auctions){
        return <Empty/>
    }
    return <div className={'grid grid-cols-5 gap-8'}>
        {auctions.map((auction, index) => <AuctionItem listing={auction} key={index} />)}
    </div>;
}

export function CompletedAuctions() {
    const auctions = useAppSelector(state => state.authentication.completedAuctions)
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!auctions){
            dispatch(asyncFetchCompletedAuctions())
        }
    }, [auctions, dispatch]);
    if (!auctions){
        return <Empty/>
    }
    return <div className={'grid grid-cols-5 gap-8'}>
        {auctions.map((auction, index) => <AuctionItem listing={auction} key={index} />)}
    </div>;
}

export function OngoingBids() {
    return <Card title="Ongoing Bids">Your current bids will be shown here.</Card>;
}
