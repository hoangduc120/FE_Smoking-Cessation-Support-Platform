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
  async ({ quitPlanId}, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/plans/quitplans/${quitPlanId}/badge`
      );
      console.log(response.data)
      return response.data.data;
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

export const getMyBadge = createAsyncThunk(
  "badge/getMyBadge",
  async(_, {rejectWithValue}) => {
    try {
      const response = await fetcher.get("/badges/my")
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
        state.badges = Array.isArray(payload) ? payload : payload ? [payload] : [];
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
      .addCase(getMyBadge.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getMyBadge.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.badges = payload.data; 
      })
      .addCase(getMyBadge.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.isError = payload;
      })
  },
});

export default badgeSlice.reducer;
