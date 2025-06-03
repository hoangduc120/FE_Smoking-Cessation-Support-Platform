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

export const stagesSlice = createSlice({
  name: "stages",
  initialState: {
    stages: [],
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createStageApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createStageApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isError = null;
      state.stages = Array.isArray(state.stages)
        ? [...state.stages, payload]
        : [payload];
    });
    builder.addCase(createStageApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = payload;
    });
  },
});

export default stagesSlice.reducer;