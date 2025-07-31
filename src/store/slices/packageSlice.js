import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Tạo gói mới
export const createPackage = createAsyncThunk(
  "package/createPackage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/packages", data);
      return response.data.data;
    } catch (error) {
      console.error("createPackage error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Lấy danh sách gói
export const fetchPackages = createAsyncThunk(
  "package/fetchPackages",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.level) queryParams.append("level", filters.level);
      if (filters.isActive) queryParams.append("isActive", filters.isActive);

      const response = await fetcher.get(`/packages?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error("fetchPackages error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định khi lấy danh sách gói."
      );
    }
  }
);

// Cập nhật gói
export const updatePackage = createAsyncThunk(
  "package/updatePackage",
  async ({ id, packageData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/packages/${id}`, packageData);
      return response.data.data;
    } catch (error) {
      console.error("updatePackage error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định khi cập nhật gói."
      );
    }
  }
);

// Xóa gói
export const deletePackage = createAsyncThunk(
  "package/deletePackage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.delete(`/packages/${id}`);
      return { id };
    } catch (error) {
      console.error("deletePackage error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định khi xóa gói."
      );
    }
  }
);

const initialState = {
  packageData: null,
  packagesList: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const packageSlice = createSlice({
  name: "package",
  initialState: initialState,
  reducers: {
    resetPackageData: (state) => {
      state.packageData = null;
      state.packagesList = [];
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPackage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.packageData = action.payload;
        state.packagesList = [...state.packagesList, action.payload];
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchPackages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.packagesList = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updatePackage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.packageData = action.payload;
        state.packagesList = state.packagesList.map((pkg) =>
          pkg._id === action.payload._id ? action.payload : pkg
        );
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deletePackage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.packagesList = state.packagesList.filter(
          (pkg) => pkg._id !== action.payload.id
        );
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetPackageData } = packageSlice.actions;

export default packageSlice.reducer;
