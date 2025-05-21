import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Lấy thông tin đánh giá theo id
export const fetchAssessment = createAsyncThunk(
  "quitSmoking/fetchAssessment",
  async (userId = "1", { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://67dabbe235c87309f52dc7a7.mockapi.io/assessment/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Lưu thông tin đánh giá
export const saveAssessment = createAsyncThunk(
  "quitSmoking/saveAssessment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://67dabbe235c87309f52dc7a7.mockapi.io/assessment",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Lưu thông tin kế hoạch
export const saveQuitPlan = createAsyncThunk(
  "quitSmoking/saveQuitPlan",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://67dabbe235c87309f52dc7a7.mockapi.io/plan",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const quitSmokingSlice = createSlice({
  name: "quitSmoking",
  initialState: {
    assessmentData: null,
    quitPlanData: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.assessmentData = action.payload;
      })
      .addCase(fetchAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(saveAssessment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(saveAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.assessmentData = action.payload;
      })
      .addCase(saveAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(saveQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(saveQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.quitPlanData = action.payload;
      })
      .addCase(saveQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default quitSmokingSlice.reducer;