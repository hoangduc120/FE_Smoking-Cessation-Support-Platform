
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Box,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material"
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Warning,
  CheckCircle,
  Cancel,
  PhoneAndroid,
  Business,
} from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchPaymentStats } from "../../../store/slices/dashboard"

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    success: {
      main: "#16a34a",
    },
    error: {
      main: "#dc2626",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Helper function to get payment method icon
const getPaymentMethodIcon = (method) => {
  switch (method.toLowerCase()) {
    case "momo":
      return <PhoneAndroid sx={{ fontSize: 20 }} />
    case "vnpay":
      return <Business sx={{ fontSize: 20 }} />
    default:
      return <CreditCard sx={{ fontSize: 20 }} />
  }
}

// Overview Card Component
const OverviewCard = ({ title, value, subtitle, icon, color = "primary" }) => (
  <Card sx={{ height: "100%", boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box color={`${color}.main`}>{icon}</Box>
      </Box>
      <Typography variant="h4" component="div" color={`${color}.main`} gutterBottom>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
)

export default function PaymentStatistics() {
  const dispatch = useDispatch()
  const { paymentStarts, isLoading, isError, errorMessage } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchPaymentStats())
  }, [dispatch])

  // Handle loading and error states
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  if (isError) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography color="error.main">
            Lỗi khi tải dữ liệu: {errorMessage || "Đã xảy ra lỗi"}
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  // Ensure paymentStats.data exists before accessing its properties
  if (!paymentStarts?.data) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">
            Không có dữ liệu thống kê
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  const { data } = paymentStarts
  const successRate = (data.successfulPayments / data.totalPayments) * 100
  const totalRevenue = data.paymentStatusBreakdown.find((p) => p._id === "success")?.totalAmount || 0
  const totalLostRevenue = data.failedPayments.reduce((sum, p) => sum + p.lostRevenue, 0)

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom color="text.primary">
              Thống Kê Thanh Toán
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hệ thống hỗ trợ cai thuốc lá
            </Typography>
          </Box>

          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item size={{xs:12, sm:6, md:3}}>
              <OverviewCard
                title="Tổng Thanh Toán"
                value={data.totalPayments}
                subtitle="Tổng số giao dịch"
                icon={<CreditCard />}
                color="primary"
              />
            </Grid>
            <Grid item size={{xs:12, sm:6, md:3}}>
              <OverviewCard
                title="Thành Công"
                value={data.successfulPayments}
                subtitle={`Tỷ lệ: ${successRate.toFixed(1)}%`}
                icon={<CheckCircle />}
                color="success"
              />
            </Grid>
            <Grid item size={{xs:12, sm:6, md:3}}>
              <OverviewCard
                title="Thất Bại"
                value={data.failedPaymentsCount}
                subtitle={`Tỷ lệ: ${(100 - successRate).toFixed(1)}%`}
                icon={<Cancel />}
                color="error"
              />
            </Grid>
            <Grid item size={{xs:12, sm:6, md:3}}>
              <OverviewCard
                title="Doanh Thu"
                value={formatCurrency(totalRevenue)}
                subtitle="Từ thanh toán thành công"
                icon={<AttachMoney />}
                color="success"
              />
            </Grid>
          </Grid>

          {/* Charts and Details */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Payment Status Breakdown */}
            <Grid item size={{xs:12, lg:6}}>
              <Card sx={{ height: "100%", boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6" component="h2">
                      Trạng Thái Thanh Toán
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Phân tích theo trạng thái giao dịch
                  </Typography>

                  <Box sx={{ space: 3 }}>
                    {data.paymentStatusBreakdown.map((status) => (
                      <Box key={status._id} sx={{ mb: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {status._id === "success" ? (
                              <CheckCircle sx={{ fontSize: 20, color: "success.main" }} />
                            ) : status._id === "pending" ? (
                              <Warning sx={{ fontSize: 20, color: "warning.main" }} />
                            ) : (
                              <Cancel sx={{ fontSize: 20, color: "error.main" }} />
                            )}
                            <Typography variant="body1" fontWeight="medium">
                              {status._id === "success"
                                ? "Thành công"
                                : status._id === "pending"
                                ? "Chờ xử lý"
                                : "Thất bại"}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${status.count} giao dịch`}
                            color={status._id === "success" ? "success" : status._id === "pending" ? "warning" : "error"}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Tổng tiền: {formatCurrency(status.totalAmount)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(status.count / data.totalPayments) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                          color={status._id === "success" ? "success" : status._id === "pending" ? "warning" : "error"}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Payment Method Breakdown */}
            <Grid item size={{xs:12, lg:6}}>
              <Card sx={{ height: "100%", boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <CreditCard color="primary" />
                    <Typography variant="h6" component="h2">
                      Phương Thức Thanh Toán
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Phân tích theo phương thức
                  </Typography>

                  <Box sx={{ space: 3 }}>
                    {data.paymentMethodBreakdown.map((method) => (
                      <Box key={method._id} sx={{ mb: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getPaymentMethodIcon(method._id)}
                            <Typography variant="body1" fontWeight="medium">
                              {method._id.toUpperCase()}
                            </Typography>
                          </Box>
                          <Chip label={`${method.count} giao dịch`} variant="outlined" size="small" />
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 1 }}>
                          <Grid item size={6}>
                            <Typography variant="caption" color="text.secondary">
                              Tổng tiền:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(method.totalAmount)}
                            </Typography>
                          </Grid>
                          <Grid item size={6}>
                            <Typography variant="caption" color="text.secondary">
                              Trung bình:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(method.averageAmount)}
                            </Typography>
                          </Grid>
                        </Grid>
                        < Typography
                          variant="determinate"
                          value={(method.count / data.totalPayments) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Failed Payments Analysis */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Warning sx={{ color: "error.main" }} />
                <Typography variant="h6" component="h2">
                  Phân Tích Thanh Toán Thất Bại
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Chi tiết về các giao dịch thất bại và doanh thu bị mất
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: "error.light",
                  color: "error.contrastText",
                  border: "1px solid",
                  borderColor: "error.main",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingDown />
                  <Typography variant="body1" fontWeight="medium">
                    Tổng Doanh Thu Bị Mất
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(totalLostRevenue)}
                </Typography>
              </Paper>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Phương Thức
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight="bold">
                        Số Lần Thất Bại
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight="bold">
                        Doanh Thu Mất
                      </Typography>
                    </TableCell>
              
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.failedPayments.map((payment) => {
      
                 
                   

                    return (
                      <TableRow key={payment._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getPaymentMethodIcon(payment._id)}
                            <Typography variant="body1" fontWeight="medium">
                              {payment._id.toUpperCase()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={payment.failedCount} color="error" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="medium" color="error.main">
                            {formatCurrency(payment.lostRevenue)}
                          </Typography>
                        </TableCell>
                     
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}