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
import { format, parse } from "date-fns";
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
  title: yup
    .string()
    .required("Tên kế hoạch là bắt buộc")
    .min(3, "Tên kế hoạch phải có ít nhất 3 ký tự"),
  reason: yup
    .string()
    .required("Lý do là bắt buộc")
    .min(10, "Lý do phải có ít nhất 10 ký tự"),
  startDate: yup
    .string()
    .required("Ngày bắt đầu là bắt buộc")
    .test(
      "is-future-date",
      "Ngày bắt đầu không được trước ngày hiện tại",
      (value) => {
        const today = format(new Date(), "yyyy-MM-dd");
        return value >= today;
      }
    ),
  endDate: yup
    .string()
    .required("Ngày kết thúc là bắt buộc")
    .test(
      "is-after-start-date",
      "Ngày kết thúc phải sau ngày bắt đầu",
      (value, context) => {
        const { startDate } = context.parent;
        return !startDate || !value || value >= startDate;
      }
    ),
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
      startDate: "",
      endDate: "",
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
        startDate: planToEdit.startDate
          ? format(new Date(planToEdit.startDate), "yyyy-MM-dd")
          : "",
        endDate: planToEdit.endDate
          ? format(new Date(planToEdit.endDate), "yyyy-MM-dd")
          : "",
        status: planToEdit.status || "template",
      });
    } else {
      reset({
        title: "",
        reason: "",
        startDate: "",
        endDate: "",
        status: "template",
      });
    }
  }, [planToEdit, reset]);

  const handleCloseDialog = () => {
    setOpen(false);
    reset({
      title: "",
      reason: "",
      startDate: "",
      endDate: "",
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
      const formattedData = {
        ...data,
        startDate: data.startDate
          ? format(
              parse(data.startDate, "yyyy-MM-dd", new Date()),
              "yyyy-MM-dd"
            )
          : "",
        endDate: data.endDate
          ? format(parse(data.endDate, "yyyy-MM-dd", new Date()), "yyyy-MM-dd")
          : "",
        coachId,
      };

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

  // Get today's date dynamically
  const today = format(new Date(), "yyyy-MM-dd");

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

          {/* StartDate field */}
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Ngày bắt đầu"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
                sx={{ mb: 2 }}
                inputProps={{ min: today }}
              />
            )}
          />

          {/* EndDate field */}
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Ngày kết thúc"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
                sx={{ mb: 2 }}
                inputProps={{ min: today }}
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
