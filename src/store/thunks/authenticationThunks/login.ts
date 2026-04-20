import {createAsyncThunk} from "@reduxjs/toolkit";
import type { Profile} from "@/types";
import {supabase} from "@/utils/supabase.ts";
import {fetchProfileByUserId} from "@/utils/profileQueries.ts";
import {normalizeError, saveAuthentication} from "@/utils";

export interface AuthSuccessPayload {
    user: Profile;
    redirectTo: string;
    onboardingRequired: boolean;
}

type LoginCredentials = {
    email: string;
    password: string;
    remember?: boolean;
};

export const asyncLoginUser = createAsyncThunk<AuthSuccessPayload, LoginCredentials, {rejectValue: string}>(
    "authentication/login",
    async (credentials, {rejectWithValue}) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (error) {
                return rejectWithValue(error.message);
            }

            const authUser = data.user;
            if (!authUser) {
                return rejectWithValue("Unable to find authenticated user");
            }

            const profile = await fetchProfileByUserId(authUser.id);
            const onboardingRequired = false;

            if (!profile) {
                return {
                    user: {} as Profile,
                    onboardingRequired: true,
                    redirectTo: '/sign-up/complete'
                }
            }

            if (credentials.remember){
                saveAuthentication(data.session.access_token,data.session.refresh_token, data.session.expires_at)
            }
            console.log(authUser)
            return {
                user: {
                    ...profile,
                    verification: {
                        emailVerified: authUser.user_metadata.email_verified,
                        phoneVerified: authUser.user_metadata.phone_verified,
                        kycVerified: profile.verification.kycVerified
                    }
                },
                onboardingRequired,
                redirectTo: onboardingRequired ? "/settings" : "/"
            };
        } catch (error: unknown) {
            return rejectWithValue(normalizeError(error, "Failed to login"));
        }
    }
);
