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

import { useState } from "react";
import { createPlan, fetchPlan, updatePlan } from "../../../store/slices/planeSlice";

// Define Yup schema for validation
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Tên kế hoạch là bắt buộc")
    .min(3, "Tên kế hoạch phải có ít nhất 3 ký tự"),
  description: yup
    .string()
    .required("Mô tả là bắt buộc")
    .min(10, "Mô tả phải có ít nhất 10 ký tự"),
  expectedQuitDate: yup
    .string()
    .required("Ngày dự kiến cai thuốc là bắt buộc")
    .test(
      "is-future-date",
      "Ngày dự kiến không được trước ngày hiện tại",
      (value) => {
        const today = format(new Date(), "yyyy-MM-dd"); // Lấy ngày hiện tại động
        return value >= today;
      }
    ),
});

export default function CreatePlanDialog({ open, setOpen, coachId, planToEdit }) {
  // Khởi tạo React Hook Form với Yup resolver
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: planToEdit?.title || "",
      description: planToEdit?.description || "",
      expectedQuitDate: planToEdit?.expectedQuitDate || "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.plan);
  const [toastOpen, setToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isEditMode = !!planToEdit;

  const handleCloseDialog = () => {
    setOpen(false);
    reset({
      title: "",
      description: "",
      expectedQuitDate: "",
    });
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleCloseErrorToast = () => {
    setErrorToastOpen(false);
  };

  // Xử lý submit form
  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        expectedQuitDate: data.expectedQuitDate
          ? format(
              parse(data.expectedQuitDate, "yyyy-MM-dd", new Date()),
              "yyyy-MM-dd"
            )
          : "",
      };

      let result;
      if (isEditMode) {
        // Cập nhật kế hoạch
        result = await dispatch(
          updatePlan({ id: planToEdit._id, data: formattedData })
        ).unwrap();

      } else {
        // Tạo kế hoạch mới
        result = await dispatch(createPlan({ data: formattedData })).unwrap();
        console.log("CreatePlan success:", result);
      }

      // Hiển thị thông báo thành công
      setToastOpen(true);

      // Gọi lại fetchPlan để làm mới danh sách
      if (coachId) {
        await dispatch(fetchPlan({ coachId })).unwrap();
       
      } else {
        console.warn("coachId is undefined, cannot fetch plans.");
      }

      handleCloseDialog();
    } catch (error) {
      console.error(`${isEditMode ? "UpdatePlan" : "CreatePlan"} error:`, error);
      setErrorMessage(error.message || `${isEditMode ? "Cập nhật" : "Tạo"} kế hoạch thất bại!`);
      setErrorToastOpen(true);
    }
  };

  // Lấy ngày hiện tại động
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? "Cập nhật kế hoạch" : "Tạo kế hoạch mới"}</DialogTitle>
        <DialogContent>
          {/* Trường title */}
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

          {/* Trường description */}
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

          {/* Trường expectedQuitDate */}
          <Controller
            name="expectedQuitDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Ngày dự kiến cai thuốc"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.expectedQuitDate}
                helperText={errors.expectedQuitDate?.message}
                sx={{ mb: 2 }}
                inputProps={{
                  min: today, // Giới hạn ngày tối thiểu là hôm nay
                }}
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
            disabled={isLoading}
          >
            {isEditMode ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo thành công */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity="success" sx={{ width: "100%" }}>
          {isEditMode ? "Cập nhật kế hoạch thành công!" : "Tạo kế hoạch thành công!"}
        </Alert>
      </Snackbar>

      {/* Thông báo lỗi */}
      <Snackbar
        open={errorToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseErrorToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseErrorToast} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}