import type {CarAuction, CarItem, Dealership} from "@/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {keysToCamelCase} from "@/utils/caseConverter.ts";
import {isCarAuction, supabase} from "@/utils";
import {toCarAuction, toCarItem} from "@/utils/dbHelpers.ts";
import {setEndingSoon} from "@/store/reducers/auctionSlice.ts";


interface WheelsState {
    featuredListings: (CarItem | CarAuction)[];
    auctionsEndingSoon: CarAuction[];
    newListings: (CarItem | CarAuction)[];
    newDealers: Dealership[];
    popularListings: CarItem[];
    popularDealers: Dealership[];
    fetched: boolean;
    loading: boolean;
    hasError: boolean;
    errorMessage: string | null;
}

const initialState: WheelsState = {
    auctionsEndingSoon: [],
    featuredListings: [],
    hasError: false,
    loading: false,
    newDealers: [],
    newListings: [],
    popularDealers: [],
    popularListings: [],
    errorMessage: null,
    fetched: false
};

type HomeCuratedPayload = {
    featured_listings: (CarItem | CarAuction)[];
    ending_soon: CarAuction[];
    new_listings: (CarItem | CarAuction)[];
    new_dealers: Dealership[];
    popular_listings: CarItem[];
    popular_dealers: Dealership[];
};


const toDealership = (value: unknown): Dealership => keysToCamelCase<Dealership>(value);
const isAuctionLike = (value: unknown) => {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    return record.type === "auction" || "startingBid" in record || "starting_bid" in record || "current_bid" in record;
};

