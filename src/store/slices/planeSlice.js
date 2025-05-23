import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPlan = createAsyncThunk(
  "plane/fetchPlan",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://67dabbe235c87309f52dc7a7.mockapi.io/coachPlan`
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  "plane/fetchPlanById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://67dabbe235c87309f52dc7a7.mockapi.io/coachPlan/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const planeSlice = createSlice({
  name: "plane",
  initialState: {
    plans: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
    })
    .addCase(fetchPlan.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      state.isError = false;
      state.plans = payload;
    })
    .addCase(fetchPlan.rejected, (state, {payload}) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload;
    });
    builder.addCase(fetchPlanById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
    })
    .addCase(fetchPlanById.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      state.isError = false;
      state.plans = payload;
    })
    .addCase(fetchPlanById.rejected, (state, {payload}) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload;
    });
  },
});

export default planeSlice.reducer;