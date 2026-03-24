import {createAsyncThunk} from "@reduxjs/toolkit";
import type { Profile} from "@/types";
import {keysToCamelCase} from "@/utils/caseConverter";
import {supabase} from "@/utils/supabase.ts";

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



export function normalizeError(error: unknown, fallback: string) {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error) {
        return String((error as {message?: unknown}).message ?? fallback);
    }
    return fallback;
}

export const loginAsync = createAsyncThunk<AuthSuccessPayload, LoginCredentials, {rejectValue: string}>(
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

            const userResponse = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authUser.id)
                .maybeSingle();

            if (userResponse.error) {
                return rejectWithValue(userResponse.error.message);
            }

            const dealerRecord = userResponse.data;
            const onboardingRequired = false;

            if (!dealerRecord) {


                return {
                    user: {} as Profile,
                    onboardingRequired,
                    redirectTo: '/sign-up/complete'
                }
            }

            return {
                user: keysToCamelCase<Profile>(dealerRecord),
                onboardingRequired,
                redirectTo: onboardingRequired ? "/settings" : "/"
            };
        } catch (error: unknown) {
            return rejectWithValue(normalizeError(error, "Failed to login"));
        }
    }
);
