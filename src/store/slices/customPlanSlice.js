import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Tạo yêu cầu kế hoạch cai thuốc lá tùy chỉnh
export const createCustomQuitPlan = createAsyncThunk(
  "customPlan/createCustomQuitPlan",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/plans/quitplans/custom", data);
      return response.data;
    } catch (error) {
      console.error("createCustomQuitPlan error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Lấy danh sách yêu cầu kế hoạch cai thuốc lá tùy chỉnh (pending)
export const fetchCustomQuitPlans = createAsyncThunk(
  "customPlan/fetchCustomQuitPlans",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append("userId", filters.userId);
      if (filters.coachId) queryParams.append("coachId", filters.coachId);
      if (filters.status) queryParams.append("status", filters.status);

      const response = await fetcher.get(
        `/plans/quitplans/custom?${queryParams.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error("fetchCustomQuitPlans error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định khi lấy danh sách kế hoạch."
      );
    }
  }
);

// Lấy danh sách các custom quit plans đã được approve
export const fetchApprovedCustomQuitPlans = createAsyncThunk(
  "customPlan/fetchApprovedCustomQuitPlans",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append("userId", filters.userId);
      if (filters.coachId) queryParams.append("coachId", filters.coachId);

      const response = await fetcher.get(
        `/plans/quitplans/custom/approved?${queryParams.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error("fetchApprovedCustomQuitPlans error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định khi lấy danh sách kế hoạch đã duyệt."
      );
    }
  }
);

// Phê duyệt yêu cầu kế hoạch cai thuốc lá tùy chỉnh
export const approveCustomQuitPlan = createAsyncThunk(
  "customPlan/approveCustomQuitPlan",
  async ({ requestId, quitPlanData, stagesData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `/plans/quitplans/custom/${requestId}/approve`,
        { quitPlanData, stagesData } // gửi lên request body theo đúng yêu cầu BE
      );
      return response.data.data;
    } catch (error) {
      console.error("approveCustomQuitPlan error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định khi phê duyệt kế hoạch."
      );
    }
  }
);

// Từ chối yêu cầu kế hoạch cai thuốc lá tùy chỉnh
export const rejectCustomQuitPlan = createAsyncThunk(
  "customPlan/rejectCustomQuitPlan",
  async ({ requestId, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `/plans/quitplans/custom/${requestId}/reject`,
        { rejectionReason }
      );
      return response.data.data;
    } catch (error) {
      console.error("rejectCustomQuitPlan error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định khi từ chối kế hoạch."
      );
    }
  }
);

const initialState = {
  customPlanData: null,
  customPlansList: [],
  approvedCustomPlans: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const customPlanSlice = createSlice({
  name: "customPlan",
  initialState: initialState,
  reducers: {
    resetCustomPlanData: (state) => {
      state.customPlanData = null;
      state.customPlansList = [];
      state.approvedCustomPlans = [];
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createCustomQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlanData = action.payload;
      })
      .addCase(createCustomQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchCustomQuitPlans.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCustomQuitPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlansList = action.payload;
      })
      .addCase(fetchCustomQuitPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchApprovedCustomQuitPlans.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchApprovedCustomQuitPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.approvedCustomPlans = action.payload;
      })
      .addCase(fetchApprovedCustomQuitPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(approveCustomQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(approveCustomQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlanData = action.payload;
        if (state.customPlansList) {
          state.customPlansList = state.customPlansList.filter(
            (plan) => plan._id !== action.meta.arg
          );
        }
      })
      .addCase(approveCustomQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(rejectCustomQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(rejectCustomQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlanData = action.payload;
        if (state.customPlansList) {
          state.customPlansList = state.customPlansList.filter(
            (plan) => plan._id !== action.meta.arg.requestId
          );
        }
      })
      .addCase(rejectCustomQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetCustomPlanData } = customPlanSlice.actions;

export default customPlanSlice.reducer;
