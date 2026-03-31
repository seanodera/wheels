import {fetchTopBidder, refreshAuctionAsync, useAppDispatch} from "@/store";
import {useEffect, useRef} from "react";
import {supabase} from "@/utils";


export function useAuctionSync(
    listingId?: string,
    auctionId?: string,
    hasEnded?: boolean
) {
    const dispatch = useAppDispatch();
    const lastBidRef = useRef<number | null>(null);

    useEffect(() => {
        if (!auctionId || !listingId) return;

        const channel = supabase
            .channel(`auction-${auctionId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "auctions",
                    filter: `id=eq.${auctionId}`
                },
                (payload) => {
                    const newBid = Number(
                        (payload.new as { current_bid?: number | string }).current_bid ?? 0
                    );

                    // ✅ only react if bid actually changed
                    if (lastBidRef.current !== null && newBid === lastBidRef.current) {
                        return;
                    }

                    lastBidRef.current = newBid;

                    // 🔄 refresh auction
                    // dispatch(refreshAuctionAsync(listingId));

                    // 🏆 fetch top bidder ONLY when bid changes
                    dispatch(fetchTopBidder(listingId));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [auctionId, listingId, dispatch]);

    useEffect(() => {
        if (!listingId || hasEnded) return;

        const interval = setInterval(() => {
            dispatch(refreshAuctionAsync(listingId));
        }, 5000);

        return () => clearInterval(interval);
    }, [listingId, hasEnded, dispatch]);
}