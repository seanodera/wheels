import type {CarAuction, CarItem, Dealer} from "@/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {keysToCamelCase} from "@/utils/caseConverter.ts";
import {supabase} from "@/utils";


interface WheelsState {
    featuredListings: (CarItem | CarAuction)[];
    auctionsEndingSoon: CarAuction[];
    newListings: CarItem[];
    newDealers: Dealer[];
    popularListings: CarItem[];
    popularDealers: Dealer[];
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
    errorMessage: null
};

type HomeCuratedPayload = {
    featured_listings: (CarItem | CarAuction)[];
    ending_soon: CarAuction[];
    new_listings: CarItem[];
    new_dealers: Dealer[];
    popular_listings: CarItem[];
    popular_dealers: Dealer[];
};

const toCarItem = (value: unknown): CarItem => keysToCamelCase<CarItem>(value);
const toCarAuction = (value: unknown): CarAuction => keysToCamelCase<CarAuction>(value);
const toDealer = (value: unknown): Dealer => keysToCamelCase<Dealer>(value);
const isAuctionLike = (value: unknown) => {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    return record.type === "auction" || "startingBid" in record || "starting_bid" in record || "current_bid" in record;
};

export const fetchHomeData = createAsyncThunk<HomeCuratedPayload, void, {rejectValue: string}>('wheels/fetchHomeData',
    async (_, {rejectWithValue}) => {
        try {
            const [
                featuredResponse,
                endingSoonResponse,
                newListingsResponse,
                popularListingsResponse,
                newDealersResponse,
                popularDealersResponse
            ] = await Promise.all([
                supabase
                    .from("vehicles")
                    .select("*")
                    .in("type", ["listing", "auction"])
                    .eq("featured", true)
                    .order("created_at", {ascending: false})
                    .limit(10),
                supabase
                    .from("vehicles")
                    .select("*")
                    .eq("type", "auction")
                    .order("ending", {ascending: true})
                    .limit(10),
                supabase
                    .from("vehicles")
                    .select("*")
                    .eq("type", "listing")
                    .order("created_at", {ascending: false})
                    .limit(10),
                supabase
                    .from("vehicles")
                    .select("*")
                    .eq("type", "listing")
                    .order("views", {ascending: false})
                    .limit(10),
                supabase
                    .from("dealers")
                    .select("*")
                    .order("created_at", {ascending: false})
                    .limit(8),
                supabase
                    .from("dealers")
                    .select("*")
                    .order("views", {ascending: false})
                    .limit(8)
            ]);

            const hasAnyError = [
                featuredResponse.error,
                endingSoonResponse.error,
                newListingsResponse.error,
                popularListingsResponse.error,
                newDealersResponse.error,
                popularDealersResponse.error
            ].some(Boolean);

            if (hasAnyError) {
                const messages = [
                    featuredResponse.error?.message ? `featured_listings: ${featuredResponse.error.message}` : null,
                    endingSoonResponse.error?.message ? `ending_soon: ${endingSoonResponse.error.message}` : null,
                    newListingsResponse.error?.message ? `new_listings: ${newListingsResponse.error.message}` : null,
                    popularListingsResponse.error?.message ? `popular_listings: ${popularListingsResponse.error.message}` : null,
                    newDealersResponse.error?.message ? `new_dealers: ${newDealersResponse.error.message}` : null,
                    popularDealersResponse.error?.message ? `popular_dealers: ${popularDealersResponse.error.message}` : null
                ].filter(Boolean).join(" | ");

                return rejectWithValue(messages || "Failed to fetch curated home data from Supabase");
            }

            const featuredListings = (featuredResponse.data ?? []).map((item) =>
                isAuctionLike(item) ? toCarAuction(item) : toCarItem(item)
            );
            const endingSoon = (endingSoonResponse.data ?? []).map(toCarAuction);
            const newListings = (newListingsResponse.data ?? []).map(toCarItem);
            const popularListings = (popularListingsResponse.data ?? []).map(toCarItem);
            const newDealers = (newDealersResponse.data ?? []).map(toDealer);
            const popularDealers = (popularDealersResponse.data ?? []).map(toDealer);

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
            })
            .addCase(fetchHomeData.rejected,(state,action) => {
                state.loading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string;
            })
    }
})

export default WheelSlice.reducer
