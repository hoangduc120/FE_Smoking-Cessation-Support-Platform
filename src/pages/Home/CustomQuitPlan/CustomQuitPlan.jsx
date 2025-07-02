import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  SmokingRooms as SmokingIcon,
} from "@mui/icons-material";
import { createCustomQuitPlan } from "../../../store/slices/customPlanSlice";

const CustomQuitPlan = () => {
  const dispatch = useDispatch();
  const {
    isLoading = false,
    isError = false,
    errorMessage = null,
  } = useSelector((state) => state.customPlan || {});

  const [planData, setPlanData] = useState({
    title: "",
    description: "",
    rules: [],
  });

  const [newRule, setNewRule] = useState({
    rule: "",
    value: "",
    description: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const ruleTypes = [
    { value: "daily", label: "Giảm hàng ngày", unit: "điếu/ngày" },
    { value: "duration", label: "Thời gian hoàn thành", unit: "ngày" },
    { value: "specificGoal", label: "Mục tiêu cụ thể", unit: "" },
  ];

  const specificGoalOptions = [
    { value: "quit_completely", label: "Bỏ thuốc hoàn toàn" },
    { value: "reduce_half", label: "Giảm một nửa" },
    { value: "reduce_75", label: "Giảm 75%" },
    { value: "weekend_only", label: "Chỉ hút cuối tuần" },
  ];

  const handleInputChange = (field, value) => {
    setPlanData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewRuleChange = (field, value) => {
    setNewRule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRule = () => {
    if (!newRule.rule || !newRule.value || !newRule.description) {
      setNotification({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin quy tắc",
        severity: "warning",
      });
      return;
    }

    const ruleToAdd = {
      ...newRule,
      value:
        newRule.rule === "specificGoal"
          ? newRule.value
          : Number.parseInt(newRule.value),
    };

    setPlanData((prev) => ({
      ...prev,
      rules: [...prev.rules, ruleToAdd],
    }));

    setNewRule({ rule: "", value: "", description: "" });
  };

  const removeRule = (index) => {
    setPlanData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (
      !planData.title ||
      !planData.description ||
      planData.rules.length === 0
    ) {
      setNotification({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin kế hoạch",
        severity: "error",
      });
      return;
    }

    try {
      const resultAction = await dispatch(createCustomQuitPlan(planData));
      if (createCustomQuitPlan.fulfilled.match(resultAction)) {
        setNotification({
          open: true,
          message: "Kế hoạch cai thuốc đã được tạo thành công!",
          severity: "success",
        });

        // Reset form
        setPlanData({ title: "", description: "", rules: [] });
      } else {
        throw new Error(
          resultAction.payload || "Có lỗi xảy ra khi tạo kế hoạch"
        );
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Có lỗi xảy ra khi tạo kế hoạch",
        severity: "error",
      });
    }
  };

  const getRuleTypeLabel = (ruleType) => {
    return ruleTypes.find((type) => type.value === ruleType)?.label || ruleType;
  };

  const getSpecificGoalLabel = (value) => {
    return (
      specificGoalOptions.find((option) => option.value === value)?.label ||
      value
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SmokingIcon sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Tạo Kế Hoạch Cai Thuốc Cá Nhân
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Thiết kế kế hoạch cai thuốc phù hợp với lối sống và mục tiêu của bạn
        </Typography>
      </Paper>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Thông Tin Cơ Bản
          </Typography>

          <Grid container spacing={3}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên kế hoạch"
                variant="outlined"
                value={planData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="VD: Kế hoạch cai thuốc lá cá nhân"
                required
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mô tả kế hoạch"
                variant="outlined"
                multiline
                rows={3}
                value={planData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về kế hoạch cai thuốc của bạn..."
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Thêm Quy Tắc Mới
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Loại quy tắc</InputLabel>
                <Select
                  value={newRule.rule}
                  onChange={(e) => handleNewRuleChange("rule", e.target.value)}
                  label="Loại quy tắc"
                >
                  {ruleTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 3 }}>
              {newRule.rule === "specificGoal" ? (
                <FormControl fullWidth>
                  <InputLabel>Mục tiêu</InputLabel>
                  <Select
                    value={newRule.value}
                    onChange={(e) =>
                      handleNewRuleChange("value", e.target.value)
                    }
                    label="Mục tiêu"
                  >
                    {specificGoalOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Giá trị"
                  type="number"
                  value={newRule.value}
                  onChange={(e) => handleNewRuleChange("value", e.target.value)}
                  placeholder="Nhập số"
                />
              )}
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Mô tả"
                value={newRule.description}
                onChange={(e) =>
                  handleNewRuleChange("description", e.target.value)
                }
                placeholder="Mô tả quy tắc này..."
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addRule}
                sx={{ height: 56 }}
              >
                Thêm
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {planData.rules.length > 0 && (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              color="primary"
              fontWeight="bold"
            >
              Quy Tắc Đã Thêm ({planData.rules.length})
            </Typography>

            {planData.rules.map((rule, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Chip
                          label={getRuleTypeLabel(rule.rule)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Giá trị:{" "}
                          {rule.rule === "specificGoal"
                            ? getSpecificGoalLabel(rule.value)
                            : rule.value}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {rule.description}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removeRule(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !planData.title ||
            !planData.description ||
            planData.rules.length === 0
          }
          sx={{
            px: 4,
            py: 1.5,
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
            },
          }}
        >
          {isLoading ? "Đang tạo kế hoạch..." : "Tạo Kế Hoạch"}
        </Button>
      </Box>

      <Snackbar
        open={notification.open || isError}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={isError ? "error" : notification.severity}
          sx={{ width: "100%" }}
        >
          {isError ? errorMessage : notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomQuitPlan;
