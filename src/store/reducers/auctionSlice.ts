import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {CarAuction} from "@/types";
import {supabase} from "@/utils";
import {keysToCamelCase} from "@/utils/caseConverter.ts";

interface AuctionState {
    auctions: CarAuction[];
    endingSoon: CarAuction[];
    newlyListed: CarAuction[];
    noReserve: CarAuction[];
    lowestMileage: CarAuction[];
    inspected: CarAuction[];
    currentAuction: CarAuction | null;
    loading: boolean;
    currentAuctionLoading: boolean;
    error: string | null;
}

const initialState: AuctionState = {
    auctions: [],
    endingSoon: [],
    newlyListed: [],
    noReserve: [],
    lowestMileage: [],
    inspected: [],
    currentAuction: null,
    loading: false,
    currentAuctionLoading: false,
    error: null
};

const normalizeAuction = (row: unknown): CarAuction => keysToCamelCase<CarAuction>(row);

const toNumber = (value: unknown, fallback = 0): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const deriveCollections = (auctions: CarAuction[]) => {
    const endingSoon = [...auctions]
        .sort((a, b) => new Date(a.ending).getTime() - new Date(b.ending).getTime());

    const newlyListed = [...auctions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const noReserve = auctions.filter((auction) => toNumber(auction.startingBid) <= 0);

    const lowestMileage = [...auctions]
        .sort((a, b) => toNumber((a as unknown as {millage?: unknown}).millage, toNumber(a.mileage)) - toNumber((b as unknown as {millage?: unknown}).millage, toNumber(b.mileage)));

    const inspected = auctions.filter((auction) => Boolean(auction.verified));

    return {endingSoon, newlyListed, noReserve, lowestMileage, inspected};
};

export const fetchAuctionsAsync = createAsyncThunk<CarAuction[], void, {rejectValue: string}>(
    "auction/fetchAuctions",
    async (_, {rejectWithValue}) => {
        try {
            const response = await supabase
                .from("vehicles")
                .select("*")
                .eq("type", "auction")
                .order("created_at", {ascending: false});

            if (response.error) {
                return rejectWithValue(response.error.message);
            }

            return (response.data ?? []).map(normalizeAuction);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to fetch auctions");
        }
    }
);

export const fetchAuctionByIdAsync = createAsyncThunk<CarAuction, string, {rejectValue: string}>(
    "auction/fetchAuctionById",
    async (id, {rejectWithValue}) => {
        try {
            const response = await supabase
                .from("vehicles")
                .select("*")
                .eq("type", "auction")
                .eq("id", id)
                .maybeSingle();

            if (response.error) {
                return rejectWithValue(response.error.message);
            }

            if (!response.data) {
                return rejectWithValue("Auction not found");
            }

            return normalizeAuction(response.data);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to fetch auction");
        }
    }
);

const auctionSlice = createSlice({
    name: "auction",
    initialState,
    reducers: {
        clearCurrentAuction: (state) => {
            state.currentAuction = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuctionsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuctionsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.auctions = action.payload;
                const derived = deriveCollections(action.payload);
                state.endingSoon = derived.endingSoon;
                state.newlyListed = derived.newlyListed;
                state.noReserve = derived.noReserve;
                state.lowestMileage = derived.lowestMileage;
                state.inspected = derived.inspected;
            })
            .addCase(fetchAuctionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch auctions";
            })
            .addCase(fetchAuctionByIdAsync.pending, (state) => {
                state.currentAuctionLoading = true;
                state.error = null;
            })
            .addCase(fetchAuctionByIdAsync.fulfilled, (state, action) => {
                state.currentAuctionLoading = false;
                state.currentAuction = action.payload;
            })
            .addCase(fetchAuctionByIdAsync.rejected, (state, action) => {
                state.currentAuctionLoading = false;
                state.error = action.payload ?? "Failed to fetch auction";
            });
    }
});

export const {clearCurrentAuction} = auctionSlice.actions;
export default auctionSlice.reducer;