const uniqueById = <T extends {id: string | number}>(items: T[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
        const key = String(item.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const takeFill = <T extends {id: string | number}>(primary: T[], fallback: T[], limit: number) =>
    uniqueById([...primary, ...fallback]).slice(0, limit);

const sortListingsByPopularity = (items: CarItem[]) =>
    [...items].sort((a, b) =>
        (Number(b.views ?? 0) + Number(b.favorites ?? 0)) - (Number(a.views ?? 0) + Number(a.favorites ?? 0))
    );

const sortListingsByCreated = (items: CarItem[]) =>
    [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const sortAuctionsByEnding = (items: CarAuction[]) =>
    [...items].sort((a, b) => new Date(a.ending).getTime() - new Date(b.ending).getTime());

const sortDealersByViews = (items: Dealership[]) =>
    [...items].sort((a, b) => Number(b.views ?? 0) - Number(a.views ?? 0));

const sortDealersByCreated = (items: Dealership[]) =>
    [...items].sort((a, b) => {
        const aTime = Date.parse((a as unknown as {createdAt?: string}).createdAt ?? "");
        const bTime = Date.parse((b as unknown as {createdAt?: string}).createdAt ?? "");
        return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });

export const fetchHomeData = createAsyncThunk<HomeCuratedPayload, void, {rejectValue: string}>('wheels/fetchHomeData',
    async (_, {rejectWithValue, dispatch}) => {
        try {
            const [
                featuredResponse,
                endingSoonResponse,
                newListingsResponse,
                popularListingsResponse,
                newDealersResponse,
                popularDealersResponse,
                fallbackListingsResponse,
                fallbackAuctionsResponse,
                fallbackDealersResponse,
            ] = await Promise.all([
                supabase
                    .from("vehicles")
                    .select("*")
                    .in("type", ["listing", "auction"])
                    .eq("published", true)
                    .eq("featured", true)
                    .order("created_at", {ascending: false})
                    .limit(10),
                supabase
                    .from("auctions")
                    .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                    .eq("vehicle.published", true)
                    .order("ending", {ascending: true})
                    .limit(10),
                supabase
                    .from("newly_listed_feed")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(10),
                supabase
                    .from("listings")
                    .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                    .eq("vehicle.published", true)
                    .order("views", {ascending: false, referencedTable: 'vehicles'})
                    .limit(10),
                supabase
                    .from("dealerships")
                    .select("*")
                    .order("created_at", {ascending: false})
                    .limit(8),
                supabase
                    .from("dealerships")
                    .select("*")
                    .order("views", {ascending: false})
                    .limit(8),
                supabase
                    .from("listings")
                    .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                    .eq("vehicle.published", true)
                    .order("created_at", {ascending: false})
                    .limit(24),
                supabase
                    .from("auctions")
                    .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                    .eq("vehicle.published", true)
                    .order("created_at", {ascending: false})
                    .limit(24),
                supabase
                    .from("dealerships")
                    .select("*")
                    .limit(24),
            ]);

            const messages = [
                featuredResponse.error,
                endingSoonResponse.error,
                newListingsResponse.error,
                popularListingsResponse.error,
                newDealersResponse.error,
                popularDealersResponse.error,
                fallbackListingsResponse.error,
                fallbackAuctionsResponse.error,
                fallbackDealersResponse.error,
            ]
                .map((error, index) => {
                    if (!error?.message) return null;
                    const labels = [
                        "featured_listings",
                        "ending_soon",
                        "new_listings",
                        "popular_listings",
                        "new_dealers",
                        "popular_dealers",
                        "fallback_listings",
                        "fallback_auctions",
                        "fallback_dealers",
                    ];
                    return `${labels[index]}: ${error.message}`;
                })
                .filter(Boolean)
                .join(" | ");

            const featuredListingsRaw = (featuredResponse.data ?? []).map((item) =>
                isAuctionLike(item) ? toCarAuction(item) : toCarItem(item)
            );
            const endingSoonRaw = (endingSoonResponse.data ?? []).map(toCarAuction);
            const newListingsRaw = (newListingsResponse.data ?? []).map((item) => isCarAuction(item) ? toCarAuction(item) : toCarItem(item));
            const popularListingsRaw = (popularListingsResponse.data ?? []).map(toCarItem);
            const newDealersRaw = (newDealersResponse.data ?? []).map(toDealership);
            const popularDealersRaw = (popularDealersResponse.data ?? []).map(toDealership);
            const fallbackListings = (fallbackListingsResponse.data ?? []).map(toCarItem);
            const fallbackAuctions = (fallbackAuctionsResponse.data ?? []).map(toCarAuction);
            const fallbackDealers = (fallbackDealersResponse.data ?? []).map(toDealership);

            const endingSoon = takeFill(endingSoonRaw, sortAuctionsByEnding(fallbackAuctions), 10);
            const newListings = takeFill(newListingsRaw, sortListingsByCreated(fallbackListings), 10);
            const popularListings = takeFill(popularListingsRaw, sortListingsByPopularity(fallbackListings), 10);
            const newDealers = takeFill(newDealersRaw, sortDealersByCreated(fallbackDealers), 8);
            const popularDealers = takeFill(popularDealersRaw, sortDealersByViews(fallbackDealers), 8);
            const featuredFallback = uniqueById<(CarItem | CarAuction)>([
                ...endingSoon,
                ...newListings,
                ...popularListings,
            ]);
            const featuredListings = takeFill(featuredListingsRaw, featuredFallback, 10);

            if (
                !featuredListings.length &&
                !endingSoon.length &&
                !newListings.length &&
                !popularListings.length &&
                !newDealers.length &&
                !popularDealers.length
            ) {
                return rejectWithValue(messages || "Failed to fetch curated home data from Supabase");
            }

            dispatch(setEndingSoon(endingSoon))
            return {
                featured_listings: featuredListings,
                ending_soon: endingSoon,
                new_listings: newListings,
                new_dealers: newDealers,
                popular_listings: popularListings,
                popular_dealers: popularDealers
            };
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(`An error has occured: ${error.message}`);
            }
            return rejectWithValue("An error has occured while fetching curated lists");
        }
    });


const WheelSlice = createSlice({
    name: 'wheels', initialState, reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeData.pending,(state) => {
                state.loading = true;
                state.hasError = false;
                state.errorMessage = null;
            })
            .addCase(fetchHomeData.fulfilled,(state,action) => {
                const {featured_listings,ending_soon,new_listings,new_dealers,popular_dealers,popular_listings} = action.payload;
                state.featuredListings = featured_listings;
                state.auctionsEndingSoon = ending_soon;
                state.newListings = new_listings;
                state.newDealers = new_dealers;
                state.popularDealers = popular_dealers;
                state.popularListings = popular_listings
                state.loading = false;
                state.hasError = false;
                state.errorMessage = null;
                state.fetched = true
            })
            .addCase(fetchHomeData.rejected,(state,action) => {
                state.loading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string;
            })
    }
})

export default WheelSlice.reducer
