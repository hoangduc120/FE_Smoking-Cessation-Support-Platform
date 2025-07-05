// "use client";

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Grid,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   Snackbar,
//   Paper,
//   Tabs,
//   Tab,
//   CircularProgress,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import {
//   CheckCircle as ApproveIcon,
//   Cancel as RejectIcon,
//   Person as PersonIcon,
//   Schedule as ScheduleIcon,
//   Rule as RuleIcon,
//   Refresh as RefreshIcon,
//   Email as EmailIcon,
// } from "@mui/icons-material";
// import React from "react";

// // A no-op transition that simply renders its children
// const NoTransition = React.forwardRef(function NoTransition(props, ref) {
//   const { children } = props;
//   return <div ref={ref}>{children}</div>;
// });

// const CoachQuitPlans = () => {
//   // Hardcoded data for display
//   const hardcodedPlans = [
//     {
//       _id: "68693099d4f943a0d10c050e",
//       userId: {
//         _id: "6835967c9a0dc287ff72ae9f",
//         userName: "truongdoan25",
//         email: "doandinhquangtruong@gmail.com",
//       },
//       coachId: null,
//       title: "Kế hoạch cai thuốc lá cá nhân",
//       description: "Tôi muốn một kế hoạch phù hợp với lịch làm việc của mình",
//       rules: [
//         {
//           rule: "daily",
//           value: 10,
//           description: "Giảm 10 điếu mỗi ngày",
//           _id: "68693099d4f943a0d10c050f",
//         },
//         {
//           rule: "duration",
//           value: 60,
//           description: "Hoàn thành trong 60 ngày",
//           _id: "68693099d4f943a0d10c0510",
//         },
//         {
//           rule: "specificGoal",
//           value: "quit_completely",
//           description: "Mục tiêu: Bỏ thuốc hoàn toàn triệt để",
//           _id: "68693099d4f943a0d10c0511",
//         },
//       ],
//       status: "pending",
//       quitPlanId: null,
//       createdAt: "2025-01-05T14:03:05.714Z",
//       updatedAt: "2025-01-05T14:03:05.714Z",
//       __v: 0,
//     },
//     {
//       _id: "68693099d4f943a0d10c051a",
//       userId: {
//         _id: "6835967c9a0dc287ff72ae8f",
//         userName: "nguyenvan123",
//         email: "nguyenvan@gmail.com",
//       },
//       coachId: null,
//       title: "Kế hoạch giảm dần thuốc lá",
//       description: "Muốn giảm từ từ để không bị shock",
//       rules: [
//         {
//           rule: "daily",
//           value: 5,
//           description: "Giảm 5 điếu mỗi ngày",
//           _id: "68693099d4f943a0d10c051b",
//         },
//         {
//           rule: "duration",
//           value: 30,
//           description: "Hoàn thành trong 30 ngày",
//           _id: "68693099d4f943a0d10c051c",
//         },
//       ],
//       status: "approved",
//       quitPlanId: null,
//       createdAt: "2025-01-04T10:15:20.714Z",
//       updatedAt: "2025-01-04T15:30:45.714Z",
//       __v: 0,
//     },
//     {
//       _id: "68693099d4f943a0d10c052a",
//       userId: {
//         _id: "6835967c9a0dc287ff72ae7f",
//         userName: "lethimai",
//         email: "lethimai@gmail.com",
//       },
//       coachId: null,
//       title: "Kế hoạch cai thuốc cuối tuần",
//       description: "Chỉ muốn hút thuốc vào cuối tuần thôi",
//       rules: [
//         {
//           rule: "specificGoal",
//           value: "weekend_only",
//           description: "Chỉ hút cuối tuần",
//           _id: "68693099d4f943a0d10c052b",
//         },
//       ],
//       status: "rejected",
//       quitPlanId: null,
//       createdAt: "2025-01-03T08:20:15.714Z",
//       updatedAt: "2025-01-03T16:45:30.714Z",
//       __v: 0,
//     },
//     {
//       _id: "68693099d4f943a0d10c053a",
//       userId: {
//         _id: "6835967c9a0dc287ff72ae6f",
//         userName: "phamhoang",
//         email: "phamhoang@gmail.com",
//       },
//       coachId: null,
//       title: "Kế hoạch cai thuốc nhanh",
//       description: "Muốn bỏ thuốc trong thời gian ngắn nhất",
//       rules: [
//         {
//           rule: "daily",
//           value: 15,
//           description: "Giảm 15 điếu mỗi ngày",
//           _id: "68693099d4f943a0d10c053b",
//         },
//         {
//           rule: "duration",
//           value: 14,
//           description: "Hoàn thành trong 2 tuần",
//           _id: "68693099d4f943a0d10c053c",
//         },
//         {
//           rule: "specificGoal",
//           value: "quit_completely",
//           description: "Bỏ thuốc hoàn toàn",
//           _id: "68693099d4f943a0d10c053d",
//         },
//       ],
//       status: "pending",
//       quitPlanId: null,
//       createdAt: "2025-01-05T09:30:10.714Z",
//       updatedAt: "2025-01-05T09:30:10.714Z",
//       __v: 0,
//     },
//     {
//       _id: "68693099d4f943a0d10c054a",
//       userId: {
//         _id: "6835967c9a0dc287ff72ae5f",
//         userName: "tranminh",
//         email: "tranminh@gmail.com",
//       },
//       coachId: null,
//       title: "Kế hoạch giảm 75%",
//       description: "Không muốn bỏ hoàn toàn, chỉ giảm 75%",
//       rules: [
//         {
//           rule: "specificGoal",
//           value: "reduce_75",
//           description: "Giảm 75% lượng thuốc",
//           _id: "68693099d4f943a0d10c054b",
//         },
//         {
//           rule: "duration",
//           value: 45,
//           description: "Thực hiện trong 45 ngày",
//           _id: "68693099d4f943a0d10c054c",
//         },
//       ],
//       status: "approved",
//       quitPlanId: null,
//       createdAt: "2025-01-02T14:25:35.714Z",
//       updatedAt: "2025-01-02T18:40:20.714Z",
//       __v: 0,
//     },
//   ];

