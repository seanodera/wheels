import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CarItem} from "@/types";
import {supabase} from "@/utils";
import {keysToCamelCase} from "@/utils/caseConverter.ts";


export interface ListingState {
    listings: CarItem[];
    popularListings: CarItem[];
    newListings: CarItem[];
    relatedListings: CarItem[];
    currentListing?: CarItem;
    page: number;
    fetchedPages: number[];
    totalPages: number;
    totalCount: number;
    pageSize: number;
    loading: boolean;
    currentListingLoading: boolean;
    error: string | null;
}

type FetchListingsArgs = {
    page?: number;
    pageSize?: number;
};

type FetchListingsPayload = {
    listings: CarItem[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
};

const normalizeSupabaseListing = (input: unknown): CarItem =>
    keysToCamelCase<CarItem>(input);

const rankPopular = (listings: CarItem[]) =>
    [...listings]
        .sort((a, b) => (Number(b.views ?? 0) + Number(b.favorites ?? 0)) - (Number(a.views ?? 0) + Number(a.favorites ?? 0)))
        .slice(0, 9);

const rankNewest = (listings: CarItem[]) =>
    [...listings]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9);

export const fetchListingAsync = createAsyncThunk<FetchListingsPayload, FetchListingsArgs | undefined, {rejectValue: string}>(
    "listing/fetchListings",
    async (args, {rejectWithValue}) => {
        const page = args?.page ?? 1;
        const pageSize = args?.pageSize ?? 20;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        try {
            const {data, error, count} = await supabase
                .from("vehicles")
                .select("*", {count: "exact"})
                .eq("type", "listing")
                .order("created_at", {ascending: false})
                .range(from, to);

            if (error) {
                return rejectWithValue("Error fetching listings: " + error.message);
            }

            const listings = Array.isArray(data)
                ? data.map((listing) => normalizeSupabaseListing(listing))
                : [];

            const totalCount = typeof count === "number" ? count : listings.length;
            const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

            return {listings, page, pageSize, totalPages, totalCount};
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue("Error fetching listings: " + error.message);
            }
            return rejectWithValue("Error fetching listings");
        }
    }
);

export const fetchListingByIdAsync = createAsyncThunk<CarItem, string, {rejectValue: string}>(
    "listing/fetchListingById",
    async (id, {rejectWithValue}) => {
        const listingId = String(id);
        if (!listingId) {
            return rejectWithValue("Invalid listing id");
        }

        try {
            const {data, error} = await supabase
                .from("vehicles")
                .select("*")
                .eq("id", listingId)
                .eq("type", "listing")
                .maybeSingle();

            if (error || !data) {
                return rejectWithValue(error?.message ?? "Listing not found");
            }

            return normalizeSupabaseListing(data);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue("Error fetching listing: " + error.message);
            }
            return rejectWithValue("Error fetching listing");
        }
    }
);

const initialState: ListingState = {
    listings: [],
    popularListings: [],
    newListings: [],
    relatedListings: [],
    page: 1,
    fetchedPages: [],
    totalPages: 1,
    totalCount: 0,
    pageSize: 20,
    loading: false,
    currentListingLoading: false,
    error: null
};

const listingSlice = createSlice({
    name: "listing",
    initialState,
    reducers: {
        addListing: (state, action: PayloadAction<CarItem>) => {
            state.listings.unshift(action.payload);
            state.newListings = rankNewest(state.listings);
            state.popularListings = rankPopular(state.listings);
            state.totalCount = state.listings.length;
            state.totalPages = Math.max(1, Math.ceil(state.totalCount / state.pageSize));
        },
        clearCurrentListing: (state) => {
            state.currentListing = undefined;
            state.relatedListings = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListingAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchListingAsync.fulfilled, (state, action) => {
                const {listings, page, pageSize, totalPages, totalCount} = action.payload;
                const pages = new Set(state.fetchedPages);
                pages.add(page);

                state.page = page;
                state.pageSize = pageSize;
                state.totalPages = totalPages;
                state.totalCount = totalCount;
                state.fetchedPages = Array.from(pages).sort((a, b) => a - b);
                state.loading = false;

                if (page === 1) {
                    state.listings = listings;
                } else {
                    const byId = new Map(state.listings.map((item) => [String(item.id), item]));
                    listings.forEach((item) => byId.set(String(item.id), item));
                    state.listings = Array.from(byId.values());
                }

                state.popularListings = rankPopular(state.listings);
                state.newListings = rankNewest(state.listings);

                if (state.currentListing) {
                    state.relatedListings = state.newListings
                        .filter((listing) => String(listing.id) !== String(state.currentListing?.id))
                        .slice(0, 8);
                }
            })
            .addCase(fetchListingAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchListingByIdAsync.pending, (state) => {
                state.currentListingLoading = true;
                state.error = null;
            })
            .addCase(fetchListingByIdAsync.fulfilled, (state, action) => {
                state.currentListingLoading = false;
                state.currentListing = action.payload;
                state.relatedListings = state.newListings
                    .filter((listing) => String(listing.id) !== String(action.payload.id))
                    .slice(0, 8);
            })
            .addCase(fetchListingByIdAsync.rejected, (state, action) => {
                state.currentListingLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const {addListing, clearCurrentListing} = listingSlice.actions;
export default listingSlice.reducer;
