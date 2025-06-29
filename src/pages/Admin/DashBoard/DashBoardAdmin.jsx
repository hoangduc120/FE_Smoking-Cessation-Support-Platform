import { Box, Grid, Typography } from "@mui/material";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import AdjustIcon from "@mui/icons-material/Adjust";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import "./DashBoard.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDashboard } from "../../../store/slices/dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const DATA_COUNT = 3;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

// Doughnut chart data
const data = {
  labels: ["Hoàn thành", "Đang thực hiện", "Thất bại"],
  datasets: [
    {
      label: "Dataset 1",
      data: [60, 30, 10],
      backgroundColor: ["#10b982", "#3b82f6", "#ee4444"],
    },
  ],
};

// Line chart data
const dataLine = {
  labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
  datasets: [
    {
      label: "Kế hoạch mới",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "#4881ea",
      tension: 0.1,
    },
  ],
};

// Doughnut chart config
const config = {
  type: "doughnut",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Trạng thái kế hoạch",
      },
    },
  },
};

// Line chart config
const configLine = {
  type: "line",
  data: dataLine,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Xu hướng tuần",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          // text: "Số kế hoạch",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  },
};

export default function DashBoardAdmin() {
  const dispatch = useDispatch();
  const { dashboard, isLoading, isError } = useSelector(
    (state) => state.dashboard
  );

  const warningData = dashboard?.data?.plansAtRisk;

  useEffect(() => {
    dispatch(fetchDashboard());
  }, []);

  
  return (
    <Box className="dashboard">
      <Box className="dashboard-title">
        <Box className="dasboard-titleLeft">
          <Typography className="dashboard-title-text">Dashboard</Typography>
          <span className="dashboard-title-span">
            Tổng quan hệ thống QuitSmoke
          </span>
        </Box>
        <Box className="dasboard-titleRight">
          <Typography className="dasboard-titleRight-text">
            <AddModeratorIcon sx={{ marginRight: "10px" }} />
            Hệ thống ổn định
          </Typography>
        </Box>
      </Box>
      <Box className="dashboard-card">
        <Grid container spacing={2} className="dashboard-gird">
          <Grid size={3} className="dashboard-grid-plan">
            <Box className="dashboard-card-content">
              <Typography
                sx={{ color: "#4767bf", fontSize: "20px", fontWeight: "bold" }}
              >
                Tổng số kế hoạch
              </Typography>
              <span
                style={{
                  color: "#23368f",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                {dashboard?.data?.totalOngoingPlans}
              </span>
            </Box>
            <Box className="dashboard-card-icons">
              <AdjustIcon sx={{ color: "#426ad5", fontSize: "40px" }} />
            </Box>
          </Grid>
          <Grid size={3} className="dashboard-grid-user">
            <Box className="dashboard-card-content">
              <Typography
                sx={{ color: "#41ad83", fontSize: "20px", fontWeight: "bold" }}
              >
                Người dùng
              </Typography>
              <span
                style={{
                  color: "#0f5835",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                150
              </span>
            </Box>
            <Box className="dashboard-card-icons-user">
              <PeopleIcon sx={{ color: "#41ad83", fontSize: "40px" }} />
            </Box>
          </Grid>
          <Grid size={3} className="dashboard-grid-plan-percent">
            <Box className="dashboard-card-content">
              <Typography
                sx={{ color: "#926dbb", fontSize: "20px", fontWeight: "bold" }}
              >
                Tỷ lệ thành công
              </Typography>
              <span
                style={{
                  color: "#63148b",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                {dashboard?.data?.successRate}
              </span>
            </Box>
            <Box className="dashboard-card-icons-percent">
              <TrendingUpIcon sx={{ color: "#926dbb", fontSize: "40px" }} />
            </Box>
          </Grid>
          <Grid size={3} className="dashboard-grid-plan-today">
            <Box className="dashboard-card-content">
              <Typography
                sx={{ color: "#f69037", fontSize: "20px", fontWeight: "bold" }}
              >
                Hoạt động hôm nay
              </Typography>
              <span
                style={{
                  color: "#7e2d11",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                150
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
                Trạng thái kế hoạch
              </Typography>
              <span style={{ color: "#9c9797", fontSize: "20px" }}>
                Phân bổ các kế hoạch cai thuốc
              </span>
            </Box>
            <Box
              sx={{
                width: "300px",
                height: "300px",
                marginLeft: "17%",
                marginTop: "30px",
              }}
            >
              <Doughnut data={data} options={config.options} />
            </Box>
          </Grid>
          <Grid item size={6} className="chart-right">
            <Box className="chart-title">
              <Typography sx={{ fontSize: "30px" }}>Xu hướng tuần</Typography>
              <span style={{ color: "#9c9797", fontSize: "20px" }}>
                Kế hoạch mới trong 7 ngày qua
              </span>
            </Box>
            <Box
              sx={{
                width: "400px",
                height: "300px",
                marginLeft: "5%",
                marginTop: "30px",
              }}
            >
              <Line data={dataLine} options={configLine.options} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="dashboard-progress" sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item size={6} className="chart-right">
            <Box className="dashboard-card-content">
              <Typography sx={{ fontSize: "30px" }}>
                Tiến độ hệ thống
              </Typography>
              <Typography sx={{ color: "#9c9797", fontSize: "20px" }}>
                Các chỉ số quan trọng
              </Typography>
              <div className="progress-item">
                <Typography className="progress-label">
                  Kế hoạch hoàn thành{" "}
                  <span className="progress-value">
                    {dashboard?.data?.completedPlans}/
                    {dashboard?.data?.totalOngoingPlans}
                  </span>
                </Typography>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "53.33%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="progress-item">
                <Typography className="progress-label">
                  Người dùng hoạt động{" "}
                  <span className="progress-value">120/300</span>
                </Typography>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="progress-item">
                <Typography className="progress-label">
                  Tỷ thành công <span className="progress-value">76.2%</span>
                </Typography>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "76.2%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Box>
          </Grid>
          <Grid item size={6} className="chart-right">
            <Box className="dashboard-card-content" sx={{ padding: 2 }}>
              <Typography sx={{ fontSize: "30px" }}>Cảnh báo rủi ro</Typography>
              <Typography sx={{ color: "#9c9797", fontSize: "20px" }}>
                Kế hoạch cần theo dõi
              </Typography>

              <Box className="grid-warning">
                <Box className="grid-warning-content-low">
                  <Typography className="grid-warning-text-low">
                    <AddTaskIcon
                      sx={{ marginRight: "15px", color: "#3e8f5c" }}
                    />{" "}
                    Rủi ro thấp{" "}
                  </Typography>
                  <span className="grid-warning-text-low-sup "> 10</span>
                </Box>
                <Box className="grid-warning-content-medium">
                  <Typography className="grid-warning-text-medium">
                    <ErrorIcon sx={{ marginRight: "15px", color: "#b39438" }} />{" "}
                    Rủi ro trung bình{" "}
                  </Typography>
                  <span className="grid-warning-text-medium-sup "> 10</span>
                </Box>
                <Box className="grid-warning-content-high">
                  <Typography className="grid-warning-text-high">
                    <PriorityHighIcon
                      sx={{ marginRight: "15px", color: "#d46926" }}
                    />{" "}
                    Rủi ro trung cao{" "}
                  </Typography>
                  <span className="grid-warning-text-high-sup "> 10</span>
                </Box>
                <Box className="grid-warning-content-danger">
                  <Typography className="grid-warning-text-danger">
                    <WarningIcon
                      sx={{ marginRight: "15px", color: "#d65861" }}
                    />{" "}
                    Nguy Cấp{" "}
                  </Typography>
                  <span className="grid-warning-text-danger-sup "> 10</span>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
