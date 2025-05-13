import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import logo from "../../../assets/sRXsrwcNxAZFoPzKym7hvY3SL72Ru0S7l3C51j_Nw_k.webp";
import "../Login/LoginPage";
import { Link } from "react-router-dom";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PATH } from "../../../routes/path";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object({
  userName: yup.string().required("Họ và Tên không được để trống"),
  email: yup.string()
    .required("Email không được để trống")
    .email("Email không đúng định dạng"),
  password: yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải dài hơn 6 ký tự"),
});
export default function RegisterPage() {
 
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  })

// handle form submit
  const onSubmit = async (data) => {
    console.log(data)
  }

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
              <img
                src={logo}
                alt="QuitSmoke Logo"
                style={{ width: "20%", height: "20%", borderRadius: "50%" }}
              />
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
                Tạo tài khoản
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Nhập thông tin của bạn để bắt đầu hành trình cai thuốc lá
              </Typography>
            </Box>
            <Box className="login-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  id="userName"
                  label="Họ và Tên"
                  type="text"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("userName")}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  id="password"
                  label="Mật khẩu"
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
                  sx={{
                    mb: 2,
                    backgroundColor: "#2e7d32",
                    borderRadius: "8px",
                    py: 1.5,
                  }}
                >
                  Đăng ký
                </Button>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", mb: 2, color: "#757575" }}
                >
                  Đã có tài khoảng?{" "}
                  <Link to={PATH.LOGIN} className="login-link">
                    Đăng nhập ngay
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", color: "#757575" }}
                >
                  Hoặc đăng ký với
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      mr: 1,
                      borderRadius: "8px",
                      color: "#000",
                      borderColor: "#ccc",
                    }}
                  >
                    Google
                  </Button>
                </Box>
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