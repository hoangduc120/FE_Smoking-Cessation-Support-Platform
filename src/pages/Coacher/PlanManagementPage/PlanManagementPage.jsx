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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  Stack,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import CreatePlanDialog from "./CreatePlanDialog";
import "./PlanManagementPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import toast from "react-hot-toast";
import { deletePlan, fetchAllPlan } from "../../../store/slices/planeSlice";

export default function PlanManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, isLoading, isError } = useSelector((state) => state.plan);
  const auth = useSelector((state) => state.auth);
  const coachId = auth?.currentUser?.user?.id;

  const [openDialog, setOpenDialog] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [planIdToDelete, setPlanIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("tat-ca");
  const pageSize = 3; // Hiển thị 3 kế hoạch mỗi trang

  useEffect(() => {
    if (!auth?.currentUser) {
      navigate(PATH.LOGIN);
    } else if (coachId) {
      dispatch(fetchAllPlan({ coachId, page: 1, limit: 1000 })); // Lấy tối đa 100 bản ghi
    } else {
      console.warn("coachId is undefined, cannot fetch plans.");
    }
  }, [auth, coachId, dispatch, navigate]);

  // Reset trang khi tìm kiếm hoặc lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleOpenDialog = (plan = null) => {
    setPlanToEdit(plan);
    setOpenDialog(true);
  };

  const handleOpenConfirmDialog = (id) => {
    setPlanIdToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setPlanIdToDelete(null);
  };

  const handleDeletePlan = async () => {
    if (planIdToDelete) {
      try {
        await dispatch(deletePlan({ id: planIdToDelete })).unwrap();
        if (coachId) {
          await dispatch(
            fetchAllPlan({ coachId, page: 1, limit: 100 })
          ).unwrap();
          toast.success("Xóa kế hoạch thành công");
        }
      } catch (error) {
        console.error("DeletePlan error:", error);
        toast.error("Xóa kế hoạch thất bại!");
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  // Lọc kế hoạch dựa trên tiêu đề và trạng thái
  const filteredPlans = (plans?.data || []).filter(
    (plan) =>
      (plan.title || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "tat-ca" || plan.status === filterStatus)
  );

  // Tính toán phân trang
  const totalPlans = filteredPlans.length;
  const totalPages = Math.ceil(totalPlans / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
          <Button
            className="planeManager-btn"
            onClick={() => handleOpenDialog()}
          >
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
                  {filteredPlans.length}
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
                  {filteredPlans.length > 0
                    ? Math.round(
                        filteredPlans.reduce(
                          (total, p) => total + (p.students || 0),
                          0
                        ) / filteredPlans.length
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
                  {filteredPlans.length > 0
                    ? filteredPlans.reduce((max, p) =>
                        (p.students || 0) > (max.students || 0) ? p : max
                      ).title || "N/A"
                    : "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography className="plan-grid-des">
                  {filteredPlans.length > 0
                    ? filteredPlans.reduce((max, p) =>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "#888", mr: 1 }} />
                    ),
                  }}
                />
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="tat-ca">Tất cả trạng thái</MenuItem>
                  <MenuItem value="template">Đang hoạt động</MenuItem>
                  <MenuItem value="draft">Bản nháp</MenuItem>
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
                      Ngày bắt đầu
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Ngày kết thúc
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Lý do cai thuốc
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
                  ) : !Array.isArray(currentPlans) ||
                    currentPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        {filteredPlans.length === 0
                          ? "Không tìm thấy kế hoạch nào phù hợp"
                          : "Không có kế hoạch nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPlans.map((planItem) => (
                      <TableRow key={planItem._id}>
                        <TableCell>
                          <Box>
                            {planItem.title}
                            <Typography
                              variant="caption"
                              sx={{ display: "block", color: "#888" }}
                            >
                              {planItem.reason}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {planItem.startDate &&
                          !isNaN(new Date(planItem.startDate).getTime())
                            ? format(new Date(planItem.startDate), "dd/MM/yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {planItem.endDate &&
                          !isNaN(new Date(planItem.endDate).getTime())
                            ? format(new Date(planItem.endDate), "dd/MM/yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{planItem.reason || "N/A"}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              planItem.status === "template"
                                ? "Đang hoạt động"
                                : "Bản nháp"
                            }
                            sx={{
                              backgroundColor:
                                planItem.status === "template"
                                  ? "#39ad32"
                                  : "#f0f0f0",
                              color: "white",
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
                              onClick={() =>
                                handleOpenConfirmDialog(planItem._id)
                              }
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
            <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </Box>
        </Box>
      </Box>
      <CreatePlanDialog
        open={openDialog}
        setOpen={setOpenDialog}
        coachId={coachId}
        planToEdit={planToEdit}
      />
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Xác nhận xóa kế hoạch
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description">
            Bạn có chắc muốn xóa kế hoạch này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeletePlan} color="error" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
