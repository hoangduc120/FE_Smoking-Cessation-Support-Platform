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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createStageApi, updateStageApi, getStageById } from "../../../store/slices/stagesSlice";
import { useEffect, useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

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
  goal: Yup.string().required("Vui lòng nhập mục tiêu"),
  targetCigarettesPerDay: Yup.number().required("Vui lòng nhập số điếu thuốc mục tiêu cần cai"),
});

export default function CreateStageDialog({
  open,
  setOpen,
  plans,
  isLoading,
  stageToEdit = null,
  setStageToEdit = () => {}, // thêm dòng này
  onStageUpdated = () => {},
}) {
  const dispatch = useDispatch();
  const [isStageLoading, setIsStageLoading] = useState(false);
  const { stages } = useSelector((state) => state.stages);

  // React Hook Form setup
  const getNextOrderIndex = (planId) => {
    const filtered = stages?.filter(s => s.quitPlanId === planId) || [];
    const maxOrderIndex = filtered.reduce((max, stage) => Math.max(max, stage.order_index || 0), 0);
    return maxOrderIndex + 1;
  };

  const defaultPlanId = stageToEdit?.quitPlanId || plans?.data?.[0]?._id || "";
  const defaultOrderIndex = stageToEdit?.order_index || getNextOrderIndex(defaultPlanId);

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
      quitPlanId: defaultPlanId,
      stage_name: stageToEdit?.stage_name || "",
      description: stageToEdit?.description || "",
      order_index: defaultOrderIndex,
      duration: stageToEdit?.duration || 1,
      goal: stageToEdit?.goal || "",
      targetCigarettesPerDay: stageToEdit?.targetCigarettesPerDay || "",
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
      goal: stageToEdit?.goal || "",
      targetCigarettesPerDay: stageToEdit?.targetCigarettesPerDay || "",
      // status: stageToEdit?.status || "template",
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
    const planId = plans?.data?.[0]?._id || "";
    reset({
      quitPlanId: planId,
      stage_name: "",
      description: "",
      order_index: getNextOrderIndex(planId),
      duration: 1,
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
        createStageApi({ data: { ...data, status: 'template' }, id: data.quitPlanId })
      ).unwrap();
      // Reset form về mặc định sau khi tạo thành công
      reset({
        quitPlanId: plans?.data?.[0]?._id || "",
        stage_name: "",
        description: "",
        order_index: getNextOrderIndex(watchQuitPlanId),
        duration: 1,
      });
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
        updateStageApi({ data: { ...data, status: 'template' }, id: stageToEdit._id })
      ).unwrap();
      // Reset form về mặc định sau khi cập nhật thành công
      reset({
        quitPlanId: plans?.data?.[0]?._id || "",
        stage_name: "",
        description: "",
        order_index: getNextOrderIndex(watchQuitPlanId),
        duration: 1,
      });
      toast.success("Cập nhật giai đoạn thành công");
      onStageUpdated();
      setStageToEdit(null); // Thêm dòng này để reset về chế độ tạo mới
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

  const handleCreateAndContinue = async (data) => {
    const isDuplicate = stages?.some(
      stage => stage.order_index === data.order_index && stage.quitPlanId === data.quitPlanId
    );
    if (isDuplicate) {
      toast.error("Thứ tự này đã tồn tại trong kế hoạch. Vui lòng chọn thứ tự khác.");
      return;
    }
    setIsStageLoading(true);
    try {
      await dispatch(
        createStageApi({ data: { ...data, status: 'template' }, id: data.quitPlanId })
      ).unwrap();
    
      await dispatch(getStageById({ id: data.quitPlanId, page: 1, limit: 100 })).unwrap();
      toast.success("Tạo giai đoạn thành công");
     
      reset({
        ...data,
        order_index: undefined, 
      });
 
      if (stageToEdit) {
        onStageUpdated();
        setOpen(false); 
        setTimeout(() => setOpen(true), 100); 
      }
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

  useEffect(() => {
    if (open && !stageToEdit) {
      setValue("order_index", getNextOrderIndex(watchQuitPlanId));
    }
  }, [stages, open, stageToEdit, watchQuitPlanId, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{
      sx: { borderRadius: 3, boxShadow: 8, border: '2px solid #19a14c', minWidth: 600 }
    }}>
      <DialogTitle sx={{ bgcolor: '#19a14c', color: '#fff', fontWeight: 700, fontSize: 22, letterSpacing: 1, textAlign: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        {stageToEdit ? "Chỉnh sửa giai đoạn" : "Tạo giai đoạn mới"}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#f6fff9', p: 3 }}>
        <DialogContentText sx={{ mb: 2, color: '#19a14c', fontWeight: 600, fontSize: 16 }}>
          {stageToEdit
            ? "Cập nhật thông tin giai đoạn"
            : "Thêm một giai đoạn mới vào kế hoạch cai thuốc"}
        </DialogContentText>
        <Box component="form" className="planStage-form-grid" sx={{ mb: 3 }}>
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
                    plans.data
                      .filter((plan) => plan.status === "template")
                      .map((plan) => (
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
          />  <Controller
          name="goal"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mục tiêu"
              fullWidth
              margin="normal"
              placeholder="VD: Cai hết 10 điếu thuốc/ngày"
              error={!!errors.goal}
              helperText={errors.goal?.message}
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
                    InputProps={{ readOnly: !stageToEdit }} // Thêm dòng này
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
              <Controller
                name="targetCigarettesPerDay"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Số điếu thuốc cần cai"
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    error={!!errors.targetCigarettesPerDay}
                    helperText={errors.targetCigarettesPerDay?.message}
               
                  />
                )}
              />
            </Grid>
            {/* Bỏ trường status khỏi form nhập liệu */}
          </Grid>
        </Box>
        {/* Bảng danh sách giai đoạn */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom sx={{ color: '#19a14c', fontWeight: 700 }}>Danh sách các giai đoạn trong kế hoạch</Typography>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2, bgcolor: '#fff', p: 2, border: '1.5px solid #19a14c' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                    <TableCell sx={{ color: '#19a14c', fontWeight: 700 }}><b>Tên giai đoạn</b></TableCell>
                    <TableCell align="center" sx={{ color: '#19a14c', fontWeight: 700 }}><b>Thứ tự</b></TableCell>
                    <TableCell align="center" sx={{ color: '#19a14c', fontWeight: 700 }}><b>Chi tiết</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(stages) && stages.length > 0 ? (
                    [...stages]
                      .filter(s => s.quitPlanId === watchQuitPlanId)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((stage) => (
                        <TableRow key={stage._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontWeight: 500 }}>{stage.stage_name}</TableCell>
                          <TableCell align="center">{stage.order_index}</TableCell>
                          <TableCell align="center">{stage.description}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Không có giai đoạn nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 2, bgcolor: "#f6fff9" }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderColor: '#19a14c', color: '#19a14c', fontWeight: 600 }}
          startIcon={<CloseIcon />}
        >
          Hủy
        </Button>
        <Box>
          {!stageToEdit && (
            <Tooltip title="Lưu và tạo mới">
              <IconButton
                color="success"
                onClick={handleSubmit(handleCreateAndContinue)}
                disabled={isStageLoading || isLoading}
                sx={{ mr: 1 }}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button
            onClick={handleSubmit(stageToEdit ? handleEditStage : handleCreateStage)}
            disabled={isStageLoading || isLoading}
            sx={{ bgcolor: '#19a14c', color: '#fff', fontWeight: 600, borderRadius: 2, '&:hover': { bgcolor: '#14813b' } }}
            startIcon={<SaveIcon />}
          >
            {isStageLoading
              ? (stageToEdit ? "Đang lưu..." : "Đang tạo...")
              : (stageToEdit ? "Lưu" : "Tạo mới")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
