// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import fetcher from "../../apis/fetcher";

// // Tạo yêu cầu kế hoạch cai thuốc lá tùy chỉnh
// export const createCustomQuitPlan = createAsyncThunk(
//   "customPlan/createCustomQuitPlan",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await fetcher.post("/plans/quitplans/custom", data);
//       return response.data;
//     } catch (error) {
//       console.error("createCustomQuitPlan error:", error);
//       return rejectWithValue(
//         error.response ? error.response.data : error.message
//       );
//     }
//   }
// );

// // Lấy danh sách yêu cầu kế hoạch cai thuốc lá tùy chỉnh (pending)
// export const fetchCustomQuitPlans = createAsyncThunk(
//   "customPlan/fetchCustomQuitPlans",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetcher.get("/plans/quitplans/custom");
//       return response.data.data;
//     } catch (error) {
//       console.error("fetchCustomQuitPlans error:", error);
//       return rejectWithValue(
//         error.response ? error.response.data : error.message
//       );
//     }
//   }
// );

// // Phê duyệt yêu cầu kế hoạch cai thuốc lá tùy chỉnh
// export const approveCustomQuitPlan = createAsyncThunk(
//   "customPlan/approveCustomQuitPlan",
//   async (requestId, { rejectWithValue }) => {
//     try {
//       const response = await fetcher.post(
//         `/plans/quitplans/custom/${requestId}/approve`
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("approveCustomQuitPlan error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//           error.message ||
//           "Lỗi không xác định khi phê duyệt kế hoạch."
//       );
//     }
//   }
// );

// // Từ chối yêu cầu kế hoạch cai thuốc lá tùy chỉnh
// export const rejectCustomQuitPlan = createAsyncThunk(
//   "customPlan/rejectCustomQuitPlan",
//   async (requestId, { rejectWithValue }) => {
//     try {
//       const response = await fetcher.post(
//         `/plans/quitplans/custom/${requestId}/reject`
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("rejectCustomQuitPlan error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//           error.message ||
//           "Lỗi không xác định khi từ chối kế hoạch."
//       );
//     }
//   }
// );

// export const customPlanSlice = createSlice({
//   name: "customPlan",
//   initialState: {
//     customPlanData: null,
//     customPlansList: null,
//     isLoading: false,
//     isError: false,
//     errorMessage: null,
//   },
//   reducers: {
//     resetCustomPlanData: (state) => {
//       state.customPlanData = null;
//       state.customPlansList = null;
//       state.isLoading = false;
//       state.isError = false;
//       state.errorMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createCustomQuitPlan.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//       })
//       .addCase(createCustomQuitPlan.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isError = false;
//         state.customPlanData = action.payload;
//       })
//       .addCase(createCustomQuitPlan.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.errorMessage = action.payload;
//       })
//       .addCase(fetchCustomQuitPlans.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//       })
//       .addCase(fetchCustomQuitPlans.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isError = false;
//         state.customPlansList = action.payload;
//       })
//       .addCase(fetchCustomQuitPlans.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.errorMessage = action.payload;
//       })
//       .addCase(approveCustomQuitPlan.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//       })
//       .addCase(approveCustomQuitPlan.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isError = false;
//         state.customPlanData = action.payload;
//         // Xóa khỏi danh sách pending (nếu cần)
//         if (state.customPlansList) {
//           state.customPlansList = state.customPlansList.filter(
//             (plan) => plan._id !== action.meta.arg
//           );
//         }
//       })
//       .addCase(approveCustomQuitPlan.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.errorMessage = action.payload;
//       })
//       .addCase(rejectCustomQuitPlan.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//       })
//       .addCase(rejectCustomQuitPlan.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isError = false;
//         state.customPlanData = action.payload;

//         // Xóa khỏi danh sách pending
//         if (state.customPlansList) {
//           state.customPlansList = state.customPlansList.filter(
//             (plan) => plan._id !== action.meta.arg
//           );
//         }
//       })
//       .addCase(rejectCustomQuitPlan.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.errorMessage = action.payload;
//       });
//   },
// });

// export const { resetCustomPlanData } = customPlanSlice.actions;
// export default customPlanSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Tạo yêu cầu kế hoạch cai thuốc lá tùy chỉnh
export const createCustomQuitPlan = createAsyncThunk(
  "customPlan/createCustomQuitPlan",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/plans/quitplans/custom", data);
      return response.data;
    } catch (error) {
      console.error("createCustomQuitPlan error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Lấy danh sách yêu cầu kế hoạch cai thuốc lá tùy chỉnh (pending)
export const fetchCustomQuitPlans = createAsyncThunk(
  "customPlan/fetchCustomQuitPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/plans/quitplans/custom");
      return response.data.data;
    } catch (error) {
      console.error("fetchCustomQuitPlans error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Phê duyệt yêu cầu kế hoạch cai thuốc lá tùy chỉnh
export const approveCustomQuitPlan = createAsyncThunk(
  "customPlan/approveCustomQuitPlan",
  async ({ requestId, quitPlanData, stagesData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `/plans/quitplans/custom/${requestId}/approve`,
        { quitPlanData, stagesData } // gửi lên request body theo đúng yêu cầu BE
      );
      return response.data.data;
    } catch (error) {
      console.error("approveCustomQuitPlan error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định khi phê duyệt kế hoạch."
      );
    }
  }
);

// Từ chối yêu cầu kế hoạch cai thuốc lá tùy chỉnh
export const rejectCustomQuitPlan = createAsyncThunk(
  "customPlan/rejectCustomQuitPlan",
  async ({ requestId, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `/plans/quitplans/custom/${requestId}/reject`,
        { rejectionReason }
      );
      return response.data.data;
    } catch (error) {
      console.error("rejectCustomQuitPlan error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định khi từ chối kế hoạch."
      );
    }
  }
);

export const customPlanSlice = createSlice({
  name: "customPlan",
  initialState: {
    customPlanData: null,
    customPlansList: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {
    resetCustomPlanData: (state) => {
      state.customPlanData = null;
      state.customPlansList = null;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createCustomQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlanData = action.payload;
      })
      .addCase(createCustomQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchCustomQuitPlans.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCustomQuitPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlansList = action.payload;
      })
      .addCase(fetchCustomQuitPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(approveCustomQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(approveCustomQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlanData = action.payload;
        if (state.customPlansList) {
          state.customPlansList = state.customPlansList.filter(
            (plan) => plan._id !== action.meta.arg
          );
        }
      })
      .addCase(approveCustomQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(rejectCustomQuitPlan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(rejectCustomQuitPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customPlanData = action.payload;
        if (state.customPlansList) {
          state.customPlansList = state.customPlansList.filter(
            (plan) => plan._id !== action.meta.arg.requestId
          );
        }
      })
      .addCase(rejectCustomQuitPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetCustomPlanData } = customPlanSlice.actions;
export default customPlanSlice.reducer;
