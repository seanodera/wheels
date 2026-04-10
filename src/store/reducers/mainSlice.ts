import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Address} from "@/types";




export interface MainState {
    theme: "light" | "dark" | "system";
    collapseSidebar: boolean;
    showAddAddressModal: boolean;
    toBeEditedAddress?: Address;
    showAddPaymentModal: boolean;

}

const initialState: MainState = {
    collapseSidebar: false,
    showAddPaymentModal: false,
    showAddAddressModal: false,
    theme: (localStorage.getItem("theme") as "light" | "dark" | "system") ?? "light"

}


const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<"light" | "dark" | "system">) {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },
        setCollapseSidebar(state, action: PayloadAction<boolean>) {
            state.collapseSidebar = action.payload;
        },
        setShowAddAddressModal(state, action: PayloadAction<boolean>) {
            state.showAddAddressModal = action.payload;
            if (!action.payload) state.toBeEditedAddress = undefined;
        },
        setToBeEditedAddress(state, action: PayloadAction<Address>) {
            state.toBeEditedAddress = action.payload;
        },
        setShowAddPaymentModal(state, action: PayloadAction<boolean>) {
            state.showAddPaymentModal = action.payload;
        }
    }
});
export const {setTheme,setShowAddAddressModal,setShowAddPaymentModal,setToBeEditedAddress,setCollapseSidebar} = mainSlice.actions
export default mainSlice;
