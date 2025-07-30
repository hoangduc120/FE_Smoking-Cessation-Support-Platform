import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Slider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  LinearProgress,
} from "@mui/material";
import { ArrowBack, ArrowForward, CheckCircle } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./AssessmentPage.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveAssessment,
} from "../../../store/slices/quitSmokingSlice";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";

// Validation schema
const schema = yup.object().shape({
  smokingYears: yup
    .number()
    .min(1, "Số năm hút thuốc phải lớn hơn 0")
    .required("Số năm hút thuốc là bắt buộc"),
  motivation: yup.string().required("Động lực cai thuốc là bắt buộc"),
  peakSmokingTimes: yup
    .string()
    .required("Thời điểm hút thuốc nhiều nhất là bắt buộc"),
  previousAttempts: yup.string().required("Số lần cố gắng cai là bắt buộc"),
  supportSystem: yup
    .array()
    .min(1, "Phải chọn ít nhất một hệ thống hỗ trợ")
    .required("Hệ thống hỗ trợ là bắt buộc"),
});

export default function AssessmentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const totalSteps = 3; // Cập nhật thành 3 bước

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!currentUser || !currentUser.token) {
      toast.error("Vui lòng đăng nhập để tiếp tục!");
      navigate(PATH.LOGIN);
      return;
    }
  }, [currentUser, navigate]);

  // Ngăn chặn nút back của trình duyệt nếu đã hoàn thành assessment
  useEffect(() => {
    const handlePopState = () => {
      if (step === totalSteps) {
        window.history.pushState(null, "", window.location.pathname);
        toast("Bạn đang trong quá trình đánh giá. Vui lòng hoàn thành trước khi quay lại.");
      }
    };
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.pathname);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step, totalSteps]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      smokingYears: 5,
      motivation: "health",
      peakSmokingTimes: "morning-stress",
      previousAttempts: "1-2",
      supportSystem: ["counseling", "reminders"],
    },
  });

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data) => {
    if (step === totalSteps) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const assessmentData = {
        userId: currentUser?.user?.id || "1",
        motivation:
          data.motivation === "health" ? "Muốn cải thiện sức khỏe" : data.motivation === "money" ? "Tiết kiệm tiền" : "Khác",
        smokingDurationYear: data.smokingYears,
        peakSmokingTimes:
          data.peakSmokingTimes === "morning-stress"
            ? "Sáng và khi căng thẳng"
            : data.peakSmokingTimes === "evening"
              ? "Buổi tối"
              : data.peakSmokingTimes === "after-meals"
                ? "Sau bữa ăn"
                : "Khác",
        quitAttempts: parseInt(data.previousAttempts.split("-")[0]) || 0,
        supportNeeded:
          data.supportSystem.includes("counseling") && data.supportSystem.includes("reminders")
            ? "Tư vấn tâm lý và nhắc nhở"
            : data.supportSystem.includes("counseling")
              ? "Tư vấn tâm lý"
              : data.supportSystem.includes("reminders")
                ? "Nhắc nhở"
                : data.supportSystem.includes("peer-support")
                  ? "Hỗ trợ từ bạn bè"
                  : data.supportSystem.includes("app-support")
                    ? "Hỗ trợ qua ứng dụng"
                    : "Khác",
      };

      try {
        await dispatch(saveAssessment(assessmentData)).unwrap();
        localStorage.setItem("hasAssessed", "true"); 
        await toast.success("Đánh giá thành công!");
        setTimeout(() => {
          navigate("/planCustomization");
        }, 2000);
      } catch {
        toast.error("Đánh giá thất bại! Vui lòng thử lại.");
      }
    } else {
      nextStep();
    }
  };

  return (
    <Box className="assessment-page">
      <Box className="container">
        <Typography variant="h4" align="center" gutterBottom>
          Đánh Giá Thói Quen Hút Thuốc
        </Typography>
        <Typography align="center" color="textSecondary" paragraph>
          Hãy cung cấp thông tin chi tiết để chúng tôi có thể tạo kế hoạch cai
          thuốc phù hợp nhất cho bạn
        </Typography>

        <Box className="progress-container">
          <Box className="progress-info">
            <span>
              Bước {step}/{totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% hoàn thành</span>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(step / totalSteps) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#2d7e32",
              },
            }}
          />
        </Box>

        {/* Step 1: Số năm hút thuốc và động lực cai thuốc */}
        {step === 1 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Thói quen hút thuốc</Typography>
            </CardHeader>
            <CardContent className="form-container">
              {/* Số năm hút thuốc */}
              <FormLabel>Bạn đã hút thuốc được bao lâu?</FormLabel>
              <Box display="flex" alignItems="center" gap={2}>
                <Controller
                  name="smokingYears"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Slider
                        {...field}
                        min={1}
                        max={30}
                        step={1}
                        onChange={(_, value) => field.onChange(value)}
                        sx={{
                          flex: 1,
                          "& .MuiSlider-track": { backgroundColor: "#2d7e32" },
                          "& .MuiSlider-rail": { backgroundColor: "#e0e0e0" },
                          "& .MuiSlider-thumb": { backgroundColor: "#2d7e32" },
                        }}
                      />
                      <Typography>{field.value} năm</Typography>
                    </>
                  )}
                />
              </Box>
              {errors.smokingYears && (
                <Typography color="error">
                  {errors.smokingYears.message}
                </Typography>
              )}

              {/* Động lực cai thuốc */}
              <FormLabel>
                Lý do chính khiến bạn muốn cai thuốc lá là gì?
              </FormLabel>
              <Controller
                name="motivation"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="health"
                      control={<Radio />}
                      label="Vì sức khỏe"
                    />
                    <FormControlLabel
                      value="money"
                      control={<Radio />}
                      label="Tiết kiệm tiền"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Lý do khác"
                    />
                  </RadioGroup>
                )}
              />
              {errors.motivation && (
                <Typography color="error">
                  {errors.motivation.message}
                </Typography>
              )}
            </CardContent>
            <Box className="button-container">
              <Button
                variant="outlined"
                onClick={prevStep}
                disabled={step === 1}
                startIcon={<ArrowBack />}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit(onSubmit)}
                endIcon={<ArrowForward />}
              >
                Tiếp tục
              </Button>
            </Box>
          </Card>
        )}

        {/* Step 2: Thời điểm hút thuốc nhiều nhất và số lần cố gắng cai */}
        {step === 2 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Lịch sử và thói quen</Typography>
            </CardHeader>
            <CardContent className="form-container">
              {/* Thời điểm hút thuốc nhiều nhất - Thêm tùy chọn */}
              <FormLabel>Thời điểm nào bạn hút thuốc nhiều nhất?</FormLabel>
              <Controller
                name="peakSmokingTimes"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="morning-stress"
                      control={<Radio />}
                      label="Sáng và khi căng thẳng"
                    />
                    <FormControlLabel
                      value="evening"
                      control={<Radio />}
                      label="Buổi tối"
                    />
                    <FormControlLabel
                      value="after-meals"
                      control={<Radio />}
                      label="Sau bữa ăn"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Khác"
                    />
                  </RadioGroup>
                )}
              />
              {errors.peakSmokingTimes && (
                <Typography color="error">
                  {errors.peakSmokingTimes.message}
                </Typography>
              )}

              {/* Số lần cố gắng cai - Thêm tùy chọn */}
              <FormLabel>
                Bạn đã từng cố gắng cai thuốc bao nhiêu lần?
              </FormLabel>
              <Controller
                name="previousAttempts"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="0 lần"
                    />
                    <FormControlLabel
                      value="1-2"
                      control={<Radio />}
                      label="1-2 lần"
                    />
                    <FormControlLabel
                      value="3-5"
                      control={<Radio />}
                      label="3-5 lần"
                    />
                    <FormControlLabel
                      value="6-10"
                      control={<Radio />}
                      label="6-10 lần"
                    />
                    <FormControlLabel
                      value="10+"
                      control={<Radio />}
                      label="Hơn 10 lần"
                    />
                  </RadioGroup>
                )}
              />
              {errors.previousAttempts && (
                <Typography color="error">
                  {errors.previousAttempts.message}
                </Typography>
              )}
            </CardContent>
            <Box className="button-container">
              <Button
                variant="outlined"
                onClick={prevStep}
                startIcon={<ArrowBack />}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit(onSubmit)}
                endIcon={<ArrowForward />}
              >
                Tiếp tục
              </Button>
            </Box>
          </Card>
        )}

        {/* Step 3: Hệ thống hỗ trợ - Thêm tùy chọn */}
        {step === 3 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Hỗ trợ cai thuốc</Typography>
            </CardHeader>
            <CardContent className="form-container">
              <FormLabel>Hệ thống hỗ trợ bạn cần là gì?</FormLabel>
              <Controller
                name="supportSystem"
                control={control}
                render={({ field }) => (
                  <Box className="checkbox-grid">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes("counseling")}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, "counseling"]
                              : field.value.filter((v) => v !== "counseling");
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label="Tư vấn tâm lý"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes("reminders")}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, "reminders"]
                              : field.value.filter((v) => v !== "reminders");
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label="Nhắc nhở"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes("peer-support")}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, "peer-support"]
                              : field.value.filter((v) => v !== "peer-support");
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label="Hỗ trợ từ bạn bè/người thân"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes("app-support")}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, "app-support"]
                              : field.value.filter((v) => v !== "app-support");
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label="Hỗ trợ qua ứng dụng"
                    />
                  </Box>
                )}
              />
              {errors.supportSystem && (
                <Typography color="error">
                  {errors.supportSystem.message}
                </Typography>
              )}
            </CardContent>
            <Box className="button-container">
              <Button
                variant="outlined"
                onClick={prevStep}
                startIcon={<ArrowBack />}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit(onSubmit)}
                endIcon={<CheckCircle />}
              >
                Hoàn thành
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
}