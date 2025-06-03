import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const createStageApi = createAsyncThunk(
  "stages/createStageApi",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `/plans/quitplans/${id}/stages`,
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

export const updateStageApi = createAsyncThunk(
  "stages/updateStageApi",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/plans/quitplan-stages/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteStageApi = createAsyncThunk(
  "stages/deleteStageApi",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.delete(`/plans/quitplan-stages/${id}
`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const stagesSlice = createSlice({
  name: "stages",
  initialState: {
    stages: [],
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStageApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStageApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.stages = Array.isArray(state.stages)
          ? [...state.stages, payload]
          : [payload];
      })
      .addCase(createStageApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(updateStageApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStageApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = state.plan.map((plan) =>
          plan._id === payload._id ? payload : plan
        );
      })
      .addCase(updateStageApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(deleteStageApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStageApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.plan = state.plan.filter((plan) => plan._id !== payload);
      })
      .addCase(deleteStageApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      });
  },
});

export default stagesSlice.reducer;
