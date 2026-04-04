import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BaseCar, CarAuction, CarItem} from "@/types";
import {isCarAuction} from "@/utils";
import {fetchAuctionsAsync} from "@/store/reducers/auctionSlice.ts";
import {fetchListingAsync} from "@/store/reducers/listingSlice.ts";

export type SearchTabKey = "all" | "auctions" | "listings";
export type SortKey = "newest" | "year-desc" | "year-asc" | "price-desc" | "price-asc" | "ending-soon";
export type SearchResult = CarAuction | CarItem;

interface SearchState {
    auctions: CarAuction[];
    listings: CarItem[];
    activeTab: SearchTabKey;
    query: string;
    brandFilter: string | null;
    bodyFilter: string | null;
    fuelFilter: BaseCar["fuelType"] | null;
    transmissionFilter: BaseCar["transmission"] | null;
    sortBy: SortKey;
    brands: string[];
    bodyStyles: string[];
    fuelTypes: BaseCar["fuelType"][];
    transmissions: BaseCar["transmission"][];
    filteredResults: SearchResult[];
    auctionsLoading: boolean;
    listingsLoading: boolean;
    error: string | null;
}

const initialState: SearchState = {
    auctions: [],
    listings: [],
    activeTab: "all",
    query: "",
    brandFilter: null,
    bodyFilter: null,
    fuelFilter: null,
    transmissionFilter: null,
    sortBy: "newest",
    brands: [],
    bodyStyles: [],
    fuelTypes: [],
    transmissions: [],
    filteredResults: [],
    auctionsLoading: false,
    listingsLoading: false,
    error: null,
};

const getResultPrice = (item: SearchResult) => isCarAuction(item) ? Number(item.currentBid ?? 0) : Number(item.price ?? 0);

const sortResults = (items: SearchResult[], sortBy: SortKey) => {
    const next = [...items];

    switch (sortBy) {
        case "year-desc":
            return next.sort((a, b) => Number(b.year) - Number(a.year));
        case "year-asc":
            return next.sort((a, b) => Number(a.year) - Number(b.year));
        case "price-desc":
            return next.sort((a, b) => getResultPrice(b) - getResultPrice(a));
        case "price-asc":
            return next.sort((a, b) => getResultPrice(a) - getResultPrice(b));
        case "ending-soon":
            return next.sort((a, b) => {
                if (!isCarAuction(a) && !isCarAuction(b)) return 0;
                if (!isCarAuction(a)) return 1;
                if (!isCarAuction(b)) return -1;
                return new Date(a.ending).getTime() - new Date(b.ending).getTime();
            });
        case "newest":
        default:
            return next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
};

const getSourceList = (state: SearchState): SearchResult[] => {
    switch (state.activeTab) {
        case "auctions":
            return state.auctions;
        case "listings":
            return state.listings;
        case "all":
        default:
            return [...state.auctions, ...state.listings];
    }
};

const recomputeSearch = (state: SearchState) => {
    const sourceList = getSourceList(state);

    state.brands = Array.from(new Set(sourceList.map((item) => item.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    state.bodyStyles = Array.from(new Set(sourceList.map((item) => item.body).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    state.fuelTypes = Array.from(new Set(sourceList.map((item) => item.fuelType).filter(Boolean))) as BaseCar["fuelType"][];
    state.transmissions = Array.from(new Set(sourceList.map((item) => item.transmission).filter(Boolean))) as BaseCar["transmission"][];

    const normalizedQuery = state.query.trim().toLowerCase();
    const filtered = sourceList.filter((item) => {
        const searchable = [
            item.name,
            item.brand,
            item.model,
            item.body,
            item.color,
            item.engine,
            item.transmission,
            item.fuelType,
            ...(item.tags ?? []),
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
        const matchesBrand = !state.brandFilter || item.brand === state.brandFilter;
        const matchesBody = !state.bodyFilter || item.body === state.bodyFilter;
        const matchesFuel = !state.fuelFilter || item.fuelType === state.fuelFilter;
        const matchesTransmission = !state.transmissionFilter || item.transmission === state.transmissionFilter;

        return matchesQuery && matchesBrand && matchesBody && matchesFuel && matchesTransmission;
    });

    state.filteredResults = sortResults(filtered, state.sortBy);
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        syncSearchInventory: (state, action: PayloadAction<{auctions: CarAuction[]; listings: CarItem[]}>) => {
            state.auctions = action.payload.auctions;
            state.listings = action.payload.listings;
            recomputeSearch(state);
        },
        setActiveTab: (state, action: PayloadAction<SearchTabKey>) => {
            state.activeTab = action.payload;
            recomputeSearch(state);
        },
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
            recomputeSearch(state);
        },
        setBrandFilter: (state, action: PayloadAction<string | null>) => {
            state.brandFilter = action.payload;
            recomputeSearch(state);
        },
        setBodyFilter: (state, action: PayloadAction<string | null>) => {
            state.bodyFilter = action.payload;
            recomputeSearch(state);
        },
        setFuelFilter: (state, action: PayloadAction<BaseCar["fuelType"] | null>) => {
            state.fuelFilter = action.payload;
            recomputeSearch(state);
        },
        setTransmissionFilter: (state, action: PayloadAction<BaseCar["transmission"] | null>) => {
            state.transmissionFilter = action.payload;
            recomputeSearch(state);
        },
        setSortBy: (state, action: PayloadAction<SortKey>) => {
            state.sortBy = action.payload;
            recomputeSearch(state);
        },
        resetSearchFilters: (state) => {
            state.query = "";
            state.brandFilter = null;
            state.bodyFilter = null;
            state.fuelFilter = null;
            state.transmissionFilter = null;
            state.sortBy = "newest";
            recomputeSearch(state);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuctionsAsync.pending, (state) => {
                state.auctionsLoading = true;
                state.error = null;
            })
            .addCase(fetchAuctionsAsync.fulfilled, (state, action) => {
                state.auctionsLoading = false;
                state.auctions = action.payload;
                recomputeSearch(state);
            })
            .addCase(fetchAuctionsAsync.rejected, (state, action) => {
                state.auctionsLoading = false;
                state.error = action.payload ?? "Failed to fetch auctions";
            })
            .addCase(fetchListingAsync.pending, (state) => {
                state.listingsLoading = true;
                state.error = null;
            })
            .addCase(fetchListingAsync.fulfilled, (state, action) => {
                state.listingsLoading = false;
                state.listings = action.payload.page === 1
                    ? action.payload.listings
                    : Array.from(new Map([...state.listings, ...action.payload.listings].map((item) => [String(item.id), item])).values());
                recomputeSearch(state);
            })
            .addCase(fetchListingAsync.rejected, (state, action) => {
                state.listingsLoading = false;
                state.error = action.payload ?? "Failed to fetch listings";
            });
    },
});

export const {
    syncSearchInventory,
    setActiveTab,
    setQuery,
    setBrandFilter,
    setBodyFilter,
    setFuelFilter,
    setTransmissionFilter,
    setSortBy,
    resetSearchFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
