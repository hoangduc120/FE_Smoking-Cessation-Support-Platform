import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Tabs,
  Tab,
  Box,
  Badge,
  Grid,
  Checkbox,
  LinearProgress,
} from "@mui/material";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Medal,
  Trophy,
  Users,
} from "lucide-react";
import "./Roadmap.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlanCurrent } from "../../../store/slices/planeSlice";

// Hardcode data for sections not provided by API
const hardcodedData = {
  todayTasks: [
    { id: 1, title: "Giảm xuống còn 5 điếu", completed: false },
    { id: 2, title: "Uống 2L nước", completed: true },
    { id: 3, title: "Tập thể dục 15 phút", completed: false },
    { id: 4, title: "Ghi lại cảm xúc", completed: false },
  ],
  recentAchievements: [
    { id: 1, title: "Hoàn thành 1 tuần giảm dần", date: "24/05/2025" },
    { id: 2, title: "Tiết kiệm 350.000đ", date: "25/05/2025" },
  ],
  savings: 350000,
  healthImprovement: 15,
  daysWithoutSmoking: 0,
  cravingsManaged: 24,
};

const Roadmap = () => {
  const [tabValue, setTabValue] = useState("community");
  const dispatch = useDispatch();
  const { plan, stages, isLoading, isError, errorMessage } = useSelector(
    (state) => state.plan
  );

  console.log("Redux state:", {
    plan,
    stages,
    isLoading,
    isError,
    errorMessage,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    console.log("Dispatching fetchPlanCurrent");
    dispatch(fetchPlanCurrent());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Lỗi: {errorMessage}</Typography>;
  }

  if (!plan || !stages || stages.length === 0) {
    return (
      <Typography>
        Bạn chưa có kế hoạch nào. Hãy bắt đầu hành trình cai thuốc lá!
        <Button
          component={Link}
          to="/create-plan"
          variant="contained"
          sx={{ mt: 2, background: "black", color: "white" }}
        >
          Tạo kế hoạch mới
        </Button>
      </Typography>
    );
  }

  // Calculate progress based on completed stages
  const totalStages = stages.length;
  const completedStages = stages.filter((stage) => stage.completed).length;
  const progress = Math.round((completedStages / totalStages) * 100);

  // Determine current stage
  const currentStage = stages.find((stage) => !stage.completed) || stages[0];
  const currentStageIndex =
    stages.findIndex((stage) => stage._id === currentStage._id) + 1;

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate remaining days
  const calculateRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="roadMap-container">
      <div className="roadMap-header">
        <div>
          <Typography variant="h4" className="roadMap-title">
            Lộ trình của tôi
          </Typography>
          <Typography variant="body2" className="roadMap-subtitle">
            Theo dõi và quản lý hành trình cai thuốc lá của bạn
          </Typography>
        </div>
        <div className="roadMap-header-actions">
          <Button
            variant="contained"
            className="roadMap-action-button"
            sx={{ background: "black" }}
          >
            <Link
              style={{
                textDecorationLine: "none",
                color: "white",
                border: "none",
              }}
              to={`/member/my-roadmap/stage/${currentStageIndex}`}
            >
              Giai đoạn hiện tại
            </Link>
          </Button>
        </div>
      </div>

      <Card className="roadMap-overview-card">
        <CardHeader
          title={
            <div className="roadMap-card-header-content">
              <div>
                <Typography variant="h5" className="roadMap-card-title">
                  {plan.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="roadMap-card-description"
                >
                  <Users size={16} className="roadMap-icon" /> Coach:{" "}
                  <Typography className="roadMap-coach-link">
                    {plan.coachId.email}
                  </Typography>
                </Typography>
              </div>
              <div className="roadMap-card-badges">
                <Badge color="secondary" className="roadMap-badge">
                  <CalendarDays size={12} className="roadMap-icon" />{" "}
                  {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                </Badge>
                <Badge color="secondary" className="roadMap-badge">
                  <Clock size={12} className="roadMap-icon" /> Còn lại:{" "}
                  {calculateRemainingDays(plan.endDate)} ngày
                </Badge>
              </div>
            </div>
          }
          className="roadMap-card-header"
        />
        <CardContent className="roadMap-card-content">
          <div className="roadMap-progress-section">
            <div className="roadMap-progress-header">
              <span>Tiến độ tổng thể</span>
              <span>{progress}%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={progress}
              className="roadMap-progress-bar"
            />
          </div>
          <div className="roadMap-timeline">
            <div className="roadMap-timeline-markers">
              {stages.map((stage, index) => (
                <div key={stage._id} className="roadMap-timeline-marker">
                  <div
                    className={`roadMap-timeline-circle ${
                      stage.completed
                        ? "roadMap-timeline-completed"
                        : stage._id === currentStage._id
                          ? "roadMap-timeline-current"
                          : "roadMap-timeline-pending"
                    }`}
                  >
                    {stage.completed ? (
                      <CheckCircle2 size={16} color="white" />
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="roadMap-timeline-line"></div>
            <div
              className="roadMap-timeline-progress"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="roadMap-timeline-labels">
              {stages.map((stage, index) => (
                <div key={stage._id} className="roadMap-timeline-label">
                  <Link
                    to={`/member/my-roadmap/stage/${index + 1}`}
                    className={`roadMap-timeline-link ${
                      stage._id === currentStage._id
                        ? "roadMap-timeline-current"
                        : ""
                    }`}
                  >
                    {stage.stage_name}
                  </Link>
                  <span className="roadMap-timeline-duration">
                    {stage.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardActions className="roadMap-card-footer">
          <div className="roadMap-footer-left">
            <Badge color="primary" className="roadMap-badge">
              Giai đoạn {currentStageIndex}/{totalStages}
            </Badge>
            <span>{currentStage.stage_name}</span>
          </div>
          <div className="roadMap-footer-actions">
            <Button
              variant="outlined"
              size="small"
              className="roadMap-action-button"
            >
              <Link
                to="/stats"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FileText size={16} className="roadMap-icon-btn" /> Thống kê
              </Link>
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="roadMap-action-button"
              sx={{ marginLeft: "10px" }}
            >
              <Link
                to="/member/my-roadmap/achievements"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trophy size={16} className="roadMap-icon-btn" /> Thành tựu
              </Link>
            </Button>
          </div>
        </CardActions>
      </Card>

      <Box className="roadMap-card-container">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }} sx={{ lineHeight: "66px" }}>
            <Card className="roadMap-card">
              <CardHeader
                title="Nhiệm vụ hôm nay"
                subheader="Hoàn thành các nhiệm vụ để tiến gần hơn đến mục tiêu"
              />
              <CardContent>
                {hardcodedData.todayTasks.map((task) => (
                  <div key={task.id} className="roadMap-task-item">
                    <Checkbox checked={task.completed} id={`task-${task.id}`} />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`roadMap-task-label ${task.completed ? "roadMap-task-completed" : ""}`}
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: "black", color: "white" }}
                >
                  Cập nhật tiến độ
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="roadMap-card">
              <CardHeader
                title={
                  <Typography variant="h6" className="roadMap-card-title-small">
                    <Trophy
                      size={16}
                      color="#eab308"
                      className="roadMap-icon"
                    />{" "}
                    Thành tựu gần đây
                  </Typography>
                }
              />
              <CardContent>
                {hardcodedData.recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="roadMap-achievement-item"
                  >
                    <div className="roadMap-achievement-content">
                      <Medal
                        size={16}
                        color="#eab308"
                        className="roadMap-icon"
                      />
                      <span>{achievement.title}</span>
                    </div>
                    <span className="roadMap-achievement-date">
                      {achievement.date}
                    </span>
                  </div>
                ))}
              </CardContent>
              <CardActions>
                <Button variant="text" size="small" fullWidth>
                  <Link
                    to="/member/my-roadmap/achievements"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      color: "#6f7583",
                    }}
                  >
                    Xem tất cả{" "}
                    <ChevronRight size={16} className="roadMap-icon" />
                  </Link>
                </Button>
              </CardActions>
            </Card>
            <Card className="roadMap-card" sx={{ marginTop: "20px" }}>
              <CardHeader
                title={
                  <Typography variant="h6" className="roadMap-card-title-small">
                    Thống kê nhanh
                  </Typography>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {[
                    {
                      value: hardcodedData.savings.toLocaleString() + "đ",
                      label: "Tiết kiệm",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                    {
                      value: `+${hardcodedData.healthImprovement}%`,
                      label: "Sức khỏe",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                    {
                      value: hardcodedData.daysWithoutSmoking,
                      label: "Ngày không hút",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                    {
                      value: hardcodedData.cravingsManaged,
                      label: "Cơn thèm đã vượt qua",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                  ].map((stat, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <div
                        className="roadMap-stat-item"
                        style={{
                          backgroundColor: stat.bg,
                          borderColor: stat.bg,
                        }}
                      >
                        <Typography variant="h5" style={{ color: stat.color }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption">{stat.label}</Typography>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <CardActions>
                <Button variant="text" size="small" fullWidth>
                  <Link
                    to="/stats"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      color: "#6f7583",
                    }}
                  >
                    Xem chi tiết{" "}
                    <ChevronRight size={16} className="roadMap-icon" />
                  </Link>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginTop: "40px" }}>
        <Card className="roadMap-card" sx={{ width: "100%" }}>
          <CardHeader title="Hỗ trợ & Tài nguyên" />
          <CardContent>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              className="roadMap-tabs"
            >
              <Tab
                value="community"
                label="Cộng đồng"
                className="roadMap-tab"
              />
              <Tab
                value="emergency"
                label="Hỗ trợ khẩn cấp"
                className="roadMap-tab"
              />
            </Tabs>
            {tabValue === "community" && (
              <Box className="roadMap-tab-content">
                <div className="roadMap-community-card">
                  <Typography variant="h6">Cộng đồng hỗ trợ</Typography>
                  <Typography variant="body2">
                    Kết nối với những người khác đang trong hành trình cai thuốc
                    lá
                  </Typography>
                  <div className="roadMap-community-actions">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "black",
                        border: "1px solid #e7e7e7",
                        textTransform: "none",
                      }}
                    >
                      Tham gia nhóm chat
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "black",
                        border: "1px solid #e7e7e7",
                        textTransform: "none",
                      }}
                    >
                      Diễn đàn
                    </Button>
                  </div>
                </div>
              </Box>
            )}
            {tabValue === "emergency" && (
              <Box className="roadMap-tab-content">
                <div className="roadMap-emergency-card">
                  <Typography variant="h6" color="error">
                    Hỗ trợ khẩn cấp
                  </Typography>
                  <Typography variant="body2">
                    Khi bạn cảm thấy không thể kiểm soát cơn thèm thuốc
                  </Typography>
                  <div className="roadMap-emergency-actions">
                    <Button variant="contained" color="error">
                      Gọi hỗ trợ ngay
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "black",
                        border: "1px solid #e7e7e7",
                        textTransform: "none",
                      }}
                    >
                      Nhắn với huấn luyện viên
                    </Button>
                  </div>
                </div>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Roadmap;
