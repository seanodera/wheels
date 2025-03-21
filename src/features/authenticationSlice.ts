import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import { generateCarAuction, generateCarListing, generateDealers } from "@/data/generator.ts";
import { CarAuction, CarItem, Profile } from "@/types.ts";

// Define State Type
interface AuthenticationState {
    user?: Profile | null;
    listings?: CarItem[];
    archivedListings?: CarItem[];
    wishlist?: (CarItem | CarAuction)[];
    auctions?: CarAuction[];
    userAuctions?: CarAuction[];
    completedAuctions?: CarAuction[];
    bids?: CarAuction[];
    loading: boolean;
    error?: string | null;
}

// Initial State
const initialState: AuthenticationState = {
    user: null,
    listings: undefined,
    archivedListings: undefined,
    wishlist: undefined,
    auctions: undefined,
    userAuctions: undefined,
    completedAuctions: undefined,
    bids: undefined,
    loading: false,
    error: null,
};

// Async Thunks

// Auto-login (Mocking a session fetch)
export const autoLoginUser = createAsyncThunk("authentication/autoLogin", async (_, { rejectWithValue }) => {
    try {
        // Simulating stored user session retrieval
        const userData = localStorage.getItem("wheela_user");
        if (!userData) throw new Error("No active session");

        return JSON.parse(userData);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to auto-login");
    }
});

// Signup
export const asyncSignUp = createAsyncThunk(
    "authentication/signUp",
    async (values: { firstName: string; lastName: string; email: string; password: string; username: string }) => {
        const newUser: Profile = {
            id: faker.number.int(),
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            phone: faker.phone.number(),
            createdAt: new Date(),
            verification: { emailVerified: false, phoneVerified: false, kycVerified: false },
            preferences: { currency: "KES", language: "en", notifications: { email: false, sms: false, push: false } },
            security: { twoFactorAuth: false, recentLogins: [] },
        };

        // Simulating storing session
        localStorage.setItem("wheela_user", JSON.stringify(newUser));

        return newUser;
    }
);

// Login
export const asyncLoginUser = createAsyncThunk(
    "authentication/loginUser",
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const user: Profile = {
                id: faker.number.int(),
                email,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                username: faker.internet.displayName(),
                phone: faker.phone.number(),
                createdAt: new Date(),
                verification: { emailVerified: false, phoneVerified: false, kycVerified: false },
                preferences: { currency: "KES", language: "en", notifications: { email: false, sms: false, push: false } },
                security: { twoFactorAuth: false, recentLogins: [] },
            };

            // Simulate storing user session
            localStorage.setItem("wheela_user", JSON.stringify(user));
            console.log(password)
            return user;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Login failed");
        }
    }
);

// Fetch Listings
export const asyncFetchActiveListings = createAsyncThunk("authentication/fetchActiveListings", async () => {
    return Array.from({ length: 20 }, (_, id) => generateCarListing(id, generateDealers(id)));
});
export const asyncFetchArchivedListings = createAsyncThunk("authentication/fetchArchivedListings", async () => {
    return Array.from({ length: 20 }, (_, id) => generateCarListing(id, generateDealers(id)));
});

// Fetch Wishlist (Saved Listings)
export const asyncFetchWishlist = createAsyncThunk("authentication/fetchWishlist", async () => {
    return Array.from({ length: 9 }, (_, id) =>
        faker.datatype.boolean() ? generateCarAuction(id) : generateCarListing(id, generateDealers(id))
    );
});

// Fetch Auctions
export const asyncFetchUserAuctions = createAsyncThunk("authentication/fetchUserAuctions", async () => {
    return Array.from({ length: 20 }, (_, id) => generateCarAuction(id));
});
export const asyncFetchCompletedAuctions = createAsyncThunk("authentication/fetchCompletedAuctions", async () => {
    return Array.from({ length: 20 }, (_, id) => generateCarAuction(id));
});

// Slice
const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("wheela_user");
        },
    },
    extraReducers: (builder) => {
        builder
            // Auto Login
            .addCase(autoLoginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(autoLoginUser.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(autoLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Sign Up
            .addCase(asyncSignUp.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.user = action.payload;
            })

            // Login
            .addCase(asyncLoginUser.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.user = action.payload;
            })

            // Listings
            .addCase(asyncFetchActiveListings.fulfilled, (state, action: PayloadAction<CarItem[]>) => {
                state.listings = action.payload;
            })
            .addCase(asyncFetchArchivedListings.fulfilled, (state, action: PayloadAction<CarItem[]>) => {
                state.archivedListings = action.payload;
            })

            // Wishlist
            .addCase(asyncFetchWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload;
            })

            // Auctions
            .addCase(asyncFetchUserAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.userAuctions = action.payload;
            })
            .addCase(asyncFetchCompletedAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.completedAuctions = action.payload;
            });
    },
});

// Actions & Reducer
export const { logoutUser } = authenticationSlice.actions;
export default authenticationSlice.reducer;
