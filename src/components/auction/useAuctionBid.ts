import {makeBidAsync, useAppDispatch} from "@/store";
import {App} from "antd";
import {useEffect, useRef, useState} from "react";
import {toMoneyFormat} from "@/utils";


export function useAuctionBid(currentBid: number) {
    const dispatch = useAppDispatch();
    const { message } = App.useApp();

    const [myBid, setMyBid] = useState(0);
    const pendingBidRef = useRef<number | null>(null);

    const minBid = currentBid + 50000;

    useEffect(() => {
        setMyBid(minBid);
    }, [minBid]);

    const placeBid = async (hasEnded: boolean) => {
        if (hasEnded) {
            message.error("This auction has already ended");
            return;
        }

        if (myBid < minBid) {
            message.error(`Minimum bid is KSH ${toMoneyFormat(minBid)}`);
            setMyBid(minBid);
            return;
        }

        pendingBidRef.current = myBid;

        try {
            await dispatch(makeBidAsync(myBid)).unwrap();
            message.success(`Bid placed at KSH ${toMoneyFormat(myBid)}`);
        } catch (error) {
            pendingBidRef.current = null;
            message.error(error instanceof Error ? error.message : String(error));
        }
    };

    return {
        myBid,
        setMyBid,
        minBid,
        placeBid,
        pendingBidRef
    };
}