import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Box, Card, CardContent, Button, Typography, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { Cancel, Refresh, CreditCard, Help, ArrowLeft, Warning, Lightbulb } from '@mui/icons-material';



export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const orderCode = searchParams.get('orderCode');
    const errorMessage = searchParams.get('error');

    // Hiển thị thông tin cơ bản từ URL parameters
    setPaymentData({
      order: {
        orderCode: orderCode || 'N/A',
        memberShipPlan: { name: 'Premium' }
      },
      payment: {
        status: 'failed',
        paymentMethod: 'vnpay',
        amount: 0
      }
    });
    setLoading(false);
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Container
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
        sx={{ padding: 0 }}
      >
        <Box className="max-w-lg w-full space-y-8">
          {loading ? (
            <Box className="text-center py-20">
              <CircularProgress size={60} sx={{ color: 'red' }} />
              <Typography className="mt-4 text-lg text-gray-600">
                Đang kiểm tra thông tin thanh toán...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Error Animation */}
              <Box className="text-center">
                <Box className="relative mx-auto w-32 h-32 mb-8">
                  <Box className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 rounded-full animate-pulse opacity-75"></Box>
                  <Box className="relative bg-gradient-to-r from-red-500 to-rose-600 rounded-full w-32 h-32 flex items-center justify-center shadow-2xl">
                    <Cancel className="w-16 h-16 text-white animate-pulse" />
                  </Box>
                  <Box className="absolute -top-2 -right-2">
                    <Warning className="w-8 h-8 text-yellow-400 animate-bounce" />
                  </Box>
                </Box>

                <Box className="space-y-4">
                  <Typography
                    variant="h3"
                    className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent"
                  >
                    Thanh toán thất bại 😔
                  </Typography>
                  <Typography className="text-xl text-gray-600 font-medium">
                    Đừng lo lắng! Chúng tôi sẽ giúp bạn khắc phục ngay
                  </Typography>
                </Box>
              </Box>

              {/* Error Alert */}
              <Alert
                severity="error"
                className="border-0 bg-gradient-to-r from-red-50 to-rose-50 shadow-xl shadow-red-100/50 backdrop-blur-sm"
              >
                <Box className="flex items-center space-x-3">
                  <Box className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                    <Cancel className="h-5 w-5 text-white" />
                  </Box>
                  <AlertTitle className="text-red-800 font-medium">
                    <strong>Lỗi:</strong> Thẻ tín dụng bị từ chối. Vui lòng kiểm tra thông tin thẻ hoặc thử phương thức thanh toán khác.
                  </AlertTitle>
                </Box>
              </Alert>

              {/* Transaction Details */}
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-red-100/50">
                <CardContent className="p-8">
                  <Box className="space-y-6">
                    <Box className="text-center pb-4 border-b border-gray-100">
                      <Typography className="text-lg font-semibold text-gray-800 mb-2">
                        Chi tiết giao dịch
                      </Typography>
                    </Box>

                    <Box className="space-y-4">
                      <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                        <Typography className="text-gray-600 font-medium">Gói đăng ký</Typography>
                        <Typography className="font-bold text-gray-700">
                          {paymentData?.order?.memberShipPlan?.name || 'Premium'}
                        </Typography>
                      </Box>

                      <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <Typography className="text-gray-600 font-medium">Số tiền</Typography>
                        <Typography className="font-bold text-2xl text-blue-700">
                          {paymentData?.payment?.amount?.toLocaleString() || '0'} VNĐ
                        </Typography>
                      </Box>

                      <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <Typography className="text-gray-600 font-medium">Mã giao dịch</Typography>
                        <Typography className="font-mono text-sm bg-white px-3 py-1 rounded-full border text-gray-500">
                          #{paymentData?.order?.orderCode || 'N/A'}
                        </Typography>
                      </Box>

                      <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                        <Typography className="text-gray-600 font-medium">Phương thức</Typography>
                        <Typography className="font-semibold text-orange-700">
                          {paymentData?.payment?.paymentMethod?.toUpperCase() || 'N/A'}
                        </Typography>
                      </Box>

                      <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
                        <Typography className="text-gray-600 font-medium">Trạng thái</Typography>
                        <Typography className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg">
                          ✗ {paymentData?.payment?.status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Solutions Card */}
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-yellow-100/50">
                <CardContent className="p-8">
                  <Box className="flex items-center space-x-3 mb-6">
                    <Box className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </Box>
                    <Typography className="font-bold text-xl text-gray-800">
                      Nguyên nhân thường gặp
                    </Typography>
                  </Box>

                  <Box className="space-y-3">
                    {[
                      'Số dư tài khoản không đủ',
                      'Thông tin thẻ không chính xác',
                      'Thẻ đã hết hạn hoặc bị khóa',
                      'Vượt quá giới hạn giao dịch',
                    ].map((reason, index) => (
                      <Box
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <Box className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </Box>
                        <Typography className="text-gray-700 font-medium">{reason}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Box className="space-y-4">
                <Link to="/upgrade-member" className="w-full block">
                  <Button
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
                    startIcon={<Refresh className="w-5 h-5 mr-2" />}
                  >
                    Thử lại thanh toán
                  </Button>
                </Link>

                <Box className="grid grid-cols-2 gap-4">
                  <Link to="/payment/methods" className="block">
                    <Button
                      variant="outlined"
                      className="w-full h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      startIcon={<CreditCard className="w-4 h-4 mr-2" />}
                    >
                      Đổi phương thức
                    </Button>
                  </Link>

                  <Link to="/support" className="block">
                    <Button
                      variant="outlined"
                      className="w-full h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
                      startIcon={<Help className="w-4 h-4 mr-2" />}
                    >
                      Hỗ trợ
                    </Button>
                  </Link>
                </Box>
              </Box>

              {/* Motivation Card */}
              <Card className="backdrop-blur-sm bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-2xl shadow-green-100/50">
                <CardContent className="p-6 text-center">
                  <Box className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Typography className="text-3xl">🚭</Typography>
                  </Box>
                  <Typography className="font-bold text-green-800 mb-3 text-lg">
                    Đừng bỏ cuộc nhé! 💪
                  </Typography>
                  <Typography className="text-green-700 mb-4 font-medium">
                    Hành trình cai thuốc của bạn rất quan trọng. Chúng tôi luôn sẵn sàng hỗ trợ!
                  </Typography>
                  <Link to="/free-trial">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      🎁 Dùng thử miễn phí 7 ngày
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Back Navigation */}
              <Box className="text-center">
                <Link
                  to="/upgrade-member"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại trang gói dịch vụ
                </Link>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </div>
  );
}