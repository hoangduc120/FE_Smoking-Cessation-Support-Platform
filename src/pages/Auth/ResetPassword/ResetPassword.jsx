import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import "../../../pages/Auth/Login/LoginPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PATH } from "../../../routes/path";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordApi } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";

const schema = yup.object({
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải dài hơn 6 ký tự"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Token không hợp lệ. Vui lòng thử lại.");
      navigate(PATH.FORGOT_PASSWORD);
      return;
    }

    try {
      toast.loading("Đang đặt lại mật khẩu...");
      await dispatch(
        resetPasswordApi({ token, password: data.password })
      ).unwrap();
      toast.dismiss();
      toast.success("Đặt lại mật khẩu thành công");
      localStorage.removeItem("authToken");
      navigate(PATH.LOGIN);
    } catch (error) {
      toast.dismiss();
      if (
        error.includes("token") ||
        error.includes("expired") ||
        error.includes("required")
      ) {
        toast.error("Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        navigate(PATH.FORGOT_PASSWORD);
      } else {
        toast.error(error || "Không thể đặt lại mật khẩu");
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="login-page" sx={{ width: "100%", minHeight: "100vh" }}>
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid item size={6} className="login-left">
          <Box className="login-container">
            <Box className="login-logo">
              🌿
              <Typography
                variant="h4"
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  ml: 2,
                  color: "#2e7d32",
                }}
              >
                QuitSmoke
              </Typography>
            </Box>
            <Box className="login-title">
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                Đặt lại mật khẩu
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Nhập mật khẩu mới cho tài khoản của bạn
              </Typography>
            </Box>
            <Box className="login-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  id="password"
                  label="Nhập mật khẩu mới"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mb: 2,
                    backgroundColor: "#2e7d32",
                    borderRadius: "8px",
                    py: 1.5,
                  }}
                >
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", mb: 2, color: "#757575" }}
                >
                  <Link
                    to={PATH.LOGIN}
                    className="login-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Quay lại đăng nhập
                  </Link>
                </Typography>
              </form>
            </Box>
          </Box>
        </Grid>
        <Grid item size={6} className="login-right">
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              p: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#2e7d32", mb: 4 }}
            >
              {"\n"} Bắt đầu hành trình từ bỏ thuốc lá của bạn
            </Typography>
            <Typography variant="body1" sx={{ color: "#757575", mb: 4 }}>
              Theo dõi tiến trình, nâng cao sức khỏe và cải thiện chất lượng cuộc
              sống của bạn.
            </Typography>
            <Box
              sx={{
                width: "200px",
                height: "200px",
                backgroundColor: "#f5f5f5",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Hình ảnh
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "80%",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: "12px",
                  flex: 1,
                  mr: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#2e7d32", fontWeight: "bold" }}
                >
                  Tiết kiệm tiền
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  Theo dõi số tiền bạn tiết kiệm được
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: "12px",
                  flex: 1,
                  mx: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#2e7d32", fontWeight: "bold" }}
                >
                  Sức khỏe tốt hơn
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  Cải thiện chất lượng cuộc sống
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: "12px",
                  flex: 1,
                  ml: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#2e7d32", fontWeight: "bold" }}
                >
                  Cộng đồng
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  Kết nối với những người khác
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}