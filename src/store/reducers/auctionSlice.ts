import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {CarAuction} from "@/types";
import type {RootState} from "@/store";
import {normalizeError, supabase} from "@/utils";
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
    placingBid: boolean;
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
    placingBid: false,
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

async function fetchAuctionByVehicleId(vehicleId: string) {
    const response = await supabase
        .from("auctions")
        .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
        .eq("vehicle.published", true)
        .eq("vehicle_id", vehicleId)
        .maybeSingle();

    if (response.error) {
        throw new Error(response.error.message);
    }

    if (!response.data) {
        throw new Error("Auction not found");
    }

    return toCarAuction(response.data);
}

type PlaceBidResult = {
    auction_id: string;
    vehicle_id: string;
    current_bid: number;
};

function applyAuctionUpdate(state: AuctionState, updatedAuction: CarAuction) {
    state.currentAuction = updatedAuction;

    const replaceAuction = (items: CarAuction[]) =>
        items.some((auction) => auction.id === updatedAuction.id)
            ? items.map((auction) => auction.id === updatedAuction.id ? updatedAuction : auction)
            : items;

    state.auctions = state.auctions.some((auction) => auction.id === updatedAuction.id)
        ? state.auctions.map((auction) => auction.id === updatedAuction.id ? updatedAuction : auction)
        : [...state.auctions, updatedAuction];
    state.endingSoon = replaceAuction(state.endingSoon);
    state.newlyListed = replaceAuction(state.newlyListed);
    state.noReserve = replaceAuction(state.noReserve);
    state.lowestMileage = replaceAuction(state.lowestMileage);
    state.inspected = replaceAuction(state.inspected);
}

export const fetchAuctionsAsync = createAsyncThunk<CarAuction[], void, { rejectValue: string }>(
    "auction/fetchAuctions",
    async (_, {rejectWithValue}) => {
        try {
            const response = await supabase
                .from("auctions")
                .select("*, vehicle:vehicles!inner(*, seller:dealerships(*))")
                .eq("vehicle.published", true)
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
            return await fetchAuctionByVehicleId(id);
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

            return await fetchAuctionByVehicleId(id);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to fetch auction");
        }
    }
);

export const refreshAuctionAsync = createAsyncThunk<CarAuction, string, { rejectValue: string }>(
    "auction/refreshAuction",
    async (vehicleId, {rejectWithValue}) => {
        try {
            return await fetchAuctionByVehicleId(vehicleId);
        } catch (error) {
            return rejectWithValue(normalizeError(error, "Failed to refresh auction"));
        }
    }
);

export const makeBidAsync = createAsyncThunk<
    CarAuction,
    number,
    { state: RootState; rejectValue: string }
>(
    "auction/makeBid",
    async (amount, {rejectWithValue, getState}) => {
        try {
            console.log("[makeBidAsync] started", {amount});
            const state = getState();
            const currentAuction = state.auction.currentAuction;
            const userId = state.authentication.user?.id;

            console.log("[makeBidAsync] state snapshot", {
                currentAuction,
                userId
            });

            if (!currentAuction) {
                console.log("[makeBidAsync] aborting: no auction selected");
                return rejectWithValue("No auction selected");
            }

            if (!userId) {
                console.log("[makeBidAsync] aborting: no authenticated user");
                return rejectWithValue("You must be logged in to place a bid");
            }

            const vehicleId = String(currentAuction.id);
            const auctionId = String(currentAuction.auctionId);
            const nextBidAmount = toNumber(amount);

            console.log("[makeBidAsync] resolved ids", {
                vehicleId,
                auctionId,
                nextBidAmount
            });

            if (nextBidAmount <= 0) {
                console.log("[makeBidAsync] aborting: invalid amount", {nextBidAmount});
                return rejectWithValue("Bid amount must be greater than zero");
            }

            console.log("[makeBidAsync] calling place_bid rpc", {
                auctionId,
                nextBidAmount
            });
            const bidResponse = await supabase
                .rpc("place_bid", {
                    p_auction_id: auctionId,
                    p_amount: nextBidAmount
                })
                .maybeSingle();

            console.log("[makeBidAsync] place_bid response", bidResponse);

            if (bidResponse.error) {
                console.log("[makeBidAsync] aborting: rpc error", bidResponse.error);
                return rejectWithValue(bidResponse.error.message);
            }

            const bidData = bidResponse.data as PlaceBidResult | null;
            const refreshedVehicleId = String(bidData?.vehicle_id ?? vehicleId);

            console.log("[makeBidAsync] refetching updated auction", {vehicleId: refreshedVehicleId});
            const refreshedAuction = await fetchAuctionByVehicleId(refreshedVehicleId);
            console.log("[makeBidAsync] success", refreshedAuction);
            return refreshedAuction;
        } catch (error) {
            console.log("[makeBidAsync] unexpected error", error);
            return rejectWithValue(normalizeError(error, "Failed to place bid"));
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
                applyAuctionUpdate(state, action.payload);
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
                applyAuctionUpdate(state, action.payload);
            })
            .addCase(setCurrentAuctionAsync.rejected, (state, action) => {
                state.currentAuctionLoading = false;
                state.error = action.payload ?? "Failed to fetch auction";
            })
            .addCase(refreshAuctionAsync.fulfilled, (state, action) => {
                applyAuctionUpdate(state, action.payload);
            })
            .addCase(refreshAuctionAsync.rejected, (state, action) => {
                state.error = action.payload ?? state.error;
            })
            .addCase(makeBidAsync.pending, (state) => {
                state.placingBid = true;
                state.error = null;
            })
            .addCase(makeBidAsync.fulfilled, (state, action) => {
                state.placingBid = false;
                applyAuctionUpdate(state, action.payload);
            })
            .addCase(makeBidAsync.rejected, (state, action) => {
                state.placingBid = false;
                state.error = action.payload ?? "Failed to place bid";
            });
    }
});

export const {clearCurrentAuction, setEndingSoon} = auctionSlice.actions;
export default auctionSlice.reducer;
