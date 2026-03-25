import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CarAuction, CarItem,  Profile} from "@/types";
import {loginAsync} from "@/store/thunks/authenticationThunks/login.ts";
import {asyncSignUp} from "@/store/thunks/authenticationThunks/signUp.ts";
import {supabase} from "@/utils";
import {keysToCamelCase} from "@/utils/caseConverter.ts";

// Define State Type
interface AuthenticationState {
    user: Profile | null;
    listings?: CarItem[];
    archivedListings?: CarItem[];
    wishlist?: (CarItem | CarAuction)[];
    auctions?: CarAuction[];
    userAuctions?: CarAuction[];
    completedAuctions?: CarAuction[];
    bids?: CarAuction[];
    onboardingRequired: boolean;
    redirectTo?: string | null;
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
    onboardingRequired: false,
    redirectTo: null,
    loading: false,
    error: null,
};

// const dealerToProfile = (dealer: Dealer): Profile => {
//     const fallbackName = dealer.name?.trim() || dealer.email.split("@")[0] || "dealer";
//     const firstName = dealer.firstName?.trim() || fallbackName.split(" ")[0] || fallbackName;
//     const lastName = dealer.lastName?.trim() || fallbackName.split(" ").slice(1).join(" ");
//     const username = firstName && lastName ? `${firstName} ${lastName}` : fallbackName;
//
//     return {
//         id: dealer.id,
//         email: dealer.email,
//         username,
//         firstName,
//         lastName,
//         phone: dealer.phone,
//         profilePicture: dealer.profile,
//         createdAt: new Date(),
//         verification: {
//             emailVerified: false,
//             phoneVerified: false,
//             kycVerified: false
//         },
//         preferences: {
//             currency: "KES",
//             language: "en",
//             notifications: {
//                 email: false,
//                 sms: false,
//                 push: false
//             }
//         },
//         security: {
//             twoFactorAuth: false,
//             recentLogins: []
//         }
//     };
// };

const parseStoredProfile = (raw: string): Profile => {
    const parsed = JSON.parse(raw) as Profile;
    return {
        ...parsed,
        createdAt: new Date(parsed.createdAt).toISOString()
    };
};

// Async Thunks
export const autoLoginUser = createAsyncThunk<Profile, void, {rejectValue: string}>(
    "authentication/autoLogin",
    async (_, {rejectWithValue}) => {
        try {
            const userData = localStorage.getItem("wheela_user");
            if (!userData) {
                return rejectWithValue("No active session");
            }

            return parseStoredProfile(userData);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to auto-login");
        }
    }
);

// Keep these aliases for existing screen imports.
export const asyncLoginUser = loginAsync;

const normalizeListing = (input: unknown): CarItem =>
    keysToCamelCase<CarItem>(input);
const normalizeAuction = (input: unknown): CarAuction =>
    keysToCamelCase<CarAuction>(input);

// Fetch Listings


// Fetch Wishlist (Saved Listings)
export const asyncFetchWishlist = createAsyncThunk<(CarItem | CarAuction)[]>(
    "authentication/fetchWishlist",
    async () => {
        const {data, error} = await supabase
            .from("vehicles")
            .select("*")
            .eq("published", true)
            .eq("type", "listing")
            .order("created_at", {ascending: false})
            .limit(9);

        if (error || !Array.isArray(data)) {
            return [];
        }

        return data.map((listing) => normalizeListing(listing));
    }
);

export const asyncFetchUserAuctions = createAsyncThunk<CarAuction[]>(
    "authentication/fetchUserAuctions",
    async () => {
        const {data, error} = await supabase
            .from("vehicles")
            .select("*")
            .eq("published", true)
            .eq("type", "auction")
            .order("created_at", {ascending: false})
            .limit(20);

        if (error || !Array.isArray(data)) {
            return [];
        }

        return data.map((auction) => normalizeAuction(auction));
    }
);

export const asyncFetchCompletedAuctions = createAsyncThunk<CarAuction[]>(
    "authentication/fetchCompletedAuctions",
    async () => {
        const {data, error} = await supabase
            .from("vehicles")
            .select("*")
            .eq("published", true)
            .eq("type", "auction")
            .eq("active", "sold")
            .order("created_at", {ascending: false})
            .limit(20);

        if (error || !Array.isArray(data)) {
            return [];
        }

        return data.map((auction) => normalizeAuction(auction));
    }
);

// Slice
const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.redirectTo = null;
            state.onboardingRequired = false;
            localStorage.removeItem("wheela_user");
        },
    },
    extraReducers: (builder) => {
        builder
            // Auto Login
            .addCase(autoLoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
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
            .addCase(asyncSignUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncSignUp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.onboardingRequired = false;
                state.redirectTo = '/login';
                localStorage.setItem("wheela_user", JSON.stringify(action.payload));
            })
            .addCase(asyncSignUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Login
            .addCase(asyncLoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncLoginUser.fulfilled, (state, action) => {

                state.loading = false;
                state.user = action.payload.user;
                state.onboardingRequired = action.payload.onboardingRequired;
                state.redirectTo = action.payload.redirectTo;
                localStorage.setItem("wheela_user", JSON.stringify(action.payload.user));
            })
            .addCase(asyncLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Wishlist
            .addCase(asyncFetchWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload;
            })

            // Auctions
            .addCase(asyncFetchUserAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.auctions = action.payload;
                state.userAuctions = action.payload;
            })
            .addCase(asyncFetchCompletedAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.completedAuctions = action.payload;
            });
    },
});

// Actions & Reducer
export const { logoutUser } = authenticationSlice.actions;
export * from '@/store/thunks/authenticationThunks/signUp'
export * from '@/store/thunks/authenticationThunks/login'
export default authenticationSlice.reducer;
