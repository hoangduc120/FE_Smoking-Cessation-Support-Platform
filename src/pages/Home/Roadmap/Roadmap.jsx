import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  LinearProgress,
  TextField,
  Collapse,
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { fetchPlanCurrent, completeQuitPlan, failQuitPlan } from "../../../store/slices/planeSlice";
import { createQuitProgree } from "../../../store/slices/progressSlice";
import { completeStageApi } from "../../../store/slices/stagesSlice";
import Loading from "../../../components/Loading/Loading";
import { infoCompleteQuitPlan } from "../../../store/slices/planeSlice";

// Hardcode data for sections not provided by API
const hardcodedData = {
  recentAchievements: [
    { id: 1, title: "Hoàn thành 1 tuần giảm dần", date: "24/05/2025" },
    { id: 2, title: "Tiết kiệm 350.000đ", date: "25/05/2025" },
  ],
  savings: 350000,
  healthImprovement: 15,
  daysWithoutSmoking: 0,
  cravingsManaged: 24,
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  cigarettesSmoked: Yup.number()
    .typeError("Số điếu thuốc phải là số")
    .required("Số điếu thuốc là bắt buộc")
    .min(0, "Số điếu thuốc không được âm"),
  healthStatus: Yup.string()
    .required("Trạng thái sức khỏe là bắt buộc")
    .trim()
    .min(1, "Trạng thái sức khỏe không được để trống"),
  notes: Yup.string().nullable(),
});

