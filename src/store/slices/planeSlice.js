import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const fetchPlan = createAsyncThunk(
  "plan/fetchPlan",
  async ({ coachId }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/plans/coach/${coachId}`);
   
      return response.data;
    } catch (error) {
      console.log("FetchPlan error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createPlan = createAsyncThunk(
  "plan/createPlan",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/plans", data);
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
      const response = await fetcher.put(`/plans/${id}`, data);
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
      await fetcher.delete(`/plans/${id}`);
      return id; // Trả về id để xóa khỏi state
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
        state.isError = null;
      })
      .addCase(fetchPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.plan = Array.isArray(payload) ? payload : payload.data || [];
    
      })
      .addCase(fetchPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
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
      });
  },
});

export default planSlice.reducer;
