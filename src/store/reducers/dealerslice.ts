import {createSlice} from "@reduxjs/toolkit";
import type {Dealership} from "@/types";


export interface DealerState {
    dealers: Dealership[],
    currentDealer?: Dealership,
    loading: boolean,
    hasError: boolean,
    errorMessage?: string
}

const initialState:DealerState = {
    dealers: [], hasError: false, loading: false

}

const dealerSlice = createSlice({
    name: 'dealer',
    initialState,
    reducers: {}
})

export default dealerSlice
