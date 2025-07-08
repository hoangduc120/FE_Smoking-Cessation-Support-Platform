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
  Delete as DeleteIcon,
} from "@mui/icons-material";
import React from "react";
import {
  fetchCustomQuitPlans,
  approveCustomQuitPlan,
  rejectCustomQuitPlan,
  fetchApprovedCustomQuitPlans,
} from "../../../store/slices/customPlanSlice";

// A no-op transition that simply renders its children
const NoTransition = React.forwardRef(function NoTransition(props, ref) {
  const { children } = props;
  return <div ref={ref}>{children}</div>;
});

const CoachQuitPlans = () => {
  const dispatch = useDispatch();
  const { customPlansList, approvedCustomPlans, isLoading, isError, errorMessage } = useSelector(
    (state) => state.customPlan
  );
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
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

  const fetchApprovedPlans = async () => {
    dispatch(fetchApprovedCustomQuitPlans());
  };

  useEffect(() => {
    fetchPlans();
    fetchApprovedPlans();
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
        // Update filteredPlans to remove the rejected plan
        setFilteredPlans((prev) => prev.filter((plan) => plan._id !== planId));
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
            <IconButton onClick={() => { fetchPlans(); fetchApprovedPlans(); }} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Tabs để chuyển đổi giữa Pending và Approved */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
            },
          }}
        >
          <Tab
            label={`Chờ duyệt (${filteredPlans.length})`}
            sx={{ color: "#ff9800" }}
          />
          <Tab
            label={`Đã duyệt (${approvedCustomPlans.length})`}
            sx={{ color: "#4caf50" }}
          />
        </Tabs>
      </Paper>

      {selectedTab === 0 && (
        <>
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
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                          gutterBottom
                          sx={{ flex: 1, pr: 1 }}
                        >
                          {plan.title}
                        </Typography>
                        <Chip
                          label={getStatusText(plan.status)}
                          color={getStatusColor(plan.status)}
                          size="small"
                          sx={{ flexShrink: 0 }}
                        />
                      </Box>

                      {plan.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {plan.description}
                        </Typography>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {plan.userId.userName}
                          </Typography>
                          <Tooltip title={plan.userId.email}>
                            <EmailIcon
                              color="action"
                              fontSize="small"
                              sx={{ cursor: "help" }}
                            />
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ScheduleIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(plan.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Quy tắc yêu cầu:
                        </Typography>
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

                    <Divider />

                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<ApproveIcon />}
                          onClick={() =>
                            openConfirmDialog(plan._id, "approve", plan.title)
                          }
                          disabled={actionLoading === plan._id}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: "none",
                          }}
                        >
                          Duyệt
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<RejectIcon />}
                          onClick={() =>
                            openConfirmDialog(plan._id, "reject", plan.title)
                          }
                          disabled={actionLoading === plan._id}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: "none",
                          }}
                        >
                          Từ chối
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {selectedTab === 1 && (
        <Box>
          {approvedCustomPlans.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                Chưa có kế hoạch custom nào được duyệt
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {approvedCustomPlans.map((approvedPlan) => (
                <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={approvedPlan.customRequest._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                      border: "2px solid #4caf50",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                          gutterBottom
                          sx={{ flex: 1, pr: 1 }}
                        >
                          {approvedPlan.quitPlan.title}
                        </Typography>
                        <Chip
                          label={`${approvedPlan.quitPlan.status} (${approvedPlan.progress.completionPercentage}%)`}
                          color="success"
                          size="small"
                          sx={{ flexShrink: 0 }}
                        />
                      </Box>

                      {approvedPlan.quitPlan.reason && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {approvedPlan.quitPlan.reason}
                        </Typography>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {approvedPlan.user.userName}
                          </Typography>
                          <Tooltip title={approvedPlan.user.email}>
                            <EmailIcon
                              color="action"
                              fontSize="small"
                              sx={{ cursor: "help" }}
                            />
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ScheduleIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            Duyệt: {formatDate(approvedPlan.customRequest.approvedAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Tiến độ thực hiện:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {approvedPlan.progress.completedStages}/{approvedPlan.progress.totalStages} giai đoạn ({approvedPlan.progress.completionPercentage}%)
                        </Typography>
                        <Box sx={{ width: "100%", mt: 1 }}>
                          <Box
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "grey.300",
                              position: "relative",
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                borderRadius: 4,
                                bgcolor: approvedPlan.progress.isCompleted ? "#4caf50" : "#2196f3",
                                width: `${approvedPlan.progress.completionPercentage}%`,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
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
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            borderRadius: "3px 3px 0 0",
          }}
        >
          Duyệt kế hoạch cai thuốc
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.9)",
            p: 3,
          }}
        >
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Phần trái - Thông tin kế hoạch */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  pr: 1,
                  scrollbarWidth: "thin",
                  scrollbarColor: "#667eea rgba(102, 126, 234, 0.1)",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(102, 126, 234, 0.1)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#667eea",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#764ba2",
                    },
                  },
                }}
              >
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(255, 255, 255, 0.85)",
                    borderRadius: 2,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#333", fontWeight: "bold" }}
                  >
                    Thông tin kế hoạch yêu cầu
                  </Typography>
                  {approvalDialog.planData && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "#764ba2" }}
                      >
                        {approvalDialog.planData.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
                        {approvalDialog.planData.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ color: "#667eea" }}
                        >
                          Người yêu cầu:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          {approvalDialog.planData.userId.userName} (
                          {approvalDialog.planData.userId.email})
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ color: "#667eea" }}
                        >
                          Ngày tạo:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          {formatDate(approvalDialog.planData.createdAt)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                          sx={{ color: "#667eea" }}
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
                                sx={{
                                  mr: 1,
                                  fontWeight: "bold",
                                  color: "#764ba2",
                                }}
                              >
                                ●
                              </Typography>
                              <Chip
                                label={getRuleTypeLabel(rule.rule)}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: "#667eea",
                                  color: "#667eea",
                                  bgcolor: "rgba(102, 126, 234, 0.1)",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ display: "block", ml: 3, color: "#555" }}
                            >
                              Số ngày: {rule.value} ngày
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "block", ml: 3, color: "#777" }}
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
              <Box
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  pr: 1,
                  scrollbarWidth: "thin",
                  scrollbarColor: "#667eea rgba(102, 126, 234, 0.1)",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(102, 126, 234, 0.1)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#667eea",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#764ba2",
                    },
                  },
                }}
              >
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(255, 255, 255, 0.85)",
                    borderRadius: 2,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#333", fontWeight: "bold" }}
                  >
                    Tạo kế hoạch cai thuốc
                  </Typography>
                  <Stack spacing={3}>
                    {/* Thông tin kế hoạch */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "#764ba2" }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "& fieldset": { borderColor: "#667eea" },
                              "&:hover fieldset": { borderColor: "#764ba2" },
                            },
                            "& .MuiInputLabel-root": { color: "#667eea" },
                          }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "& fieldset": { borderColor: "#667eea" },
                              "&:hover fieldset": { borderColor: "#764ba2" },
                            },
                            "& .MuiInputLabel-root": { color: "#667eea" },
                          }}
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
                          inputProps={{ min: 1 }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "& fieldset": { borderColor: "#667eea" },
                              "&:hover fieldset": { borderColor: "#764ba2" },
                            },
                            "& .MuiInputLabel-root": { color: "#667eea" },
                          }}
                        />
                        <TextField
                          label="Hình ảnh URL (tùy chọn)"
                          value={approvalDialog.quitPlanData.image}
                          onChange={(e) =>
                            handleQuitPlanDataChange("image", e.target.value)
                          }
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "& fieldset": { borderColor: "#667eea" },
                              "&:hover fieldset": { borderColor: "#764ba2" },
                            },
                            "& .MuiInputLabel-root": { color: "#667eea" },
                          }}
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
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ color: "#764ba2" }}
                        >
                          Giai đoạn thực hiện
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={addStage}
                          variant="contained"
                          sx={{
                            bgcolor: "#667eea",
                            color: "#fff",
                            "&:hover": { bgcolor: "#764ba2" },
                            borderRadius: 2,
                          }}
                        >
                          Thêm giai đoạn
                        </Button>
                      </Box>
                      {approvalDialog.stagesData.map((stage, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: "rgba(102, 126, 234, 0.05)",
                            borderRadius: 2,
                            border: "1px solid rgba(102, 126, 234, 0.2)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              sx={{ color: "#667eea" }}
                            >
                              Giai đoạn {index + 1}
                            </Typography>
                            {approvalDialog.stagesData.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => removeStage(index)}
                                sx={{ color: "#e57373" }}
                              >
                                <DeleteIcon />
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
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "& fieldset": { borderColor: "#667eea" },
                                  "&:hover fieldset": {
                                    borderColor: "#764ba2",
                                  },
                                },
                                "& .MuiInputLabel-root": { color: "#667eea" },
                              }}
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
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "& fieldset": { borderColor: "#667eea" },
                                  "&:hover fieldset": {
                                    borderColor: "#764ba2",
                                  },
                                },
                                "& .MuiInputLabel-root": { color: "#667eea" },
                              }}
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
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                      "& fieldset": { borderColor: "#667eea" },
                                      "&:hover fieldset": {
                                        borderColor: "#764ba2",
                                      },
                                    },
                                    "& .MuiInputLabel-root": {
                                      color: "#667eea",
                                    },
                                  }}
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
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                      "& fieldset": { borderColor: "#667eea" },
                                      "&:hover fieldset": {
                                        borderColor: "#764ba2",
                                      },
                                    },
                                    "& .MuiInputLabel-root": {
                                      color: "#667eea",
                                    },
                                  }}
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
        <DialogActions
          sx={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(5px)",
            "@supports not (backdrop-filter: blur(5px))": {
              background: "rgba(102, 126, 234, 0.5)",
            },
            p: 2,
            borderRadius: "0 0 3px 3px",
          }}
        >
          <Button
            onClick={closeApprovalDialog}
            sx={{
              color: "#fff",
              bgcolor: "#e57373",
              "&:hover": { bgcolor: "#d32f2f" },
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleApprovalSubmit}
            color="success"
            variant="contained"
            disabled={actionLoading === approvalDialog.planId}
            sx={{
              bgcolor: "#4caf50",
              "&:hover": { bgcolor: "#388e3c" },
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {actionLoading === approvalDialog.planId ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "2px solid #9FD7F9",
            boxShadow: 10,
            backgroundColor: "#fdfefe", // màu nền nhẹ
            width: 500,
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            color: "#1976d2", // màu xanh MUI
            pb: 0,
          }}
        >
          Lý do từ chối kế hoạch
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ mb: 2, fontSize: "1rem" }}>
            Vui lòng nhập lý do từ chối kế hoạch "
            <strong>{rejectReasonDialog.planTitle}</strong>":
          </Typography>

          <TextField
            fullWidth
            label="Lý do từ chối"
            value={rejectReasonDialog.rejectionReason}
            onChange={handleRejectionReasonChange}
            multiline
            rows={3}
            required
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#9FD7F9",
                },
                "&:hover fieldset": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button
            onClick={closeRejectReasonDialog}
            sx={{
              color: "#1976d2",
              borderColor: "#1976d2",
              textTransform: "none",
              ":hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Hủy
          </Button>
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
            sx={{
              textTransform: "none",
              boxShadow: "none",
              ":hover": {
                backgroundColor: "#d32f2f",
              },
            }}
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
