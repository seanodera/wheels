import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "@/features/authenticationSlice"; // Adjust path based on your folder structure

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer, // Add authentication reducer here
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
