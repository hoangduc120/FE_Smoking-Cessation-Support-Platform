import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Flag as TargetIcon,
} from "@mui/icons-material";
import "./PlanCustomization.css";
import { fetchAssessment } from "../../../store/slices/quitSmokingSlice";

function PlanCustomizationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentData, isLoading, isError, errorMessage } = useSelector(
    (state) => state.quitSmoking
  );
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const [snackbar, setSnackbar] = useState({
    open: false,
    title: "",
    description: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchAssessment("1"));
  }, [dispatch]);

  const [planData, setPlanData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date.toISOString().split("T")[0];
    })(),
    approach: assessmentData?.PreferredApproach || "gradual",
    initialReductionPercent: 25,
    weeklyReductionPercent: 15,
    dailyGoals: assessmentData?.CigarettesPerDay
      ? [
          Math.round(assessmentData.CigarettesPerDay * 0.75),
          Math.round(assessmentData.CigarettesPerDay * 0.65),
          Math.round(assessmentData.CigarettesPerDay * 0.55),
          Math.round(assessmentData.CigarettesPerDay * 0.45),
          Math.round(assessmentData.CigarettesPerDay * 0.35),
          Math.round(assessmentData.CigarettesPerDay * 0.25),
          Math.round(assessmentData.CigarettesPerDay * 0.15),
          0,
        ]
      : [12, 10, 8, 6, 5, 3, 2, 0],
    triggers: assessmentData?.RelapseTriggers || [
      "afterMeals",
      "withCoffee",
      "stress",
      "socialGatherings",
    ],
    alternativeActivities: [
      "walking",
      "drinking water",
      "deep breathing",
      "chewing gum",
    ],
    supportMethods: assessmentData?.QuitMethods || [
      "nicotineGum",
      "app",
      "coaching",
    ],
    reminders: true,
    reminderFrequency: "daily",
    reminderTime: "20:00",
  });

  const updatePlanData = (field, value) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
      setPlanSaved(true);
      setSnackbar({
        open: true,
        title: "Kế hoạch đã được lưu",
        description: "Kế hoạch cai thuốc của bạn đã được lưu thành công.",
        severity: "success",
      });
      setTimeout(() => navigate("/coachPlan"), 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu kế hoạch. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="plan-container">
        <Alert severity="error">
          <Typography variant="h6">Lỗi</Typography>
          <Typography>
            {errorMessage || "Không thể tải dữ liệu đánh giá."}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!assessmentData) {
    return (
      <Box className="plan-container">
        <Alert severity="warning">
          <Typography variant="h6">Không tìm thấy dữ liệu</Typography>
          <Typography>
            Vui lòng hoàn thành đánh giá trước khi tùy chỉnh kế hoạch.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/assessment")}
            className="mt-4"
          >
            Quay lại trang đánh giá
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="plan-container">
      <Box className="plan-content">
        <Box className="plan-header">
          <Box>
            <Typography variant="h4" className="plan-title">
              Tùy chỉnh kế hoạch cai thuốc
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Dựa trên đánh giá của bạn, chúng tôi đã tạo một kế hoạch cai
              thuốc. Hãy tùy chỉnh theo nhu cầu của bạn.
            </Typography>
          </Box>
          <Box className="plan-header-buttons">
            {isEditing ? (
              <Button
                variant="contained"
                color="success"
                startIcon={
                  isSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={handleSavePlan}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Lưu kế hoạch"}
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa kế hoạch
              </Button>
            )}
          </Box>
        </Box>

        {planSaved && !isEditing && (
          <Alert
            icon={<CheckCircleIcon />}
            severity="success"
            className="plan-alert"
          >
            <Typography variant="h6">
              Kế hoạch cai thuốc đã được lưu!
            </Typography>
            <Typography>
              Bây giờ bạn có thể xem các kế hoạch từ huấn luyện viên.
            </Typography>
          </Alert>
        )}

        <Alert icon={<InfoIcon />} severity="info" className="plan-alert">
          <Typography variant="h6">
            Kế hoạch được tạo dựa trên đánh giá của bạn
          </Typography>
          <Typography>
            Chúng tôi đã tạo kế hoạch cai thuốc dựa trên thông tin bạn cung cấp.
          </Typography>
        </Alert>

        <Tabs value={tabValue} onChange={handleTabChange} className="plan-tabs">
          <Tab label="Tổng quan" value="overview" />
          <Tab label="Lịch trình" value="schedule" />
          <Tab label="Chiến lược" value="strategies" />
          <Tab label="Hỗ trợ" value="support" />
        </Tabs>

        {tabValue === "overview" && (
          <Card className="plan-card">
            <CardHeader
              title="Tổng quan kế hoạch"
              subheader="Thông tin cơ bản về kế hoạch cai thuốc của bạn"
            />
            <CardContent>
              <Box className="plan-grid">
                <Box className="plan-grid-item">
                  <Typography variant="h6">Thông tin cơ bản</Typography>
                  <Box className="plan-section">
                    <TextField
                      label="Ngày bắt đầu"
                      type="date"
                      value={planData.startDate}
                      onChange={(e) =>
                        updatePlanData("startDate", e.target.value)
                      }
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Dự kiến hoàn thành"
                      type="date"
                      value={planData.endDate}
                      onChange={(e) =>
                        updatePlanData("endDate", e.target.value)
                      }
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControl
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    >
                      <InputLabel>Phương pháp cai thuốc</InputLabel>
                      <Select
                        value={planData.approach}
                        onChange={(e) =>
                          updatePlanData("approach", e.target.value)
                        }
                        label="Phương pháp cai thuốc"
                      >
                        <MenuItem value="cold-turkey">
                          Cai thuốc hoàn toàn (Cold Turkey)
                        </MenuItem>
                        <MenuItem value="gradual">Giảm dần số lượng</MenuItem>
                        <MenuItem value="nrt">
                          Liệu pháp thay thế nicotine (NRT)
                        </MenuItem>
                        <MenuItem value="medication">
                          Sử dụng thuốc kê đơn
                        </MenuItem>
                        <MenuItem value="combination">
                          Kết hợp nhiều phương pháp
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography variant="h6" className="mt-4">
                    Thói quen hút thuốc hiện tại
                  </Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Số điếu mỗi ngày:
                      </Typography>
                      <Typography variant="body2">
                        {assessmentData?.CigarettesPerDay ?? "Chưa có dữ liệu"}{" "}
                        điếu
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Thời gian hút thuốc:
                      </Typography>
                      <Typography variant="body2">
                        {assessmentData?.SmokingYears ?? "Chưa có dữ liệu"} năm
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Giá một bao thuốc:
                      </Typography>
                      <Typography variant="body2">
                        {typeof assessmentData?.CigarettePrice === "number"
                          ? assessmentData.CigarettePrice.toLocaleString() +
                            " đ"
                          : "Chưa có dữ liệu"}
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Chi phí hàng tháng:
                      </Typography>
                      <Typography variant="body2">
                        {typeof assessmentData?.CigarettesPerDay === "number" &&
                        typeof assessmentData?.CigarettePrice === "number"
                          ? Math.round(
                              (assessmentData.CigarettesPerDay / 20) *
                                assessmentData.CigarettePrice *
                                30
                            ).toLocaleString() + " đ"
                          : "Chưa có dữ liệu"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="plan-grid-item">
                  <Typography variant="h6">Lý do cai thuốc</Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <CheckCircleIcon color="success" className="mr-2" />
                      <Typography variant="body2">
                        {assessmentData?.MainReason === "health" &&
                          "Cải thiện sức khỏe"}
                        {assessmentData?.MainReason === "money" &&
                          "Tiết kiệm tiền"}
                        {assessmentData?.MainReason === "family" &&
                          "Vì gia đình"}
                        {assessmentData?.MainReason === "appearance" &&
                          "Cải thiện ngoại hình"}
                        {assessmentData?.MainReason === "other" && "Lý do khác"}
                        {!assessmentData?.MainReason && "Chưa có dữ liệu"}
                      </Typography>
                    </Box>
                    {assessmentData?.MainReason === "health" &&
                      assessmentData?.HealthConcerns?.map((concern, index) => (
                        <Box key={index} className="plan-info-row">
                          <CheckCircleIcon color="success" className="mr-2" />
                          <Typography variant="body2">
                            {concern === "breathing" && "Cải thiện hệ hô hấp"}
                            {concern === "heart" &&
                              "Giảm nguy cơ bệnh tim mạch"}
                            {concern === "cancer" && "Giảm nguy cơ ung thư"}
                            {concern === "energy" && "Tăng năng lượng"}
                            {concern === "existing-condition" &&
                              "Cải thiện bệnh lý hiện tại"}
                            {concern === "prevention" && "Phòng ngừa bệnh tật"}
                            {!concern && "Chưa có dữ liệu"}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                  <Typography variant="h6" className="mt-4">
                    Mục tiêu gần nhất
                  </Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <TargetIcon color="success" className="mr-2" />
                      <Typography variant="body2">
                        Giảm {planData.initialReductionPercent}% số điếu thuốc
                        trong tuần đầu tiên
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <TargetIcon color="success" className="mr-2" />
                      <Typography variant="body2">
                        Giảm xuống {planData.dailyGoals[2]} điếu/ngày sau 2 tuần
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {tabValue === "schedule" && (
          <Card className="plan-card">
            <CardHeader
              title="Lịch trình"
              subheader="Lịch trình giảm dần số lượng thuốc lá"
            />
            <CardContent>
              <Box>
                <Typography variant="h6">Mục tiêu hàng ngày</Typography>
                <Box className="plan-section">
                  {planData.dailyGoals.map((goal, index) => (
                    <Box key={index} className="plan-goal-row">
                      <Typography variant="body2" className="w-24">
                        Tuần {index + 1}:
                      </Typography>
                      <TextField
                        type="number"
                        value={goal}
                        onChange={(e) => {
                          const newGoals = [...planData.dailyGoals];
                          newGoals[index] = Number.parseInt(e.target.value);
                          updatePlanData("dailyGoals", newGoals);
                        }}
                        disabled={!isEditing}
                        inputProps={{
                          min: 0,
                          max: assessmentData?.CigarettesPerDay || 20,
                        }}
                        className="flex-1"
                      />
                      <Typography variant="body2" className="w-20 text-right">
                        điếu/ngày
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            <Typography variant="h6">{snackbar.title}</Typography>
            <Typography>{snackbar.description}</Typography>
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default PlanCustomizationPage;
