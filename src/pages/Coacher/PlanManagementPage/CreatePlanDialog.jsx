import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import {
  createPlan,
  fetchAllPlan,
  updatePlan,
} from "../../../store/slices/planeSlice";

// Define Yup schema for validation
const schema = yup.object().shape({
  image: yup.string().required("Hình ảnh là bắt buộc"),
  title: yup
    .string()
    .required("Tên kế hoạch là bắt buộc")
    .min(3, "Tên kế hoạch phải có ít nhất 3 ký tự"),
  reason: yup
    .string()
    .required("Lý do là bắt buộc")
    .min(10, "Lý do phải có ít nhất 10 ký tự"),
  duration: yup
    .number()
    .required("Thời gian là bắt buộc")
    .min(1, "Thời gian phải lớn hơn 0"),
  //   "is-future-date",
  //   "Ngày bắt đầu không được trước ngày hiện tại",
  //   (value) => {
  //     const today = format(new Date(), "yyyy-MM-dd");
  //     return value >= today;
  //   }
  // ),
});

export default function CreatePlanDialog({
  open,
  setOpen,
  coachId,
  planToEdit,
}) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.plan);
  const [toastOpen, setToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isEditMode = !!planToEdit;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      reason: "",
      image: "",
      duration: "",
      status: "template",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (planToEdit) {
      reset({
        title: planToEdit.title || "",
        reason: planToEdit.reason || "",
        image: planToEdit.image || "",
        duration: planToEdit.duration || 1,
        status: planToEdit.status || "template",
      });
    } else {
      reset({
        title: "",
        reason: "",
        image: "",
        duration: "",
        status: "template",
      });
    }
  }, [planToEdit, reset]);

  const handleCloseDialog = () => {
    setOpen(false);
    reset({
      title: "",
      reason: "",
      image: "",
      duration: "",
      status: "template",
    });
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleCloseErrorToast = () => {
    setErrorToastOpen(false);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formattedData = { ...data, coachId };

      if (isEditMode) {
        await dispatch(
          updatePlan({ id: planToEdit._id, data: formattedData })
        ).unwrap();
        toast.success("Cập nhật kế hoạch thành công!");
      } else {
        await dispatch(createPlan({ data: formattedData })).unwrap();
        toast.success("Tạo kế hoạch thành công!");
      }

      if (coachId) {
        await dispatch(fetchAllPlan({ coachId, page: 1, limit: 1 })).unwrap();
      } else {
        console.warn("coachId is undefined, cannot fetch plans.");
      }

      handleCloseDialog();
    } catch (error) {
      console.error(
        `${isEditMode ? "UpdatePlan" : "CreatePlan"} error:`,
        error
      );
      setErrorMessage(
        error.message || `${isEditMode ? "Cập nhật" : "Tạo"} kế hoạch thất bại!`
      );
      setErrorToastOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditMode ? "Cập nhật kế hoạch" : "Tạo kế hoạch mới"}
        </DialogTitle>
        <DialogContent>
          {/* Title field */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Tên kế hoạch"
                type="text"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Reason field */}
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Lý do"
                type="text"
                fullWidth
                error={!!errors.reason}
                helperText={errors.reason?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Thời gian (ngày)"
                type="number"
                fullWidth
                error={!!errors.duration}
                helperText={errors.duration?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Hình ảnh"
                type="text"
                fullWidth
                error={!!errors.image}
                helperText={errors.image?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Status field */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={isLoading}
          >
            {isEditMode ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success notification */}
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
          {isEditMode
            ? "Cập nhật kế hoạch thành công!"
            : "Tạo kế hoạch thành công!"}
        </Alert>
      </Snackbar>

      {/* Error notification */}
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
