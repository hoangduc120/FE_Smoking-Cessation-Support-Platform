import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import { createBadge } from "../../../store/slices/badgeSlice";

// Yup schema cho xác thực huy hiệu
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Tên huy hiệu là bắt buộc")
    .min(3, "Tên huy hiệu phải có ít nhất 3 ký tự"),
  description: yup
    .string()
    .required("Mô tả là bắt buộc")
    .min(10, "Mô tả phải có ít nhất 10 ký tự"),
  quitPlanId: yup
    .string()
    .required("Kế hoạch là bắt buộc")
    .matches(/^[0-9a-fA-F]{24}$/, "Kế hoạch không hợp lệ"),
});

export default function BadgeDialog({ open, setOpen, plans = [] }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const userId = auth?.currentUser?.user?.id;
  const [toastOpen, setToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      quitPlanId: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleCloseDialog = () => {
    setOpen(false);
    reset({
      name: "",
      description: "",
      quitPlanId: "",
    });
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleCloseErrorToast = () => {
    setErrorToastOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      if (!data.quitPlanId || data.quitPlanId === "undefined") {
        throw new Error("Vui lòng chọn một kế hoạch hợp lệ");
      }
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const payload = {
        name: data.name,
        description: data.description,
        userId,
      };
      await dispatch(
        createBadge({ payload, quitPlanId: data.quitPlanId })
      ).unwrap();
      toast.success("Tạo huy hiệu thành công!");
      setToastOpen(true);
      handleCloseDialog();
    } catch (error) {
      console.error("Tạo huy hiệu lỗi:", error);
      setErrorMessage(error.message || "Tạo huy hiệu thất bại!");
      setErrorToastOpen(true);
    }
  };


  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo huy hiệu mới</DialogTitle>
        <DialogContent>
          <Controller
            name="quitPlanId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                displayEmpty
                margin="dense"
                error={!!errors.quitPlanId}
                sx={{ mb: 2 }}
                className="badge-dialog-select"
              >
                <MenuItem value="" disabled>
                  Chọn kế hoạch
                </MenuItem>
                {Array.isArray(plans) && plans.length > 0 ? (
                  plans.map((plan) => (
                    <MenuItem key={plan._id} value={plan._id}>
                      {plan.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    Không có kế hoạch nào
                  </MenuItem>
                )}
              </Select>
            )}
          />
          {errors.quitPlanId && (
            <p className="badge-dialog-error">{errors.quitPlanId.message}</p>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Tên huy hiệu"
                type="text"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Mô tả"
                type="text"
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={isSubmitting || plans.length === 0 || !userId}
          >
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="success"
          sx={{ width: "100%" }}
        >
          Tạo huy hiệu thành công!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseErrorToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseErrorToast}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
