import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchMembership = createAsyncThunk(
  "membership/fetchMembership",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/packages");
      return response.data.data;
    } catch (error) {
      console.error("fetchMembership error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchMembershipById = createAsyncThunk(
  "membership/fetchMembershipById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/packages/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("fetchMembershipById error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


const membershipSlice = createSlice({
  name: "membership",
  initialState: {
    membershipData: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembership.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.membershipData = action.payload;
      })
      .addCase(fetchMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

  },
});

export default membershipSlice.reducer;
