import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CarAuction, CarItem, Profile} from "@/types";
import {asyncLoginUser} from "@/store/thunks/authenticationThunks/login.ts";
import {asyncSignUp} from "@/store/thunks/authenticationThunks/signUp.ts";
import {supabase} from "@/utils/supabase.ts";
import {
    fetchBiddingAuctionsByUserId,
    fetchProfileByUserId,
    fetchSavedVehiclesByUserId,
    fetchWatchedAuctionsByUserId
} from "@/utils/profileQueries.ts";
import {clearAuthentication, getAuthentication} from "@/utils";

interface MarketplaceState {
    savedVehicles?: (CarItem | CarAuction)[];
    watchedAuctions?: CarAuction[];
    biddingAuctions?: CarAuction[];
    completedAuctions?: CarAuction[];
}

interface AuthenticationState {
    user: Profile | null;
    listings?: CarItem[];
    archivedListings?: CarItem[];
    marketplace: MarketplaceState;
    onboardingRequired: boolean;
    redirectTo?: string | null;
    loading: boolean;
    error?: string | null;
}

const emptyMarketplaceState = (): MarketplaceState => ({
    savedVehicles: undefined,
    watchedAuctions: undefined,
    biddingAuctions: undefined,
    completedAuctions: undefined,
});

const initialState: AuthenticationState = {
    user: null,
    listings: undefined,
    archivedListings: undefined,
    marketplace: emptyMarketplaceState(),
    onboardingRequired: false,
    redirectTo: null,
    loading: false,
    error: null,
};

const getCurrentUserId = async () => {
    const response = await supabase.auth.getUser();
    if (response.error) {
        throw response.error;
    }
    return response.data.user?.id ?? null;
};

export const autoLoginUser = createAsyncThunk<Profile, {access_token: string | undefined, refresh_token: string | undefined} | undefined, {rejectValue: string}>(
    "authentication/autoLogin",
    async (data, {rejectWithValue}) => {
        try {
            const session = data ?? getAuthentication()
            if (!session.refresh_token || !session.access_token) {

                return rejectWithValue('no data saved');
            }
            const sessionResponse = await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token
            });
            if (sessionResponse.error) {
                return rejectWithValue(sessionResponse.error.message);
            }


            const userId = sessionResponse.data.session?.user?.id;
            if (!userId) {
                return rejectWithValue("No active session");
            }

            const profile = await fetchProfileByUserId(userId);
            if (!profile) {
                return rejectWithValue("Profile not found");
            }

            return {
                ...profile,
                verification: {
                    emailVerified: sessionResponse.data.user?.user_metadata.email_verified ?? false,
                    phoneVerified: sessionResponse.data.user?.user_metadata.phone_verified ?? false,
                    kycVerified: profile.verification.kycVerified
                }
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to auto-login");
        }
    }
);



export const asyncFetchSavedVehicles = createAsyncThunk<(CarItem | CarAuction)[], void, {rejectValue: string}>(
    "authentication/fetchSavedVehicles",
    async (_, {rejectWithValue}) => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                return [];
            }
            return await fetchSavedVehiclesByUserId(userId);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch saved vehicles");
        }
    }
);

export const asyncFetchWatchedAuctions = createAsyncThunk<CarAuction[], void, {rejectValue: string}>(
    "authentication/fetchWatchedAuctions",
    async (_, {rejectWithValue}) => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                return [];
            }
            return await fetchWatchedAuctionsByUserId(userId);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch watched auctions");
        }
    }
);

export const asyncFetchBiddingAuctions = createAsyncThunk<CarAuction[], void, {rejectValue: string}>(
    "authentication/fetchBiddingAuctions",
    async (_, {rejectWithValue}) => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                return [];
            }
            return await fetchBiddingAuctionsByUserId(userId);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch bidding auctions");
        }
    }
);

export const asyncFetchCompletedAuctions = createAsyncThunk<CarAuction[], void, {rejectValue: string}>(
    "authentication/fetchCompletedAuctions",
    async (_, {rejectWithValue}) => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                return [];
            }
            return await fetchBiddingAuctionsByUserId(userId, {completedOnly: true});
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch completed auctions");
        }
    }
);

export const asyncLogoutUser = createAsyncThunk<void, void, {rejectValue: string}>(
    "authentication/logout",
    async (_, {rejectWithValue}) => {
        const response = await supabase.auth.signOut();
        if (response.error) {
            return rejectWithValue(response.error.message);
        }

        clearAuthentication();
    }
);

const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.redirectTo = null;
            state.onboardingRequired = false;
            state.marketplace = emptyMarketplaceState();
        },
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(asyncSignUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncSignUp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.onboardingRequired = false;
                state.redirectTo = "/login";
            })
            .addCase(asyncSignUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(asyncLoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncLoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.onboardingRequired = action.payload.onboardingRequired;
                state.redirectTo = action.payload.redirectTo;
            })
            .addCase(asyncLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(asyncLogoutUser.fulfilled, (state) => {
                state.user = null;
                state.redirectTo = null;
                state.onboardingRequired = false;
                state.marketplace = emptyMarketplaceState();
            })
            .addCase(asyncFetchSavedVehicles.fulfilled, (state, action) => {
                state.marketplace.savedVehicles = action.payload;
            })
            .addCase(asyncFetchWatchedAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.marketplace.watchedAuctions = action.payload;
            })
            .addCase(asyncFetchBiddingAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.marketplace.biddingAuctions = action.payload;
            })
            .addCase(asyncFetchCompletedAuctions.fulfilled, (state, action: PayloadAction<CarAuction[]>) => {
                state.marketplace.completedAuctions = action.payload;
            });
    },
});

export const {logoutUser} = authenticationSlice.actions;
export * from "@/store/thunks/authenticationThunks/signUp";
export * from "@/store/thunks/authenticationThunks/login";
export default authenticationSlice.reducer;
