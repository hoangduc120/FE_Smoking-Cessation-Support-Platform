import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginApi, loginWithGoogleApi } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import GoogleButton from 'react-google-button'
export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({});

  const BASE_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const checkGoogleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const auth = urlParams.get('auth');
      const error = urlParams.get('error');
      if (auth === 'google' || sessionStorage.getItem('googleLoginAttempt')) {
        sessionStorage.removeItem('googleLoginAttempt');
        try {
          const result = await dispatch(loginWithGoogleApi()).unwrap();
          toast.success('Google login successful');
          navigate('/', { replace: true });
        } catch (error) {
          toast.error(error?.message || 'Google login failed. Please try again.');
          navigate(PATH.LOGIN, { replace: true });
        }
      } else if (error) {
        toast.error('Google login failed: ' + error);
        navigate(PATH.LOGIN, { replace: true });
      }
    };
    checkGoogleLogin();
  }, [dispatch, navigate]);

  const handleGoogleLogin = () => {
    sessionStorage.setItem('googleLoginAttempt', 'true');
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const onSubmit = async (data) => {
    dispatch(loginApi(data))
      .unwrap()
      .then((payload) => {
        if (payload && payload.data) {
          toast.success("Đăng nhập thành công");
          localStorage.setItem("currentUser", JSON.stringify(payload.data));
          const userType = payload.data.user.role?.trim().toLowerCase();

          if (userType === "user") {
            navigate(PATH.HOME, { replace: true });
          } else if (userType === "coach") {
            navigate(PATH.PLANMANAGEMEMTPAGE, { replace: true });
          } else if (userType === "admin" || userType === "administrator") {
            navigate(PATH.ADMIN, { replace: true });
          } else {
            toast.error(
              "Vai trò không hợp lệ, vui lòng liên hệ quản trị viên."
            );
          }
        } else {
          toast.error(
            payload.message || "Đăng nhập thất bại, vui lòng thử lại."
          );
        }
      })
      .catch((error) => {
        const errorMessage =
          error.message || "Đăng nhập thất bại, vui lòng thử lại.";
        toast.error(errorMessage);
      });
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
                Đăng nhập
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Nhập thông tin đăng nhập của bạn để tiếp tục
              </Typography>
            </Box>
            <Box className="login-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("email")}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <TextField
                    id="password"
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    {...register("password")}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
                </Box>
                <Typography className="login-forget">
                  <Link to={PATH.FORGOTPASSWORD} className="login-link">
                    Quên mật khẩu?
                  </Link>
                </Typography>

                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{
                    mb: 2,
                    backgroundColor: "#2e7d32",
                    borderRadius: "8px",
                    py: 1.5,
                  }}
                >
                  Đăng nhập
                </Button>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", mb: 2, color: "#757575" }}
                >
                  Chưa có tài khoản?{" "}
                  <Link to={PATH.REGISTER} className="login-link">
                    Đăng ký ngay
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", color: "#757575" }}
                >
                  Hoặc tiếp tục với
                </Typography>
              </form>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                  mt: 2,
                }}
              >
                <GoogleButton onClick={handleGoogleLogin} />
              </Box>
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
              Bắt đầu hành trình từ bỏ thuốc lá của bạn
            </Typography>
            <Typography variant="body1" sx={{ color: "#757575", mb: 4 }}>
              Theo dõi tiến trình, nâng cao sức khỏe và cải thiện chất lượng
              cuộc sống của bạn.
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
                  backgroundColor: "# nadie f5f5f5",
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
