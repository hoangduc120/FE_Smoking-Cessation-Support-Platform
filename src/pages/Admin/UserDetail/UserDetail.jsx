import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Container,
  Fade,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Cancel,
  Google,
  SmokeFree,
  ArrowBack,
} from "@mui/icons-material";
import {
  fetchAccountById,
  updateAccountStatus,
  updateAccountRole,
} from "../../../store/slices/adminSlice";
import toast from "react-hot-toast";

const UserDetail = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    account: userData,
    isLoading: loading,
    isError,
    errorMessage: error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (userId) {
      console.log("Fetching account for userId:", userId);
      dispatch(fetchAccountById({ id: userId }));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    console.log("Redux state:", { userData, loading, isError, error });
  }, [userData, loading, isError, error]);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusColor = (isActive, isDeleted) => {
    if (isDeleted) return "error";
    if (isActive) return "success";
    return "warning";
  };

  const getStatusText = (isActive, isDeleted) => {
    if (isDeleted) return "Đã xóa";
    if (isActive) return "Hoạt động";
    return "Không hoạt động";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "user":
        return "primary";
      case "coach":
        return "secondary";
      default:
        return "default";
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "Chưa xác định";
    }
  };

  const handleToggleStatus = async () => {
    if (!userData) return;
    try {
      await dispatch(
        updateAccountStatus({ id: userId, isActive: !userData.isActive })
      ).unwrap();
      toast.success(
        `Tài khoản đã được ${!userData.isActive ? "kích hoạt" : "vô hiệu hóa"} thành công!`
      );
      dispatch(fetchAccountById({ id: userId })); // Refresh user data
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleChangeRole = async () => {
    if (!userData) return;
    const newRole = userData.role === "coach" ? "user" : "coach";
    try {
      await dispatch(updateAccountRole({ id: userId, role: newRole })).unwrap();
      toast.success(
        `Đã thay đổi vai trò thành ${newRole === "coach" ? "Coach" : "Người dùng"}!`
      );
      dispatch(fetchAccountById({ id: userId })); // Refresh user data
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại!");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Fade in={true} timeout={600}>
          <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 2 }}>
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Fade in={true} timeout={600}>
          <Alert severity="info" sx={{ borderRadius: 2, boxShadow: 2 }}>
            Không tìm thấy thông tin người dùng
          </Alert>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/admin/account")}
              sx={{
                mr: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "medium",
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "white",
                  borderColor: "primary.light",
                },
              }}
            >
              Quay lại
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Chi tiết người dùng
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card
                elevation={6}
                sx={{
                  borderRadius: 3,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={userData.profilePicture}
                    sx={{
                      width: 140,
                      height: 140,
                      mb: 3,
                      border: "5px solid",
                      borderColor: "primary.main",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ color: "text.primary" }}
                  >
                    {userData.userName}
                  </Typography>
                  {userData.role && (
                    <Chip
                      label={
                        userData.role === "coach"
                          ? "COACH"
                          : userData.role.toUpperCase()
                      }
                      color={getRoleColor(userData.role)}
                      variant="outlined"
                      sx={{ fontWeight: "medium", px: 1, mb: 2 }}
                    />
                  )}
                  <Chip
                    label={getStatusText(userData.isActive, userData.isDeleted)}
                    color={getStatusColor(
                      userData.isActive,
                      userData.isDeleted
                    )}
                    icon={
                      userData.isActive && !userData.isDeleted ? (
                        <CheckCircle />
                      ) : (
                        <Cancel />
                      )
                    }
                    sx={{ fontWeight: "medium", px: 1, mb: 2 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleChangeRole}
                      sx={{ textTransform: "none", fontWeight: "medium" }}
                    >
                      {userData.role === "coach"
                        ? "Đặt làm Người dùng"
                        : "Đặt làm Coach"}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleToggleStatus}
                      sx={{ textTransform: "none", fontWeight: "medium" }}
                    >
                      {userData.isActive
                        ? "Vô hiệu hóa tài khoản"
                        : "Kích hoạt tài khoản"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, md: 8 }}>
              <Card
                elevation={6}
                sx={{
                  borderRadius: 3,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      mb: 4,
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    Thông tin chi tiết
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 2,
                          fontWeight: "bold",
                          color: "primary.main",
                        }}
                      >
                        Thông tin liên hệ
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <Email color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Email:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {userData.email}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <Phone color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Số điện thoại:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {userData.phone || "Chưa có thông tin"}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <LocationOn color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Địa chỉ:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {userData.address || "Chưa có thông tin"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item size={{ xs: 12 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 2,
                          fontWeight: "bold",
                          color: "primary.main",
                        }}
                      >
                        Thông tin cá nhân
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <Person color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Giới tính:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {getGenderText(userData.gender)}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <SmokeFree color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ngày không hút thuốc:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {userData.smokingFreeDays || 0} ngày
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={1}
                            >
                              Tiểu sử:
                            </Typography>
                            <Typography variant="body1">
                              {userData.bio || "Chưa có thông tin"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item size={{ xs: 12 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 2,
                          fontWeight: "bold",
                          color: "primary.main",
                        }}
                      >
                        Thông tin tài khoản
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <Google color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Google ID:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {userData.googleId || "Chưa liên kết"}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <CalendarToday color="action" fontSize="small" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ngày tạo:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {formatDate(userData.createdAt)}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={1}
                            >
                              Cập nhật lần cuối:
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(userData.updatedAt)}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 6 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={1}
                            >
                              Đổi mật khẩu lần cuối:
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(userData.passwordChangeAt)}
                            </Typography>
                          </Grid>
                          {userData.quitReason && (
                            <Grid item size={{ xs: 12 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={1}
                              >
                                Lý do thoát:
                              </Typography>
                              <Typography variant="body1">
                                {userData.quitReason}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default UserDetail;
