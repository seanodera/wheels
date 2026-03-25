import type {CarAuction, CarItem, Profile} from "@/types";
import {keysToCamelCase} from "@/utils/caseConverter.ts";
import {supabase} from "@/utils/supabase.ts";
import {toCarAuction, toCarItem} from "@/utils/dbHelpers.ts";

type SavedVehicleRow = {
    vehicle_id: string;
    vehicle?: ({
        id: string;
        type?: string;
    } & Record<string, unknown>) | Array<Record<string, unknown>>;
};

type AuctionRelationRow = {
    auction?: ({
        status?: string;
    } & Record<string, unknown>) | Array<Record<string, unknown>>;
};

const asSingleRecord = <T extends Record<string, unknown>>(value: T | T[] | undefined): T | null => {
    if (!value) {
        return null;
    }

    return Array.isArray(value) ? (value[0] as T | undefined) ?? null : value;
};

const dedupeAuctions = (auctions: CarAuction[]) => {
    const seen = new Set<string>();
    return auctions.filter((auction) => {
        const key = String(auction.id);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

export async function fetchProfileByUserId(userId: string): Promise<Profile | null> {
    const response = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (response.error) {
        throw response.error;
    }

    if (!response.data) {
        return null;
    }

    return keysToCamelCase<Profile>(response.data);
}

export async function fetchSavedVehiclesByUserId(userId: string): Promise<(CarItem | CarAuction)[]> {
    const savedResponse = await supabase
        .from("user_saved_vehicles")
        .select("vehicle_id, vehicle:vehicles!inner(*, seller:dealerships(*))")
        .eq("user_id", userId)
        .eq("vehicle.published", true)
        .order("created_at", {ascending: false});

    if (savedResponse.error || !Array.isArray(savedResponse.data) || savedResponse.data.length === 0) {
        return [];
    }

    const savedRows = savedResponse.data as unknown as SavedVehicleRow[];
    const listingVehicleIds = savedRows
        .filter((row) => asSingleRecord(row.vehicle)?.type === "listing")
        .map((row) => row.vehicle_id);
    const auctionVehicleIds = savedRows
        .filter((row) => asSingleRecord(row.vehicle)?.type === "auction")
        .map((row) => row.vehicle_id);

    const [listingResponse, auctionResponse] = await Promise.all([
        listingVehicleIds.length
            ? supabase
                .from("listings")
                .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                .in("vehicle_id", listingVehicleIds)
            : Promise.resolve({data: [], error: null}),
        auctionVehicleIds.length
            ? supabase
                .from("auctions")
                .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                .in("vehicle_id", auctionVehicleIds)
            : Promise.resolve({data: [], error: null}),
    ]);

    if (listingResponse.error || auctionResponse.error) {
        return [];
    }

    const listingMap = new Map(
        (listingResponse.data ?? []).map((row) => [String((row as {vehicle_id: string}).vehicle_id), toCarItem(row)])
    );
    const auctionMap = new Map(
        (auctionResponse.data ?? []).map((row) => [String((row as {vehicle_id: string}).vehicle_id), toCarAuction(row)])
    );

    const savedVehicles: (CarItem | CarAuction)[] = [];
    for (const row of savedRows) {
        const type = asSingleRecord(row.vehicle)?.type;
        if (type === "listing") {
            const listing = listingMap.get(row.vehicle_id);
            if (listing) {
                savedVehicles.push(listing);
            }
            continue;
        }

        if (type === "auction") {
            const auction = auctionMap.get(row.vehicle_id);
            if (auction) {
                savedVehicles.push(auction);
            }
        }
    }

    return savedVehicles;
}

export async function fetchWatchedAuctionsByUserId(userId: string): Promise<CarAuction[]> {
    const response = await supabase
        .from("user_auction_watches")
        .select("auction:auctions!inner(*, vehicle:vehicles!inner(*, seller:dealerships(*)))")
        .eq("user_id", userId)
        .eq("auction.vehicle.published", true)
        .order("created_at", {ascending: false});

    if (response.error || !Array.isArray(response.data)) {
        return [];
    }

    return dedupeAuctions(
        response.data.flatMap((row) => {
            const auction = asSingleRecord((row as unknown as AuctionRelationRow).auction);
            return auction ? [toCarAuction(auction)] : [];
        })
    );
}

export async function fetchBiddingAuctionsByUserId(
    userId: string,
    options?: {completedOnly?: boolean}
): Promise<CarAuction[]> {
    const response = await supabase
        .from("auction_bids")
        .select("created_at, auction:auctions!inner(*, vehicle:vehicles!inner(*, seller:dealerships(*)))")
        .eq("user_id", userId)
        .eq("auction.vehicle.published", true)
        .order("created_at", {ascending: false});

    if (response.error || !Array.isArray(response.data)) {
        return [];
    }

    const auctions = response.data.flatMap((row) => {
        const auction = asSingleRecord((row as unknown as AuctionRelationRow).auction);
        if (!auction) {
            return [];
        }

        if (options?.completedOnly && auction.status !== "ended") {
            return [];
        }

        if (!options?.completedOnly && auction.status === "ended") {
            return [];
        }

        return [toCarAuction(auction)];
    });

    return dedupeAuctions(auctions);
}
