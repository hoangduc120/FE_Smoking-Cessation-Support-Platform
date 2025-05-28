import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import CreatePlanDialog from "./CreatePlanDialog";
import "./PlanManagementPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import { deletePlan, fetchPlan } from "../../../store/slices/planeSlice";


export default function PlanManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plan, isLoading, isError } = useSelector((state) => state.plan);
  const auth = useSelector((state) => state.auth);
  const coachId = auth?.currentUser?.user?.id;

  useEffect(() => {
    if (!auth?.currentUser) {
      navigate(PATH.LOGIN);
    } else if (coachId) {
      dispatch(fetchPlan({ coachId }));
    } else {
      console.warn("coachId is undefined, cannot fetch plans.");
    }
  }, [auth, coachId, dispatch, navigate]);

  const [openDialog, setOpenDialog] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);

  const handleOpenDialog = (plan = null) => {
    setPlanToEdit(plan);
    setOpenDialog(true);
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa kế hoạch này?")) {
      try {
        await dispatch(deletePlan({ id })).unwrap();
     
        // Gọi lại fetchPlan để làm mới danh sách
        if (coachId) {
          await dispatch(fetchPlan({ coachId })).unwrap();
      
        }
      } catch (error) {
        console.error("DeletePlan error:", error);
      }
    }
  };

  if (!auth?.currentUser) {
    return null;
  }

  return (
    <Box className="dashboard">
      <Box className="planeManager">
        <Box className="planeManager-title">
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              flexDirection: "column",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            Quản lý kế hoạch cai thuốc
            <span
              style={{ fontSize: "20px", fontWeight: "100", color: "#acacb4" }}
            >
              Tạo và quản lý các kế hoạch cai thuốc của bạn
            </span>
          </Typography>
          <Button className="planeManager-btn" onClick={() => handleOpenDialog()}>
            Tạo kế hoạch mới
          </Button>
        </Box>
        <Box className="planeManager-card">
          <Grid container spacing={2}>
            <Grid item size={4} className="plan-grid">
              <Box className="plan-grid-title">
                <Typography sx={{ fontWeight: "bold" }}>
                  Tổng số kế hoạch
                </Typography>
                <AssignmentIcon />
              </Box>
              <Box>
                <Typography className="plan-grid-content">
                  {Array.isArray(plan) ? plan.length : 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item size={4} className="plan-grid">
              <Box className="plan-grid-title">
                <Typography sx={{ fontWeight: "bold" }}>
                  Tổng số học viên
                </Typography>
                <PersonIcon />
              </Box>
              <Box>
                <Typography className="plan-grid-des">
                  Trung bình{" "}
                  {Array.isArray(plan) && plan.length > 0
                    ? Math.round(
                        plan.reduce((total, p) => total + (p.students || 0), 0) /
                          plan.length
                      )
                    : 0}{" "}
                  học viên/kế hoạch
                </Typography>
              </Box>
            </Grid>
            <Grid item size={4} className="plan-grid">
              <Box className="plan-grid-title">
                <Typography sx={{ fontWeight: "bold" }}>
                  Kế hoạch phổ biến nhất
                </Typography>
                <AddTaskIcon />
              </Box>
              <Box>
                <Typography className="plan-grid-content">
                  {Array.isArray(plan) && plan.length > 0
                    ? plan.reduce((max, p) =>
                        (p.students || 0) > (max.students || 0) ? p : max
                      ).title || "N/A"
                    : "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography className="plan-grid-des">
                  {Array.isArray(plan) && plan.length > 0
                    ? plan.reduce((max, p) =>
                        (p.students || 0) > (max.students || 0) ? p : max
                      ).students || 0
                    : 0}{" "}
                  học viên
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className="planeManager-table">
          <Box sx={{ padding: "20px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Danh sách kế hoạch
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="Tìm kiếm kế hoạch..."
                  size="small"
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "#888", mr: 1 }} />
                    ),
                  }}
                />
                <Select value="tat-ca" size="small" sx={{ minWidth: 150 }}>
                  <MenuItem value="tat-ca">Tất cả trạng thái</MenuItem>
                  <MenuItem value="dang-hoat-dong">Đang hoạt động</MenuItem>
                  <MenuItem value="ban-nhap">Bản nháp</MenuItem>
                </Select>
              </Box>
            </Box>
            <TableContainer
              component={Paper}
              sx={{ border: "1px solid #afafaf", borderRadius: "10px" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Tên kế hoạch
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Thời gian
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Giá
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Học viên
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6}>Đang tải...</TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        Lỗi: {isError.message || "Đã có lỗi xảy ra"}
                      </TableCell>
                    </TableRow>
                  ) : !Array.isArray(plan) || plan.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>Không có kế hoạch nào</TableCell>
                    </TableRow>
                  ) : (
                    plan.map((planItem) => (
                      <TableRow key={planItem._id}>
                        <TableCell>
                          <Box>
                            {planItem.title}
                            <Typography
                              variant="caption"
                              sx={{ display: "block", color: "#888" }}
                            >
                              {planItem.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{planItem.duration || "N/A"}</TableCell>
                        <TableCell>
                          {(planItem.price || 0).toLocaleString()}đ
                        </TableCell>
                        <TableCell>{planItem.students || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              planItem.status === "active"
                                ? "Đang hoạt động"
                                : "Bản nháp"
                            }
                            sx={{
                              backgroundColor:
                                planItem.status === "active"
                                  ? "#e6ffe6"
                                  : "#f0f0f0",
                              color:
                                planItem.status === "active"
                                  ? "#19a24b"
                                  : "#666",
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(planItem)}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeletePlan(planItem._id)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <CreatePlanDialog
        open={openDialog}
        setOpen={setOpenDialog}
        coachId={coachId}
        planToEdit={planToEdit}
      />
    </Box>
  );
}