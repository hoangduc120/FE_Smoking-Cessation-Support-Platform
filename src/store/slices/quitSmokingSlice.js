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

// Cập nhật thông tin đánh giá
export const updateAssment = createAsyncThunk(
  "quitSmoking/updateAssessment",
  async ({ surveyId, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/surveys/${surveyId}`, data);
      return response.data;
    } catch (error) {
      console.error("updateAssment error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định khi cập nhật kế hoạch."
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
      })
      .addCase(updateAssment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAssment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.assessmentData = action.payload;
      })
      .addCase(updateAssment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetAssessmentData } = quitSmokingSlice.actions;
export default quitSmokingSlice.reducer;
