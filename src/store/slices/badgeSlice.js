import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const createBadge = createAsyncThunk(
  "badge/createBadge",
  async ({ payload, quitPlanId }, { rejectWithValue }) => {
    try {
      if (!quitPlanId || quitPlanId === "undefined") {
        throw new Error("Invalid quitPlanId");
      }

      console.log("Request URL:", `/plans/quitplans/${quitPlanId}/badges`);
      console.log("Request payload:", payload);

      const response = await fetcher.post(
        `/plans/quitplans/${quitPlanId}/badges`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Create badge response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create badge error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchBadgesByPlan = createAsyncThunk(
  "badge/fetchBadgesByPlan",
  async ({ quitPlanId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/plans/quitplans/${quitPlanId}/badges?page=${page}&limit=${limit}`
      );
      console.log("Fetch badges response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Fetch badges error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const badgeSlice = createSlice({
  name: "badge",
  initialState: {
    badges: [],
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBadge.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(createBadge.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.badges = Array.isArray(payload) ? payload : [payload];
      })
      .addCase(createBadge.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
        state.badges = [];
      })
      .addCase(fetchBadgesByPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchBadgesByPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.badges = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchBadgesByPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
        state.badges = [];
      });
  },
});

export default badgeSlice.reducer;
