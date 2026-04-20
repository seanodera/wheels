import {supabase} from "@/utils/supabase.ts";

type WatchAuctionArgs = {
    auctionId: string;
    vehicleId: string;
    dealerId: string;
    eventProperties: Record<string, unknown>;
    capture?: (eventName: string, properties: Record<string, unknown>) => void;
};

export type WatchAuctionResult = {
    inserted: boolean;
    watchCount: number;
};

export const watchAuction = async ({
    auctionId,
    vehicleId,
    dealerId,
    eventProperties,
    capture
}: WatchAuctionArgs): Promise<WatchAuctionResult | null> => {
    try {
        console.log("[watchAuction] start", {
            auctionId,
            vehicleId,
            dealerId,
            eventProperties
        });

        const {data, error} = await supabase.rpc("record_auction_watch", {
            p_auction_id: auctionId,
            p_vehicle_id: vehicleId,
            p_dealer_id: dealerId,
            p_metadata: eventProperties
        });

        console.log("[watchAuction] rpc response", {data, error});

        if (error) {
            console.error("Failed to watch auction", error);
            return null;
        }

        const result = data as {inserted?: boolean; watch_count?: number; watchCount?: number} | null;
        const watchCount = Number(result?.watch_count ?? result?.watchCount ?? 0);
        const inserted = Boolean(result?.inserted);

        if (inserted) {
            console.log("[watchAuction] watch inserted, capturing PostHog event", {watchCount});
            capture?.("auction_watched", {
                ...eventProperties,
                unique_watch: true
            });
        } else {
            console.log("[watchAuction] duplicate watch ignored", {watchCount});
        }

        return {inserted, watchCount};
    } catch (error) {
        console.error("Failed to watch auction", error);
        return null;
    }
};