//   const [plans, setPlans] = useState(hardcodedPlans);
//   const [filteredPlans, setFilteredPlans] = useState(hardcodedPlans);
//   const [loading, setLoading] = useState(false); // Set to false since we're using hardcoded data
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [confirmDialog, setConfirmDialog] = useState({
//     open: false,
//     planId: null,
//     action: null,
//     planTitle: "",
//   });
//   const [notification, setNotification] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [actionLoading, setActionLoading] = useState(null);

//   const statusTabs = [
//     { label: "Tất cả", value: "all", color: "default" },
//     { label: "Chờ duyệt", value: "pending", color: "warning" },
//     { label: "Đã duyệt", value: "approved", color: "success" },
//     { label: "Đã từ chối", value: "rejected", color: "error" },
//   ];

//   const fetchPlans = async () => {
//     // Simulate loading for demo purposes
//     setLoading(true);
//     setTimeout(() => {
//       setPlans(hardcodedPlans);
//       setLoading(false);
//       setNotification({
//         open: true,
//         message: "Dữ liệu đã được làm mới!",
//         severity: "success",
//       });
//     }, 1000);
//   };

//   useEffect(() => {
//     const currentTab = statusTabs[selectedTab];
//     if (currentTab.value === "all") {
//       setFilteredPlans(plans);
//     } else {
//       setFilteredPlans(
//         plans.filter((plan) => plan.status === currentTab.value)
//       );
//     }
//   }, [plans, selectedTab]);

//   const handleAction = async (planId, action) => {
//     setActionLoading(planId);

//     // Simulate API call
//     setTimeout(() => {
//       // Update the plan status in hardcoded data
//       const updatedPlans = plans.map((plan) =>
//         plan._id === planId
//           ? { ...plan, status: action === "approve" ? "approved" : "rejected" }
//           : plan
//       );
//       setPlans(updatedPlans);

//       setNotification({
//         open: true,
//         message: `Kế hoạch đã được ${action === "approve" ? "duyệt" : "từ chối"} thành công!`,
//         severity: "success",
//       });

//       setActionLoading(null);
//       setConfirmDialog({
//         open: false,
//         planId: null,
//         action: null,
//         planTitle: "",
//       });
//     }, 1500);
//   };

//   const openConfirmDialog = (planId, action, planTitle) => {
//     setConfirmDialog({
//       open: true,
//       planId,
//       action,
//       planTitle,
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "warning";
//       case "approved":
//         return "success";
//       case "rejected":
//         return "error";
//       default:
//         return "default";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "Chờ duyệt";
//       case "approved":
//         return "Đã duyệt";
//       case "rejected":
//         return "Đã từ chối";
//       default:
//         return status;
//     }
//   };

//   const getRuleTypeLabel = (ruleType) => {
//     switch (ruleType) {
//       case "daily":
//         return "Giảm hàng ngày";
//       case "duration":
//         return "Thời gian hoàn thành";
//       case "specificGoal":
//         return "Mục tiêu cụ thể";
//       default:
//         return ruleType;
//     }
//   };

//   const getSpecificGoalLabel = (value) => {
//     switch (value) {
//       case "quit_completely":
//         return "Bỏ thuốc hoàn toàn";
//       case "reduce_half":
//         return "Giảm một nửa";
//       case "reduce_75":
//         return "Giảm 75%";
//       case "weekend_only":
//         return "Chỉ hút cuối tuần";
//       default:
//         return value;
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "400px",
//         }}
//       >
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 3,
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "white",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               component="h1"
//               fontWeight="bold"
//               gutterBottom
//             >
//               Quản Lý Kế Hoạch Cai Thuốc
//             </Typography>
//             <Typography variant="body1" sx={{ opacity: 0.9 }}>
//               Xem xét và phê duyệt các kế hoạch cai thuốc của người dùng
//             </Typography>
//           </Box>
//           <Tooltip title="Làm mới dữ liệu">
//             <IconButton onClick={fetchPlans} sx={{ color: "white" }}>
//               <RefreshIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Paper>

//       <Paper sx={{ mb: 3 }}>
//         <Tabs
//           value={selectedTab}
//           onChange={(e, newValue) => setSelectedTab(newValue)}
//           variant="fullWidth"
//           sx={{ borderBottom: 1, borderColor: "divider" }}
//         >
//           {statusTabs.map((tab, index) => (
//             <Tab
//               key={tab.value}
//               label={
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   {tab.label}
//                   <Chip
//                     size="small"
//                     label={
//                       tab.value === "all"
//                         ? plans.length
//                         : plans.filter((p) => p.status === tab.value).length
//                     }
//                     color={tab.color}
//                   />
//                 </Box>
//               }
//             />
//           ))}
//         </Tabs>
//       </Paper>

//       {filteredPlans.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="h6" color="text.secondary">
//             Không có kế hoạch nào trong danh mục này
//           </Typography>
//         </Paper>
//       ) : (
//         <Grid container spacing={3}>
//           {filteredPlans.map((plan) => (
//             <Grid item szie={{ xs: 12, md: 6, lg: 4 }} key={plan._id}>
//               <Card
//                 elevation={3}
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       mb: 2,
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       component="h2"
//                       fontWeight="bold"
//                       sx={{ flexGrow: 1, mr: 1 }}
//                     >
//                       {plan.title}
//                     </Typography>
//                     <Chip
//                       label={getStatusText(plan.status)}
//                       color={getStatusColor(plan.status)}
//                       size="small"
//                     />
//                   </Box>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mb: 2 }}
//                   >
//                     {plan.description}
//                   </Typography>

//                   <Divider sx={{ my: 2 }} />

//                   <Box sx={{ mb: 2 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <PersonIcon
//                         sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
//                       />
//                       <Typography variant="body2" fontWeight="medium">
//                         {plan.userId.userName}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <EmailIcon
//                         sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         {plan.userId.email}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <ScheduleIcon
//                         sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         {formatDate(plan.createdAt)}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   <Box>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <RuleIcon
//                         sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
//                       />
//                       <Typography variant="body2" fontWeight="medium">
//                         Quy tắc ({plan.rules.length})
//                       </Typography>
//                     </Box>
//                     <List dense sx={{ py: 0 }}>
//                       {plan.rules.map((rule, index) => (
//                         <ListItem key={rule._id} sx={{ px: 0, py: 0.5 }}>
//                           <ListItemText
//                             primary={
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 1,
//                                 }}
//                               >
//                                 <Chip
//                                   label={getRuleTypeLabel(rule.rule)}
//                                   size="small"
//                                   variant="outlined"
//                                 />
//                                 <Typography variant="body2">
//                                   Giá trị:{" "}
//                                   {rule.rule === "specificGoal"
//                                     ? getSpecificGoalLabel(rule.value)
//                                     : rule.value}
//                                 </Typography>
//                               </Box>
//                             }
//                             secondary={rule.description}
//                           />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Box>
//                 </CardContent>

//                 {plan.status === "pending" && (
//                   <Box sx={{ p: 2, pt: 0 }}>
//                     <Grid container spacing={1}>
//                       <Grid item xs={6}>
//                         <Button
//                           fullWidth
//                           variant="contained"
//                           color="success"
//                           startIcon={<ApproveIcon />}
//                           onClick={() =>
//                             openConfirmDialog(plan._id, "approve", plan.title)
//                           }
//                           disabled={actionLoading === plan._id}
//                           size="small"
//                         >
//                           {actionLoading === plan._id ? (
//                             <CircularProgress size={20} />
//                           ) : (
//                             "Duyệt"
//                           )}
//                         </Button>
//                       </Grid>
//                       <Grid item size={{ xs: 6 }}>
//                         <Button
//                           fullWidth
//                           variant="contained"
//                           color="error"
//                           startIcon={<RejectIcon />}
//                           onClick={() =>
//                             openConfirmDialog(plan._id, "reject", plan.title)
//                           }
//                           disabled={actionLoading === plan._id}
//                           size="small"
//                         >
//                           {actionLoading === plan._id ? (
//                             <CircularProgress size={20} />
//                           ) : (
//                             "Từ chối"
//                           )}
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 )}
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Dialog
//         open={confirmDialog.open}
//         onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
//         disableScrollLock
//         TransitionComponent={NoTransition}
//       >
//         <DialogTitle>
//           Xác nhận {confirmDialog.action === "approve" ? "duyệt" : "từ chối"} kế
//           hoạch
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             Bạn có chắc chắn muốn{" "}
//             {confirmDialog.action === "approve" ? "duyệt" : "từ chối"} kế hoạch
//             "{confirmDialog.planTitle}"?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
//           >
//             Hủy
//           </Button>
//           <Button
//             onClick={() =>
//               handleAction(confirmDialog.planId, confirmDialog.action)
//             }
//             color={confirmDialog.action === "approve" ? "success" : "error"}
//             variant="contained"
//           >
//             {confirmDialog.action === "approve" ? "Duyệt" : "Từ chối"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
//       >
//         <Alert
//           onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
//           severity={notification.severity}
//           sx={{ width: "100%" }}
//         >
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default CoachQuitPlans;

