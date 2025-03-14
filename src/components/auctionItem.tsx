import { useState, useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { CarAuction } from "@/types.ts";
import {toMoneyFormat} from "@/utils.ts";

const {Title, Text } = Typography;

export default function AuctionItem({ listing }: { listing: CarAuction }) {
    const [countDown, setCountDown] = useState("");

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const endTime = new Date(listing.ending).getTime();
            const diff = endTime - now;

            if (diff <= 0) {
                setCountDown("Ended");
                return;
            }

            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                setCountDown(`${days} day${days > 1 ? "s" : ""}`);
            } else if (hours > 0) {
                setCountDown(`${hours} hour${hours > 1 ? "s" : ""}`);
            } else {
                setCountDown(`${minutes} min${minutes > 1 ? "s" : ""}`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [listing.ending]);

    return (
        <div>
            <div className="aspect-video relative">
                <img src={listing.images[0] || "/placeholder.jpg"} alt="" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute bottom-1 left-1 bg-dark flex gap-2 p-2 rounded-md">
                    <span className="flex items-center gap-1">
                        <Text className={'leading-none my-0'} type="secondary">
                            <ClockCircleOutlined />
                        </Text>
                        <Text  className="leading-none my-0 font-medium">{countDown}</Text>
                    </span>
                    <span>
                        <Text className={'leading-none my-0'} type="secondary">Bid</Text>
                        <Text className="leading-none my-0 font-medium"> KSH {toMoneyFormat(listing.currentBid, true)}</Text>
                    </span>
                </div>
            </div>
            <div>
                <Title className={'leading-none'} level={5}>{listing.year} {listing.brand} {listing.model}</Title>
                <Text className={'leading-none block'} >{listing.millage} KM · {listing.engine} · {listing.transmission} . {listing.drivetrain}</Text>
                <Text className={'leading-none block'} type={'secondary'}>{listing.tags.join(', ')}</Text>
            </div>
        </div>
    );
}
