import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Fetch user profile
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/users/profile/me");
      console.log(
        "User profile fetched successfully:",
        response.data.data.user
      );
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Update user info
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/users/profile", data);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Update avatar image
export const changeImageApi = createAsyncThunk(
  "user/updateImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/users/upload-avatar", formData);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.user = payload;
      })
      .addCase(fetchUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.user = payload;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload;
      })
      .addCase(changeImageApi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(changeImageApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.user = payload;
      })
      .addCase(changeImageApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload;
      });
  },
});

export default userSlice.reducer;
