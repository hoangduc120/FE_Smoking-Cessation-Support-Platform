import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Add as PlusIcon,
  Edit as EditIcon,
  Delete as TrashIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import toast from "react-hot-toast";
import { isValid, parseISO } from "date-fns";
import "./PlanStage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import { fetchAllPlan } from "../../../store/slices/planeSlice";
import {
  createStageApi,
  updateStageApi,
} from "../../../store/slices/stagesSlice";

// Yup validation schema
const stageSchema = Yup.object().shape({
  quitPlanId: Yup.string().required("Vui lòng chọn kế hoạch"),
  stage_name: Yup.string()
    .required("Vui lòng nhập tên giai đoạn")
    .max(100, "Tên giai đoạn quá dài"),
  description: Yup.string()
    .required("Vui lòng nhập mô tả")
    .max(500, "Mô tả quá dài"),
  order_index: Yup.number()
    .required("Vui lòng nhập thứ tự")
    .min(1, "Thứ tự phải lớn hơn 0"),
  start_date: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
  end_date: Yup.string()
    .required("Vui lòng chọn ngày kết thúc")
    .test(
      "is-after-start",
      "Ngày kết thúc phải sau ngày bắt đầu",
      function (value) {
        const { start_date } = this.parent;
        return !start_date || !value || new Date(value) >= new Date(start_date);
      }
    ),
  status: Yup.string()
    .required("Vui lòng chọn trạng thái")
    .oneOf(["draft", "active", "completed"]),
});

