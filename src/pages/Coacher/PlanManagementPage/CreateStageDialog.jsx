
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createStageApi, updateStageApi } from "../../../store/slices/stagesSlice";
import { useEffect, useState } from "react";

// Yup validation schema for stages
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

export default function CreateStageDialog({
  open,
  setOpen,
  plans,
  isLoading,
  stageToEdit = null,
  onStageUpdated = () => {},
}) {
  const dispatch = useDispatch();
  const [isStageLoading, setIsStageLoading] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stageSchema),
    defaultValues: {
      quitPlanId: stageToEdit?.quitPlanId || plans?.data?.[0]?._id || "",
      stage_name: stageToEdit?.stage_name || "",
      description: stageToEdit?.description || "",
      order_index: stageToEdit?.order_index || 1,
      start_date: stageToEdit ? formatDate(stageToEdit.start_date) : "",
      end_date: stageToEdit ? formatDate(stageToEdit.end_date) : "",
      status: stageToEdit?.status || "draft",
    },
  });

  // Reset form when stageToEdit or plans change
  useEffect(() => {
    reset({
      quitPlanId: stageToEdit?.quitPlanId || plans?.data?.[0]?._id || "",
      stage_name: stageToEdit?.stage_name || "",
      description: stageToEdit?.description || "",
      order_index: stageToEdit?.order_index || 1,
      start_date: stageToEdit ? formatDate(stageToEdit.start_date) : "",
      end_date: stageToEdit ? formatDate(stageToEdit.end_date) : "",
      status: stageToEdit?.status || "draft",
    });
  }, [stageToEdit, plans, reset]);

  const handleCreateStage = async (data) => {
    setIsStageLoading(true);
    try {
      const response = await dispatch(
        createStageApi({ data, id: data.quitPlanId })
      ).unwrap();
      setOpen(false);
      reset();
      toast.success("Tạo giai đoạn thành công");
      onStageUpdated();
    } catch (error) {
      console.error("Error creating stage:", error);
      toast.error(
        "Không thể tạo giai đoạn: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsStageLoading(false);
    }
  };

  const handleEditStage = async (data) => {
    if (!stageToEdit) return;
    setIsStageLoading(true);
    try {
      const response = await dispatch(
        updateStageApi({ data, id: stageToEdit._id })
      ).unwrap();
      setOpen(false);
      reset();
      toast.success("Cập nhật giai đoạn thành công");
      onStageUpdated();
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error(
        "Không thể cập nhật giai đoạn: " +
          (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsStageLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        {stageToEdit ? "Chỉnh sửa giai đoạn" : "Tạo giai đoạn mới"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {stageToEdit
            ? "Cập nhật thông tin giai đoạn"
            : "Thêm một giai đoạn mới vào kế hoạch cai thuốc"}
        </DialogContentText>
        <Box component="form" className="planStage-form-grid">
          <FormControl fullWidth margin="normal" error={!!errors.quitPlanId}>
            <InputLabel>Kế hoạch cai thuốc</InputLabel>
            <Controller
              name="quitPlanId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Kế hoạch cai thuốc" disabled={isLoading}>
                  {isLoading ? (
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
              <Typography color="error">{errors.quitPlanId.message}</Typography>
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
                  <Typography color="error">{errors.status.message}</Typography>
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
        <Button onClick={() => setOpen(false)} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(stageToEdit ? handleEditStage : handleCreateStage)}
          disabled={isStageLoading || isLoading}
        >
          {isStageLoading
            ? stageToEdit
              ? "Đang cập nhật..."
              : "Đang tạo..."
            : stageToEdit
            ? "Cập nhật"
            : "Tạo giai đoạn"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
