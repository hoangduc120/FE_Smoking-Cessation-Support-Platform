import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchPlan = createAsyncThunk(
  "plan/fetchPlan",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/plans/quitplans?page=${page}&limit=${limit}`
      );
      console.log("API /plans/quitplans response:", response.data);

      return response.data;
    } catch (error) {
      console.log("FetchPlan error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchAllPlan = createAsyncThunk(
  "plan/fetchAllPlan",
  async ({ page, limit, coachId }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/plans/quitplans?coachId=${coachId}&page=${page}&limit=${limit}`
      );
      console.log("lnas", response.data);
      return response.data;
    } catch (error) {
      console.error("FetchPlan error:", error);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const createPlan = createAsyncThunk(
  "plan/createPlan",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("plans/quitplans", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updatePlan = createAsyncThunk(
  "plan/updatePlan",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/plans/quitplans/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deletePlan = createAsyncThunk(
  "plan/deletePlan",
  async ({ id }, { rejectWithValue }) => {
    try {
      await fetcher.delete(`/plans/quitplans/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const planSlice = createSlice({
  name: "plan",
  initialState: {
    plan: [],
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = {
          data: action.payload.data || [], 
          total: action.payload.total || action.payload.data?.length || 0,
          totalPages:
            action.payload.totalPages ||
            Math.ceil((action.payload.data?.length || 0) / 100),
        };
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Failed to fetch plans";
      })
      .addCase(createPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = Array.isArray(state.plan)
          ? [...state.plan, payload]
          : [payload];
      })
      .addCase(createPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(updatePlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = state.plan.map((plan) =>
          plan._id === payload._id ? payload : plan
        );
      })
      .addCase(updatePlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(deletePlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = state.plan.filter((plan) => plan._id !== payload);
      })
      .addCase(deletePlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(fetchAllPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.errorMessage = "";
      })
      .addCase(fetchAllPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.plans = payload;
      })
      .addCase(fetchAllPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload.message || "Có lỗi xảy ra khi lấy dữ liệu";
      });
  },
});

export default planSlice.reducer;
