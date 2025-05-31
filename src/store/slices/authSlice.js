import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import fetcher from "../../apis/fetcher";

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

// forgot password
export const forgotPasswordApi = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/auth/forgot-password?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// reset password
export const resetPasswordApi = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/auth/reset-password`, { token, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Google Login Callback Handler
export const googleLoginCallback = createAsyncThunk(
  "auth/googleLoginCallback",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/users/profile/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = response.data.data.user;

      // Lưu thông tin vào localStorage
      localStorage.setItem("currentUser", JSON.stringify({
        user: userData,
        token: accessToken
      }));
      localStorage.setItem("token", accessToken);

      return {
        user: userData,
        token: accessToken
      };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
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
      state.currentUser = payload.data;
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
      state.currentUser = payload.data;
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
    builder.addCase(forgotPasswordApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPasswordApi.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(forgotPasswordApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(resetPasswordApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPasswordApi.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(resetPasswordApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });

    // Google Login Callback handlers
    builder.addCase(googleLoginCallback.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(googleLoginCallback.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = payload;
    });
    builder.addCase(googleLoginCallback.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;