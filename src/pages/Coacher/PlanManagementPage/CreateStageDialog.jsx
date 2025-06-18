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
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createStageApi, updateStageApi, getStageById } from "../../../store/slices/stagesSlice";
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
  duration: Yup.number()
    .required("Vui lòng nhập thời gian (ngày)")
    .min(1, "Thời gian phải lớn hơn 0"),
  status: Yup.string()
    .required("Vui lòng chọn trạng thái")
    .oneOf(["template", "ongoing", ]) ,
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
  const { stages } = useSelector((state) => state.stages);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stageSchema),
    defaultValues: {
      quitPlanId: stageToEdit?.quitPlanId || plans?.data?.[0]?._id || "",
      stage_name: stageToEdit?.stage_name || "",
      description: stageToEdit?.description || "",
      order_index: stageToEdit?.order_index || 1,
      duration: stageToEdit?.duration || 1,
      status: stageToEdit?.status || "template",
    },
  });

  const watchQuitPlanId = watch("quitPlanId");

  // Reset form when stageToEdit or plans change
  useEffect(() => {
    reset({
      quitPlanId: stageToEdit?.quitPlanId || plans?.data?.[0]?._id || "",
      stage_name: stageToEdit?.stage_name || "",
      description: stageToEdit?.description || "",
      order_index: stageToEdit?.order_index || 1,
      duration: stageToEdit?.duration || 1,
      status: stageToEdit?.status || "template",
    });
  }, [stageToEdit, plans, reset]);

  // Fetch stages when quitPlanId changes
  useEffect(() => {
    let isMounted = true;

    const fetchStages = async () => {
      if (watchQuitPlanId && !stageToEdit) {
        try {
          await dispatch(getStageById({ id: watchQuitPlanId, page: 1, limit: 100 })).unwrap();
          if (isMounted) {
            // Tìm order_index lớn nhất và tăng lên 1
            const maxOrderIndex = stages?.reduce((max, stage) => 
              Math.max(max, stage.order_index || 0), 0);
            setValue("order_index", maxOrderIndex + 1);
          }
        } catch (error) {
          console.error("Error fetching stages:", error);
        }
      }
    };

    fetchStages();

    return () => {
      isMounted = false;
    };
  }, [watchQuitPlanId, stageToEdit]);

  // Reset form when dialog is closed
  const handleClose = () => {
    reset({
      quitPlanId: plans?.data?.[0]?._id || "",
      stage_name: "",
      description: "",
      order_index: 1,
      duration: 1,
      status: "template",
    });
    setOpen(false);
  };

  const handleCreateStage = async (data) => {
    // Kiểm tra order_index trùng lặp
    const isDuplicate = stages?.some(
      stage => stage.order_index === data.order_index && stage.quitPlanId === data.quitPlanId
    );

    if (isDuplicate) {
      toast.error("Thứ tự này đã tồn tại trong kế hoạch. Vui lòng chọn thứ tự khác.");
      return;
    }

    setIsStageLoading(true);
    try {
      const response = await dispatch(
        createStageApi({ data, id: data.quitPlanId })
      ).unwrap();
      handleClose();
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

    // Kiểm tra order_index trùng lặp (bỏ qua giai đoạn đang edit)
    const isDuplicate = stages?.some(
      stage => 
        stage.order_index === data.order_index && 
        stage.quitPlanId === data.quitPlanId &&
        stage._id !== stageToEdit._id
    );

    if (isDuplicate) {
      toast.error("Thứ tự này đã tồn tại trong kế hoạch. Vui lòng chọn thứ tự khác.");
      return;
    }

    setIsStageLoading(true);
    try {
      const response = await dispatch(
        updateStageApi({ data, id: stageToEdit._id })
      ).unwrap();
      handleClose();
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
    <Dialog open={open} onClose={handleClose}>
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
            <Grid item size={4}>
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
             <Grid item size={4}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Thời gian (ngày)"
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={4}>
              <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel>Trạng thái</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Trạng thái">
                      <MenuItem value="template"> Bản nháp</MenuItem>
                      <MenuItem value="ongoing">Đang hoạt động</MenuItem>
                    </Select>
                  )}
                />
                {errors.status && (
                  <Typography color="error">{errors.status.message}</Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
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
