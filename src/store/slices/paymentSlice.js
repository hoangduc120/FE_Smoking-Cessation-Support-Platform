import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PaymentService from "../../services/paymentService";

// Thunk để tạo payment URL
export const createPaymentUrl = createAsyncThunk(
    "payment/createPaymentUrl",
    async ({ memberShipPlanId, paymentMethod, amount }, { rejectWithValue }) => {
        try {
            const response = await PaymentService.createPaymentUrl(memberShipPlanId, paymentMethod, amount);
            return response;
        } catch (error) {
            console.error("Create payment URL error:", error);
            return rejectWithValue(
                error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo thanh toán"
            );
        }
    }
);

// Thunk để verify VNPay callback
export const verifyVnpayCallback = createAsyncThunk(
    "payment/verifyVnpayCallback",
    async (vnpayParams, { rejectWithValue }) => {
        try {
            const response = await PaymentService.verifyVnpayCallback(vnpayParams);
            return response;
        } catch (error) {
            console.error("Verify VNPay callback error:", error);
            return rejectWithValue(
                error.response?.data?.message || error.message || "Có lỗi xảy ra khi xác thực thanh toán"
            );
        }
    }
);

// Thunk để lấy trạng thái thanh toán bằng orderCode
export const getPaymentStatusByOrderCode = createAsyncThunk(
    "payment/getPaymentStatusByOrderCode",
    async (orderCode, { rejectWithValue }) => {
        try {
            const response = await PaymentService.getPaymentStatusByOrderCode(orderCode);
            return response.data;
        } catch (error) {
            console.error("Get payment status by orderCode error:", error);
            return rejectWithValue(
                error.response?.data?.message || error.message || "Có lỗi xảy ra khi lấy trạng thái thanh toán"
            );
        }
    }
);

// Thunk để lấy lịch sử thanh toán
export const getPaymentHistory = createAsyncThunk(
    "payment/getPaymentHistory",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await PaymentService.getPaymentHistory(page, limit);
            return response.data;
        } catch (error) {
            console.error("Get payment history error:", error);
            return rejectWithValue(
                error.response?.data?.message || error.message || "Có lỗi xảy ra khi lấy lịch sử thanh toán"
            );
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        paymentUrl: null,
        orderId: null,
        orderCode: null,
        paymentStatus: null,
        paymentHistory: null,
        isLoading: false,
        isError: false,
        errorMessage: null,
        currentPayment: null,
    },
    reducers: {
        clearPaymentState: (state) => {
            state.paymentUrl = null;
            state.orderId = null;
            state.orderCode = null;
            state.paymentStatus = null;
            state.isError = false;
            state.errorMessage = null;
            state.currentPayment = null;
        },
        setCurrentPayment: (state, action) => {
            state.currentPayment = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Payment URL
            .addCase(createPaymentUrl.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(createPaymentUrl.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.paymentUrl = action.payload.paymentUrl;
                state.orderId = action.payload.orderId;
                state.orderCode = action.payload.orderCode;
            })
            .addCase(createPaymentUrl.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Get Payment Status By OrderCode
            .addCase(getPaymentStatusByOrderCode.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getPaymentStatusByOrderCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.paymentStatus = action.payload;
            })
            .addCase(getPaymentStatusByOrderCode.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Get Payment History
            .addCase(getPaymentHistory.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getPaymentHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.paymentHistory = action.payload;
            })
            .addCase(getPaymentHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Verify VNPay Callback
            .addCase(verifyVnpayCallback.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(verifyVnpayCallback.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                // Có thể lưu kết quả verify nếu cần
            })
            .addCase(verifyVnpayCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    },
});

export const { clearPaymentState, setCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer; 