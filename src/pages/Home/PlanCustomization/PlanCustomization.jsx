import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  People as UsersIcon,
  ArrowForward as ArrowRightIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Flag as TargetIcon,
} from "@mui/icons-material";
import "./PlanCustomization.css";

function PlanCustomizationPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const [snackbar, setSnackbar] = useState({
    open: false,
    title: "",
    description: "",
    severity: "success", // success or error
  });

  // Mock assessment data
  const assessmentData = {
    cigarettesPerDay: 15,
    smokingYears: 8,
    cigarettePrice: 25000,
    mainReason: "health",
    goalTimeframe: "3months",
    preferredApproach: "gradual",
  };

  // Plan state
  const [planData, setPlanData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date.toISOString().split("T")[0];
    })(),
    approach: "gradual",
    initialReductionPercent: 25,
    weeklyReductionPercent: 15,
    dailyGoals: [12, 10, 8, 6, 5, 3, 2, 0],
    triggers: ["afterMeals", "withCoffee", "stress", "socialGatherings"],
    alternativeActivities: ["walking", "drinking water", "deep breathing", "chewing gum"],
    supportMethods: ["nicotineGum", "app", "coaching"],
    milestones: [
      { days: 3, description: "72 giờ không có nicotine trong cơ thể" },
      { days: 7, description: "1 tuần không hút thuốc" },
      { days: 14, description: "2 tuần không hút thuốc" },
      { days: 30, description: "1 tháng không hút thuốc" },
      { days: 90, description: "3 tháng không hút thuốc" },
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
      setPlanSaved(true);
      setSnackbar({
        open: true,
        title: "Kế hoạch đã được lưu",
        description: "Kế hoạch cai thuốc của bạn đã được lưu thành công.",
        severity: "success",
      });
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

  const handleFindCoaches = () => {
    navigate("/member/coach-matching");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="plan-container">
      <Box className="plan-content">
        <Box className="plan-header">
          <Box>
            <Typography variant="h4" className="plan-title">
              Tùy chỉnh kế hoạch cai thuốc
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Dựa trên đánh giá của bạn, chúng tôi đã tạo một kế hoạch cai thuốc. Hãy tùy chỉnh theo nhu cầu của bạn.
            </Typography>
          </Box>
          <Box className="plan-header-buttons">
            {isEditing ? (
              <Button
                variant="contained"
                color="success"
                startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
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
            <Typography variant="h6">Kế hoạch cai thuốc đã được lưu!</Typography>
            <Typography>
              Kế hoạch cai thuốc của bạn đã được lưu thành công. Bây giờ bạn có thể tìm huấn luyện viên phù hợp để hỗ trợ bạn trong hành trình cai thuốc.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UsersIcon />}
              endIcon={<ArrowRightIcon />}
              onClick={handleFindCoaches}
              sx={{ mt: 2 }}
            >
              Tìm huấn luyện viên phù hợp
            </Button>
          </Alert>
        )}

        <Alert icon={<InfoIcon />} severity="info" className="plan-alert">
          <Typography variant="h6">Kế hoạch được tạo dựa trên đánh giá của bạn</Typography>
          <Typography>
            Chúng tôi đã tạo kế hoạch cai thuốc dựa trên thông tin bạn cung cấp. Bạn có thể tùy chỉnh kế hoạch này để phù hợp với nhu cầu cá nhân.
          </Typography>
        </Alert>

        <Tabs value={tabValue} onChange={handleTabChange} className="plan-tabs">
          <Tab label="Tổng quan" value="overview" />
          <Tab label="Lịch trình" value="schedule" />
          <Tab label="Chiến lược" value="strategies" />
          <Tab label="Hỗ trợ" value="support" />
        </Tabs>

        {/* Overview Tab */}
        {tabValue === "overview" && (
          <Card className="plan-card">
            <CardHeader>
              <Typography variant="h5">Tổng quan kế hoạch</Typography>
              <Typography variant="body2" color="textSecondary">
                Thông tin cơ bản về kế hoạch cai thuốc của bạn
              </Typography>
            </CardHeader>
            <CardContent>
              <Box className="plan-grid">
                <Box className="plan-grid-item">
                  <Typography variant="h6">Thông tin cơ bản</Typography>
                  <Box className="plan-section">
                    <TextField
                      label="Ngày bắt đầu"
                      type="date"
                      value={planData.startDate}
                      onChange={(e) => updatePlanData("startDate", e.target.value)}
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Dự kiến hoàn thành"
                      type="date"
                      value={planData.endDate}
                      onChange={(e) => updatePlanData("endDate", e.target.value)}
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal" disabled={!isEditing}>
                      <InputLabel>Phương pháp cai thuốc</InputLabel>
                      <Select
                        value={planData.approach}
                        onChange={(e) => updatePlanData("approach", e.target.value)}
                        label="Phương pháp cai thuốc"
                      >
                        <MenuItem value="cold-turkey">Cai thuốc hoàn toàn (Cold Turkey)</MenuItem>
                        <MenuItem value="gradual">Giảm dần số lượng</MenuItem>
                        <MenuItem value="nrt">Liệu pháp thay thế nicotine (NRT)</MenuItem>
                        <MenuItem value="medication">Sử dụng thuốc kê đơn</MenuItem>
                        <MenuItem value="combination">Kết hợp nhiều phương pháp</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Thói quen hút thuốc hiện tại
                  </Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Số điếu mỗi ngày:
                      </Typography>
                      <Typography variant="body2">{assessmentData.cigarettesPerDay} điếu</Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Thời gian hút thuốc:
                      </Typography>
                      <Typography variant="body2">{assessmentData.smokingYears} năm</Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Giá một bao thuốc:
                      </Typography>
                      <Typography variant="body2">
                        {assessmentData.cigarettePrice.toLocaleString()} đ
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Chi phí hàng tháng:
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(
                          (assessmentData.cigarettesPerDay / 20) * assessmentData.cigarettePrice * 30
                        ).toLocaleString()}{" "}
                        đ
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="plan-grid-item">
                  <Typography variant="h6">Lý do cai thuốc</Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {assessmentData.mainReason === "health" && "Cải thiện sức khỏe"}
                        {assessmentData.mainReason === "money" && "Tiết kiệm tiền"}
                        {assessmentData.mainReason === "family" && "Vì gia đình"}
                        {assessmentData.mainReason === "appearance" && "Cải thiện ngoại hình"}
                        {assessmentData.mainReason === "other" && "Lý do khác"}
                      </Typography>
                    </Box>
                    {assessmentData.mainReason === "health" && (
                      <>
                        <Box className="plan-info-row">
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                          <Typography variant="body2">Cải thiện hệ hô hấp</Typography>
                        </Box>
                        <Box className="plan-info-row">
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                          <Typography variant="body2">Giảm nguy cơ bệnh tim mạch</Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Mục tiêu gần nhất
                  </Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <TargetIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Giảm {planData.initialReductionPercent}% số điếu thuốc trong tuần đầu tiên
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <TargetIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Giảm xuống {planData.dailyGoals[2]} điếu/ngày sau 2 tuần
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Tiết kiệm dự kiến
                  </Typography>
                  <Box className="plan-section">
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Sau 1 tháng:
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(
                          (assessmentData.cigarettesPerDay / 20) * assessmentData.cigarettePrice * 30
                        ).toLocaleString()}{" "}
                        đ
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Sau 3 tháng:
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(
                          (assessmentData.cigarettesPerDay / 20) * assessmentData.cigarettePrice * 90
                        ).toLocaleString()}{" "}
                        đ
                      </Typography>
                    </Box>
                    <Box className="plan-info-row">
                      <Typography variant="body2" color="textSecondary">
                        Sau 1 năm:
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(
                          (assessmentData.cigarettesPerDay / 20) * assessmentData.cigarettePrice * 365
                        ).toLocaleString()}{" "}
                        đ
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Schedule Tab */}
        {tabValue === "schedule" && (
          <Card className="plan-card">
            <CardHeader>
              <Typography variant="h5">Lịch trình</Typography>
              <Typography variant="body2" color="textSecondary">
                Lịch trình giảm dần số lượng thuốc lá
              </Typography>
            </CardHeader>
            <CardContent>
              <Box>
                <Typography variant="h6">Mục tiêu hàng ngày</Typography>
                <Box className="plan-section">
                  {planData.dailyGoals.map((goal, index) => (
                    <Box key={index} className="plan-goal-row">
                      <Typography variant="body2" sx={{ width: "100px" }}>
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
                        inputProps={{ min: 0, max: assessmentData.cigarettesPerDay }}
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body2" sx={{ width: "80px", textAlign: "right" }}>
                        điếu/ngày
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Typography variant="h6" sx={{ mt: 4 }}>
                  Các mốc quan trọng
                </Typography>
                <Box className="plan-section">
                  {planData.milestones.map((milestone, index) => (
                    <Box key={index} className="plan-milestone-row">
                      <Typography variant="body2" sx={{ width: "100px" }}>
                        Ngày {milestone.days}:
                      </Typography>
                      <TextField
                        value={milestone.description}
                        onChange={(e) => {
                          const newMilestones = [...planData.milestones];
                          newMilestones[index].description = e.target.value;
                          updatePlanData("milestones", newMilestones);
                        }}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Strategies Tab */}
        {tabValue === "strategies" && (
          <Card className="plan-card">
            <CardHeader>
              <Typography variant="h5">Chiến lược</Typography>
              <Typography variant="body2" color="textSecondary">
                Chiến lược để vượt qua cơn thèm thuốc
              </Typography>
            </CardHeader>
            <CardContent>
              <Box>
                <Typography variant="h6">Yếu tố kích thích hút thuốc</Typography>
                <Box className="plan-section plan-grid">
                  {[
                    { id: "afterMeals", label: "Sau bữa ăn" },
                    { id: "withCoffee", label: "Khi uống cà phê" },
                    { id: "stress", label: "Khi căng thẳng" },
                    { id: "socialGatherings", label: "Khi gặp gỡ bạn bè" },
                    { id: "alcohol", label: "Khi uống rượu bia" },
                    { id: "boredom", label: "Khi buồn chán" },
                  ].map((trigger) => (
                    <FormControlLabel
                      key={trigger.id}
                      control={
                        <Checkbox
                          checked={planData.triggers.includes(trigger.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updatePlanData("triggers", [...planData.triggers, trigger.id]);
                            } else {
                              updatePlanData(
                                "triggers",
                                planData.triggers.filter((t) => t !== trigger.id)
                              );
                            }
                          }}
                          disabled={!isEditing}
                        />
                      }
                      label={trigger.label}
                    />
                  ))}
                </Box>

                <Typography variant="h6" sx={{ mt: 4 }}>
                  Hoạt động thay thế
                </Typography>
                <Box className="plan-section plan-grid">
                  {[
                    { id: "walking", label: "Đi bộ" },
                    { id: "drinking water", label: "Uống nước" },
                    { id: "deep breathing", label: "Hít thở sâu" },
                    { id: "chewing gum", label: "Nhai kẹo cao su" },
                    { id: "exercise", label: "Tập thể dục" },
                    { id: "meditation", label: "Thiền" },
                  ].map((activity) => (
                    <FormControlLabel
                      key={activity.id}
                      control={
                        <Checkbox
                          checked={planData.alternativeActivities.includes(activity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updatePlanData("alternativeActivities", [
                                ...planData.alternativeActivities,
                                activity.id,
                              ]);
                            } else {
                              updatePlanData(
                                "alternativeActivities",
                                planData.alternativeActivities.filter((a) => a !== activity.id)
                              );
                            }
                          }}
                          disabled={!isEditing}
                        />
                      }
                      label={activity.label}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Support Tab */}
        {tabValue === "support" && (
          <Card className="plan-card">
            <CardHeader>
              <Typography variant="h5">Hỗ trợ</Typography>
              <Typography variant="body2" color="textSecondary">
                Các phương pháp hỗ trợ cai thuốc
              </Typography>
            </CardHeader>
            <CardContent>
              <Box>
                <Typography variant="h6">Phương pháp hỗ trợ</Typography>
                <Box className="plan-section plan-grid">
                  {[
                    { id: "nicotineGum", label: "Kẹo cao su nicotine" },
                    { id: "app", label: "Ứng dụng theo dõi" },
                    { id: "coaching", label: "Tư vấn huấn luyện viên" },
                    { id: "nicotinePatch", label: "Miếng dán nicotine" },
                    { id: "medication", label: "Thuốc kê đơn" },
                    { id: "supportGroup", label: "Nhóm hỗ trợ" },
                  ].map((method) => (
                    <FormControlLabel
                      key={method.id}
                      control={
                        <Checkbox
                          checked={planData.supportMethods.includes(method.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updatePlanData("supportMethods", [...planData.supportMethods, method.id]);
                            } else {
                              updatePlanData(
                                "supportMethods",
                                planData.supportMethods.filter((s) => s !== method.id)
                              );
                            }
                          }}
                          disabled={!isEditing}
                        />
                      }
                      label={method.label}
                    />
                  ))}
                </Box>

                <Typography variant="h6" sx={{ mt: 4 }}>
                  Nhắc nhở
                </Typography>
                <Box className="plan-section">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={planData.reminders}
                        onChange={(e) => updatePlanData("reminders", e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Bật nhắc nhở"
                  />
                  {planData.reminders && (
                    <>
                      <FormControl fullWidth margin="normal" disabled={!isEditing}>
                        <InputLabel>Tần suất nhắc nhở</InputLabel>
                        <Select
                          value={planData.reminderFrequency}
                          onChange={(e) => updatePlanData("reminderFrequency", e.target.value)}
                          label="Tần suất nhắc nhở"
                        >
                          <MenuItem value="daily">Hàng ngày</MenuItem>
                          <MenuItem value="twice-daily">Hai lần mỗi ngày</MenuItem>
                          <MenuItem value="weekly">Hàng tuần</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Thời gian nhắc nhở"
                        type="time"
                        value={planData.reminderTime}
                        onChange={(e) => updatePlanData("reminderTime", e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {planSaved && !isEditing && (
          <Box className="plan-footer">
            <Button
              variant="contained"
              color="primary"
              startIcon={<UsersIcon />}
              endIcon={<ArrowRightIcon />}
              onClick={handleFindCoaches}
              size="large"
            >
              Tìm huấn luyện viên phù hợp
            </Button>
          </Box>
        )}

        {/* Snackbar for toast notifications */}
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