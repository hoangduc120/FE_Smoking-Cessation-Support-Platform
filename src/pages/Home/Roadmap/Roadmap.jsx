import React, { useState } from "react";
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

const Roadmap = () => {
  const [tabValue, setTabValue] = useState("community");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const roadmapData = {
    id: "roadmap-123",
    title: "Cai thuốc lá trong 90 ngày",
    coach: "Nguyễn Văn A",
    coachId: "coach-123",
    progress: 35,
    startDate: "01/05/2025",
    endDate: "30/07/2025",
    currentStage: 2,
    totalStages: 5,
    stages: [
      { id: 1, title: "Chuẩn bị", completed: true, duration: "14 ngày" },
      {
        id: 2,
        title: "Giảm dần",
        completed: false,
        duration: "21 ngày",
        current: true,
      },
      { id: 3, title: "Ngừng hoàn toàn", completed: false, duration: "7 ngày" },
      { id: 4, title: "Duy trì", completed: false, duration: "30 ngày" },
      { id: 5, title: "Củng cố", completed: false, duration: "18 ngày" },
    ],
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
            sx={{
              background: "black",
            }}
          >
            <Link
              style={{
                textDecorationLine: "none",
                color: "white",
                border: "none",
              }}
              to={`/member/my-roadmap/stage/${roadmapData.currentStage}`}
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
                  {roadmapData.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="roadMap-card-description"
                >
                  <Users size={16} className="roadMap-icon" /> Coach:{" "}
                  <Typography className="roadMap-coach-link">
                    {roadmapData.coach}
                  </Typography>
                </Typography>
              </div>
              <div className="roadMap-card-badges">
                <Badge color="secondary" className="roadMap-badge">
                  <CalendarDays size={12} className="roadMap-icon" />{" "}
                  {roadmapData.startDate} - {roadmapData.endDate}
                </Badge>
                <Badge color="secondary" className="roadMap-badge">
                  <Clock size={12} className="roadMap-icon" /> Còn lại: 65 ngày
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
              <span>{roadmapData.progress}%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={roadmapData.progress}
              className="roadMap-progress-bar"
            />
          </div>
          <div className="roadMap-timeline">
            <div className="roadMap-timeline-markers">
              {roadmapData.stages.map((stage) => (
                <div key={stage.id} className="roadMap-timeline-marker">
                  <div
                    className={`roadMap-timeline-circle ${
                      stage.completed
                        ? "roadMap-timeline-completed"
                        : stage.current
                          ? "roadMap-timeline-current"
                          : "roadMap-timeline-pending"
                    }`}
                  >
                    {stage.completed ? (
                      <CheckCircle2 size={16} color="white" />
                    ) : (
                      stage.id
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="roadMap-timeline-line"></div>
            <div
              className="roadMap-timeline-progress"
              style={{ width: `${roadmapData.progress}%` }}
            ></div>
            <div className="roadMap-timeline-labels">
              {roadmapData.stages.map((stage) => (
                <div key={stage.id} className="roadMap-timeline-label">
                  <Link
                    to={`/member/my-roadmap/stage/${stage.id}`}
                    className={`roadMap-timeline-link ${stage.current ? "roadMap-timeline-current" : ""}`}
                  >
                    {stage.title}
                  </Link>
                  <span className="roadMap-timeline-duration">
                    {stage.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardActions className="roadMap-card-footer">
          <div className="roadMap-footer-left">
            <Badge color="primary" className="roadMap-badge">
              Giai đoạn {roadmapData.currentStage}/{roadmapData.totalStages}
            </Badge>
            <span>{roadmapData.stages.find((s) => s.current)?.title}</span>
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
                {roadmapData.todayTasks.map((task) => (
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
                {roadmapData.recentAchievements.map((achievement) => (
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
                      value: roadmapData.savings.toLocaleString() + "đ",
                      label: "Tiết kiệm",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                    {
                      value: `+${roadmapData.healthImprovement}%`,
                      label: "Sức khỏe",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                    {
                      value: roadmapData.daysWithoutSmoking,
                      label: "Ngày không hút",
                      color: "#3d7433",
                      bg: "#e6f4e4",
                    },
                    {
                      value: roadmapData.cravingsManaged,
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
