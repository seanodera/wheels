import {Avatar, Button, Tag, Typography} from "antd";
import {EnvironmentOutlined, MessageOutlined} from "@ant-design/icons";
import {BaseCar, Dealership} from "@/types";
import {Link, useNavigate} from "react-router";
import {startConversationAsync, useAppDispatch} from "@/store";


const {Title} = Typography;

function formatDealerLocation(locations?: Dealership["locations"]) {
    if (!locations || locations.length === 0) return null;

    const [first, ...rest] = locations;

    const main = `${first.county}, ${first.country}`;
    const extraCount = rest.length;

    return extraCount > 0 ? `${main} +${extraCount} more` : main;
}

export function DealerComponent({dealer, listing}: { dealer: Dealership, listing: BaseCar }) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const locationText = formatDealerLocation(dealer.locations);
    const handleMessageDealer = async () => {
        if (!listing?.sellerId) {
            return;
        }

        await dispatch(startConversationAsync({
            dealerId: String(listing.sellerId),
            dealerName: listing.seller.name,
            dealerAvatar: listing.seller.profile,
            vehicleId: String(listing.id),
            vehicleTitle: `${listing.year} ${listing.brand} ${listing.model}`,
            subject: `Inquiry about ${listing.year} ${listing.brand} ${listing.model}`
        })).unwrap();

        navigate("/messages");
    };
    return (
        <div
            className="flex items-center justify-between p-4 glass-card bg-white dark:bg-dark rounded-lg transition-all">

            {/* LEFT */}
            <Link
                to={`/dealers/${dealer.id}`}
                className="flex items-center gap-3 min-w-0"
            >
                <Avatar
                    size={64}
                    src={dealer.profile}
                    className="shrink-0"
                >
                    {dealer.name?.[0]}
                </Avatar>

                <div>

                    {/* NAME + VERIFIED */}
                    <div className="flex items-center gap-2">
                        <Title level={5} className="leading-none! mb-0! truncate text-white">
                            {dealer.name}
                        </Title>

                        {dealer.verified && (
                            <Tag color="green" className="m-0!">
                                Verified
                            </Tag>
                        )}
                    </div>

                    {/* 📍 LOCATION */}
                    {locationText && (
                        <div className="flex items-center gap-1 text-sm text-neutral-400">
                            <EnvironmentOutlined className="text-neutral-500"/>
                            <span className="truncate text-nowrap">{locationText}</span>
                        </div>
                    )}

                    {/*/!* ⭐ TRUST ROW *!/*/}
                    {/*<div className="flex items-center gap-2 text-sm text-neutral-400">*/}
                    {/*    {dealer.rating && (*/}
                    {/*        <span className="flex items-center gap-1">*/}
                    {/*            <StarFilled className="text-yellow-400"/>*/}
                    {/*            {dealer.rating.toFixed(1)}*/}
                    {/*        </span>*/}
                    {/*    )}*/}

                    {/*    {dealer.listingCount && (*/}
                    {/*        <Text className="text-neutral-500">*/}
                    {/*            {dealer.listingCount} listings*/}
                    {/*        </Text>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                </div>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
                <Button
                    type="primary"
                    ghost
                    icon={<MessageOutlined/>}
                    className="rounded-xl"
                    onClick={handleMessageDealer}
                >
                    Message
                </Button>
            </div>
        </div>
    );
}