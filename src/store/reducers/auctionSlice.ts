import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {CarAuction} from "@/types";
import {supabase} from "@/utils";
import {toCarAuction, toNumber} from "@/utils/dbHelpers.ts";

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


const deriveCollections = (auctions: CarAuction[]) => {
    const newlyListed = [...auctions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const noReserve = auctions.filter((auction) => toNumber(auction.startingBid) <= 0);

    const lowestMileage = [...auctions]
        .sort((a, b) => toNumber((a as unknown as {
            millage?: unknown
        }).millage, toNumber(a.mileage)) - toNumber((b as unknown as {
            millage?: unknown
        }).millage, toNumber(b.mileage)));

    const inspected = auctions.filter((auction) => Boolean(auction.verified));

    return {newlyListed, noReserve, lowestMileage, inspected};
};

export const fetchAuctionsAsync = createAsyncThunk<CarAuction[], void, { rejectValue: string }>(
    "auction/fetchAuctions",
    async (_, {rejectWithValue}) => {
        try {
            const response = await supabase
                .from("auctions")
                .select("*, vehicle:vehicles(*, seller:dealers(*)")
                .order("created_at", {ascending: false});

            if (response.error) {
                return rejectWithValue(response.error.message);
            }

            return (response.data ?? []).map(toCarAuction);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to fetch auctions");
        }
    }
);

export const fetchAuctionByIdAsync = createAsyncThunk<CarAuction, string, { rejectValue: string }>(
    "auction/fetchAuctionById",
    async (id, {rejectWithValue}) => {
        try {
            const response = await supabase
                .from("auctions")
                .select("*, vehicle:vehicles(*, seller:dealers(*)")
                .eq("vehicle_id", id)
                .maybeSingle();

            if (response.error) {
                return rejectWithValue(response.error.message);
            }

            if (!response.data) {
                return rejectWithValue("Auction not found");
            }

            return toCarAuction(response.data);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to fetch auction");
        }
    }
);

export const setCurrentAuctionAsync = createAsyncThunk<CarAuction, string, { rejectValue: string }>(
    "auction/setAuctionById",
    async (id, {rejectWithValue, getState}) => {
        const {auction} = getState() as { auction: AuctionState };
        try {
            const item = auction.auctions.find((auction) => auction.id === id);

            if (item) return item;

            const response = await supabase
                .from("auctions")
                .select("*, vehicle:vehicles(*, seller:dealers(*))")
                .eq("vehicle_id", id)
                .maybeSingle();

            if (response.error) {
                return rejectWithValue(response.error.message);
            }

            if (!response.data) {
                return rejectWithValue("Auction not found");
            }

            console.log(response.data)
            return toCarAuction(response.data);
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
        },
        setEndingSoon: (state, action) => {
            state.endingSoon = action.payload;
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
                state.newlyListed = derived.newlyListed;
                state.noReserve = derived.noReserve;
                state.lowestMileage = derived.lowestMileage;
                state.inspected = derived.inspected;
            })
            .addCase(fetchAuctionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch auctions";
            });
        builder.addCase(fetchAuctionByIdAsync.pending, (state) => {
            state.currentAuctionLoading = true;
            state.error = null;
        })
            .addCase(fetchAuctionByIdAsync.fulfilled, (state, action) => {
                state.currentAuctionLoading = false;
                state.currentAuction = action.payload;
                if (state.auctions.some((auction) => auction.id === action.payload.id)) return;
                state.auctions.push(action.payload);
            })
            .addCase(fetchAuctionByIdAsync.rejected, (state, action) => {
                state.currentAuctionLoading = false;
                state.error = action.payload ?? "Failed to fetch auction";
            });
        builder.addCase(setCurrentAuctionAsync.pending, (state) => {
            state.currentAuctionLoading = true;
            state.error = null;
        })
            .addCase(setCurrentAuctionAsync.fulfilled, (state, action) => {
                state.currentAuctionLoading = false;
                state.currentAuction = action.payload;
                if (state.auctions.some((auction) => auction.id === action.payload.id)) return;
                state.auctions.push(action.payload);
            })
            .addCase(setCurrentAuctionAsync.rejected, (state, action) => {
                state.currentAuctionLoading = false;
                state.error = action.payload ?? "Failed to fetch auction";
            });
    }
});

export const {clearCurrentAuction, setEndingSoon} = auctionSlice.actions;
export default auctionSlice.reducer;
