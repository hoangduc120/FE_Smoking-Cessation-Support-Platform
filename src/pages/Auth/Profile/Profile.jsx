import { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Badge,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Person, Email, Phone, LocationOn } from "@mui/icons-material";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../../../store/slices/userSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import toast from "react-hot-toast";

export const profileSchema = yup.object().shape({
  userName: yup
    .string()
    .required("Tên hiển thị là bắt buộc")
    .min(3, "Tên hiển thị phải có ít nhất 3 ký tự"),
  gender: yup
    .string()
    .required("Giới tính là bắt buộc")
    .oneOf(["male", "female"], "Giới tính phải là Nam hoặc Nữ"),
  bio: yup
    .string()
    .max(200, "Giới thiệu không được vượt quá 200 ký tự")
    .nullable(),
  phone: yup
    .string()
    .matches(/^(0\d{9,10})?$/, "Số điện thoại không hợp lệ")
    .nullable(),
  address: yup
    .string()
    .max(100, "Địa chỉ không được vượt quá 100 ký tự")
    .nullable(),
});

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading, isError, errorMessage, isUpdating, updateError } =
    useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      userName: "",
      gender: "",
      bio: "",
      phone: "",
      address: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName || "",
        gender: user.gender || "",
        bio: user.bio || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  // Fetch user profile when component mounts
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await dispatch(updateUser(data)).unwrap();
      toast.success("Cập nhật thông tin thành công");
      await dispatch(fetchUser()).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    reset({
      userName: user?.userName || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  };

  if (isLoading) {
    return <Typography variant="body1">Đang tải hồ sơ...</Typography>;
  }
  if (isError) {
    return (
      <Typography variant="body1" color="error">
        {errorMessage}
      </Typography>
    );
  }
  if (!user) {
    return <Typography variant="body1">Không có dữ liệu người dùng</Typography>;
  }

  return (
    <>
      <Box className="homePage">
        <Box className={`profile-container ${isEditing ? "editing" : ""}`}>
          <Typography variant="h4" className="profile-title">
            Hồ sơ cá nhân
          </Typography>
          <Typography variant="body2" className="profile-subtitle">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </Typography>

          <Box className="profile-grid ">
            {/* Profile Picture & Basic Info */}
            <Box className="profile-sidebar">
              <Card
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
              >
                <CardContent className="profile-card-content">
                  <Box className="avatar-container">
                    <Avatar
                      src={user?.profilePicture || ""}
                      alt="User"
                      className="avatar"
                    >
                      {user?.userName?.[0] || "?"}
                    </Avatar>
                  </Box>

                  <Box className="user-info">
                    <Typography variant="h6">{user.userName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email || "Chưa cập nhật email"}
                    </Typography>
                    <Box className="badge-container1">
                      <Badge
                        badgeContent={
                          user?.role === "user"
                            ? "Thành viên"
                            : user?.role === "coach"
                            ? "Coach"
                            : user?.role === "admin"
                            ? "Quản trị viên"
                            : "Người dùng"
                        }
                        color="primary"
                        variant="outlined"
                        sx={{
                          width: "100px",
                          marginRight: "100px",
                          marginTop: "10px",
                          "& .MuiBadge-badge": {
                            backgroundColor: "#44b194",
                            color: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                          },
                        }}
                      />
                    </Box>
                    <Box className="stats-container">
                      <Box className="stat-item">
                        <Typography variant="body2" color="textSecondary">
                          Người theo dõi:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {user?.followers?.length || 0}
                        </Typography>
                      </Box>
                      <Box className="stat-item">
                        <Typography variant="body2" color="textSecondary">
                          Đang theo dõi:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {user?.following?.length || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Profile Details */}
            <Box className="profile-main">
              {/* Personal Information */}
              <Card
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <CardHeader
                    title="Thông tin cá nhân"
                    subheader="Cập nhật thông tin cá nhân của bạn"
                  />
                  {/* Update Button */}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "end",
                      paddingRight: "15px",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit(onSubmit)}
                          disabled={isUpdating}
                          sx={{
                          cursor:"pointer",
                          backgroundColor:"#2c7a35",
                        }}
                        >
                          {isUpdating ? "Đang lưu..." : "Lưu"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancel}
                          disabled={isUpdating}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditing(true)}
                        sx={{
                          cursor:"pointer",
                          backgroundColor:"#2c7a35",
                        }}
                      >
                        Cập nhật
                      </Button>
                    )}
                  </Box>
                  {updateError && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                      Lỗi cập nhật: {updateError}
                    </Typography>
                  )}
                </Box>
                <CardContent>
                  <Box className="form-grid">
                    <Box className="form-field">
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="userName"
                      >
                        Tên hiển thị
                      </Typography>
                      <Box className="info-box">
                        <Person fontSize="small" className="info-icon" />
                        {isEditing ? (
                          <TextField
                            id="userName"
                            {...register("userName")}
                            size="small"
                            fullWidth
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                          />
                        ) : (
                          <Typography>{user.userName}</Typography>
                        )}
                      </Box>
                    </Box>
                    <Box className="form-field">
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="gender"
                      >
                        Giới tính
                      </Typography>
                      <Box className="info-box">
                        <Person fontSize="small" className="info-icon" />
                        {isEditing ? (
                          <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.gender}
                          >
                            <InputLabel id="gender-label">Giới tính</InputLabel>
                            <Select
                              labelId="gender-label"
                              id="gender"
                              {...register("gender")}
                              label="Giới tính"
                            >
                              <MenuItem value="male">Nam</MenuItem>
                              <MenuItem value="female">Nữ</MenuItem>
                            </Select>
                            {errors.gender && (
                              <Typography variant="caption" color="error">
                                {errors.gender.message}
                              </Typography>
                            )}
                          </FormControl>
                        ) : (
                          <Typography>
                            {user?.gender === "male" ? "Nam" : "Nữ"}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box className="form-field">
                    <Typography variant="body2" component="label" htmlFor="bio">
                      Giới thiệu bản thân
                    </Typography>
                    <Box className="info-box bio-box">
                      {isEditing ? (
                        <TextField
                          id="bio"
                          {...register("bio")}
                          size="small"
                          fullWidth
                          multiline
                          rows={3}
                          error={!!errors.bio}
                          helperText={errors.bio?.message}
                        />
                      ) : (
                        <Typography color="textSecondary">
                          {user.bio || "Chưa cập nhật thông tin giới thiệu"}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card
                className="card-margin"
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
              >
                <CardHeader
                  title="Thông tin liên hệ"
                  subheader="Thông tin liên hệ và địa chỉ"
                />
                <CardContent>
                  <Box className="form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="email"
                    >
                      Email
                    </Typography>
                    <Box className="info-box">
                      <Email fontSize="small" className="info-icon" />
                      <Typography>{user.email}</Typography>
                    </Box>
                  </Box>
                  <Box className="form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="phone"
                    >
                      Số điện thoại
                    </Typography>
                    <Box className="info-box">
                      <Phone fontSize="small" className="info-icon" />
                      {isEditing ? (
                        <TextField
                          id="phone"
                          {...register("phone")}
                          size="small"
                          fullWidth
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      ) : (
                        <Typography>{user.phone || "Chưa cập nhật"}</Typography>
                      )}
                    </Box>
                  </Box>
                  <Box className="form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="address"
                    >
                      Địa chỉ
                    </Typography>
                    <Box className="info-box">
                      <LocationOn fontSize="small" className="info-icon" />
                      {isEditing ? (
                        <TextField
                          id="address"
                          {...register("address")}
                          size="small"
                          fullWidth
                          error={!!errors.address}
                          helperText={errors.address?.message}
                        />
                      ) : (
                        <Typography>
                          {user.address || "Chưa cập nhật"}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
