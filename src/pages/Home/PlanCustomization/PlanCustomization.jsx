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
import {
  fetchAssessment,
  updateAssment,
} from "../../../store/slices/quitSmokingSlice";
import "./PlanCustomization.css";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";

function PlanCustomizationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentData, isLoading, isError, errorMessage } = useSelector(
    (state) => state.quitSmoking
  );

  console.log("assessmentData", assessmentData);

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
    userId: "",
    motivation: "",
    smokingDurationYear: 0,
    peakSmokingTimes: [],
    quitAttempts: 0,
    supportNeeded: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    dispatch(fetchAssessment("1"));
  }, [dispatch]);

  // Kiểm tra xem người dùng đã hoàn thành assessment chưa
  useEffect(() => {
    // Chỉ chuyển hướng nếu không có dữ liệu assessment và không có hasAssessed
    const hasAssessed = localStorage.getItem("hasAssessed");
    if (!assessmentData?.data?.length && hasAssessed !== "true") {
      toast.error("Vui lòng hoàn thành đánh giá trước khi tùy chỉnh kế hoạch!");
      navigate(PATH.ASSESSMENTPAGE);
      return;
    }
  }, [navigate, assessmentData]);

  // Ngăn chặn nút back của trình duyệt để quay lại trang assessment
  useEffect(() => {
    const handlePopState = () => {
      const hasAssessed = localStorage.getItem("hasAssessed");
      // Chỉ ngăn chặn nếu thực sự đã hoàn thành assessment
      if (hasAssessed === "true" && assessmentData?.data?.length > 0) {
        // Nếu người dùng cố gắng quay lại, chuyển hướng về trang hiện tại
        window.history.pushState(null, "", window.location.pathname);
        toast("Bạn đã hoàn thành đánh giá. Không thể quay lại trang trước đó.");
      }
    };

    window.addEventListener("popstate", handlePopState);
    // Thêm một entry vào history để có thể bắt sự kiện popstate
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [assessmentData]);

  useEffect(() => {
    console.log("assessmentData in useEffect:", assessmentData);
    if (assessmentData?.data?.length > 0) {
      const surveyData = assessmentData.data[0];
      setPlanData((prev) => ({
        ...prev,
        userId: surveyData.userId || "",
        motivation: surveyData.motivation || "",
        smokingDurationYear: surveyData.smokingDurationYear || 0,
        peakSmokingTimes: surveyData.peakSmokingTimes
          ? surveyData.peakSmokingTimes.split(", ").map((item) => item.trim())
          : [],
        quitAttempts: surveyData.quitAttempts || 0,
        supportNeeded: surveyData.supportNeeded || "",
        createdAt: surveyData.createdAt || "",
        updatedAt: surveyData.updatedAt || "",
      }));
    }
  }, [assessmentData]);

  const updatePlanData = (field, value) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePlan = async () => {
    if (planData.smokingDurationYear < 0 || planData.quitAttempts < 0) {
      setSnackbar({
        open: true,
        title: "Lỗi",
        description:
          "Số năm hút thuốc và số lần thử cai thuốc phải lớn hơn hoặc bằng 0.",
        severity: "error",
      });
      return;
    }
    if (new Date(planData.endDate) < new Date(planData.startDate)) {
      setSnackbar({
        open: true,
        title: "Lỗi",
        description: "Ngày hoàn thành phải sau ngày bắt đầu.",
        severity: "error",
      });
      return;
    }
    if (!assessmentData?.data?.length || !assessmentData.data[0]._id) {
      setSnackbar({
        open: true,
        title: "Lỗi",
        description: "Dữ liệu đánh giá không hợp lệ. Vui lòng tải lại trang.",
        severity: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Tạo payload theo schema của backend
      const surveyData = {
        title: `Kế hoạch cai thuốc - ${planData.motivation}`,
        description: `Hỗ trợ: ${planData.supportNeeded}, Thời gian hút thuốc: ${planData.smokingDurationYear} năm`,
        questions: [
          {
            question: "Thời gian hút thuốc nhiều nhất",
            type: "multiple-choice",
            options: planData.peakSmokingTimes.map((time) => ({
              [time]: time,
            })),
          },
          {
            question: "Số lần thử cai thuốc",
            type: "multiple-choice",
            options: [
              {
                [`${planData.quitAttempts} lần`]: `${planData.quitAttempts} lần`,
              },
            ],
          },
        ],
      };

      // Gửi yêu cầu update
      await dispatch(
        updateAssment({
          surveyId: assessmentData.data[0]._id,
          data: surveyData,
        })
      ).unwrap();

      // Lấy lại dữ liệu mới từ backend
      await dispatch(fetchAssessment("1")).unwrap();

      setIsEditing(false);
      setPlanSaved(true);
      setSnackbar({
        open: true,
        title: "Tình trạng đã khai báo được lưu",
        description:
          "Tình trạng đã khai báo của bạn đã được lưu thành công. Vui lòng kiểm tra trước khi chuyển trang.",
        severity: "success",
      });
      setTimeout(() => navigate("/coachPlan"), 2000); 
    } catch (error) {
      console.error("Error in handleSavePlan:", error);
      setSnackbar({
        open: true,
        title: "Lỗi",
        description:
          error.message || "Đã xảy ra lỗi khi lưu kế hoạch. Vui lòng thử lại.",
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
      <Box className="PlanCustomization-flex PlanCustomization-justify-center PlanCustomization-items-center PlanCustomization-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="PlanCustomization-container">
        <Alert severity="error">
          <Typography variant="h6">Lỗi</Typography>
          <Typography>
            {errorMessage || "Không thể tải dữ liệu đánh giá."}
          </Typography>
        </Alert>
      </Box>
    );
  }

 

  return (
    <Box className="PlanCustomization-container">
      <Box className="PlanCustomization-content">
        <Box className="PlanCustomization-header">
          <Box>
            <Typography variant="h4" className="PlanCustomization-title">
              Tình trạng đã khai báo
            </Typography>
       
          </Box>
          <Box className="PlanCustomization-header-buttons">
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
                {isSaving ? "Đang lưu..." : "Tiếp tục"}
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
            className="PlanCustomization-alert PlanCustomization-alert-success"
          >
            <Typography variant="h6">
              Kế hoạch cai thuốc đã được lưu!
            </Typography>
            <Typography>
              Vui lòng kiểm tra thông tin dưới đây trước khi chuyển sang trang
              kế hoạch huấn luyện viên.
            </Typography>
          </Alert>
        )}

        <Alert
          icon={<InfoIcon />}
          severity="info"
          className="PlanCustomization-alert"
        >
          <Typography variant="h6">
            Tình trạng đã khai báo được tạo dựa trên đánh giá của bạn
          </Typography>
          <Typography>
            Chúng tôi sẽ cung cấp lộ trình cai thuốc dựa trên tình trạng đã khai
            báo của bạn.
          </Typography>
        </Alert>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="PlanCustomization-tabs"
        >
          <Tab label="Tổng quan" value="overview" />
        </Tabs>

        {tabValue === "overview" && (
          <Card className="PlanCustomization-card">
            <CardHeader
              title="Tổng quan tình trạng đã khai báo"
              subheader="Thông tin cơ bản về tình trạng đã khai báo"
            />
            <CardContent>
              <Box className="PlanCustomization-grid">
                <Box className="PlanCustomization-grid-item">
                  <Typography variant="h6">Thông tin cơ bản</Typography>
                  <Box className="PlanCustomization-section">
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
                  </Box>
                  <Typography variant="h6" className="PlanCustomization-mt-4">
                    Thói quen và thông tin cá nhân
                  </Typography>
                  <Box className="PlanCustomization-section">
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
                      value={planData.peakSmokingTimes.join(", ") || ""}
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
                <Box className="PlanCustomization-grid-item">
                  <Typography variant="h6">Động lực và hỗ trợ</Typography>
                  <Box className="PlanCustomization-section">
                    <TextField
                      label="Động lực cai thuốc"
                      value={planData.motivation}
                      onChange={(e) =>
                        updatePlanData("motivation", e.target.value)
                      }
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
                  <Typography variant="h6" className="PlanCustomization-mt-4">
                    Thông tin hệ thống
                  </Typography>
                  <Box className="PlanCustomization-section">
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
