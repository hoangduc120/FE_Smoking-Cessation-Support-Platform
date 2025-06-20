import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";




export const createBadge = createAsyncThunk(
  "badge/createBadge",
  async ({ payload, quitPlanId }, { rejectWithValue }) => {
    try {
      if (!quitPlanId || quitPlanId === "undefined") {
        throw new Error("Invalid quitPlanId");
      }

      const response = await fetcher.post(
        `/plans/quitplans/${quitPlanId}/badges`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Create badge error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const createBadgeForPlan = createAsyncThunk(
  "badge/createBadgeForPlan",
  async({data}, {rejectWithValue}) => {
    try {
      const response = await fetcher.post("/badges/create-for-plan", data)
      return response.data
    } catch (error) {
       return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)


// fetch Plan ID
export const fetchBadgesByPlan = createAsyncThunk(
  "badge/fetchBadgesByPlan",
  async ({ quitPlanId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/plans/quitplans/${quitPlanId}/badges?page=${page}&limit=${limit}`
      );
      return response.data.data || [];
    } catch (error) {
      
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const getAllBadge = createAsyncThunk(
  "badge/getAllBadge",
  async(_, {rejectWithValue}) => {
    try {
      const response = await fetcher.get("/badges/all")
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

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
      .addCase(createBadgeForPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(createBadgeForPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.badges = Array.isArray(payload) ? payload : [payload];
      })
      .addCase(createBadgeForPlan.rejected, (state, { payload }) => {
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
      })
      .addCase(getAllBadge.pending,(state) => {
        state.isLoading = true
      })
      .addCase(getAllBadge.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.badges = payload
      })
      .addCase(getAllBadge.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
        state.badges = [];
      })
  },
});

export default badgeSlice.reducer;
