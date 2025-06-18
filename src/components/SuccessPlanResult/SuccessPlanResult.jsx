import { useEffect, useState } from "react"
import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, Typography, LinearProgress } from "@mui/material"
import { motion } from "framer-motion"

import { EmojiEvents, ArrowBack, Share, Star, CalendarToday, AccessTime, AttachMoney, MonitorHeart, AutoAwesome, TrendingUp, TrackChanges } from "@mui/icons-material"
import { Link, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { infoCompleteQuitPlan } from "../../store/slices/planeSlice"

// Confetti Component
const Confetti = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)
  }, [])

  return (
    <Box className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 100],
            x: [Math.random() * 100 - 50],
            rotate: [0, 360],
            scale: [1, 0.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </Box>
  )
}

export default function SuccessPlanResult({ planId: propPlanId }) {
  const dispatch = useDispatch()
  const { plan, isLoading, isError, errorMessage } = useSelector((state) => state.plan)
  const {badge} = useSelector((state) => state.badge)
  console.log("badge",badge )
  const [searchParams] = useSearchParams()

  const [showConfetti, setShowConfetti] = useState(false)

  // Lấy planId từ prop hoặc từ URL query parameter
  const planId = propPlanId || searchParams.get('planId')

  useEffect(() => {
    if (planId) {

      dispatch(infoCompleteQuitPlan({ planId }))
    }
  }, [dispatch, planId])

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const calculateDays = () => {
    if (!plan?.plan?.startDate || !plan?.plan?.endDate) return 0
    const start = new Date(plan.plan.startDate)
    const end = new Date(plan.plan.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Tính toán các thống kê dựa trên dữ liệu thực tế
  const calculateStats = () => {
    if (!plan?.plan) return {
      moneySaved: 0,
      healthImprovement: 0,
      daysSmokeFree: 0,
      cigarettesAvoided: 0,
    }

    const daysSmokeFree = calculateDays()
    const cigarettesPerDay = 20 // Giả sử trung bình 20 điếu/ngày
    const pricePerPack = 30000 // Giả sử 30,000 VND/gói (20 điếu)
    
    return {
      moneySaved: daysSmokeFree * (pricePerPack / 20) * cigarettesPerDay,
      healthImprovement: Math.min(85, daysSmokeFree * 2.8), // Cải thiện sức khỏe theo thời gian
      daysSmokeFree: daysSmokeFree,
      cigarettesAvoided: daysSmokeFree * cigarettesPerDay,
    }
  }

  // Hiển thị loading nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Typography variant="h5" className="text-gray-600">
          Đang tải thông tin kế hoạch...
        </Typography>
      </Box>
    )
  }

  // Hiển thị lỗi nếu có
  if (isError) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Typography variant="h5" className="text-red-600">
          Lỗi: {errorMessage || "Không thể tải thông tin kế hoạch"}
        </Typography>
      </Box>
    )
  }

  // Kiểm tra nếu không có dữ liệu plan
  if (!plan || !plan.plan) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Typography variant="h5" className="text-gray-600">
          Không tìm thấy thông tin kế hoạch
        </Typography>
      </Box>
    )
  }

  const stats = calculateStats()
  const planData = plan.plan
  const badgeData = plan.badges?.[0] || {
    name: "Plan Completed",
    description: `Hoàn thành kế hoạch cai thuốc: ${planData.title}`,
  }

  return (
    <Box className="min-h-screen relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {showConfetti && <Confetti />}
      <Box className="absolute inset-0 overflow-hidden">
        <Box className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <Box className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <Box className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
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
              className="relative"
            >
              <Box className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <EmojiEvents className="h-16 w-16 text-white" />
              </Box>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <AutoAwesome className="h-8 w-8 text-yellow-500" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography variant="h1" className="text-6xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                🎉 XUẤT SẮC! 🎉
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Typography className="text-2xl text-gray-700 font-medium">
                Bạn đã hoàn thành thành công lộ trình cai thuốc lá!
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="flex justify-center space-x-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    delay: i * 0.1,
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                >
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                </motion.div>
              ))}
            </motion.div>
          </Box>
        </motion.div>

        <Grid container spacing={8} className="mb-12">
          <Grid item xs={12} xl={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                <Box className="h-2 bg-gradient-to-r from-green-400 to-blue-500" />
                <CardHeader>
                  <Typography variant="h5" className="flex items-center gap-3 text-2xl">
                    <Box className="p-3 rounded-full bg-green-100">
                      <TrackChanges className="h-6 w-6 text-green-600" />
                    </Box>
                    Thông tin kế hoạch
                  </Typography>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Box className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <Typography variant="h6" className="font-bold text-2xl mb-3 text-gray-800">
                      {planData.title}
                    </Typography>
                    <Typography className="text-gray-600 text-lg leading-relaxed">
                      {planData.reason}
                    </Typography>
                  </Box>

                  <Grid container spacing={6}>
                    <Grid item xs={12} md={4}>
                      <Box className="bg-blue-50 rounded-xl p-4 text-center">
                        <CalendarToday className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <Typography className="text-sm text-blue-600 font-medium">Ngày bắt đầu</Typography>
                        <Typography className="font-bold text-lg text-gray-800">{formatDate(planData.startDate)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className="bg-purple-50 rounded-xl p-4 text-center">
                        <CalendarToday className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <Typography className="text-sm text-purple-600 font-medium">Ngày kết thúc</Typography>
                        <Typography className="font-bold text-lg text-gray-800">{formatDate(planData.endDate)}</Typography>
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
                      label="✅ Hoàn thành xuất sắc"
                      className="text-lg px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500"
                      color="success"
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} xl={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 shadow-2xl border-0 overflow-hidden">
                <Box className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
                <CardHeader>
                  <Typography variant="h5" className="flex items-center justify-center gap-2 text-2xl text-green-800">
                    <EmojiEvents className="h-6 w-6" />
                    Huy hiệu & Thành tựu
                  </Typography>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Box className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                      className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <EmojiEvents className="h-12 w-12 text-white" />
                    </motion.div>
                    <Typography className="font-bold text-xl text-green-800 mb-2">{badgeData.name}</Typography>
                    <Typography className="text-green-700 text-sm leading-relaxed">{badgeData.description}</Typography>
                  </Box>

                  <Box className="space-y-4">
                    <Box className="bg-white rounded-xl p-4 shadow-sm">
                      <Box className="flex items-center justify-between mb-2">
                        <Box className="flex items-center gap-2">
                          <AttachMoney className="h-5 w-5 text-green-600" />
                          <Typography className="font-medium">Tiết kiệm</Typography>
                        </Box>
                        <Typography className="font-bold text-green-600">{formatCurrency(stats.moneySaved)}</Typography>
                      </Box>
                    </Box>

                    <Box className="bg-white rounded-xl p-4 shadow-sm">
                      <Box className="flex items-center justify-between mb-2">
                        <Box className="flex items-center gap-2">
                          <MonitorHeart className="h-5 w-5 text-blue-600" />
                          <Typography className="font-medium">Sức khỏe</Typography>
                        </Box>
                        <Typography className="font-bold text-blue-600">+{stats.healthImprovement}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={stats.healthImprovement} className="h-2" />
                    </Box>

                    <Box className="bg-white rounded-xl p-4 shadow-sm">
                      <Box className="flex items-center justify-between mb-2">
                        <Box className="flex items-center gap-2">
                          <CalendarToday className="h-5 w-5 text-purple-600" />
                          <Typography className="font-medium">Ngày không thuốc</Typography>
                        </Box>
                        <Typography className="font-bold text-purple-600">{stats.daysSmokeFree} ngày</Typography>
                      </Box>
                    </Box>

                    <Box className="bg-white rounded-xl p-4 shadow-sm">
                      <Box className="flex items-center justify-between mb-2">
                        <Box className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                          <Typography className="font-medium">Điếu thuốc tránh được</Typography>
                        </Box>
                        <Typography className="font-bold text-orange-600">{stats.cigarettesAvoided} điếu</Typography>
                      </Box>
                    </Box>
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
          <Link to="/coachPlan">
            <Button
              variant="outlined"
              size="large"
              className="bg-white/80 backdrop-blur-sm hover:bg-white border-2 shadow-lg text-lg px-8 py-4"
            >
              <ArrowBack className="h-5 w-5 mr-2" />
              Xem kế hoạch
            </Button>
          </Link>
      
          <Link to="/historyPlan">
            <Button
              variant="outlined"
              size="large"
              className="bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-800 shadow-lg text-lg px-8 py-4"
            >
              <EmojiEvents className="h-5 w-5 mr-2" />
              Xem thành tựu
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
            Status: <span className="font-mono">{planData.status}</span> | Plan ID: <span className="font-mono">{planId}</span>
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