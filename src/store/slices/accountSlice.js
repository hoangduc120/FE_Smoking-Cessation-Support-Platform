import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const getAllAccount = createAsyncThunk(
    "account/getAllAccount",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/users/all")
            return response.data.data.user || response.data.user || response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const getDashBoardStart = createAsyncThunk(
    "account/getDashBoardStart", 
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/admin/dashboard/stats")
            return response.data
        } catch (error) {
             return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

const accountSlice = createSlice({
    name:"account",
    initialState:{
        account:[],
        dashboardStarts:[],
        isLoading: false,
        isError: null,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getAllAccount.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        })
        .addCase(getAllAccount.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isError = null;
            state.account = payload;
        })
        .addCase(getAllAccount.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.isError = payload;
        })
        .addCase(getDashBoardStart.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getDashBoardStart.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isError = null;
            state.dashboardStarts = payload
        })
        .addCase(getDashBoardStart.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.isError = payload;
        })
    }
})

export default accountSlice.reducer