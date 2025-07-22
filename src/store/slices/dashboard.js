import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/admin/revenue/total");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchRevenueMemberShip = createAsyncThunk(
  "dashboard/fetchRevenueMemberShip",
  async(_, {rejectWithValue}) => {
    try {
      const response = await fetcher.get("/admin/revenue/membership-stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

export const fetchPaymentStats = createAsyncThunk(
  "dashboard/fetchPaymentStats",
  async(_,{rejectWithValue}) => {
    try {
      const response = await fetcher.get("/admin/revenue/payment-stats");
     
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

export const fetchRevenueByPeriod = createAsyncThunk(
  "dashboard/fetchRevenueByPeriod",
  async({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/admin/revenue/by-period?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: [],
    revenueMemberShip: [],
    paymentStarts:[],
    revenueByPeriod:[],
    isLoading: false,
    isError: null,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.dashboard = payload;
      })
      .addCase(fetchDashboard.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(fetchRevenueMemberShip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRevenueMemberShip.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.revenueMemberShip = payload;
      })
      .addCase(fetchRevenueMemberShip.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(fetchPaymentStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.paymentStarts = payload
      })
      .addCase(fetchPaymentStats.rejected, (state, {payload}) => {
        state.isError = payload;
        state.isLoading = false;
      })
      .addCase(fetchRevenueByPeriod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRevenueByPeriod.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.revenueByPeriod = payload
      })
      .addCase(fetchRevenueByPeriod.rejected, (state, {payload}) => {
        state.isError = payload;
        state.isLoading = false;
      })
  },
});

export default dashboardSlice.reducer;
