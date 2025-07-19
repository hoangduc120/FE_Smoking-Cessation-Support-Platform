import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchAccountById = createAsyncThunk(
  "admin/fetchAccountById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/accounts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateAccountStatus = createAsyncThunk(
  "admin/updateAccountStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/admin/accounts/${id}/status`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateAccountRole = createAsyncThunk(
  "admin/updateAccountRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/admin/accounts/${id}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    account: null,
    isLoading: false,
    isError: null,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountById.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.errorMessage = "";
      })
      .addCase(fetchAccountById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.account = payload.data?.account || null;
      })
      .addCase(fetchAccountById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || "Failed to fetch account";
      })
      .addCase(updateAccountStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.errorMessage = "";
      })
      .addCase(updateAccountStatus.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.account = payload.data?.account || state.account;
      })
      .addCase(updateAccountStatus.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          payload?.message || "Failed to update account status";
      })
      .addCase(updateAccountRole.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.errorMessage = "";
      })
      .addCase(updateAccountRole.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.account = payload.data?.account || state.account;
      })
      .addCase(updateAccountRole.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          payload?.message || "Failed to update account role";
      });
  },
});

export default adminSlice.reducer;
