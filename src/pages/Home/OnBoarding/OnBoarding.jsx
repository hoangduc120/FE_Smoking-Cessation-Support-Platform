import { useState, useEffect } from "react";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  SmokingRooms,
  AccessTime,
  AttachMoney,
  Favorite,
} from "@mui/icons-material";
import {
  Button,
  TextField,
  Slider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Box,
  LinearProgress,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./OnBoarding.css";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Họ và tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một số"),
  smokingYears: yup
    .number()
    .min(1, "Số năm hút thuốc phải lớn hơn 0")
    .required("Số năm hút thuốc là bắt buộc"),
  cigarettesPerDay: yup
    .number()
    .min(1, "Số điếu thuốc mỗi ngày phải lớn hơn 0")
    .required("Số điếu thuốc là bắt buộc"),
  cigarettePrice: yup
    .number()
    .min(15000, "Giá thuốc lá phải lớn hơn 15,000 VNĐ")
    .required("Giá thuốc lá là bắt buộc"),
  mainReason: yup.string().required("Lý do chính là bắt buộc"),
  previousAttempts: yup.string().required("Số lần cố gắng cai là bắt buộc"),
  startDate: yup.string().required("Ngày bắt đầu là bắt buộc"),
  customDate: yup.string().when("startDate", {
    is: "custom",
    then: (schema) => schema.required("Ngày tùy chỉnh là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  goals: yup
    .array()
    .min(1, "Phải chọn ít nhất một mục tiêu")
    .required("Mục tiêu là bắt buộc"),
  notifications: yup.boolean(),
  quitMethod: yup.string().required("Phương pháp cai thuốc là bắt buộc"),
});

export default function OnboardingPage() {
  // Lưu step hiện tại
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("onboardingStep");
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  const [loading, setLoading] = useState(false);
  const totalSteps = 5;

  // luu form
  const getInitialFormValues = () => {
    const savedFormData = localStorage.getItem("onboardingFormData");
    if (savedFormData) {
      try {
        return JSON.parse(savedFormData);
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
    return {
      name: "",
      email: "",
      password: "",
      smokingYears: 5,
      cigarettesPerDay: 10,
      cigarettePrice: 25000,
      mainReason: "health",
      previousAttempts: "0",
      startDate: "now",
      customDate: "",
      goals: ["health", "money", "family"],
      notifications: true,
      quitMethod: "cold-turkey",
    };
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getInitialFormValues(),
  });

  const startDate = watch("startDate");

  // Lưu step
  useEffect(() => {
    localStorage.setItem("onboardingStep", step);
  }, [step]);

  // Lưu dữ liệu
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("onboardingFormData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  const onSubmit = (data) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("onboardingStep");
      localStorage.removeItem("onboardingFormData");
      setStep(1);
    }, 2000);
  };

  return (
    <Box className="quit-smoke-onboarding">
      <Box className="onboarding-content">
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

        {step === 1 && (
          <Card className="step-card">
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Bắt đầu hành trình cai thuốc lá
              </Typography>
              <Typography align="center" color="textSecondary" paragraph>
                Hãy cung cấp một số thông tin cơ bản để chúng tôi có thể tạo tài
                khoản cho bạn
              </Typography>
              <Box className="form-container">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Họ và tên"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      className="form-field"
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      className="form-field"
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mật khẩu"
                      type="password"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      className="form-field"
                    />
                  )}
                />
              </Box>
              <Box className="button-container">
                <Box></Box>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit(nextStep)}
                  endIcon={<ArrowForward />}
                >
                  Tiếp tục
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="step-card">
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Thói quen hút thuốc của bạn
              </Typography>
              <Typography align="center" color="textSecondary" paragraph>
                Thông tin này giúp chúng tôi cá nhân hóa hành trình cai thuốc lá
                cho bạn
              </Typography>
              <Box className="form-container">
                <FormControl fullWidth className="form-field">
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
                              "& .MuiSlider-track": {
                                backgroundColor: "#2d7e32",
                                borderColor: "#2d7e32",
                              },
                              "& .MuiSlider-rail": {
                                backgroundColor: "#e0e0e0",
                              },
                              "& .MuiSlider-thumb": {
                                backgroundColor: "#2d7e32",
                                "&:hover, &.Mui-focusVisible": {
                                  boxShadow:
                                    "0 0 0 8px rgba(45, 126, 50, 0.16)",
                                },
                              },
                              "& .MuiSlider-valueLabel": {
                                backgroundColor: "#2d7e32",
                              },
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
                </FormControl>
                <FormControl fullWidth className="form-field">
                  <FormLabel>Bạn hút bao nhiêu điếu thuốc mỗi ngày?</FormLabel>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Controller
                      name="cigarettesPerDay"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Slider
                            {...field}
                            min={1}
                            max={40}
                            step={1}
                            onChange={(_, value) => field.onChange(value)}
                            sx={{
                              flex: 1,
                              "& .MuiSlider-track": {
                                backgroundColor: "#2d7e32",
                                borderColor: "#2d7e32",
                              },
                              "& .MuiSlider-rail": {
                                backgroundColor: "#e0e0e0",
                              },
                              "& .MuiSlider-thumb": {
                                backgroundColor: "#2d7e32",
                                "&:hover, &.Mui-focusVisible": {
                                  boxShadow:
                                    "0 0 0 8px rgba(45, 126, 50, 0.16)",
                                },
                              },
                              "& .MuiSlider-valueLabel": {
                                backgroundColor: "#2d7e32",
                              },
                            }}
                          />
                          <Typography>{field.value} điếu</Typography>
                        </>
                      )}
                    />
                  </Box>
                  {errors.cigarettesPerDay && (
                    <Typography color="error">
                      {errors.cigarettesPerDay.message}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth className="form-field">
                  <FormLabel>Giá một bao thuốc lá (VNĐ)</FormLabel>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Controller
                      name="cigarettePrice"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Slider
                            value={field.value / 1000}
                            min={15}
                            max={100}
                            step={1}
                            onChange={(_, value) =>
                              field.onChange(value * 1000)
                            }
                            sx={{
                              flex: 1,
                              "& .MuiSlider-track": {
                                backgroundColor: "#2d7e32",
                                borderColor: "#2d7e32",
                              },
                              "& .MuiSlider-rail": {
                                backgroundColor: "#e0e0e0",
                              },
                              "& .MuiSlider-thumb": {
                                backgroundColor: "#2d7e32",
                                "&:hover, &.Mui-focusVisible": {
                                  boxShadow:
                                    "0 0 0 8px rgba(45, 126, 50, 0.16)",
                                },
                              },
                              "& .MuiSlider-valueLabel": {
                                backgroundColor: "#2d7e32",
                              },
                            }}
                          />
                          <Typography>
                            {field.value.toLocaleString()} đ
                          </Typography>
                        </>
                      )}
                    />
                  </Box>
                  {errors.cigarettePrice && (
                    <Typography color="error">
                      {errors.cigarettePrice.message}
                    </Typography>
                  )}
                </FormControl>
                <FormControl component="fieldset" className="form-field">
                  <FormLabel component="legend">
                    Bạn đã từng cố gắng cai thuốc lá bao nhiêu lần?
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
                          label="Đây là lần đầu tiên"
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
                          value="5+"
                          control={<Radio />}
                          label="Hơn 5 lần"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.previousAttempts && (
                    <Typography color="error">
                      {errors.previousAttempts.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
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
                  onClick={handleSubmit(nextStep)}
                  endIcon={<ArrowForward />}
                >
                  Tiếp tục
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="step-card">
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Động lực cai thuốc lá của bạn
              </Typography>
              <Typography align="center" color="textSecondary" paragraph>
                Hiểu rõ động lực của bạn sẽ giúp chúng tôi hỗ trợ bạn tốt hơn
                trong hành trình này
              </Typography>
              <Box className="form-container">
                <FormControl component="fieldset" className="form-field">
                  <FormLabel component="legend">
                    Lý do chính khiến bạn muốn cai thuốc lá là gì?
                  </FormLabel>
                  <Controller
                    name="mainReason"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                      >
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            value="health"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Vì sức khỏe
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tôi muốn cải thiện sức khỏe và sống lâu hơn
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            value="money"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Tiết kiệm tiền
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tôi muốn tiết kiệm tiền đang chi cho thuốc lá
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            value="family"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Vì gia đình
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tôi muốn bảo vệ sức khỏe của người thân
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            value="appearance"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Cải thiện ngoại hình
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tôi muốn có làn da, hơi thở và ngoại hình tốt
                                  hơn
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            value="other"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Lý do khác
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tôi có lý do riêng để cai thuốc lá
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                      </RadioGroup>
                    )}
                  />
                  {errors.mainReason && (
                    <Typography color="error">
                      {errors.mainReason.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
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
                  onClick={handleSubmit(nextStep)}
                  endIcon={<ArrowForward />}
                >
                  Tiếp tục
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="step-card">
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Thiết lập mục tiêu
              </Typography>
              <Typography align="center" color="textSecondary" paragraph>
                Hãy xác định mục tiêu cai thuốc lá của bạn để chúng tôi có thể
                giúp bạn đạt được chúng
              </Typography>
              <Box className="form-container">
                <FormControl component="fieldset" className="form-field">
                  <FormLabel component="legend">
                    Khi nào bạn muốn bắt đầu cai thuốc lá?
                  </FormLabel>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                      >
                        <FormControlLabel
                          value="now"
                          control={<Radio />}
                          label="Ngay bây giờ"
                        />
                        <FormControlLabel
                          value="tomorrow"
                          control={<Radio />}
                          label="Ngày mai"
                        />
                        <FormControlLabel
                          value="week"
                          control={<Radio />}
                          label="Trong tuần này"
                        />
                        <FormControlLabel
                          value="custom"
                          control={<Radio />}
                          label="Chọn ngày cụ thể"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.startDate && (
                    <Typography color="error">
                      {errors.startDate.message}
                    </Typography>
                  )}
                  {startDate === "custom" && (
                    <Controller
                      name="customDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{ mt: 2 }}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.customDate}
                          helperText={errors.customDate?.message}
                        />
                      )}
                    />
                  )}
                </FormControl>
                <FormControl component="fieldset" className="form-field">
                  <FormLabel component="legend">
                    Mục tiêu bạn muốn đạt được
                  </FormLabel>
                  <Controller
                    name="goals"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes("health")}
                                onChange={(e) => {
                                  const newGoals = e.target.checked
                                    ? [...field.value, "health"]
                                    : field.value.filter((g) => g !== "health");
                                  field.onChange(newGoals);
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Cải thiện sức khỏe
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Cải thiện sức khỏe tổng thể và giảm nguy cơ
                                  bệnh tật
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes("money")}
                                onChange={(e) => {
                                  const newGoals = e.target.checked
                                    ? [...field.value, "money"]
                                    : field.value.filter((g) => g !== "money");
                                  field.onChange(newGoals);
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Tiết kiệm tiền
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tiết kiệm tiền đang chi cho thuốc lá
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes("family")}
                                onChange={(e) => {
                                  const newGoals = e.target.checked
                                    ? [...field.value, "family"]
                                    : field.value.filter((g) => g !== "family");
                                  field.onChange(newGoals);
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Bảo vệ gia đình
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Bảo vệ người thân khỏi tác hại của khói thuốc
                                  thụ động
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                        <Card variant="outlined" sx={{ mb: 1, p: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes("appearance")}
                                onChange={(e) => {
                                  const newGoals = e.target.checked
                                    ? [...field.value, "appearance"]
                                    : field.value.filter(
                                        (g) => g !== "appearance"
                                      );
                                  field.onChange(newGoals);
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  Cải thiện ngoại hình
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Cải thiện làn da, hơi thở và ngoại hình tổng
                                  thể
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                      </>
                    )}
                  />
                  {errors.goals && (
                    <Typography color="error">
                      {errors.goals.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
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
                  onClick={handleSubmit(nextStep)}
                  endIcon={<ArrowForward />}
                >
                  Tiếp tục
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card className="step-card">
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Tổng kết thông tin
              </Typography>
              <Typography align="center" color="textSecondary" paragraph>
                Hãy xem lại thông tin của bạn trước khi bắt đầu hành trình cai
                thuốc lá
              </Typography>
              <Box className="summary-container">
                <Card className="summary-stats-card">
                  <Typography variant="h6" gutterBottom color="success.main">
                    Thống kê của bạn
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={3} sm={6}>
                      <Card className="stat-item-card">
                        <SmokingRooms fontSize="large" color="warning" />
                        <Typography variant="caption" color="textSecondary">
                          Số điếu thuốc mỗi ngày
                        </Typography>
                        <Typography variant="h5">
                          {watch("cigarettesPerDay")} điếu
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item size={3}>
                      <Card className="stat-item-card">
                        <AccessTime fontSize="large" color="primary" />
                        <Typography variant="caption" color="textSecondary">
                          Thời gian hút thuốc
                        </Typography>
                        <Typography variant="h5">
                          {watch("smokingYears")} năm
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item size={3}>
                      <Card className="stat-item-card">
                        <AttachMoney fontSize="large" color="success" />
                        <Typography variant="caption" color="textSecondary">
                          Chi phí hàng tháng
                        </Typography>
                        <Typography variant="h5">
                          {Math.round(
                            (watch("cigarettesPerDay") / 20) *
                              watch("cigarettePrice") *
                              30
                          ).toLocaleString()}{" "}
                          đ
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item size={3}>
                      <Card className="stat-item-card">
                        <Favorite fontSize="large" color="error" />
                        <Typography variant="caption" color="textSecondary">
                          Động lực chính
                        </Typography>
                        <Typography variant="h5">
                          {watch("mainReason") === "health"
                            ? "Sức khỏe"
                            : watch("mainReason") === "money"
                            ? "Tiết kiệm"
                            : watch("mainReason") === "family"
                            ? "Gia đình"
                            : watch("mainReason") === "appearance"
                            ? "Ngoại hình"
                            : "Khác"}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Mục tiêu của bạn
                  </Typography>
                  {watch("goals").includes("health") && (
                    <Card className="goal-item">
                      <CheckCircle color="success" />
                      <Box>
                        <Typography variant="subtitle1">
                          Cải thiện sức khỏe
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Cải thiện sức khỏe tổng thể và giảm nguy cơ bệnh tật
                        </Typography>
                      </Box>
                    </Card>
                  )}
                  {watch("goals").includes("money") && (
                    <Card className="goal-item">
                      <CheckCircle color="success" />
                      <Box>
                        <Typography variant="subtitle1">
                          Tiết kiệm tiền
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Tiết kiệm tiền đang chi cho thuốc lá
                        </Typography>
                      </Box>
                    </Card>
                  )}
                  {watch("goals").includes("family") && (
                    <Card className="goal-item">
                      <CheckCircle color="success" />
                      <Box>
                        <Typography variant="subtitle1">
                          Bảo vệ gia đình
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Bảo vệ người thân khỏi tác hại của khói thuốc thụ động
                        </Typography>
                      </Box>
                    </Card>
                  )}
                  {watch("goals").includes("appearance") && (
                    <Card className="goal-item">
                      <CheckCircle color="success" />
                      <Box>
                        <Typography variant="subtitle1">
                          Cải thiện ngoại hình
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Cải thiện làn da, hơi thở và ngoại hình tổng thể
                        </Typography>
                      </Box>
                    </Card>
                  )}
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Kế hoạch cai thuốc lá
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1">Ngày bắt đầu:</Typography>
                    <Typography color="textSecondary">
                      {watch("startDate") === "now"
                        ? "Ngay hôm nay"
                        : watch("startDate") === "tomorrow"
                        ? "Ngày mai"
                        : watch("startDate") === "week"
                        ? "Trong tuần này"
                        : watch("customDate") || "Ngày tùy chỉnh"}
                    </Typography>
                  </Card>
                </Box>
                <Controller
                  name="notifications"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Tôi muốn nhận thông báo và lời nhắc để duy trì động lực"
                    />
                  )}
                />
              </Box>
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
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {loading ? "Đang xử lý..." : "Bắt đầu hành trình"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
