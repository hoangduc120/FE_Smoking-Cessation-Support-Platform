import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  SmokingRooms as SmokingIcon,
} from "@mui/icons-material";
import { createCustomQuitPlan } from "../../../store/slices/customPlanSlice";
import { fetchPlanCurrent } from "../../../store/slices/planeSlice";
import { useNavigate } from "react-router-dom";

const CustomQuitPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoading = false,
    isError = false,
    errorMessage = null,
    plan = null,
  } = useSelector((state) => state.plan || {}); // Changed to use 'plan' slice

  const [planData, setPlanData] = useState({
    title: "",
    description: "",
    goal: "",
    targetCigarettesPerDay: "",
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

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

  useEffect(() => {
    dispatch(fetchPlanCurrent());
  }, [dispatch]);

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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (
      !planData.title ||
      !planData.description ||
      !planData.goal ||
      planData.targetCigarettesPerDay === "" ||
      planData.rules.length === 0
    ) {
      setNotification({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin kế hoạch",
        severity: "error",
      });
      return;
    }

    // Check if user has an active plan
    if (plan?._id) {
      setConfirmDialogOpen(true);
      return;
    }

    // Proceed with plan creation
    try {
      const resultAction = await dispatch(createCustomQuitPlan(planData));
      if (createCustomQuitPlan.fulfilled.match(resultAction)) {
        setNotification({
          open: true,
          message: "Kế hoạch cai thuốc đã được tạo thành công!",
          severity: "success",
        });
        setPlanData({
          title: "",
          description: "",
          goal: "",
          targetCigarettesPerDay: "",
          rules: [],
        });
      } else {
        throw new Error(
          resultAction.payload?.message || "Có lỗi xảy ra khi tạo kế hoạch"
        );
      }
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.message || "Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.",
        severity: "error",
      });
    }
  };

  const handleCancelPlan = async () => {
    navigate("/roadmap");
  };

  const handleKeepPlan = () => {
    setConfirmDialogOpen(false);
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
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mục tiêu kế hoạch"
                variant="outlined"
                value={planData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                placeholder="VD: Bỏ thuốc phù hợp : 25→15→0 điếu trong 3 tuần"
                required
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mục tiêu số điếu/ngày"
                variant="outlined"
                type="number"
                inputProps={{ min: 0 }}
                value={planData.targetCigarettesPerDay}
                onChange={(e) =>
                  handleInputChange("targetCigarettesPerDay", e.target.value)
                }
                placeholder="VD: 5 điếu"
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
                  label="Số ngày"
                  type="number"
                  value={newRule.value}
                  onChange={(e) => handleNewRuleChange("value", e.target.value)}
                  placeholder="Nhập số"
                  inputProps={{ min: 1 }}
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
                      <Chip
                        label={getRuleTypeLabel(rule.rule)}
                        color="primary"
                        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1 }}
                      />

                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Số ngày:</strong>{" "}
                        {rule.rule === "specificGoal"
                          ? getSpecificGoalLabel(rule.value)
                          : `${rule.value} ngày`}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Mô tả:</strong> {rule.description}
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
            !planData.goal ||
            planData.targetCigarettesPerDay === "" ||
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

      <Dialog
        open={confirmDialogOpen}
        onClose={handleKeepPlan}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
            py: 2,
            px: 3,
          }}
        >
          Bạn đã có một kế hoạch đang thực hiện
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: "1rem" }}
          >
            Bạn đã tham gia 1 kế hoạch, nếu muốn tiếp tục tạo kế hoạch thì bạn
            cần hủy kế hoạch hiện tại. Bạn có muốn hủy không?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleKeepPlan}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              textTransform: "none",
              ":hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Không hủy
          </Button>
          <Button
            onClick={handleCancelPlan}
            autoFocus
            sx={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              textTransform: "none",
              ":hover": {
                backgroundColor: "#c62828",
              },
            }}
          >
            Tiếp tục hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomQuitPlan;
