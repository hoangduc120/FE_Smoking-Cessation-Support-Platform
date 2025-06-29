import fetcher from '../apis/fetcher';

class PaymentService {
    // Tạo payment URL
    static async createPaymentUrl(memberShipPlanId, paymentMethod, amount) {
        try {
            const response = await fetcher.post('/payment/create-payment-url', {
                memberShipPlanId,
                paymentMethod: paymentMethod.toLowerCase(), // vnpay hoặc momo
                amount
            });
            return response.data;
        } catch (error) {
            console.error('Create payment URL error:', error);
            throw error;
        }
    }

    // Verify VNPay callback
    static async verifyVnpayCallback(vnpayParams) {
        try {
            const queryParams = new URLSearchParams(vnpayParams).toString();
            const response = await fetcher.get(`/payment/vnpay-callback?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Verify VNPay callback error:', error);
            throw error;
        }
    }

    // Verify MoMo callback
    static async verifyMomoCallback(momoParams) {
        try {
            const response = await fetcher.post('/payment/momo-callback', momoParams);
            return response.data;
        } catch (error) {
            console.error('Verify MoMo callback error:', error);
            throw error;
        }
    }

    static async getPaymentStatusByOrderCode(orderCode) {
        try {
            const response = await fetcher.get(`/payment/status-by-code/${orderCode}`);
            return response.data;
        } catch (error) {
            console.error('Get payment status by orderCode error:', error);
            throw error;
        }
    }

    // Lấy lịch sử thanh toán
    static async getPaymentHistory(page = 1, limit = 10) {
        try {
            const response = await fetcher.get(`/payment/history?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Get payment history error:', error);
            throw error;
        }
    }

    // Redirect đến payment gateway
    static redirectToPayment(paymentUrl) {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        } else {
            throw new Error('Payment URL không hợp lệ');
        }
    }
}

export default PaymentService; 