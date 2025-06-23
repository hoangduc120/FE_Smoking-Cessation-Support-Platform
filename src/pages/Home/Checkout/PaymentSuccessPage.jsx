import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Card, CardContent, Button, Typography } from '@mui/material';
import { CheckCircle, ArrowRightAlt, CalendarToday, Group, EmojiEvents, Star, CardGiftcard } from '@mui/icons-material';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Container
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
        sx={{ padding: 0 }}
      >
        <Box className="max-w-lg w-full space-y-8">
          {/* Success Animation */}
          <Box className="text-center">
            <Box className="relative mx-auto w-32 h-32 mb-8">
              <Box className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-75"></Box>
              <Box className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-32 h-32 flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white animate-bounce" />
              </Box>
              <Box className="absolute -top-2 -right-2">
                <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
              </Box>
            </Box>

            <Box className="space-y-4">
              <Typography
                variant="h3"
                className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >
                Thanh toán thành công! 🎉
              </Typography>
              <Typography className="text-xl text-gray-600 font-medium">
                Chúc mừng bạn đã bắt đầu hành trình cai thuốc lá
              </Typography>
              <Box className="flex items-center justify-center space-x-2 text-green-600">
                <CardGiftcard className="w-5 h-5" />
                <Typography className="text-sm font-medium">
                  Bạn đã nhận được 7 ngày Premium miễn phí!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Payment Details Card */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-green-100/50">
            <CardContent className="p-8">
              <Box className="space-y-6">
                <Box className="text-center pb-4 border-b border-gray-100">
                  <Typography className="text-lg font-semibold text-gray-800 mb-2">
                    Chi tiết thanh toán
                  </Typography>
                </Box>

                <Box className="space-y-4">
                  <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <Typography className="text-gray-600 font-medium">Gói đăng ký</Typography>
                    <Typography className="font-bold text-green-700 text-lg">Premium 3 tháng</Typography>
                  </Box>

                  <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <Typography className="text-gray-600 font-medium">Số tiền</Typography>
                    <Box className="text-right">
                      <Typography className="font-bold text-2xl text-blue-700">299,000 VNĐ</Typography>
                      <Typography className="text-sm text-gray-500 line-through">399,000 VNĐ</Typography>
                    </Box>
                  </Box>

                  <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <Typography className="text-gray-600 font-medium">Mã giao dịch</Typography>
                    <Typography className="font-mono text-sm bg-white px-3 py-1 rounded-full border">
                      #TXN123456789
                    </Typography>
                  </Box>

                  <Box className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <Typography className="text-gray-600 font-medium">Trạng thái</Typography>
                    <Typography className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      ✓ Đã thanh toán
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-100/50">
            <CardContent className="p-8">
              <Typography className="font-bold text-xl text-gray-800 mb-6 text-center">
                Hành trình cai thuốc của bạn bắt đầu! 🚀
              </Typography>
              <Box className="space-y-4">
                <Box className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <Box className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarToday className="w-6 h-6 text-white" />
                  </Box>
                  <Box>
                    <Typography className="font-semibold text-gray-800">Lập kế hoạch cá nhân</Typography>
                    <Typography className="text-sm text-gray-600">
                      Tạo lộ trình cai thuốc phù hợp với bạn
                    </Typography>
                  </Box>
                </Box>

                <Box className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <Box className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Group className="w-6 h-6 text-white" />
                  </Box>
                  <Box>
                    <Typography className="font-semibold text-gray-800">Tham gia cộng đồng</Typography>
                    <Typography className="text-sm text-gray-600">
                      Kết nối với 10,000+ người cùng mục tiêu
                    </Typography>
                  </Box>
                </Box>

                <Box className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <Box className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <EmojiEvents className="w-6 h-6 text-white" />
                  </Box>
                  <Box>
                    <Typography className="font-semibold text-gray-800">Theo dõi thành tích</Typography>
                    <Typography className="text-sm text-gray-600">
                      Nhận huy hiệu và phần thưởng hàng ngày
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box className="space-y-4">
            <Link to="/dashboard" className="w-full block">
              <Button
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105"
                endIcon={<ArrowRightAlt className="w-5 h-5 ml-2" />}
              >
                Bắt đầu hành trình cai thuốc
              </Button>
            </Link>

            <Link to="/support" className="w-full block">
              <Button
                variant="outlined"
                className="w-full h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
              >
                💬 Liên hệ hỗ trợ
              </Button>
            </Link>
          </Box>

          {/* Footer Message */}
          <Box className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <Typography className="text-sm text-gray-600 mb-2">
              📧 Email xác nhận đã được gửi đến hộp thư của bạn
            </Typography>
            <Typography className="text-xs text-gray-500">
              Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi! 💚
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}