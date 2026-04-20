import {createAsyncThunk} from "@reduxjs/toolkit";
import {keysToSnakeCase} from "@/utils/caseConverter.ts";
import {supabase} from "@/utils/supabase.ts";
import {omit} from "lodash";
import {Profile} from "@/types";
import {normalizeError} from "@/utils";


interface SignUpPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const asyncSignUp = createAsyncThunk(
    "auth/signUp",
    async (payload: SignUpPayload, {rejectWithValue}) => {
        try {
            const {email, password, firstName, lastName} = payload;

            const {data: authData, error: authError} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    }
                }
            });

            if (authError) {
                return rejectWithValue(authError.message);
            }

            const user = authData.user;
            if (!user) {
                return rejectWithValue("User not created");
            }

            const profile: Profile = {
                createdAt: new Date().toISOString(),
                firstName,
                lastName,
                preferences: {
                    currency: "KES",
                    language: "en",
                    notifications: {email: false, push: false, sms: false}
                },
                security: {recentLogins: [], twoFactorAuth: false},
                verification: {
                    emailVerified: Boolean(user.email_confirmed_at),
                    kycVerified: false,
                    phoneVerified: false
                },
                id: user.id,
                email
            };

            const clean = keysToSnakeCase(omit(profile, ["password"]));
            const {error: profileError} = await supabase.from("profiles").upsert({
                ...clean,
                id: user.id,
            });

            if (profileError && authData.session) {
                return rejectWithValue(profileError.message);
            }

            return profile;
        } catch (error: unknown) {
            return rejectWithValue(normalizeError(error, "Failed to sign up"));
        }
    }
);