export default function StagesManagementPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const {
    plans,
    loading: plansLoading,
    error: plansError,
  } = useSelector((state) => state.plan);
  const coachId = currentUser?.user?.id;

  const [stages, setStages] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stageSchema),
    defaultValues: {
      quitPlanId: plans?.data?.[0]?._id || "",
      stage_name: "",
      description: "",
      order_index: 1,
      start_date: "",
      end_date: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      navigate(PATH.LOGIN);
    } else if (
      coachId &&
      !plansLoading &&
      (!plans?.data || plans.data.length === 0)
    ) {
      dispatch(fetchAllPlan({ coachId, page: 1, limit: 1000 }))
        .unwrap()
        .catch((error) => {
          toast.error(
            "Không thể tải danh sách kế hoạch: " +
              (error.message || "Lỗi không xác định")
          );
        });
    }
  }, [currentUser, coachId, dispatch, navigate, plansLoading, plans?.data]);

  useEffect(() => {
    const mockStages = [
      {
        _id: "1", // Sử dụng _id thay vì id để đồng bộ với API
        quitPlanId: plans?.data?.[0]?._id || "683ea9f0d8426fddf79eb975",
        stage_name: "Tuần 1: Giảm dần số lượng",
        description:
          "Giảm số lượng thuốc lá xuống còn 50% so với thói quen ban đầu",
        order_index: 1,
        start_date: "2025-06-02",
        end_date: "2025-06-09",
        status: "active",
        tasks_count: 5,
      },
      {
        _id: "2",
        quitPlanId: plans?.data?.[0]?._id || "683ea9f0d8426fddf79eb975",
        stage_name: "Tuần 2: Thay thế thói quen",
        description:
          "Thay thế thói quen hút thuốc bằng các hoạt động tích cực khác",
        order_index: 2,
        start_date: "2025-06-09",
        end_date: "2025-06-16",
        status: "draft",
        tasks_count: 7,
      },
    ];
    setStages(mockStages);
  }, [plans?.data]);

  const filteredStages = stages
    .filter((stage) => {
      const matchesSearch =
        (stage.stage_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (stage.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || stage.status === statusFilter;
      const matchesPlan =
        selectedPlan === "all" || stage.quitPlanId === selectedPlan;
      return matchesSearch && matchesStatus && matchesPlan;
    })
    .sort((a, b) => a.order_index - b.order_index);

  const handleCreateStage = async (data) => {
    console.log("Dữ liệu gửi đi khi tạo giai đoạn:", data);
    setIsLoading(true);
    try {
      const response = await dispatch(
        createStageApi({ data, id: data.quitPlanId })
      ).unwrap();
      console.log("Response từ BE khi tạo:", response);
      setStages([...stages, { ...response, tasks_count: 0 }]);
      setIsCreateDialogOpen(false);
      reset();
      toast.success("Tạo giai đoạn thành công");
    } catch (error) {
      console.error("Error creating stage:", error);
      toast.error(
        "Không thể tạo giai đoạn: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStage = async (data) => {
    if (!editingStage) return;
    console.log("Dữ liệu gửi đi khi chỉnh sửa giai đoạn:", data);
    setIsLoading(true);
    try {
      const response = await dispatch(
        updateStageApi({ data, id: editingStage._id })
      ).unwrap();
      console.log("Response từ BE khi cập nhật:", response);
      setStages(
        stages.map((stage) =>
          stage._id === editingStage._id ? { ...stage, ...response } : stage
        )
      );
      setIsEditDialogOpen(false);
      setEditingStage(null);
      reset();
      toast.success("Cập nhật giai đoạn thành công");
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error(
        "Không thể cập nhật giai đoạn: " +
          (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStage = async (stageId) => {
    setIsLoading(true);
    try {
      setStages(stages.filter((stage) => stage._id !== stageId));
      setIsDeleteDialogOpen(false);
      setStageToDelete(null);
      toast.success("Xóa giai đoạn thành công");
    } catch (error) {
      console.error("Error deleting stage:", error);
      toast.error(
        "Không thể xóa giai đoạn: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (stage) => {
    setStageToDelete(stage);
    setIsDeleteDialogOpen(true);
  };

  const handleMoveStage = (stageId, direction) => {
    const stageIndex = stages.findIndex((s) => s._id === stageId);
    if (stageIndex === -1) return;

    const newStages = [...stages];
    const currentStage = newStages[stageIndex];

    if (direction === "up" && stageIndex > 0) {
      const prevStage = newStages[stageIndex - 1];
      if (currentStage.quitPlanId === prevStage.quitPlanId) {
        [currentStage.order_index, prevStage.order_index] = [
          prevStage.order_index,
          currentStage.order_index,
        ];
        // Gọi API để cập nhật order_index nếu cần
        dispatch(
          updateStageApi({ data: { ...currentStage }, id: currentStage._id })
        );
        dispatch(updateStageApi({ data: { ...prevStage }, id: prevStage._id }));
      }
    } else if (direction === "down" && stageIndex < newStages.length - 1) {
      const nextStage = newStages[stageIndex + 1];
      if (currentStage.quitPlanId === nextStage.quitPlanId) {
        [currentStage.order_index, nextStage.order_index] = [
          nextStage.order_index,
          currentStage.order_index,
        ];
        // Gọi API để cập nhật order_index nếu cần
        dispatch(
          updateStageApi({ data: { ...currentStage }, id: currentStage._id })
        );
        dispatch(updateStageApi({ data: { ...nextStage }, id: nextStage._id }));
      }
    }
    setStages(newStages);
  };

  const openEditDialog = (stage) => {
    setEditingStage(stage);
    reset({
      quitPlanId: stage.quitPlanId,
      stage_name: stage.stage_name,
      description: stage.description,
      order_index: stage.order_index,
      start_date: stage.start_date.split("T")[0] || stage.start_date,
      end_date: stage.end_date.split("T")[0] || stage.end_date,
      status: stage.status,
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    reset({
      quitPlanId: plans?.data?.[0]?._id || "",
      stage_name: "",
      description: "",
      order_index: 1,
      start_date: "",
      end_date: "",
      status: "draft",
    });
    setIsCreateDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Nháp", color: "default" },
      active: { label: "Đang hoạt động", color: "primary" },
      completed: { label: "Hoàn thành", color: "secondary" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Chip label={config.label} color={config.color} />;
  };

  const getDuration = (startDate, endDate) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (!isValid(start) || !isValid(end)) {
      return "N/A";
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày`;
  };

  if (!currentUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography ml={2}>Đang kiểm tra đăng nhập...</Typography>
      </Box>
    );
  }

  return (
    <Box className="planStage-container">
      {/* Header */}
      <Box className="planStage-header">
        <Box>
          <Typography className="planStage-header-title">
            Quản lý giai đoạn cai thuốc
          </Typography>
          <Typography className="planStage-header-subtitle">
            Tạo và quản lý các giai đoạn trong kế hoạch cai thuốc
          </Typography>
        </Box>
        <Button
          onClick={openCreateDialog}
          startIcon={<PlusIcon />}
          disabled={plansLoading || !plans?.data?.length}
        >
          Thêm giai đoạn mới
        </Button>
      </Box>

      {/* Filters */}
      <Card className="planStage-card">
        <CardHeader
          className="planStage-card-header"
          title={
            <Typography className="planStage-card-title">Bộ lọc</Typography>
          }
        />
        <CardContent className="planStage-card-content">
          <Grid container spacing={2} className="planStage-filters">
            <Grid item xs={12} md={3}>
              <Box className="planStage-search-container">
                <SearchIcon className="planStage-search-icon" />
                <TextField
                  fullWidth
                  placeholder="Tìm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="planStage-search-input"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Kế hoạch</InputLabel>
                <Select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <MenuItem value="all">Tất cả kế hoạch</MenuItem>
                  {plansLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                      <Typography ml={2}>Đang tải kế hoạch...</Typography>
                    </MenuItem>
                  ) : plans?.data?.length > 0 ? (
                    plans.data.map((plan) => (
                      <MenuItem key={plan._id} value={plan._id}>
                        {plan.title || "Không có tiêu đề"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Không có kế hoạch</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  <MenuItem value="draft">Nháp</MenuItem>
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPlan("all");
                  setStatusFilter("all");
                }}
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stages Table */}
      <Card className="planStage-card">
        <CardHeader
          className="planStage-card-header"
          title={
            <Typography className="planStage-card-title">
              Danh sách giai đoạn ({filteredStages.length})
            </Typography>
          }
        />
        <CardContent className="planStage-card-content">
          {plansLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={200}
            >
              <CircularProgress />
              <Typography ml={2}>Đang tải danh sách kế hoạch...</Typography>
            </Box>
          ) : plansError ? (
            <Typography color="error">
              Lỗi: {plansError.message || "Không thể tải kế hoạch"}
            </Typography>
          ) : (
            <TableContainer className="planStage-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="planStage-table-cell">
                      Thứ tự
                    </TableCell>
                    <TableCell className="planStage-table-cell">
                      Tên giai đoạn
                    </TableCell>
                    <TableCell className="planStage-table-cell">
                      Kế hoạch
                    </TableCell>
                    <TableCell className="planStage-table-cell">
                      Thời gian
                    </TableCell>
                    <TableCell className="planStage-table-cell">
                      Trạng thái
                    </TableCell>
                    <TableCell className="planStage-table-cell">
                      Nhiệm vụ
                    </TableCell>
                    <TableCell className="planStage-table-cell">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="planStage-empty">
                        Không tìm thấy giai đoạn nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStages.map((stage) => {
                      const plan = plans?.data?.find(
                        (p) => p._id === stage.quitPlanId
                      );
                      return (
                        <TableRow key={stage._id}>
                          <TableCell className="planStage-table-cell">
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography fontWeight="medium">
                                #{stage.order_index}
                              </Typography>
                              <Box className="planStage-order-controls">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleMoveStage(stage._id, "up")
                                  }
                                >
                                  <ArrowUpIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleMoveStage(stage._id, "down")
                                  }
                                >
                                  <ArrowDownIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell className="planStage-table-cell">
                            <Box className="planStage-stage-info">
                              <Typography className="planStage-stage-name">
                                {stage.stage_name}
                              </Typography>
                              <Typography className="planStage-stage-desc">
                                {stage.description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell className="planStage-table-cell">
                            <Typography fontSize="0.875rem">
                              {plan?.title || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell className="planStage-table-cell">
                            <Box className="planStage-duration">
                              <Box className="planStage-duration-row">
                                <CalendarIcon fontSize="small" />
                                <Typography fontSize="0.875rem">
                                  {stage.start_date &&
                                  isValid(parseISO(stage.start_date))
                                    ? format(
                                        parseISO(stage.start_date),
                                        "dd/MM/yyyy",
                                        { locale: vi }
                                      )
                                    : "Invalid Date"}
                                </Typography>
                              </Box>
                              <Box className="planStage-duration-row">
                                <ClockIcon fontSize="small" />
                                <Typography
                                  fontSize="0.875rem"
                                  color="textSecondary"
                                >
                                  {stage.start_date &&
                                  stage.end_date &&
                                  isValid(parseISO(stage.start_date)) &&
                                  isValid(parseISO(stage.end_date))
                                    ? getDuration(
                                        stage.start_date,
                                        stage.end_date
                                      )
                                    : "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell className="planStage-table-cell">
                            {getStatusBadge(stage.status)}
                          </TableCell>
                          <TableCell className="planStage-table-cell">
                            <Chip
                              label={`${stage.tasks_count || 0} nhiệm vụ`}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell className="planStage-table-cell">
                            <Box className="planStage-actions">
                              <IconButton onClick={() => openEditDialog(stage)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => openDeleteDialog(stage)}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <DialogTitle>Tạo giai đoạn mới</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thêm một giai đoạn mới vào kế hoạch cai thuốc
          </DialogContentText>
          <Box component="form" className="planStage-form-grid">
            <FormControl fullWidth margin="normal" error={!!errors.quitPlanId}>
              <InputLabel>Kế hoạch cai thuốc</InputLabel>
              <Controller
                name="quitPlanId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Kế hoạch cai thuốc"
                    disabled={plansLoading}
                  >
                    {plansLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                        <Typography ml={2}>Đang tải kế hoạch...</Typography>
                      </MenuItem>
                    ) : plans?.data?.length > 0 ? (
                      plans.data.map((plan) => (
                        <MenuItem key={plan._id} value={plan._id}>
                          {plan.title || "Không có tiêu đề"}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Không có kế hoạch nào</MenuItem>
                    )}
                  </Select>
                )}
              />
              {errors.quitPlanId && (
                <Typography color="error">
                  {errors.quitPlanId.message}
                </Typography>
              )}
            </FormControl>
            <Controller
              name="stage_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên giai đoạn"
                  fullWidth
                  margin="normal"
                  placeholder="VD: Tuần 1 tuần"
                  error={!!errors.stage_name}
                  helperText={errors.stage_name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Mô tả chi tiết về giai đoạn này..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="order_index"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Thứ tự"
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 1 }}
                      error={!!errors.order_index}
                      helperText={errors.order_index?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" error={!!errors.status}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Trạng thái">
                        <MenuItem value="draft">Nháp</MenuItem>
                        <MenuItem value="active">Đang hoạt động</MenuItem>
                        <MenuItem value="completed">Hoàn thành</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <Typography color="error">
                      {errors.status.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Ngày bắt đầu"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.start_date}
                      helperText={errors.start_date?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Ngày kết thúc"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.end_date}
                      helperText={errors.end_date?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsCreateDialogOpen(false)}
            variant="outlined"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit(handleCreateStage)}
            disabled={isLoading || plansLoading}
          >
            {isLoading ? "Đang tạo..." : "Tạo giai đoạn"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <DialogTitle>Chỉnh sửa giai đoạn</DialogTitle>
        <DialogContent>
          <DialogContentText>Cập nhật thông tin giai đoạn</DialogContentText>
          <Box component="form" className="planStage-form-grid">
            <FormControl fullWidth margin="normal" error={!!errors.quitPlanId}>
              <InputLabel>Kế hoạch cai thuốc</InputLabel>
              <Controller
                name="quitPlanId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Kế hoạch cai thuốc"
                    disabled={plansLoading}
                  >
                    {plansLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                        <Typography ml={2}>Đang tải kế hoạch...</Typography>
                      </MenuItem>
                    ) : plans?.data?.length > 0 ? (
                      plans.data.map((plan) => (
                        <MenuItem key={plan._id} value={plan._id}>
                          {plan.title || "Không có tiêu đề"}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Không có kế hoạch nào</MenuItem>
                    )}
                  </Select>
                )}
              />
              {errors.quitPlanId && (
                <Typography color="error">
                  {errors.quitPlanId.message}
                </Typography>
              )}
            </FormControl>
            <Controller
              name="stage_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên giai đoạn"
                  fullWidth
                  margin="normal"
                  placeholder="VD: Tuần 1 tuần"
                  error={!!errors.stage_name}
                  helperText={errors.stage_name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Mô tả chi tiết về giai đoạn này..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="order_index"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Thứ tự"
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 1 }}
                      error={!!errors.order_index}
                      helperText={errors.order_index?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" error={!!errors.status}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Trạng thái">
                        <MenuItem value="draft">Nháp</MenuItem>
                        <MenuItem value="active">Đang hoạt động</MenuItem>
                        <MenuItem value="completed">Hoàn thành</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <Typography color="error">
                      {errors.status.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Ngày bắt đầu"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.start_date}
                      helperText={errors.start_date?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Ngày kết thúc"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.end_date}
                      helperText={errors.end_date?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(handleEditStage)}
            disabled={isLoading || plansLoading}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa giai đoạn "{stageToDelete?.stage_name}"?
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={() => handleDeleteStage(stageToDelete._id)}
            color="error"
            disabled={isLoading}
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
