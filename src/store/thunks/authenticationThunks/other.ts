import {createAsyncThunk} from "@reduxjs/toolkit";


export const resetPassword = createAsyncThunk('auth/reset', async () => {})
export const forgotPassword =createAsyncThunk('auth/forgot', async () => {})
export const updatePassword = createAsyncThunk('auth/update', async () => {})
export const updateProfile = createAsyncThunk('auth/updateProfile', async () => {})