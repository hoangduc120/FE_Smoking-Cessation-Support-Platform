import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Lấy thông tin đánh giá theo id
export const fetchAssessment = createAsyncThunk(
  "quitSmoking/fetchAssessment",
  async (userId = "1", { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/surveys/me/surveys");
      return response.data;
    } catch (error) {
      console.error("fetchAssessment error:", error);
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
      const response = await fetcher.post("/surveys/", data);
      return response.data;
    } catch (error) {
      console.error("saveAssessment error:", error);
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
  reducers: {
    resetAssessmentData: (state) => {
      state.assessmentData = null;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = null;
    },
  },
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
        console.error("fetchAssessment rejected:", action.payload);
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
      });
  },
});

export const { resetAssessmentData } = quitSmokingSlice.actions;
export default quitSmokingSlice.reducer;
