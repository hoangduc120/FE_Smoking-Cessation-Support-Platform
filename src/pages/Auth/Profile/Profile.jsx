import { useEffect, useState, useRef } from "react";
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
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CameraAlt,
  SmokeFree,
} from "@mui/icons-material";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUser,
  changeImageApi,
} from "../../../store/slices/userSlice";
import { fetchAssessment } from "../../../store/slices/quitSmokingSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";

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
  profilePicture: yup
    .mixed()
    .nullable()
    .test(
      "fileSize",
      "Ảnh phải nhỏ hơn 5MB",
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Chỉ chấp nhận định dạng JPEG, PNG hoặc JPG",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

export default function ProfilePage() {
  const dispatch = useDispatch();
  const {
    user,
    isLoading: userLoading,
    isError: userError,
    errorMessage: userErrorMessage,
  } = useSelector((state) => state.user);
  const {
    assessmentData,
    isLoading: assessmentLoading,
    isError: assessmentError,
    errorMessage: assessmentErrorMessage,
  } = useSelector((state) => state.quitSmoking);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // State để lưu URL xem trước ảnh
  const hasFetchedAssessment = useRef(false);

  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      userName: "",
      gender: "",
      bio: "",
      phone: "",
      address: "",
      profilePicture: null,
    },
  });

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

  useEffect(() => {
    if (!user && !userLoading) {
      dispatch(fetchUser());
    }

    if (
      user?._id &&
      !hasFetchedAssessment.current &&
      !assessmentLoading &&
      !assessmentData
    ) {
      hasFetchedAssessment.current = true;
      dispatch(fetchAssessment(user._id));
    }
  }, [dispatch, user, userLoading, assessmentLoading, assessmentData]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUser(data)).unwrap();
      toast.success("Cập nhật thông tin thành công");
      await dispatch(fetchUser()).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Cập nhật thông tin thất bại");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null); // Xóa ảnh xem trước khi hủy
    reset({
      userName: user?.userName || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setValue("profilePicture", file);
      // Tạo URL để xem trước ảnh
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh để upload!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      await dispatch(changeImageApi(formData)).unwrap();
      toast.success("Upload ảnh thành công!");
      await dispatch(fetchUser()).unwrap();
      setSelectedFile(null);
      setPreviewUrl(null); // Xóa ảnh xem trước sau khi upload thành công
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload ảnh thất bại");
    }
  };

  // Giải phóng URL xem trước khi component bị hủy
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (userLoading || assessmentLoading) {
    return <Typography variant="body1">Đang tải hồ sơ...</Typography>;
  }
  if (userError) {
    return (
      <Typography variant="body1" color="error">
        {userErrorMessage}
      </Typography>
    );
  }
  if (assessmentError) {
    return (
      <Typography variant="body1" color="error">
        {assessmentErrorMessage}
      </Typography>
    );
  }
  if (!user) {
    return <Typography variant="body1">Không có dữ liệu người dùng</Typography>;
  }

  return (
    <>
      <Toaster />
      <Box className="homePage">
        <Box className={`profile-container ${isEditing ? "editing" : ""}`}>
          <Typography variant="h4" className="profile-title">
            Hồ sơ cá nhân
          </Typography>
          <Typography variant="body2" className="profile-subtitle">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </Typography>

          <Box className="profile-grid">
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
                      src={previewUrl || user.profilePicture || ""} // Hiển thị ảnh xem trước nếu có
                      alt="User"
                      className="avatar"
                    >
                      {user?.userName?.[0] || "?"}
                    </Avatar>
                    {isEditing && (
                      <Box
                        className="camera-icon"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <CameraAlt fontSize="small" />
                      </Box>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {isEditing && selectedFile && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUploadAvatar}
                        sx={{ mt: 2, backgroundColor: "#2c7a35" }}
                      >
                        Upload Ảnh
                      </Button>
                    )}
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

            <Box className="profile-main">
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
                          sx={{ backgroundColor: "#2c7a35" }}
                        >
                          Lưu
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancel}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditing(true)}
                        sx={{ backgroundColor: "#2c7a35" }}
                      >
                        Cập nhật
                      </Button>
                    )}
                  </Box>
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
                            {user?.gender === "male"
                              ? "Nam"
                              : user?.gender === "female"
                                ? "Nữ"
                                : "Chưa cập nhật"}
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

              <Box className="form-grid card-margin">
                <Card
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
                          <Typography>
                            {user.phone || "Chưa cập nhật"}
                          </Typography>
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

                <Card
                  sx={{
                    backgroundColor: "transparent",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  }}
                >
                  <CardHeader
                    title="Thông tin cai thuốc lá"
                    subheader="Thông tin khảo sát về quá trình cai thuốc lá"
                  />
                  <CardContent>
                    {assessmentData?.data?.length > 0 ? (
                      assessmentData.data.map((survey) => (
                        <Box key={survey._id} className="form-grid">
                          <Box className="form-field">
                            <Typography
                              variant="body2"
                              component="label"
                              htmlFor="motivation"
                            >
                              Động lực cai thuốc
                            </Typography>
                            <Box className="info-box">
                              <SmokeFree
                                fontSize="small"
                                className="info-icon"
                              />
                              <Typography>
                                {survey.motivation || "Chưa cập nhật"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="form-field">
                            <Typography
                              variant="body2"
                              component="label"
                              htmlFor="smokingDurationYear"
                            >
                              Thời gian hút thuốc (năm)
                            </Typography>
                            <Box className="info-box">
                              <SmokeFree
                                fontSize="small"
                                className="info-icon"
                              />
                              <Typography>
                                {survey.smokingDurationYear || "Chưa cập nhật"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="form-field">
                            <Typography
                              variant="body2"
                              component="label"
                              htmlFor="peakSmokingTimes"
                            >
                              Thời điểm hút thuốc nhiều nhất
                            </Typography>
                            <Box className="info-box">
                              <SmokeFree
                                fontSize="small"
                                className="info-icon"
                              />
                              <Typography>
                                {survey.peakSmokingTimes || "Chưa cập nhật"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="form-field">
                            <Typography
                              variant="body2"
                              component="label"
                              htmlFor="quitAttempts"
                            >
                              Số lần thử cai thuốc
                            </Typography>
                            <Box className="info-box">
                              <SmokeFree
                                fontSize="small"
                                className="info-icon"
                              />
                              <Typography>
                                {survey.quitAttempts || "Chưa cập nhật"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="form-field">
                            <Typography
                              variant="body2"
                              component="label"
                              htmlFor="supportNeeded"
                            >
                              Hỗ trợ cần thiết
                            </Typography>
                            <Box className="info-box">
                              <SmokeFree
                                fontSize="small"
                                className="info-icon"
                              />
                              <Typography>
                                {survey.supportNeeded || "Chưa cập nhật"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography color="textSecondary">
                        Chưa có thông tin khảo sát cai thuốc lá
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
