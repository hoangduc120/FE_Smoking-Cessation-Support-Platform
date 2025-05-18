import { useState } from "react";
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
  TextField,
  LinearProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { ArrowBack, ArrowForward, CheckCircle } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./AssessmentPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveAssessment } from "../../../store/slices/quitSmokingSlice";
import toast from "react-hot-toast";

// Validation schema
const schema = yup.object().shape({
  cigarettesPerDay: yup
    .number()
    .min(1, "Số điếu thuốc mỗi ngày phải lớn hơn 0")
    .required("Số điếu thuốc là bắt buộc"),
  smokingYears: yup
    .number()
    .min(1, "Số năm hút thuốc phải lớn hơn 0")
    .required("Số năm hút thuốc là bắt buộc"),
  cigarettePrice: yup
    .number()
    .min(15000, "Giá thuốc lá phải lớn hơn 15,000 VNĐ")
    .required("Giá thuốc lá là bắt buộc"),
  firstCigaretteTime: yup
    .string()
    .required("Thời điểm hút điếu đầu tiên là bắt buộc"),
  difficultPlacesNoSmoking: yup.boolean(),
  smokeDuringSickness: yup.boolean(),
  previousAttempts: yup.string().required("Số lần cố gắng cai là bắt buộc"),
  longestQuitDuration: yup.string().when("previousAttempts", {
    is: (value) => value !== "0",
    then: (schema) => schema.required("Thời gian cai lâu nhất là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  quitMethods: yup.array().when("previousAttempts", {
    is: (value) => value !== "0",
    then: (schema) =>
      schema
        .min(1, "Phải chọn ít nhất một phương pháp")
        .required("Phương pháp cai là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  relapseTriggers: yup.array().when("previousAttempts", {
    is: (value) => value !== "0",
    then: (schema) =>
      schema
        .min(1, "Phải chọn ít nhất một yếu tố")
        .required("Yếu tố tái nghiện là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainReason: yup.string().required("Lý do chính là bắt buộc"),
  healthConcerns: yup.array().when("mainReason", {
    is: "health",
    then: (schema) =>
      schema
        .min(1, "Phải chọn ít nhất một vấn đề sức khỏe")
        .required("Vấn đề sức khỏe là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  goalTimeframe: yup.string().required("Thời gian mục tiêu là bắt buộc"),
  confidenceLevel: yup
    .number()
    .min(1, "Mức độ tự tin phải từ 1-10")
    .max(10, "Mức độ tự tin phải từ 1-10")
    .required("Mức độ tự tin là bắt buộc"),
  supportSystem: yup
    .array()
    .min(1, "Phải chọn ít nhất một hệ thống hỗ trợ")
    .required("Hệ thống hỗ trợ là bắt buộc"),
  livesWithSmokers: yup.boolean(),
  workWithSmokers: yup.boolean(),
  preferredApproach: yup.string().required("Phương pháp cai là bắt buộc"),
  preferredCommunication: yup
    .string()
    .required("Hình thức giao tiếp là bắt buộc"),
  coachGender: yup.string().required("Giới tính huấn luyện viên là bắt buộc"),
  coachSpecialty: yup
    .string()
    .required("Chuyên môn huấn luyện viên là bắt buộc"),
  additionalInfo: yup.string(),
});

export default function AssessmentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.quitSmoking);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cigarettesPerDay: 10,
      smokingYears: 5,
      cigarettePrice: 25000,
      firstCigaretteTime: "within30min",
      difficultPlacesNoSmoking: true,
      smokeDuringSickness: false,
      previousAttempts: "1-2",
      longestQuitDuration: "1-4weeks",
      quitMethods: ["cold-turkey", "nicotine-replacement"],
      relapseTriggers: ["stress", "social"],
      mainReason: "health",
      healthConcerns: ["breathing", "heart"],
      goalTimeframe: "3months",
      confidenceLevel: 7,
      supportSystem: ["family", "friends"],
      livesWithSmokers: true,
      workWithSmokers: true,
      preferredApproach: "gradual",
      preferredCommunication: "inperson",
      coachGender: "no-preference",
      coachSpecialty: "psychology",
      additionalInfo: "",
    },
  });

  const previousAttempts = watch("previousAttempts");
  const mainReason = watch("mainReason");

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
    // Tạo object chỉ chứa các trường cần thiết
    const assessmentData = {
      id: data.id || "1", // Nếu không có id thì mặc định là "1" (dựa trên mock API)
      CigarettesPerDay: data.cigarettesPerDay,
      SmokingYears: data.smokingYears,
      CigarettePrice: data.cigarettePrice,
      FirstCigaretteTime: data.firstCigaretteTime,
      PreviousAttempts: data.previousAttempts,
      LongestQuitDuration: data.previousAttempts !== "0" ? data.longestQuitDuration : null,
      QuitMethods: data.previousAttempts !== "0" ? data.quitMethods : [],
      RelapseTriggers: data.previousAttempts !== "0" ? data.relapseTriggers : [],
      MainReason: data.mainReason,
      HealthConcerns: data.mainReason === "health" ? data.healthConcerns : [],
      GoalTimeframe: data.goalTimeframe,
      PreferredApproach: data.preferredApproach,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };
    console.log("Dữ liệu gửi đi:", assessmentData);

    try {
      await dispatch(saveAssessment(assessmentData)).unwrap();
      await toast.success("Đánh giá thành công!");
      setTimeout(() => {
        navigate("/planCustomization");
      }, 2000);
    } catch (error) {
      toast.error("Đánh giá thất bại! Vui lòng thử lại.");
    }
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

        {step === 1 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Thói quen hút thuốc</Typography>
              <Typography color="textSecondary">
                Cho chúng tôi biết về thói quen hút thuốc của bạn
              </Typography>
            </CardHeader>
            <CardContent className="form-container">
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
                          "& .MuiSlider-track": { backgroundColor: "#2d7e32" },
                          "& .MuiSlider-rail": { backgroundColor: "#e0e0e0" },
                          "& .MuiSlider-thumb": { backgroundColor: "#2d7e32" },
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
                        onChange={(_, value) => field.onChange(value * 1000)}
                        sx={{
                          flex: 1,
                          "& .MuiSlider-track": { backgroundColor: "#2d7e32" },
                          "& .MuiSlider-rail": { backgroundColor: "#e0e0e0" },
                          "& .MuiSlider-thumb": { backgroundColor: "#2d7e32" },
                        }}
                      />
                      <Typography>{field.value.toLocaleString()} đ</Typography>
                    </>
                  )}
                />
              </Box>
              {errors.cigarettePrice && (
                <Typography color="error">
                  {errors.cigarettePrice.message}
                </Typography>
              )}

              <FormLabel>
                Bạn hút điếu thuốc đầu tiên của ngày vào thời điểm nào?
              </FormLabel>
              <Controller
                name="firstCigaretteTime"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="within5min"
                      control={<Radio />}
                      label="Trong vòng 5 phút sau khi thức dậy"
                    />
                    <FormControlLabel
                      value="within30min"
                      control={<Radio />}
                      label="Trong vòng 6-30 phút sau khi thức dậy"
                    />
                    <FormControlLabel
                      value="within60min"
                      control={<Radio />}
                      label="Trong vòng 31-60 phút sau khi thức dậy"
                    />
                    <FormControlLabel
                      value="after60min"
                      control={<Radio />}
                      label="Sau 60 phút kể từ khi thức dậy"
                    />
                  </RadioGroup>
                )}
              />
              {errors.firstCigaretteTime && (
                <Typography color="error">
                  {errors.firstCigaretteTime.message}
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
                onClick={handleSubmit(nextStep)}
                endIcon={<ArrowForward />}
              >
                Tiếp tục
              </Button>
            </Box>
          </Card>
        )}

        {step === 2 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Lịch sử cai thuốc</Typography>
              <Typography color="textSecondary">
                Cho chúng tôi biết về những nỗ lực cai thuốc trước đây của bạn
              </Typography>
            </CardHeader>
            <CardContent className="form-container">
              <FormLabel>
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

              {previousAttempts !== "0" && (
                <>
                  <FormLabel>
                    Thời gian dài nhất bạn đã cai thuốc thành công là bao lâu?
                  </FormLabel>
                  <Controller
                    name="longestQuitDuration"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                      >
                        <FormControlLabel
                          value="less1week"
                          control={<Radio />}
                          label="Ít hơn 1 tuần"
                        />
                        <FormControlLabel
                          value="1-4weeks"
                          control={<Radio />}
                          label="1-4 tuần"
                        />
                        <FormControlLabel
                          value="1-6months"
                          control={<Radio />}
                          label="1-6 tháng"
                        />
                        <FormControlLabel
                          value="6months+"
                          control={<Radio />}
                          label="Hơn 6 tháng"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.longestQuitDuration && (
                    <Typography color="error">
                      {errors.longestQuitDuration.message}
                    </Typography>
                  )}

                  <FormLabel>
                    Bạn đã sử dụng phương pháp nào để cai thuốc?
                  </FormLabel>
                  <Controller
                    name="quitMethods"
                    control={control}
                    render={({ field }) => (
                      <Box className="checkbox-grid">
                        {[
                          {
                            id: "cold-turkey",
                            label: "Cai thuốc hoàn toàn (Cold Turkey)",
                          },
                          {
                            id: "gradual-reduction",
                            label: "Giảm dần số lượng",
                          },
                          {
                            id: "nicotine-replacement",
                            label: "Liệu pháp thay thế nicotine",
                          },
                          { id: "medication", label: "Thuốc kê đơn" },
                          { id: "counseling", label: "Tư vấn/Trị liệu" },
                          { id: "app", label: "Ứng dụng cai thuốc" },
                        ].map((method) => (
                          <FormControlLabel
                            key={method.id}
                            control={
                              <Checkbox
                                checked={field.value.includes(method.id)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, method.id]
                                    : field.value.filter(
                                        (v) => v !== method.id
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={method.label}
                          />
                        ))}
                      </Box>
                    )}
                  />
                  {errors.quitMethods && (
                    <Typography color="error">
                      {errors.quitMethods.message}
                    </Typography>
                  )}

                  <FormLabel>
                    Yếu tố nào khiến bạn quay lại hút thuốc?
                  </FormLabel>
                  <Controller
                    name="relapseTriggers"
                    control={control}
                    render={({ field }) => (
                      <Box className="checkbox-grid">
                        {[
                          { id: "stress", label: "Căng thẳng/Áp lực" },
                          { id: "social", label: "Tình huống xã hội" },
                          { id: "withdrawal", label: "Triệu chứng cai nghiện" },
                          { id: "alcohol", label: "Uống rượu/bia" },
                          { id: "weight-gain", label: "Tăng cân" },
                          { id: "lack-support", label: "Thiếu hỗ trợ" },
                        ].map((trigger) => (
                          <FormControlLabel
                            key={trigger.id}
                            control={
                              <Checkbox
                                checked={field.value.includes(trigger.id)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, trigger.id]
                                    : field.value.filter(
                                        (v) => v !== trigger.id
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={trigger.label}
                          />
                        ))}
                      </Box>
                    )}
                  />
                  {errors.relapseTriggers && (
                    <Typography color="error">
                      {errors.relapseTriggers.message}
                    </Typography>
                  )}
                </>
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
                onClick={handleSubmit(nextStep)}
                endIcon={<ArrowForward />}
              >
                Tiếp tục
              </Button>
            </Box>
          </Card>
        )}

        {step === 3 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Động lực và mục tiêu</Typography>
              <Typography color="textSecondary">
                Cho chúng tôi biết về động lực và mục tiêu cai thuốc của bạn
              </Typography>
            </CardHeader>
            <CardContent className="form-container">
              <FormLabel>
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
                    {[
                      {
                        value: "health",
                        label: "Vì sức khỏe",
                        description:
                          "Tôi muốn cải thiện sức khỏe và sống lâu hơn",
                      },
                      {
                        value: "money",
                        label: "Tiết kiệm tiền",
                        description:
                          "Tôi muốn tiết kiệm tiền đang chi cho thuốc lá",
                      },
                      {
                        value: "family",
                        label: "Vì gia đình",
                        description: "Tôi muốn bảo vệ sức khỏe của người thân",
                      },
                      {
                        value: "appearance",
                        label: "Cải thiện ngoại hình",
                        description:
                          "Tôi muốn có làn da, hơi thở và ngoại hình tốt hơn",
                      },
                      {
                        value: "other",
                        label: "Lý do khác",
                        description: "Tôi có lý do riêng để cai thuốc lá",
                      },
                    ].map((reason) => (
                      <Card
                        key={reason.value}
                        sx={{ mb: 1, p: 2 }}
                        variant="outlined"
                      >
                        <FormControlLabel
                          value={reason.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1">
                                {reason.label}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {reason.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </Card>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.mainReason && (
                <Typography color="error">
                  {errors.mainReason.message}
                </Typography>
              )}

              {mainReason === "health" && (
                <>
                  <FormLabel>
                    Vấn đề sức khỏe cụ thể nào khiến bạn lo ngại?
                  </FormLabel>
                  <Controller
                    name="healthConcerns"
                    control={control}
                    render={({ field }) => (
                      <Box className="checkbox-grid">
                        {[
                          { id: "breathing", label: "Khó thở/Vấn đề hô hấp" },
                          { id: "heart", label: "Bệnh tim mạch" },
                          { id: "cancer", label: "Nguy cơ ung thư" },
                          { id: "energy", label: "Thiếu năng lượng/Mệt mỏi" },
                          {
                            id: "existing-condition",
                            label: "Bệnh lý hiện tại",
                          },
                          { id: "prevention", label: "Phòng ngừa bệnh tật" },
                        ].map((concern) => (
                          <FormControlLabel
                            key={concern.id}
                            control={
                              <Checkbox
                                checked={field.value.includes(concern.id)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, concern.id]
                                    : field.value.filter(
                                        (v) => v !== concern.id
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={concern.label}
                          />
                        ))}
                      </Box>
                    )}
                  />
                  {errors.healthConcerns && (
                    <Typography color="error">
                      {errors.healthConcerns.message}
                    </Typography>
                  )}
                </>
              )}

              <FormLabel>
                Bạn muốn cai thuốc lá hoàn toàn trong khoảng thời gian nào?
              </FormLabel>
              <Controller
                name="goalTimeframe"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="1month"
                      control={<Radio />}
                      label="Trong vòng 1 tháng"
                    />
                    <FormControlLabel
                      value="3months"
                      control={<Radio />}
                      label="Trong vòng 3 tháng"
                    />
                    <FormControlLabel
                      value="6months"
                      control={<Radio />}
                      label="Trong vòng 6 tháng"
                    />
                    <FormControlLabel
                      value="gradual"
                      control={<Radio />}
                      label="Tôi muốn giảm dần, không có thời hạn cụ thể"
                    />
                  </RadioGroup>
                )}
              />
              {errors.goalTimeframe && (
                <Typography color="error">
                  {errors.goalTimeframe.message}
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
                onClick={handleSubmit(nextStep)}
                endIcon={<ArrowForward />}
              >
                Tiếp tục
              </Button>
            </Box>
          </Card>
        )}

        {step === 4 && (
          <Card className="step-card">
            <CardHeader>
              <Typography variant="h5">Tùy chọn cá nhân</Typography>
              <Typography color="textSecondary">
                Cho chúng tôi biết về sở thích của bạn để tìm huấn luyện viên
                phù hợp
              </Typography>
            </CardHeader>
            <CardContent className="form-container">
              <FormLabel>Bạn muốn áp dụng phương pháp cai thuốc nào?</FormLabel>
              <Controller
                name="preferredApproach"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    {[
                      {
                        value: "cold-turkey",
                        label: "Cai thuốc hoàn toàn (Cold Turkey)",
                        description: "Ngừng hút thuốc hoàn toàn ngay lập tức",
                      },
                      {
                        value: "gradual",
                        label: "Giảm dần số lượng",
                        description: "Giảm dần số lượng thuốc lá hút mỗi ngày",
                      },
                      {
                        value: "nrt",
                        label: "Liệu pháp thay thế nicotine",
                        description: "Sử dụng các sản phẩm thay thế nicotine",
                      },
                      {
                        value: "medication",
                        label: "Thuốc kê đơn",
                        description: "Sử dụng thuốc kê đơn để hỗ trợ cai thuốc",
                      },
                      {
                        value: "combination",
                        label: "Kết hợp nhiều phương pháp",
                        description: "Kết hợp nhiều phương pháp khác nhau",
                      },
                      {
                        value: "unsure",
                        label: "Tôi không chắc chắn",
                        description:
                          "Tôi muốn được tư vấn về phương pháp phù hợp nhất",
                      },
                    ].map((approach) => (
                      <Card
                        key={approach.value}
                        sx={{ mb: 1, p: 2 }}
                        variant="outlined"
                      >
                        <FormControlLabel
                          value={approach.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1">
                                {approach.label}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {approach.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </Card>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.preferredApproach && (
                <Typography color="error">
                  {errors.preferredApproach.message}
                </Typography>
              )}

              <FormLabel>
                Bạn thích hình thức trao đổi nào với huấn luyện viên?
              </FormLabel>
              <Controller
                name="preferredCommunication"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="inperson"
                      control={<Radio />}
                      label="Gặp mặt trực tiếp"
                    />
                    <FormControlLabel
                      value="chat"
                      control={<Radio />}
                      label="Nhắn tin"
                    />
                  </RadioGroup>
                )}
              />
              {errors.preferredCommunication && (
                <Typography color="error">
                  {errors.preferredCommunication.message}
                </Typography>
              )}

              <FormLabel>
                Bạn có sở thích về giới tính của huấn luyện viên không?
              </FormLabel>
              <Controller
                name="coachGender"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Nữ"
                    />
                    <FormControlLabel
                      value="no-preference"
                      control={<Radio />}
                      label="Không có sở thích cụ thể"
                    />
                  </RadioGroup>
                )}
              />
              {errors.coachGender && (
                <Typography color="error">
                  {errors.coachGender.message}
                </Typography>
              )}

              <FormLabel>
                Bạn muốn huấn luyện viên có chuyên môn về lĩnh vực nào?
              </FormLabel>
              <Controller
                name="coachSpecialty"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Chọn chuyên môn
                    </MenuItem>
                    <MenuItem value="psychology">Tâm lý học</MenuItem>
                    <MenuItem value="nutrition">Dinh dưỡng</MenuItem>
                    <MenuItem value="medicine">Y học</MenuItem>
                    <MenuItem value="fitness">Thể dục thể thao</MenuItem>
                    <MenuItem value="mindfulness">Thiền/Chánh niệm</MenuItem>
                    <MenuItem value="any">Bất kỳ chuyên môn nào</MenuItem>
                  </Select>
                )}
              />
              {errors.coachSpecialty && (
                <Typography color="error">
                  {errors.coachSpecialty.message}
                </Typography>
              )}

              <FormLabel>
                Thông tin bổ sung bạn muốn chia sẻ với huấn luyện viên
              </FormLabel>
              <Controller
                name="additionalInfo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Chia sẻ bất kỳ thông tin bổ sung nào..."
                    error={!!errors.additionalInfo}
                    helperText={errors.additionalInfo?.message}
                  />
                )}
              />
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
