import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  Pending,
  Error as ErrorIcon,
  Payment as PaymentIcon,
  Receipt,
} from "@mui/icons-material";
import { getPaymentHistory } from "../../../store/slices/paymentSlice";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { paymentHistory, isLoading, isError, errorMessage } = useSelector(
    (state) => state.payment
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(getPaymentHistory({ page: currentPage, limit }));
  }, [currentPage, dispatch]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      completed: {
        label: "Hoàn thành",
        color: "success",
        icon: <CheckCircle />,
      },
      success: { label: "Thành công", color: "success", icon: <CheckCircle /> },
      pending: { label: "Đang xử lý", color: "warning", icon: <Pending /> },
      failed: { label: "Thất bại", color: "error", icon: <ErrorIcon /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{
          fontWeight: "medium",
          borderRadius: "16px",
          "& .MuiChip-icon": { color: "inherit" },
        }}
      />
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      vnpay: "VNPay",
      momo: "MoMo",
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <Alert
          severity="error"
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 2 }}
        >
          {errorMessage ||
            "Không thể tải lịch sử thanh toán. Vui lòng thử lại sau."}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #2E7D32 0%, #66BB6A 50%, #C8E6C9 100%)",

        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
        }}
      >
        <Box mb={5} sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ color: "#fff", fontWeight: "bold", letterSpacing: 1 }}
          >
            Lịch sử thanh toán
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            Theo dõi và quản lý tất cả các giao dịch thanh toán của bạn
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={5}>
          {[
            {
              icon: <Receipt sx={{ fontSize: 40, color: "#667eea" }} />,
              value: paymentHistory?.pagination?.totalRecords || 0,
              label: "Tổng giao dịch",
            },
            {
              icon: <CheckCircle sx={{ fontSize: 40, color: "#4caf50" }} />,
              value:
                paymentHistory?.payments?.filter(
                  (p) =>
                    p.payment.status === "success" ||
                    p.order.status === "completed"
                ).length || 0,
              label: "Thành công",
            },
            {
              icon: <Pending sx={{ fontSize: 40, color: "#ff9800" }} />,
              value:
                paymentHistory?.payments?.filter(
                  (p) => p.payment.status === "pending"
                ).length || 0,
              label: "Đang xử lý",
            },
            {
              icon: <PaymentIcon sx={{ fontSize: 40, color: "#2196f3" }} />,
              value: formatCurrency(
                paymentHistory?.payments?.reduce(
                  (total, p) =>
                    p.payment.status === "success"
                      ? total + p.payment.amount
                      : total,
                  0
                ) || 0
              ),
              label: "Tổng tiền",
            },
          ].map((item, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  transition: "transform  Ascending 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {item.icon}
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Payment History Table */}
        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Chi tiết giao dịch
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: "rgba(0, 0, 0, 0.1)" }} />

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ borderRadius: 2 }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    {[
                      "Mã đơn hàng",
                      "Gói dịch vụ",
                      "Phương thức",
                      "Số tiền",
                      "Trạng thái",
                      "Ngày thanh toán",
                    ].map((header) => (
                      <TableCell key={header}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          {header}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory?.payments?.map((item) => (
                    <TableRow
                      key={item.order.id}
                      hover
                      sx={{
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "rgba(102, 126, 234, 0.05)",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium", color: "#333" }}
                        >
                          {item.order.orderCode}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {item.payment.transactionId
                            ? `ID: ${item.payment.transactionId}`
                            : "Chưa có mã giao dịch"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium", color: "#333" }}
                        >
                          {item.order.memberShipPlan.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {item.order.memberShipPlan.duration} ngày
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          {getPaymentMethodLabel(item.payment.paymentMethod)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium", color: "#333" }}
                        >
                          {formatCurrency(item.payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(item.payment.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          {formatDate(item.payment.paymentDate)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {paymentHistory?.pagination && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={paymentHistory.pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#667eea",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#5a6ed6" },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PaymentHistory;