"use client";

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
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Rule as RuleIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
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
  const [selectedTab, setSelectedTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    planId: null,
    action: null,
    planTitle: "",
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

  const statusTabs = [
    { label: "Chờ duyệt", value: "pending", color: "warning" },
  ];

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
    setRejectReasonDialog((prev) => ({ ...prev, open: false }));
    setActionLoading(planId);
    try {
      if (action === "approve") {
        await dispatch(
          approveCustomQuitPlan({
            // gửi lên request body vì bắt buộc
            requestId: planId,
            quitPlanData: {
              title: "Kế hoạch cá nhân cho User",
              reason: "Kế hoạch được tùy chỉnh theo yêu cầu",
              duration: 30,
              image: "https://example.com/custom-plan.jpg",
            },
            stagesData: [
              {
                stage_name: "Giai đoạn 1: Giảm dần",
                description: "Giảm 50% lượng thuốc lá",
                order_index: 1,
                duration: 15,
              },
              {
                stage_name: "Giai đoạn 2: Bỏ hoàn toàn",
                description: "Ngừng hút thuốc hoàn toàn",
                order_index: 2,
                duration: 15,
              },
            ],
          })
        ).unwrap();
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
    }
  };

  const openConfirmDialog = (planId, action, planTitle) => {
    setConfirmDialog({
      open: true,
      planId,
      action,
      planTitle,
    });
    // ❗Chỉ reset rejectReasonDialog nếu action là "reject"
    if (action === "reject") {
      setRejectReasonDialog({
        open: false,
        planId: null,
        planTitle: "",
        rejectionReason: "",
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
            <Grid item xs={12} md={6} lg={4} key={plan._id}>
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
                        <ListItem key={rule._id} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={getRuleTypeLabel(rule.rule)}
                                  size="small"
                                  variant="outlined"
                                />
                                <Typography variant="body2">
                                  Giá trị:{" "}
                                  {rule.rule === "specificGoal"
                                    ? getSpecificGoalLabel(rule.value)
                                    : rule.value}
                                </Typography>
                              </Box>
                            }
                            secondary={rule.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        disableScrollLock
        TransitionComponent={NoTransition}
      >
        <DialogTitle>
          Xác nhận {confirmDialog.action === "approve" ? "duyệt" : "từ chối"} kế
          hoạch
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn{" "}
            {confirmDialog.action === "approve" ? "duyệt" : "từ chối"} kế hoạch
            "{confirmDialog.planTitle}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Hủy
          </Button>
          <Button
            onClick={() =>
              confirmDialog.action === "approve"
                ? handleAction(confirmDialog.planId, confirmDialog.action)
                : openRejectReasonDialog(
                    confirmDialog.planId,
                    confirmDialog.planTitle
                  )
            }
            color={confirmDialog.action === "approve" ? "success" : "error"}
            variant="contained"
          >
            {confirmDialog.action === "approve" ? "Duyệt" : "Tiếp tục"}
          </Button>
        </DialogActions>
      </Dialog>

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
