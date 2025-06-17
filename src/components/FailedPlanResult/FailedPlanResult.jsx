
import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, Typography, LinearProgress } from "@mui/material"
import { motion } from "framer-motion"

import { Favorite, ArrowBack, Refresh, CalendarToday, AccessTime, People, TrackChanges } from "@mui/icons-material"
import { Link } from "react-router-dom"

export default function FailedPlanResult({ planId }) {
  const failedData = {
    plan: {
      title: "Tháng không thuốc - vì sức khỏe",
      reason: "Muốn tiết kiệm chi phí và cải thiện sức khỏe",
      startDate: "2025-06-15T00:00:00.000Z",
      endDate: "2025-07-15T00:00:00.000Z",
      status: "failed",
    },
    progress: {
      daysCompleted: 18,
      totalDays: 30,
      percentage: 60,
    },
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calculateDays = () => {
    const start = new Date(failedData.plan.startDate)
    const end = new Date(failedData.plan.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <Box className="min-h-screen relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Box className="absolute inset-0 overflow-hidden">
        <Box className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <Box className="absolute top-40 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <Box className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </Box>

      <Box className="relative z-10 max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Box className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Box className="w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Favorite className="h-16 w-16 text-white" />
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography variant="h1" className="text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                💪 ĐỪNG BỎ CUỘC! 💪
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Typography className="text-2xl text-gray-700 font-medium">
                Thất bại chỉ là bước đệm để thành công lớn hơn!
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        <Grid container spacing={8} className="mb-12">
          <Grid item size={7}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                <Box className="h-2 bg-gradient-to-r from-orange-400 to-red-500" />
                <CardHeader>
                  <Typography variant="h5" className="flex items-center gap-3 text-2xl">
                    <Box className="p-3 rounded-full bg-orange-100">
                      <TrackChanges className="h-6 w-6 text-orange-600" />
                    </Box>
                    Thông tin kế hoạch
                  </Typography>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Box className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <Typography variant="h6" className="font-bold text-2xl mb-3 text-gray-800">
                      {failedData.plan.title}
                    </Typography>
                    <Typography className="text-gray-600 text-lg leading-relaxed">
                      {failedData.plan.reason}
                    </Typography>
                  </Box>

                  <Grid container spacing={6}>
                    <Grid item xs={12} md={4}>
                      <Box className="bg-blue-50 rounded-xl p-4 text-center">
                        <CalendarToday className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <Typography className="text-sm text-blue-600 font-medium">Ngày bắt đầu</Typography>
                        <Typography className="font-bold text-lg text-gray-800">{formatDate(failedData.plan.startDate)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className="bg-purple-50 rounded-xl p-4 text-center">
                        <CalendarToday className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <Typography className="text-sm text-purple-600 font-medium">Ngày kết thúc</Typography>
                        <Typography className="font-bold text-lg text-gray-800">{formatDate(failedData.plan.endDate)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className="bg-indigo-50 rounded-xl p-4 text-center">
                        <AccessTime className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                        <Typography className="text-sm text-indigo-600 font-medium">Thời gian</Typography>
                        <Typography className="font-bold text-lg text-gray-800">{calculateDays()} ngày</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box className="flex justify-center">
                    <Chip
                      label="⏳ Chưa hoàn thành"
                      className="text-lg px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500"
                      color="error"
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item size={5}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 shadow-2xl border-0 overflow-hidden">
                <Box className="h-2 bg-gradient-to-r from-orange-400 to-red-500" />
                <CardHeader>
                  <Typography variant="h5" className="flex items-center justify-center gap-2 text-2xl text-orange-800">
                    <Favorite className="h-6 w-6" />
                    Tiến độ & Hỗ trợ
                  </Typography>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Box className="bg-white rounded-xl p-6 shadow-sm">
                    <Typography className="font-bold text-lg mb-4 text-center">Tiến độ đã đạt được</Typography>
                    <Box className="text-center mb-4">
                      <Typography className="text-4xl font-black text-orange-600">
                        {failedData.progress.daysCompleted}/{failedData.progress.totalDays}
                      </Typography>
                      <Typography className="text-gray-600">ngày hoàn thành</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={failedData.progress.percentage} className="h-3 mb-2" />
                    <Typography className="text-center text-sm text-gray-600">{failedData.progress.percentage}% hoàn thành</Typography>
                  </Box>

                  <Box className="bg-white rounded-xl p-6 shadow-sm">
                    <Typography className="font-bold text-lg mb-4 flex items-center gap-2">
                      <TrackChanges className="h-5 w-5 text-orange-600" />
                      Bước tiếp theo
                    </Typography>
                    <Box component="ul" className="space-y-3 text-sm">
                      {[
                        "Phân tích nguyên nhân và điều chỉnh kế hoạch",
                        "Tìm kiếm hỗ trợ từ coach chuyên nghiệp",
                        "Tham gia cộng đồng để có động lực",
                        "Bắt đầu lại với mục tiêu nhỏ hơn",
                      ].map((step, index) => (
                        <Box component="li" key={index} className="flex items-start gap-3">
                          <Box className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <Typography>{step}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border-l-4 border-orange-500">
                    <Typography className="text-sm text-orange-800 font-medium italic text-center">
                      "Thành công không phải là không bao giờ thất bại, mà là không bao giờ bỏ cuộc!"
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link to="/member/dashboard">
            <Button
              variant="outlined"
              size="large"
              className="bg-white/80 backdrop-blur-sm hover:bg-white border-2 shadow-lg text-lg px-8 py-4"
            >
              <ArrowBack className="h-5 w-5 mr-2" />
              Về Dashboard
            </Button>
          </Link>
          <Link to="/member/plan-customization">
            <Button
              size="large"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg text-lg px-8 py-4"
            >
              <Refresh className="h-5 w-5 mr-2" />
              Thử lại ngay
            </Button>
          </Link>
          <Link to="/member/coaches">
            <Button
              variant="outlined"
              size="large"
              className="bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-800 shadow-lg text-lg px-8 py-4"
            >
              <People className="h-5 w-5 mr-2" />
              Tìm coach hỗ trợ
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Box className="inline-block bg-white/50 backdrop-blur-sm rounded-full px-6 py-2 text-sm text-gray-600">
            Status: <span className="font-mono">failed</span> | Plan ID: <span className="font-mono">{planId}</span>
          </Box>
        </motion.div>
      </Box>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Box>
  )
}