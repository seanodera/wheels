import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "@/store/reducers/authenticationSlice.ts";
import wheelsReducer from "@/store/reducers/wheelsSlice.ts";
import listingReducer from "@/store/reducers/listingSlice.ts";
import mainSlice from "@/store/reducers/mainSlice.ts";
import dealerSlice from "@/store/reducers/dealerslice.ts"; // Adjust path based on your folder structure
import auctionReducer from "@/store/reducers/auctionSlice.ts";




export const store = configureStore({
    reducer: {
        authentication: authenticationReducer, // Add authentication reducer here
        wheels: wheelsReducer,
        listing: listingReducer,
        main: mainSlice.reducer,
        dealer: dealerSlice.reducer,
        auction: auctionReducer,

    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
