import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchUserMembership = createAsyncThunk(
  "userMembership/fetchUserMembership",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/memberships/status/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("fetchUserMembership error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const userMembershipSlice = createSlice({
  name: "userMembership",
  initialState: {
    userMembershipData: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMembership.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.userMembershipData = action.payload;
      })
      .addCase(fetchUserMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default userMembershipSlice.reducer;
