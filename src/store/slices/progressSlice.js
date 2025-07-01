import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const createQuitProgree = createAsyncThunk(
  "progress/createQuitProgree",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/quitprogress", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// get details stage 
export const fetchProgressRecord = createAsyncThunk(
  "progress/fetchProgressRecord",
  async (stageId , { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/quitprogress/by-stage/${stageId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const progressSlice = createSlice({
  name: "progress",
  initialState: {
    progress: [],
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createQuitProgree.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createQuitProgree.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isError = null;
      state.progress = payload;
    });
    builder.addCase(createQuitProgree.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload?.message || "Failed to select quit plan";
    })
    builder.addCase(fetchProgressRecord.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProgressRecord.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isError = null;
      state.progress = payload;
    });
    builder.addCase(fetchProgressRecord.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload?.message || "Failed to fetch progress record";
    });
  },
});


export default progressSlice.reducer