const Roadmap = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("community");
  const [updateFormOpen, setUpdateFormOpen] = useState({});
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // YYYY-MM-DD
  const dispatch = useDispatch();
  const { plan, stages, progress, isLoading, isError, errorMessage } =
    useSelector((state) => state.plan);



  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      cigarettesSmoked: "",
      healthStatus: "",
      notes: "",
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleUpdateForm = (stageId) => {
    setUpdateFormOpen((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
    reset(); // Reset form khi mở/đóng
  };

  const onSubmit = (data, stageId) => {
    const payload = {
      stageId,
      date: new Date().toISOString(),
      cigarettesSmoked: parseInt(data.cigarettesSmoked) || 0,
      healthStatus: data.healthStatus,
      notes: data.notes || "",
    };
    dispatch(createQuitProgree(payload)).then(() => {
      dispatch(fetchPlanCurrent());
      reset();
      setUpdateFormOpen((prev) => ({ ...prev, [stageId]: false }));
    });
  };

  // Kiểm tra ngày mới để reset form và đóng form mở
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date().toISOString().split("T")[0];
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
        reset();
        setUpdateFormOpen({});
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentDate, reset]);

  // Thêm useEffect để kiểm tra và cập nhật trạng thái của từng stage
  useEffect(() => {
    const checkAndUpdateStages = async () => {
      if (plan && stages && stages.length > 0) {
        try {
          let hasUpdates = false;
          // Kiểm tra từng stage
          for (const stage of stages) {
            // Nếu stage chưa hoàn thành và có đủ điều kiện hoàn thành
            if (!stage.completed && stage.progress >= 100) {
          
              await dispatch(completeStageApi({ id: stage._id })).unwrap();
              hasUpdates = true;
            }
          }

          // Chỉ kiểm tra trạng thái plan nếu có cập nhật stage
          if (hasUpdates) {
            const allStagesCompleted = stages.every((stage) => stage.completed);
            const hasFailedStages = stages.some((stage) => stage.status === "failed");

            if (allStagesCompleted && plan.status === "ongoing") {
           
              const result = await dispatch(completeQuitPlan({ planId: plan._id })).unwrap();
              if (result?.status === 200) {
                // Sau khi hoàn thành kế hoạch, kiểm tra trạng thái
                await checkPlanStatus();
                return;
              }
            } else if (hasFailedStages && plan.status === "ongoing") {
          
              const result = await dispatch(failQuitPlan({ planId: plan._id })).unwrap();
              if (result?.status === 200) {
                // Sau khi đánh dấu thất bại, kiểm tra trạng thái
                await checkPlanStatus();
                return;
              }
            }
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
        }
      }
    };

    checkAndUpdateStages();
  }, [plan, stages, dispatch, navigate]);

  const checkPlanStatus = async () => {
    try {
      if (!plan?._id) return;

      const completionInfo = await dispatch(infoCompleteQuitPlan({ planId: plan._id })).unwrap();

      
      if (completionInfo?.data?.plan?.status === "completed") {
        navigate(`/successPlanResult?status=success&planId=${plan._id}`);
        return;
      } else if (completionInfo?.data?.plan?.status === "failed") {
        navigate(`/failedPlanResult?status=failed&planId=${plan._id}`);
        return;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái kế hoạch:", error);
    }
  };

  // Thêm useEffect để tự động kiểm tra trạng thái kế hoạch định kỳ
  useEffect(() => {
    let isMounted = true;
    let checkInterval;

    const startChecking = async () => {
      if (plan?._id) {
        // Kiểm tra ngay lập tức
        await checkPlanStatus();

        // Thiết lập interval kiểm tra mỗi 3 giây
        checkInterval = setInterval(async () => {
          if (isMounted) {
            await checkPlanStatus();
          }
        }, 3000); 
      }
    };

    startChecking();

    // Cleanup function
    return () => {
      isMounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [plan?._id]); 

  // Giữ lại useEffect để fetch dữ liệu ban đầu
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Lấy kế hoạch hiện tại
        const result = await dispatch(fetchPlanCurrent()).unwrap();
   
        
        if (!isMounted) return;

        // Nếu có kế hoạch đang diễn ra
        if (result?.data?.plan) {
          if (result.data.plan.status === "completed") {
            navigate(`/successPlanResult?status=success&planId=${result.data.plan._id}`);
            return;
          } else if (result.data.plan.status === "failed") {
            navigate(`/failedPlanResult?status=failed&planId=${result.data.plan._id}`);
            return;
          }
        } 
        // Nếu có kế hoạch từ selectPlan
        else if (result?.data?.quitPlan) {
          if (result.data.quitPlan.status === "completed") {
            navigate(`/successPlanResult?status=success&planId=${result.data.quitPlan._id}`);
            return;
          } else if (result.data.quitPlan.status === "failed") {
            navigate(`/failedPlanResult?status=failed&planId=${result.data.quitPlan._id}`);
            return;
          }
        }
        // Nếu không có kế hoạch đang diễn ra, kiểm tra thông tin hoàn thành
        else {
          // Lấy planId từ localStorage hoặc state
          const lastPlanId = localStorage.getItem('lastPlanId');
          if (lastPlanId) {
            const completionInfo = await dispatch(infoCompleteQuitPlan({ planId: lastPlanId })).unwrap();
      
            
            if (completionInfo?.data?.plan?.status === "completed") {
              navigate(`/successPlanResult?status=success&planId=${lastPlanId}`);
              return;
            } else if (completionInfo?.data?.plan?.status === "failed") {
              navigate(`/failedPlanResult?status=failed&planId=${lastPlanId}`);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  // Thêm useEffect để lưu planId vào localStorage khi có thay đổi
  useEffect(() => {
    if (plan?._id) {
      localStorage.setItem('lastPlanId', plan._id);
    }
  }, [plan?._id]);

  if (isLoading) {
    return <Typography><Loading/></Typography>;
  }

  if (isError) {
    return <Typography color="error">Lỗi: {errorMessage}</Typography>;
  }

  // Kiểm tra cả plan và plan.quitPlan
  if (!plan && !plan?.quitPlan) {
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
const totalStages = Array.isArray(stages) ? stages.length : 0;
const completedStages = Array.isArray(stages)
  ? stages.filter((stage) => stage?.completed)?.length
  : 0;
const overallProgress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

// Determine current stage
const currentStage = Array.isArray(stages) && stages.length > 0
  ? stages.find((stage) => !stage.completed) || stages[0]
  : null;
const currentStageIndex = currentStage && Array.isArray(stages)
  ? stages.findIndex((stage) => stage._id === currentStage._id) + 1
  : 1;

// Check if stage 1 is completed
const isStage1Completed = Array.isArray(stages) && stages.length > 0 && stages[0]?.completed || false;

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

  // Lọc progress chỉ hiển thị của ngày hiện tại
  const filterTodayProgress = (progressItems) => {
    return progressItems.filter((p) => {
      const progressDate = new Date(p.date).toISOString().split("T")[0];
      return progressDate === currentDate;
    });
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
                  {plan?.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="roadMap-card-description"
                >
                  <Users size={16} className="roadMap-icon" /> Coach:{" "}
                  <Typography className="roadMap-coach-link">
                    {plan?.coachId?.email}
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
              <span>{overallProgress}%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              className="roadMap-progress-bar"
            />
          </div>
          <div className="roadMap-timeline">
         <div className="roadMap-timeline-markers">
  {Array.isArray(stages) && stages.length > 0 ? (
    stages.map((stage, index) => (
      <div key={stage._id} className="roadMap-timeline-marker">
        <div
          className={`roadMap-timeline-circle ${
            stage.completed
              ? "roadMap-timeline-completed"
              : stage._id === currentStage?._id
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
    ))
  ) : (
    <Typography>Không có giai đoạn nào.</Typography>
  )}
</div>
            <div className="roadMap-timeline-line"></div>
            <div
              className="roadMap-timeline-progress"
              style={{ width: `${overallProgress}%` }}
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
            <span>{currentStage?.stage_name}</span>
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

      <Box className="roadMap-card-container" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }} sx={{ lineHeight: "66px" }}>
            {stages.map((stage, index) => {
              const isDisabled = index > 0 && !isStage1Completed;
              // Lọc progress chỉ cho ngày hiện tại
              const stageProgress = filterTodayProgress(
                progress?.filter((p) => p.stageId === stage._id) || []
              );
              return (
                <Card key={stage._id} className="roadMap-card" sx={{ mb: 2 }}>
                  <CardHeader
                    title={
                      <Typography variant="h6">
                        <span
                          style={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            color: "#1c9f47",
                          }}
                        >
                          {stage.stage_name}
                        </span>
                        : {stage.description}
                      </Typography>
                    }
                    subheader="Hoàn thành các nhiệm vụ để tiến gần hơn đến mục tiêu"
                  />
                  <CardContent>
                    {stageProgress.length > 0 && (
                      <Box
                        className="roadMap-history"
                        sx={{
                          mt: 3,
                        }}
                      >
                        <Typography
                          variant="h6"
                          className="roadMap-progress-history-title"
                          sx={{ mb: 2 }}
                        >
                          Lịch sử cập nhật hôm nay
                        </Typography>
                        {stageProgress.map((prog) => (
                          <Card
                            key={prog._id}
                            className="roadMap-progress-card"
                            sx={{ mb: 2 }}
                          >
                            <CardContent className="roadMap-progress-content">
                              <Typography
                                variant="subtitle1"
                                className="roadMap-progress-date"
                              >
                                Ngày: {formatDate(prog.date)}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <Typography
                                    variant="body2"
                                    className="roadMap-progress-item"
                                  >
                                    <strong>Số điếu thuốc:</strong>{" "}
                                    {prog.cigarettesSmoked}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Typography
                                    variant="body2"
                                    className="roadMap-progress-item"
                                  >
                                    <strong>Sức khỏe:</strong>{" "}
                                    {prog.healthStatus}
                                  </Typography>
                                </Grid>
                                {prog.notes && (
                                  <Grid item xs={12} sm={4}>
                                    <Typography
                                      variant="body2"
                                      className="roadMap-progress-item roadMap-progress-notes"
                                    >
                                      <strong>Ghi chú:</strong> {prog.notes}
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                    <Collapse in={updateFormOpen[stage._id]}>
                      <Box
                        component="form"
                        onSubmit={handleSubmit((data) =>
                          onSubmit(data, stage._id)
                        )}
                        sx={{ mt: 2 }}
                      >
                        <TextField
                          label="Ngày cập nhật"
                          value={currentDate}
                          fullWidth
                          disabled
                          sx={{ mb: 2 }}
                        />
                        <Controller
                          name="cigarettesSmoked"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Số điếu thuốc đã hút"
                              type="number"
                              fullWidth
                              disabled={isDisabled}
                              error={!!errors.cigarettesSmoked}
                              helperText={errors.cigarettesSmoked?.message}
                              sx={{ mb: 2 }}
                            />
                          )}
                        />
                        <Controller
                          name="healthStatus"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Trạng thái sức khỏe"
                              fullWidth
                              disabled={isDisabled}
                              error={!!errors.healthStatus}
                              helperText={errors.healthStatus?.message}
                              sx={{ mb: 2 }}
                            />
                          )}
                        />
                        <Controller
                          name="notes"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Ghi chú"
                              multiline
                              rows={3}
                              fullWidth
                              disabled={isDisabled}
                              error={!!errors.notes}
                              helperText={errors.notes?.message}
                              sx={{ mb: 2 }}
                            />
                          )}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{ mt: 1, backgroundColor: "green" }}
                          disabled={isDisabled}
                        >
                          Gửi cập nhật
                        </Button>
                      </Box>
                    </Collapse>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ backgroundColor: "black", color: "white" }}
                      onClick={() => toggleUpdateForm(stage._id)}
                      disabled={isDisabled}
                    >
                      {updateFormOpen[stage._id]
                        ? "Ẩn biểu mẫu"
                        : "Cập nhật tình trạng"}
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
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
