import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import "../Login/LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordApi } from "../../../store/slices/authSlice";
import * as yup from "yup";
import { useState } from "react";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
  })
  .required();

export default function ForgotPassWord() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      toast.loading("Đang gửi email đặt lại mật khẩu...");
      await dispatch(forgotPasswordApi(data.email)).unwrap();
      toast.dismiss();
      toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu!");
      setEmail(data.email); // Lưu email vào state
      setIsSubmitted(true); // Chuyển sang giao diện "Kiểm tra email"
    } catch (error) {
      toast.dismiss();
      toast.error(error || "Không thể gửi email đặt lại mật khẩu.");
    }
  };

  const handleResendEmail = () => {
    setIsSubmitted(false); // Quay lại form để gửi lại
    reset(); // Reset form để nhập lại email
  };

  return (
    <Box className="login-page" sx={{ width: "100%", minHeight: "100vh" }}>
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid item size={6} className="login-left">
          <Box className="login-container">
            {isSubmitted ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "green.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MailOutlineIcon sx={{ color: "green.600", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Kiểm tra email của bạn
                </Typography>
                <Typography variant="body2" sx={{ color: "gray.500" }}>
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <MailOutlineIcon sx={{ fontSize: 16, color: "grey.600" }} />
                  <Typography variant="body2" sx={{ color: "grey.600" }}>
                    Email đã được gửi đến <strong>{email}</strong>. Vui lòng kiểm
                    tra hộp thư đến và thư mục spam.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleResendEmail}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Gửi lại email
                </Button>
                <Typography variant="body2" sx={{ color: "grey.600" }}>
                  <Link
                    to={PATH.LOGIN}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2e7d32",
                      textDecoration: "underline",
                    }}
                  >
                    <ArrowBackIcon sx={{ mr: 1, fontSize: 16 }} />
                    Quay lại đăng nhập
                  </Link>
                </Typography>
              </Box>
            ) : (
              <>
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
                    Quên mật khẩu?
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575" }}>
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn đặt
                    lại mật khẩu
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
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
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
                        justifyContent: "center",
                      }}
                    >
                      {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
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
                        <ArrowBackIcon /> Quay lại đăng nhập
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "center", mb: 2, color: "#757575" }}
                    >
                      Chưa có tài khoản?{" "}
                      <Link to={PATH.REGISTER} className="login-link">
                        Đăng ký ngay
                      </Link>
                    </Typography>
                  </form>
                </Box>
              </>
            )}
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