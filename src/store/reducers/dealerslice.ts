import {createSlice} from "@reduxjs/toolkit";
import {Dealer} from "@/types";


export interface DealerState {
    dealers: Dealer[],
    currentDealer?: Dealer,
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
