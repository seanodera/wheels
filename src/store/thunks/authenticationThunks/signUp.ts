import {createAsyncThunk} from "@reduxjs/toolkit";
import {keysToSnakeCase, supabase} from "@/utils";
import {omit} from "lodash";
import {Profile} from "@/types";
import {normalizeError} from "@/store/thunks/authenticationThunks/login.ts";

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
            const {email, password,firstName,lastName} = payload;

            // 1️⃣ Create auth user
            const {data: authData, error: authError} = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                return rejectWithValue(authError.message);
            }

            const user = authData.user;
            if (!user) return rejectWithValue("User not created");

            // 2️⃣ Insert profile (optional but recommended)

            const profile: Profile  = {
                createdAt: new Date().toISOString(),
                firstName: firstName,
                lastName: lastName,
                preferences: {currency: "", language: "", notifications: {email: false, push: false, sms: false}},
                security: {recentLogins: [], twoFactorAuth: false},
                verification: {emailVerified: false, kycVerified: false, phoneVerified: false},
                id: user.id,
                email: email

            }
            const clean = keysToSnakeCase(omit(profile, ['password']));
            const {error: profileError} = await supabase.from("profiles").insert({
                ...clean,
                id: user.id,

            });

            if (profileError) return rejectWithValue(profileError.message);

            return profile

        } catch (error: unknown) {
            return rejectWithValue(normalizeError(error, "Failed to sign up"));
        }
    }
);
