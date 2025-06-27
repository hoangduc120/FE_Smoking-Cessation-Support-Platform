import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchPlan = createAsyncThunk(
  "plan/fetchPlan",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/plans/quitplans?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  "plan/fetchPlanById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/plans/quitplans/${id}`);
      return response.data;
    } catch (error) {
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

export const selectPlan = createAsyncThunk(
  "plan/selectPlan",
  async ({ quitPlanId }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/plans/quitplans/select", {
        quitPlanId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchPlanCurrent = createAsyncThunk(
  "plan/fetchPlanCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/plans/quitplans/current");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const completeQuitPlan = createAsyncThunk(
  "plan/completeQuitPlan",
  async ({planId}, {rejectWithValue}) => {
    try {
      const response = await fetcher.put(`/plans/quitplans/${planId}/complete`)
      return response.data
    } catch (error) {
        return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

export const failQuitPlan = createAsyncThunk(
  "plan/failQuitPlan",
  async ({ planId }, { rejectWithValue }) => {
   try {
    const response = await fetcher.put(`/plans/quitplans/${planId}/fail`)
    return response.data
   } catch (error) {
    return rejectWithValue(
      error.response ? error.response.data : error.message
    );
   }
  }
)

export const infoCompleteQuitPlan = createAsyncThunk(
  "plan/infoCompleteQuitPlan",
  async({planId}, {rejectWithValue}) => {
    try {
      const response = await fetcher.get(`/plans/quitplans/${planId}/completion`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)


export const histotyPlan = createAsyncThunk(
  "plan/histotyPlan",
  async(_, {rejectWithValue}) => {
    try {
      const response = await fetcher.get("/plans/quitplans/history")
      return response.data.data
    } catch (error) {
       return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

export const cancelPlan = createAsyncThunk(
  "plan/cancelPlan",
  async ({ reason }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/plans/quitplans/cancel", 
        reason ? { reason } : {} // Nếu không có reason, gửi object rỗng
      );
      return response.data;
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
    plan: null,
    stages: [], 
    progress: [], 
    isLoading: false,
    isError: null,
    errorMessage: "",
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
      .addCase(deletePlan.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = null;
      
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
      })
      .addCase(fetchPlanById.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.errorMessage = "";
      })
      .addCase(fetchPlanById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.plan = Array.isArray(payload) ? payload : payload.data || null;
      })
      .addCase(fetchPlanById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(selectPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(selectPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        console.log("selectPlan payload:", payload); // Debug payload
        state.plan = payload?.quitPlan ? { quitPlan: payload.quitPlan } : payload?.plan ? payload : null;
        state.stages = payload?.stages || state.stages;
        state.progress = payload?.progress || state.progress;
      })
      .addCase(selectPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || "Failed to select quit plan";
      })
      .addCase(fetchPlanCurrent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlanCurrent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plan = action.payload?.plan || null;
        state.stages = action.payload?.stages || [];
        state.progress = action.payload?.progress || [];
      })
      .addCase(fetchPlanCurrent.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || "Failed to fetch current plan";
      })
      .addCase(completeQuitPlan.pending, (state) => {
        state.isLoading = true
      })
      .addCase(completeQuitPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = payload;
      })
      .addCase(completeQuitPlan.rejected, (state, { payload }) => { 
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || "Failed to complete quit plan";
      })
      .addCase(failQuitPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(failQuitPlan.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = payload;
      })
      .addCase(failQuitPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || "Failed to fail quit plan";
      })
      .addCase(infoCompleteQuitPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(infoCompleteQuitPlan.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = payload.data
      })
      .addCase(infoCompleteQuitPlan.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || "Failed to fail quit plan";
      })
      .addCase(histotyPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(histotyPlan.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = payload;
      })
      .addCase(histotyPlan.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = payload.data
      })
      .addCase(cancelPlan.pending, (state) => {
        state.isLoading = true
      })
      .addCase(cancelPlan.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = null;
      })
      .addCase(cancelPlan.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = payload.data
      })
  },
});

export default planSlice.reducer;