import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Rule as RuleIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import React from "react";
import {
  fetchCustomQuitPlans,
  approveCustomQuitPlan,
  rejectCustomQuitPlan,
} from "../../../store/slices/customPlanSlice";

// A no-op transition that simply renders its children
const NoTransition = React.forwardRef(function NoTransition(props, ref) {
  const { children } = props;
  return <div ref={ref}>{children}</div>;
});

const CoachQuitPlans = () => {
  const dispatch = useDispatch();
  const { customPlansList, isLoading, isError, errorMessage } = useSelector(
    (state) => state.customPlan
  );
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    planId: null,
    action: null,
    planTitle: "",
  });
  const [approvalDialog, setApprovalDialog] = useState({
    open: false,
    planId: null,
    planData: null,
    quitPlanData: {
      title: "",
      reason: "",
      duration: "",
      image: "",
    },
    stagesData: [
      {
        stage_name: "",
        description: "",
        order_index: 1,
        duration: "",
      },
    ],
  });
  const [rejectReasonDialog, setRejectReasonDialog] = useState({
    open: false,
    planId: null,
    planTitle: "",
    rejectionReason: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPlans = async () => {
    dispatch(fetchCustomQuitPlans());
  };

  useEffect(() => {
    fetchPlans();
  }, [dispatch]);

  useEffect(() => {
    if (customPlansList) {
      const pendingPlans = customPlansList.filter(
        (plan) => plan.status === "pending"
      );
      setFilteredPlans(pendingPlans);
    }
  }, [customPlansList]);

  const handleAction = async (planId, action, rejectionReason = "") => {
    setActionLoading(planId);

    // Đóng tất cả dialog trước khi thực hiện action
    setConfirmDialog({
      open: false,
      planId: null,
      action: null,
      planTitle: "",
    });
    setRejectReasonDialog({
      open: false,
      planId: null,
      planTitle: "",
      rejectionReason: "",
    });

    try {
      if (action === "approve") {
        await dispatch(
          approveCustomQuitPlan({
            requestId: planId,
            quitPlanData: {
              ...approvalDialog.quitPlanData,
              duration: parseInt(approvalDialog.quitPlanData.duration) || 0,
            },
            stagesData: approvalDialog.stagesData.map((stage) => ({
              ...stage,
              order_index: parseInt(stage.order_index) || 0,
              duration: parseInt(stage.duration) || 0,
            })),
          })
        ).unwrap();
        // Update filteredPlans to remove the approved plan
        setFilteredPlans((prev) => prev.filter((plan) => plan._id !== planId));
      } else {
        if (!rejectionReason.trim()) {
          setNotification({
            open: true,
            message: "Vui lòng cung cấp lý do từ chối!",
            severity: "error",
          });
          setActionLoading(null);
          return;
        }
        await dispatch(
          rejectCustomQuitPlan({ requestId: planId, rejectionReason })
        ).unwrap();
      }
      setNotification({
        open: true,
        message: `Kế hoạch đã được ${action === "approve" ? "duyệt" : "từ chối"} thành công!`,
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: `Lỗi khi ${action === "approve" ? "duyệt" : "từ chối"} kế hoạch!`,
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openConfirmDialog = (planId, action, planTitle) => {
    // Reset tất cả dialog state trước khi mở dialog mới
    setRejectReasonDialog({
      open: false,
      planId: null,
      planTitle: "",
      rejectionReason: "",
    });
    setApprovalDialog({
      open: false,
      planId: null,
      planData: null,
      quitPlanData: {
        title: "",
        reason: "",
        duration: "",
        image: "",
      },
      stagesData: [
        {
          stage_name: "",
          description: "",
          order_index: 1,
          duration: "",
        },
      ],
    });

    if (action === "approve") {
      // Mở dialog approval với form
      const selectedPlan = filteredPlans.find((plan) => plan._id === planId);
      setApprovalDialog({
        open: true,
        planId,
        planData: selectedPlan,
        quitPlanData: {
          title: "",
          reason: "",
          duration: "",
          image: "",
        },
        stagesData: [
          {
            stage_name: "",
            description: "",
            order_index: 1,
            duration: "",
          },
        ],
      });
    } else {
      setConfirmDialog({
        open: true,
        planId,
        action,
        planTitle,
      });
    }
  };

  const openRejectReasonDialog = (planId, planTitle) => {
    setConfirmDialog({
      open: false,
      planId: null,
      action: null,
      planTitle: "",
    });
    setRejectReasonDialog({
      open: true,
      planId,
      planTitle,
      rejectionReason: "",
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      planId: null,
      action: null,
      planTitle: "",
    });
  };

  const closeApprovalDialog = () => {
    setApprovalDialog({
      open: false,
      planId: null,
      planData: null,
      quitPlanData: {
        title: "",
        reason: "",
        duration: "",
        image: "",
      },
      stagesData: [
        {
          stage_name: "",
          description: "",
          order_index: 1,
          duration: "",
        },
      ],
    });
  };

  const closeRejectReasonDialog = () => {
    setRejectReasonDialog({
      open: false,
      planId: null,
      planTitle: "",
      rejectionReason: "",
    });
  };

  const handleRejectionReasonChange = (e) => {
    setRejectReasonDialog((prev) => ({
      ...prev,
      rejectionReason: e.target.value,
    }));
  };

  const handleQuitPlanDataChange = (field, value) => {
    setApprovalDialog((prev) => ({
      ...prev,
      quitPlanData: {
        ...prev.quitPlanData,
        [field]: value,
      },
    }));
  };

  const handleStageDataChange = (index, field, value) => {
    setApprovalDialog((prev) => ({
      ...prev,
      stagesData: prev.stagesData.map((stage, i) =>
        i === index
          ? {
              ...stage,
              [field]: value,
            }
          : stage
      ),
    }));
  };

  const addStage = () => {
    setApprovalDialog((prev) => ({
      ...prev,
      stagesData: [
        ...prev.stagesData,
        {
          stage_name: "",
          description: "",
          order_index: prev.stagesData.length + 1,
          duration: "",
        },
      ],
    }));
  };

  const removeStage = (index) => {
    if (approvalDialog.stagesData.length > 1) {
      setApprovalDialog((prev) => ({
        ...prev,
        stagesData: prev.stagesData
          .filter((_, i) => i !== index)
          .map((stage, i) => ({
            ...stage,
            order_index: i + 1,
          })),
      }));
    }
  };

  const handleApprovalSubmit = () => {
    // Validate form
    if (!approvalDialog.quitPlanData.title.trim()) {
      setNotification({
        open: true,
        message: "Vui lòng nhập tiêu đề kế hoạch!",
        severity: "error",
      });
      return;
    }

    if (!approvalDialog.quitPlanData.reason.trim()) {
      setNotification({
        open: true,
        message: "Vui lòng nhập lý do kế hoạch!",
        severity: "error",
      });
      return;
    }

    if (!approvalDialog.quitPlanData.duration) {
      setNotification({
        open: true,
        message: "Vui lòng nhập thời gian hoàn thành!",
        severity: "error",
      });
      return;
    }

    const planDuration = parseInt(approvalDialog.quitPlanData.duration);
    if (isNaN(planDuration) || planDuration <= 0 || planDuration > 365) {
      setNotification({
        open: true,
        message: "Thời gian hoàn thành phải là số từ 1 đến 365 ngày!",
        severity: "error",
      });
      return;
    }

    if (
      approvalDialog.stagesData.some(
        (stage) =>
          !stage.stage_name.trim() ||
          !stage.description.trim() ||
          !stage.duration
      )
    ) {
      setNotification({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin cho tất cả các giai đoạn!",
        severity: "error",
      });
      return;
    }

    for (let i = 0; i < approvalDialog.stagesData.length; i++) {
      const stageDuration = parseInt(approvalDialog.stagesData[i].duration);
      if (isNaN(stageDuration) || stageDuration <= 0 || stageDuration > 365) {
        setNotification({
          open: true,
          message: `Giai đoạn ${i + 1}: Thời gian phải là số từ 1 đến 365 ngày!`,
          severity: "error",
        });
        return;
      }
    }

    const totalStageDuration = approvalDialog.stagesData.reduce(
      (sum, stage) => sum + parseInt(stage.duration || 0),
      0
    );
    if (totalStageDuration > planDuration) {
      setNotification({
        open: true,
        message: `Tổng thời gian các giai đoạn (${totalStageDuration} ngày) không được vượt quá thời gian kế hoạch (${planDuration} ngày)!`,
        severity: "error",
      });
      return;
    }

    if (
      approvalDialog.stagesData.some(
        (stage, index, arr) =>
          arr.findIndex((s) => s.order_index === stage.order_index) !== index
      )
    ) {
      setNotification({
        open: true,
        message: "Thứ tự giai đoạn không được trùng lặp!",
        severity: "error",
      });
      return;
    }

    handleAction(approvalDialog.planId, "approve");
    closeApprovalDialog();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const getRuleTypeLabel = (ruleType) => {
    switch (ruleType) {
      case "daily":
        return "Giảm hàng ngày";
      case "duration":
        return "Thời gian hoàn thành";
      case "specificGoal":
        return "Mục tiêu cụ thể";
      default:
        return ruleType;
    }
  };

  const getSpecificGoalLabel = (value) => {
    switch (value) {
      case "quit_completely":
        return "Bỏ thuốc hoàn toàn";
      case "reduce_half":
        return "Giảm một nửa";
      case "reduce_75":
        return "Giảm 75%";
      case "weekend_only":
        return "Chỉ hút cuối tuần";
      default:
        return value;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Alert severity="error">{errorMessage || "Lỗi khi tải dữ liệu!"}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Quản Lý Kế Hoạch Cai Thuốc
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Xem xét và phê duyệt các kế hoạch cai thuốc của người dùng
            </Typography>
          </Box>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={fetchPlans} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {filteredPlans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Không có kế hoạch nào đang chờ duyệt
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPlans.map((plan) => (
            <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={plan._id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      fontWeight="bold"
                      sx={{ flexGrow: 1, mr: 1 }}
                    >
                      {plan.title}
                    </Typography>
                    <Chip
                      label={getStatusText(plan.status)}
                      color={getStatusColor(plan.status)}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {plan.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PersonIcon
                        sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {plan.userId.userName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon
                        sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {plan.userId.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ScheduleIcon
                        sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(plan.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <RuleIcon
                        sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        Quy tắc ({plan.rules.length})
                      </Typography>
                    </Box>
                    <List dense sx={{ py: 0 }}>
                      {plan.rules.map((rule) => (
                        <ListItem
                          key={rule._id}
                          sx={{ px: 0, py: 1, alignItems: "flex-start" }}
                        >
                          <Box sx={{ display: "flex" }}>
                            {/* Dấu chấm tròn đậm */}
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", mr: 1 }}
                            >
                              ●
                            </Typography>

                            {/* Nội dung quy tắc */}
                            <Box>
                              <Chip
                                label={getRuleTypeLabel(rule.rule)}
                                color="primary"
                                sx={{
                                  fontSize: "0.8 rem",
                                  mb: 0.5,
                                }}
                              />
                              <Typography variant="body2">
                                <strong>Số ngày:</strong>{" "}
                                {rule.rule === "specificGoal"
                                  ? getSpecificGoalLabel(rule.value)
                                  : `${rule.value} ngày`}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                <strong>Mô tả:</strong> {rule.description}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Grid container spacing={1}>
                    <Grid item size={{ xs: 6 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() =>
                          openConfirmDialog(plan._id, "approve", plan.title)
                        }
                        disabled={actionLoading === plan._id}
                        size="small"
                      >
                        {actionLoading === plan._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Duyệt"
                        )}
                      </Button>
                    </Grid>
                    <Grid item size={{ xs: 6 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() =>
                          openConfirmDialog(plan._id, "reject", plan.title)
                        }
                        disabled={actionLoading === plan._id}
                        size="small"
                      >
                        {actionLoading === plan._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Từ chối"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog duyệt kế hoạch với form */}
      <Dialog
        open={approvalDialog.open}
        onClose={closeApprovalDialog}
        maxWidth="lg"
        fullWidth
        disableScrollLock
        TransitionComponent={NoTransition}
      >
        <DialogTitle>Duyệt kế hoạch cai thuốc</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Phần trái - Thông tin kế hoạch */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
                <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin kế hoạch yêu cầu
                  </Typography>
                  {approvalDialog.planData && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {approvalDialog.planData.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {approvalDialog.planData.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Người yêu cầu:
                        </Typography>
                        <Typography variant="body2">
                          {approvalDialog.planData.userId.userName} (
                          {approvalDialog.planData.userId.email})
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Ngày tạo:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(approvalDialog.planData.createdAt)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Quy tắc yêu cầu:
                        </Typography>
                        {approvalDialog.planData.rules.map((rule) => (
                          <Box key={rule._id} sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ mr: 1, fontWeight: "bold" }}
                              >
                                ●
                              </Typography>
                              <Chip
                                label={getRuleTypeLabel(rule.rule)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ display: "block", ml: 3 }}
                            >
                              Số ngày: {rule.value} ngày
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                display: "block",
                                ml: 3,
                                color: "text.secondary",
                              }}
                            >
                              Mô tả: {rule.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Grid>

            {/* Phần phải - Form tạo kế hoạch */}
            <Grid item size={{ xs: 12, md: 8 }}>
              <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tạo kế hoạch cai thuốc
                  </Typography>

                  <Stack spacing={3}>
                    {/* Thông tin kế hoạch */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Thông tin chung
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          label="Tiêu đề kế hoạch"
                          value={approvalDialog.quitPlanData.title}
                          onChange={(e) =>
                            handleQuitPlanDataChange("title", e.target.value)
                          }
                          required
                          fullWidth
                        />
                        <TextField
                          label="Lý do/Mô tả"
                          value={approvalDialog.quitPlanData.reason}
                          onChange={(e) =>
                            handleQuitPlanDataChange("reason", e.target.value)
                          }
                          multiline
                          rows={3}
                          required
                          fullWidth
                        />
                        <TextField
                          label="Thời gian hoàn thành (ngày)"
                          type="number"
                          value={approvalDialog.quitPlanData.duration}
                          onChange={(e) =>
                            handleQuitPlanDataChange("duration", e.target.value)
                          }
                          required
                          fullWidth
                        />
                        <TextField
                          label="Hình ảnh URL (tùy chọn)"
                          value={approvalDialog.quitPlanData.image}
                          onChange={(e) =>
                            handleQuitPlanDataChange("image", e.target.value)
                          }
                          fullWidth
                        />
                      </Stack>
                    </Box>

                    {/* Giai đoạn */}
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Giai đoạn thực hiện
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={addStage}
                          variant="outlined"
                        >
                          Thêm giai đoạn
                        </Button>
                      </Box>

                      {approvalDialog.stagesData.map((stage, index) => (
                        <Paper
                          key={index}
                          sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="bold">
                              Giai đoạn {index + 1}
                            </Typography>
                            {approvalDialog.stagesData.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => removeStage(index)}
                                color="error"
                              >
                                <RemoveIcon />
                              </IconButton>
                            )}
                          </Box>

                          <Stack spacing={2}>
                            <TextField
                              label="Tên giai đoạn"
                              value={stage.stage_name}
                              onChange={(e) =>
                                handleStageDataChange(
                                  index,
                                  "stage_name",
                                  e.target.value
                                )
                              }
                              required
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Mô tả"
                              value={stage.description}
                              onChange={(e) =>
                                handleStageDataChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              multiline
                              rows={2}
                              required
                              fullWidth
                              size="small"
                            />
                            <Grid container spacing={1}>
                              <Grid item size={{ xs: 6 }}>
                                <TextField
                                  label="Thứ tự"
                                  type="number"
                                  value={stage.order_index}
                                  onChange={(e) =>
                                    handleStageDataChange(
                                      index,
                                      "order_index",
                                      e.target.value
                                    )
                                  }
                                  required
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 1 }}
                                />
                              </Grid>
                              <Grid item size={{ xs: 6 }}>
                                <TextField
                                  label="Thời gian (ngày)"
                                  type="number"
                                  value={stage.duration}
                                  onChange={(e) =>
                                    handleStageDataChange(
                                      index,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                  required
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 1 }}
                                />
                              </Grid>
                            </Grid>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApprovalDialog}>Hủy</Button>
          <Button
            onClick={handleApprovalSubmit}
            color="success"
            variant="contained"
            disabled={actionLoading === approvalDialog.planId}
          >
            {actionLoading === approvalDialog.planId ? (
              <CircularProgress size={20} />
            ) : (
              "Duyệt kế hoạch"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận từ chối */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        disableScrollLock
        TransitionComponent={NoTransition}
      >
        <DialogTitle>Xác nhận từ chối kế hoạch</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn từ chối kế hoạch "{confirmDialog.planTitle}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Hủy</Button>
          <Button
            onClick={() => {
              openRejectReasonDialog(
                confirmDialog.planId,
                confirmDialog.planTitle
              );
            }}
            color="error"
            variant="contained"
          >
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog nhập lý do từ chối */}
      <Dialog
        open={rejectReasonDialog.open}
        onClose={closeRejectReasonDialog}
        disableScrollLock
        TransitionComponent={NoTransition}
      >
        <DialogTitle>Lý do từ chối kế hoạch</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối kế hoạch "{rejectReasonDialog.planTitle}
            ":
          </Typography>
          <TextField
            fullWidth
            label="Lý do từ chối"
            value={rejectReasonDialog.rejectionReason}
            onChange={handleRejectionReasonChange}
            multiline
            rows={3}
            variant="outlined"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectReasonDialog}>Hủy</Button>
          <Button
            onClick={() =>
              handleAction(
                rejectReasonDialog.planId,
                "reject",
                rejectReasonDialog.rejectionReason
              )
            }
            color="error"
            variant="contained"
            disabled={!rejectReasonDialog.rejectionReason.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoachQuitPlans;
