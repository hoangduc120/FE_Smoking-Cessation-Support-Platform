import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../../assets/sRXsrwcNxAZFoPzKym7hvY3SL72Ru0S7l3C51j_Nw_k.webp";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { PATH } from '../../../routes/path';
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
    const { register,handleSubmit} = useForm({
  })

  const onSubmit = async(data) => {
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
                <Typography className="login-forget">Quên mật khẩu?</Typography>

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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    mt:2
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
              {/* Placeholder for image */}
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
