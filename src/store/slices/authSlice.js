import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetcher } from "../../apis/fetcher";

const userLocal = JSON.parse(localStorage.getItem("currentUser"));

export const loginApi = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const registerApi = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/register", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const logoutApi = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: userLocal,
    isLoading: false,
    error: null,
  },
  reducers: {
    login: (state, { payload }) => {
      state.currentUser = payload;
      localStorage.setItem("currentUser", JSON.stringify(payload));
      toast.success("Login successful");
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
      toast.success("Logout successful");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.currentUser = payload.data; // Lưu cả user và token
    });
    builder.addCase(registerApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(loginApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.currentUser = payload.data; // Lưu cả user và token
    });
    builder.addCase(loginApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(logoutApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutApi.fulfilled, (state) => {
      state.isLoading = false;
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    });
    builder.addCase(logoutApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
