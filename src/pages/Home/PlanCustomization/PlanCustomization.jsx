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
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { fetchAssessment } from "../../../store/slices/quitSmokingSlice";
import "./PlanCustomization.css"; 

function PlanCustomizationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentData, isLoading, isError, errorMessage } = useSelector(
    (state) => state.quitSmoking
  );

  console.log("Assessment Data: hahshaohsihih", assessmentData);
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


  const [planData, setPlanData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date.toISOString().split("T")[0];
    })(),
    userId: assessmentData?.userId || "",
    motivation: assessmentData?.motivation || "",
    smokingDurationYear: assessmentData?.smokingDurationYear || 0, 
    peakSmokingTimes: assessmentData?.peakSmokingTimes?.split(", ") || [],
    quitAttempts: assessmentData?.quitAttempts || 0,
    supportNeeded: assessmentData?.supportNeeded || "",
    createdAt: assessmentData?.createdAt || "",
    updatedAt: assessmentData?.updatedAt || "",
  });

  useEffect(() => {
    dispatch(fetchAssessment("1")); 
  }, [dispatch]);

  useEffect(() => {

    if (assessmentData) {
      setPlanData((prev) => ({
        ...prev,
        userId: assessmentData.userId || "",
        motivation: assessmentData.motivation || "",
        smokingDurationYear: assessmentData.smokingDurationYear || 0, 
        peakSmokingTimes: assessmentData.peakSmokingTimes?.split(", ") || [],
        quitAttempts: assessmentData.quitAttempts || 0,
        supportNeeded: assessmentData.supportNeeded || "",
        createdAt: assessmentData.createdAt || "",
        updatedAt: assessmentData.updatedAt || "",
      }));
    }
  }, [assessmentData]);

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
              Dựa trên đánh giá của bạn, chúng tôi đã tạo một kế hoạch cai thuốc.
              Hãy tùy chỉnh theo nhu cầu của bạn.
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
                  </Box>
                  <Typography variant="h6" className="mt-4">
                    Thói quen và thông tin cá nhân
                  </Typography>
                  <Box className="plan-section">
                    <TextField
                      label="Số năm hút thuốc"
                      type="number"
                      value={planData.smokingDurationYear}
                      onChange={(e) =>
                        updatePlanData("smokingDurationYear", e.target.value)
                      }
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Thời gian hút thuốc nhiều nhất"
                      value={planData.peakSmokingTimes.join(", ")}
                      onChange={(e) =>
                        updatePlanData(
                          "peakSmokingTimes",
                          e.target.value.split(",").map((item) => item.trim())
                        )
                      }
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      helperText="Nhập các thời gian cách nhau bằng dấu phẩy (ví dụ: sáng, chiều)"
                    />
                    <TextField
                      label="Số lần thử cai thuốc"
                      type="number"
                      value={planData.quitAttempts}
                      onChange={(e) =>
                        updatePlanData("quitAttempts", e.target.value)
                      }
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Box>
                <Box className="plan-grid-item">
                  <Typography variant="h6">Động lực và hỗ trợ</Typography>
                  <Box className="plan-section">
                    <TextField
                      label="Động lực cai thuốc"
                      value={planData.motivation}
                      onChange={(e) => updatePlanData("motivation", e.target.value)}
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Hỗ trợ cần thiết"
                      value={planData.supportNeeded}
                      onChange={(e) =>
                        updatePlanData("supportNeeded", e.target.value)
                      }
                      disabled={!isEditing}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                    />
                  </Box>
                  <Typography variant="h6" className="mt-4">
                    Thông tin hệ thống
                  </Typography>
                  <Box className="plan-section">
                    <TextField
                      label="Ngày tạo"
                      value={planData.createdAt}
                      disabled
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Ngày cập nhật"
                      value={planData.updatedAt}
                      disabled
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
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