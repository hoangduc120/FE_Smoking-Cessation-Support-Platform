import { Box, Grid, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Button } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
} from "chart.js";
import "./DashBoard.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDashboard,fetchPaymentStats,fetchRevenueMemberShip, fetchRevenueByPeriod } from "../../../store/slices/dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement
);


export default function DashBoardAdmin() {
  const dispatch = useDispatch();
  const { dashboard, revenueMemberShip,paymentStarts, isLoading, isError } = useSelector((state) => state.dashboard);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const planData = {
    orderStatistics: revenueMemberShip?.data?.orderStatistics || [],
    mostPopularPlan: revenueMemberShip?.data?.mostPopularPlan || {},
  };

 
  const paymentDoughnutData = {
    labels: dashboard?.data?.paymentMethodBreakdown
      ? dashboard.data.paymentMethodBreakdown.map((method) => method._id.toUpperCase())
      : [],
    datasets: [
      {
        label: "Doanh thu",
        data: dashboard?.data?.paymentMethodBreakdown
          ? dashboard.data.paymentMethodBreakdown.map((method) => method.revenue)
          : [],
        backgroundColor: ["#10b982", "#3b82f6"],
      },
    ],
  };



  // Doughnut chart config
  const doughnutConfig = {
    type: "doughnut",
    data: paymentDoughnutData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Tổng doanh thu theo phương thức thanh toán" },
      },
    },
  };


  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchRevenueMemberShip());
    dispatch(fetchPaymentStats());
  }, []);

  const paymentStats = paymentStarts?.data || {};
  const { revenueByPeriod } = useSelector((state) => state.dashboard);
  const revenueByPeriodData = Array.isArray(revenueByPeriod?.data?.revenueByPeriod) ? revenueByPeriod.data.revenueByPeriod : [];

  const { data } = paymentStarts
  const totalLostRevenue = data?.failedPayments.reduce((sum, p) => sum + p.lostRevenue, 0)



  const getLabel = (item) => {
    if (!item._id) return '';
    if (item._id.day) {
      const { year, month, day } = item._id;
      return `${day}/${month}/${year}`;
    }
    if (item._id.month) {
      const { year, month } = item._id;
      return `Tháng ${month}/${year}`;
    }
    if (item._id.year) {
      const { year } = item._id;
      return `${year}`;
    }
    return '';
  };

  return (
    <Box className="dashboard">
      <Box className="dashboard-title">
        <Box className="dasboard-titleLeft">
          <Typography className="dashboard-title-text">Dashboard</Typography>
          <span className="dashboard-title-span">
            Tổng quan doanh thu hệ thống QuitSmoke
          </span>
        </Box>
        <Box className="dasboard-titleRight">
          <Typography className="dasboard-titleRight-text">
            <PaymentIcon sx={{ marginRight: "10px" }} />
            Hệ thống ổn định
          </Typography>
        </Box>
      </Box>
      <Box className="dashboard-card">
        <Grid container spacing={2} className="dashboard-gird">
          <Grid size={3} className="dashboard-grid-plan">
            <Box className="dashboard-card-content">
              <Typography sx={{ color: "#4767bf", fontSize: "20px", fontWeight: "bold" }}>
                Tổng doanh thu
              </Typography>
              <span style={{ color: "#23368f", fontSize: "40px", fontWeight: "bold" }}>
                {dashboard?.data?.totalRevenue.toLocaleString()} VND
              </span>
            </Box>
            <Box className="dashboard-card-icons">
              <PaymentIcon sx={{ color: "#426ad5", fontSize: "40px" }} />
            </Box>
          </Grid>
          <Grid size={3} className="dashboard-grid-user">
            <Box className="dashboard-card-content">
              <Typography sx={{ color: "#41ad83", fontSize: "20px", fontWeight: "bold" }}>
                Tổng giao dịch
              </Typography>
              <span style={{ color: "#0f5835", fontSize: "40px", fontWeight: "bold" }}>
                {paymentStarts?.data?.totalPayments}
              </span>
            </Box>
            <Box className="dashboard-card-icons-user">
              <PeopleIcon sx={{ color: "#41ad83", fontSize: "40px" }} />
            </Box>
          </Grid>
          <Grid size={3} className="dashboard-grid-plan-percent">
            <Box className="dashboard-card-content">
              <Typography sx={{ color: "#926dbb", fontSize: "20px", fontWeight: "bold" }}>
                Gói được mua nhiều nhất
              </Typography>
              <span style={{ color: "#63148b", fontSize: "22px", fontWeight: "bold", display: 'block' }}>
                {planData.mostPopularPlan.planName ? `Gói ${planData.mostPopularPlan.planName}` : "Không có dữ liệu"}
              </span>
             
            </Box>
            <Box className="dashboard-card-icons-percent">
              <TrendingUpIcon sx={{ color: "#926dbb", fontSize: "40px" }} />
            </Box>
          </Grid>
          <Grid size={3} className="dashboard-grid-plan-today">
            <Box className="dashboard-card-content">
              <Typography sx={{ color: "#f69037", fontSize: "20px", fontWeight: "bold" }}>
                Gói thành viên đã bán
              </Typography>
              <span style={{ color: "#7e2d11", fontSize: "40px", fontWeight: "bold" }}>
                {paymentStats.recentPayments && paymentStats.recentPayments[0]?.count}
              </span>
            </Box>
            <Box className="dashboard-card-icons-today">
              <TimelineIcon sx={{ color: "#f69037", fontSize: "40px" }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="dashboard-chart">
        <Grid container spacing={2}>
          <Grid item size={6} className="chart-right">
            <Box className="dashboard-card-content">
              <Typography sx={{ fontSize: "30px" }}>
                Tổng doanh thu theo phương thức
              </Typography>
              <span style={{ color: "#9c9797", fontSize: "20px" }}>
                Phân bổ doanh thu VNPay và Momo
              </span>
            </Box>
            <Box sx={{ width: "300px", height: "300px", marginLeft: "17%", marginTop: "30px" }}>
              <Doughnut data={paymentDoughnutData} options={doughnutConfig.options} />
            </Box>
          </Grid>
          <Grid item size={6} className="chart-right">
            <Box className="chart-title">
              <Typography sx={{ fontSize: "30px" }}>Doanh thu theo thời gian</Typography>
              <span style={{ color: "#9c9797", fontSize: "20px" }}>
                Lọc doanh thu theo thời gian
              </span>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (startDate && endDate) {
                    dispatch(fetchRevenueByPeriod({ startDate, endDate }));
                  }
                }}
                style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}
              >
                <TextField
                  label="Ngày bắt đầu"
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Ngày kết thúc"
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" size="small">Lọc</Button>
              </form>
            </Box>
            <Box sx={{ width: "400px", height: "300px", marginLeft: "5%", marginTop: "30px" }}>
              {revenueByPeriodData.length > 0 ? (
                <Bar
                  data={{
                    labels: revenueByPeriodData.map(getLabel),
                    datasets: [
                      {
                        label: "Doanh thu",
                        data: revenueByPeriodData.map(item => item.totalRevenue),
                        backgroundColor: "#4881ea",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: true, text: "Doanh thu theo thời gian" },
                    },
                    scales: {
                      y: { beginAtZero: true, title: { display: true, text: "Doanh thu (VND)" } },
                      x: { title: { display: true, text: "Thời gian" } },
                    },
                  }}
                />
              ) : (
                <Typography align="center" sx={{ mt: 8, color: '#aaa' }}>
                  Không có dữ liệu doanh thu cho khoảng thời gian này.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="dashboard-progress" sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item size={6} className="chart-right">
            <Box className="dashboard-card-content">
              <Typography sx={{ fontSize: "30px" }}>Thống kê gói mua nhiều nhất</Typography>
              <Typography sx={{ color: "#9c9797", fontSize: "20px" }}>
                Các gói thành viên phổ biến
              </Typography>
              {planData.orderStatistics.length > 0 ? (
                <>
                  {planData.orderStatistics.map((plan, index) => (
                    <div className="progress-item" key={index}>
                      <Typography className="progress-label">
                        Gói {plan.planName}{" "}
                        <span className="progress-value">{plan.totalSales} lượt mua</span>
                      </Typography>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${
                                (plan.totalSales /
                                  planData.orderStatistics.reduce((sum, p) => sum + p.totalSales, 0)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <Typography>Đang tải dữ liệu gói thành viên...</Typography>
              )}
            </Box>
          </Grid>
          <Grid item size={6} className="chart-right">
            <Box className="dashboard-card-content" sx={{ padding: 2 }}>
              <Typography sx={{ fontSize: "30px" }}>Thống kê thanh toán chi tiết</Typography>
              <Typography sx={{ color: "#9c9797", fontSize: "20px" }}>
                Trạng thái thanh toán
              </Typography>
              <Box className="grid-warning">
                <Box className="grid-warning-content-low">
                  <Typography className="grid-warning-text-low">
                    <PaymentIcon sx={{ marginRight: "15px", color: "#3e8f5c" }} /> Thanh toán thành công
                  </Typography>
                  <span className="grid-warning-text-low-sup">
                    {paymentStats.successfulPayments}
                  </span>
                </Box>
                {/* <Box className="grid-warning-content-medium">
                  <Typography className="grid-warning-text-medium">
                    <PaymentIcon sx={{ marginRight: "15px", color: "#b39438" }} /> Giao dịch gần đây
                  </Typography>
                  <span className="grid-warning-text-medium-sup">
                    {paymentStats.recentPayments && paymentStats.recentPayments[1]?.count}
                  </span>
                </Box> */}
                <Box className="grid-warning-content-high">
                  <Typography className="grid-warning-text-high">
                    <PaymentIcon sx={{ marginRight: "15px", color: "#d46926" }} /> Thanh toán thất bại
                  </Typography>
                  <span className="grid-warning-text-high-sup">
                    {paymentStats.failedPaymentsCount}
                  </span>
                </Box>
                <Box className="grid-warning-content-danger">
                  <Typography className="grid-warning-text-danger">
                    <PaymentIcon sx={{ marginRight: "15px", color: "#d65861" }} /> Doanh thu bị mất
                  </Typography>
                  <span className="grid-warning-text-danger-sup">
                   {totalLostRevenue + " " + "VNĐ"}
                  </span>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}