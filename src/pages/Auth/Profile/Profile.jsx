import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Badge,
  Box,
  TextField,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
  CssBaseline,
  CircularProgress,
  alpha,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CameraAlt,
  SmokeFree,
  ArrowBack as ArrowBackIcon,
  Favorite,
  PersonAdd,
  PersonRemove,
  EmojiEvents,
  WorkspacePremium,
} from "@mui/icons-material";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUser,
  changeImageApi,
  fetchUserStats,
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
} from "../../../store/slices/userSlice";
import { fetchAssessment } from "../../../store/slices/quitSmokingSlice";
import { getMyBadge } from "../../../store/slices/badgeSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { fetchUserMembership } from "../../../store/slices/userMembershipSlice";

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
  const navigate = useNavigate();

  const {
    user,
    stats,
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
  const {
    badges,
    isLoading: badgeLoading,
    isError: badgeError,
    errorMessage: badgeErrorMessage,
  } = useSelector((state) => state.badge);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [localFollowers, setLocalFollowers] = useState([]);
  const [localFollowing, setLocalFollowing] = useState([]);
  const [localViewerFollowing, setLocalViewerFollowing] = useState([]);
  const [followProcessing, setFollowProcessing] = useState({});
  const hasFetchedAssessment = useRef(false);
  const fileInputRef = useRef(null);
  const { userMembershipData } = useSelector((state) => state.userMembership);

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
    if (user?._id) {
      dispatch(fetchUserMembership(user._id));
    }
  }, [dispatch, user]);

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
  }, [dispatch, user, userLoading]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserStats(user._id));
      dispatch(fetchFollowers(user._id)).then((res) => {
        setLocalFollowers(res.payload || []);
      });
      dispatch(fetchFollowing(user._id)).then((res) => {
        setLocalFollowing(res.payload || []);
        setLocalViewerFollowing(res.payload.map((u) => u._id));
      });
      dispatch(getMyBadge());
      if (
        !hasFetchedAssessment.current &&
        !assessmentLoading &&
        !assessmentData
      ) {
        hasFetchedAssessment.current = true;
        dispatch(fetchAssessment(user._id));
      }
    }
  }, [dispatch, user, assessmentLoading, assessmentData]);

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
    setPreviewUrl(null);
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
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload ảnh thất bại");
    }
  };

  const normalizeUser = (user) => ({
    id: user._id || "",
    name: user.userName || "Người dùng",
    username: user.userName || "unknown",
    avatar:
      user.profilePicture ||
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    role: user.role || "user",
    _id: user._id || "",
  });

  const followersList = localFollowers.map(normalizeUser);
  const followingList = localFollowing.map(normalizeUser);
  const currentData =
    tabValue === 1 ? followersList : tabValue === 2 ? followingList : [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFollowToggle = (targetUserId) => async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user?._id || followProcessing[targetUserId]) {
      if (!user?._id) {
        toast.error("Vui lòng đăng nhập để thực hiện hành động này!");
      }
      return;
    }

    setFollowProcessing((prev) => ({ ...prev, [targetUserId]: true }));

    const isFollowing = localViewerFollowing.includes(targetUserId);
    const action = isFollowing ? unfollowUser : followUser;

    try {
      const result = await dispatch(action(targetUserId)).unwrap();
      if (result.success) {
        toast.success(isFollowing ? "Đã bỏ theo dõi!" : "Đã theo dõi!");

        // Cập nhật danh sách id đang theo dõi
        setLocalViewerFollowing((prev) =>
          isFollowing
            ? prev.filter((id) => id !== targetUserId)
            : [...prev, targetUserId]
        );

        // ✅ Chỉ cập nhật localFollowing, KHÔNG động vào localFollowers
        if (isFollowing) {
          // Bỏ theo dõi
          setLocalFollowing((prev) =>
            prev.filter((u) => u._id !== targetUserId)
          );
        } else {
          // Theo dõi lại
          const knownUser = [...localFollowers, ...localFollowing].find(
            (u) => u._id === targetUserId
          );

          const newUser = knownUser
            ? knownUser
            : {
                _id: targetUserId,
                id: targetUserId,
                name: "Người dùng",
                username: "unknown",
                avatar:
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
                role: "user",
              };

          setLocalFollowing((prev) =>
            prev.some((u) => u._id === targetUserId) ? prev : [...prev, newUser]
          );
        }
      }
    } catch (err) {
      console.error("Follow action error:", err);
      toast.error("Lỗi khi cập nhật theo dõi");
    } finally {
      setFollowProcessing((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/author/${userId}`);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (userLoading || assessmentLoading || badgeLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${alpha("#4CAF50", 0.2)} 0%, ${alpha("#81C784", 0.2)} 100%)`,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#4CAF50" }} />
      </Box>
    );
  }

  if (userError || assessmentError || badgeError) {
    toast.error(
      userErrorMessage ||
        assessmentErrorMessage ||
        badgeErrorMessage ||
        "Lỗi tải thông tin"
    );
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="#2E7D32">
          {userErrorMessage ||
            assessmentErrorMessage ||
            badgeErrorMessage ||
            "Lỗi tải thông tin"}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="#2E7D32">
          Không có dữ liệu người dùng
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Toaster />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #e8f5e9, #f5f5f5)",
          py: 4,
        }}
      >
        <CssBaseline />
        <Container maxWidth="lg" className="profile-container">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" className="profile-title">
              Hồ sơ cá nhân
            </Typography>
            <Typography variant="body2" className="profile-subtitle">
              Quản lý thông tin cá nhân và cài đặt tài khoản
            </Typography>
          </Box>

          <Grid container spacing={4} className="profile-grid">
            {/* Left Sidebar (Avatar, Followers, Following, Achievements) */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "visible",
                  position: "relative",
                  mb: 3,
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                }}
                className="profile-card"
              >
                <Box
                  sx={{
                    height: 80,
                    bgcolor: "#4CAF50",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                />
                <CardContent
                  sx={{ pt: 0, pb: 3, px: 3 }}
                  className="profile-card-content"
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: -5,
                    }}
                    className="avatar-container"
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={previewUrl || user.profilePicture || ""}
                        sx={{
                          width: 100,
                          height: 100,
                          border: "4px solid white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          mb: 2,
                        }}
                        className="avatar"
                      >
                        {user?.userName?.[0] || "?"}
                      </Avatar>
                      {isEditing && (
                        <Box
                          className="camera-icon"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            bgcolor: "#4CAF50",
                            borderRadius: "50%",
                            p: 1,
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "#45a049",
                            },
                          }}
                          onClick={() => fileInputRef.current.click()}
                        >
                          <CameraAlt fontSize="small" sx={{ color: "white" }} />
                        </Box>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </Box>
                    <Box sx={{ textAlign: "center" }} className="user-info">
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, color: "#263238" }}
                      >
                        {user.userName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#546e7a", mb: 1 }}
                      >
                        @{user.email?.split("@")[0] || "unknown"}
                      </Typography>
                    </Box>

                    {isEditing && selectedFile && (
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          borderRadius: 6,
                          bgcolor: "#4CAF50",
                          color: "white",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#45a049" },
                        }}
                        onClick={handleUploadAvatar}
                      >
                        Upload Ảnh
                      </Button>
                    )}
                    <Box
                      sx={{
                        bgcolor: "#f5f5f5",
                        p: 2,
                        borderRadius: 12,
                        display: "flex",
                        justifyContent: "space-around",
                        boxShadow: "none",
                        mt: 2,
                      }}
                      className="stats-container"
                    >
                      <Box
                        onClick={() => setTabValue(1)}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer",
                          p: 1,
                          borderRadius: 8,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                          },
                          flex: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {stats?.followersCount ?? 0}
                        </Typography>
                        <Typography variant="body2">Người theo dõi</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box
                        onClick={() => setTabValue(2)}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer",
                          p: 1,
                          borderRadius: 8,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                          },
                          flex: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {stats?.followingCount ?? 0}
                        </Typography>
                        <Typography variant="body2">Đang theo dõi</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              {/*gói đăng kí*/}
              {userMembershipData?.currentPlan?.name && (
                <Card
                  sx={{
                    borderRadius: 4,
                    mb: 3,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                  }}
                  className="profile-card card-margin"
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <WorkspacePremium sx={{ color: "#4CAF50", mr: 1 }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#263238" }}
                      >
                        Gói đăng ký
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        bgcolor: "#E8F5E9",
                        border: "1px solid #A5D6A7",
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#2E7D32", fontWeight: 600 }}
                      >
                        {userMembershipData.currentPlan.name}
                      </Typography>
                      {userMembershipData?.daysLeft && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#4CAF50", mt: 0.5 }}
                        >
                          Còn lại {userMembershipData.daysLeft} ngày
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Achievements Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  mb: 3,
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                }}
                className="profile-card card-margin"
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmojiEvents
                      sx={{ color: "#4CAF50", mr: 1 }}
                      className="info-icon"
                    />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#263238" }}
                    >
                      Thành tựu
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {badges && badges.length > 0 ? (
                      badges.map((badge) => (
                        <Tooltip key={badge._id} title={badge.description}>
                          <Box sx={{ textAlign: "center" }}>
                            <Badge
                              badgeContent={1}
                              sx={{
                                "& .MuiBadge-badge": {
                                  backgroundColor: "#4CAF50",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "0.8rem",
                                },
                              }}
                            >
                              <Avatar
                                src={badge.icon_url}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  border: `2px solid ${alpha("#4CAF50", 0.3)}`,
                                  filter:
                                    "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                                }}
                              />
                            </Badge>
                            <Typography
                              variant="caption"
                              sx={{ display: "block", mt: 1, color: "#263238" }}
                            >
                              {badge.name}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#546e7a",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        Chưa có thành tựu
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Main Content */}
            <Grid item size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #e8f5e9 100%)",
                  animation: "fadeIn 0.5s ease-in-out",
                }}
                className="profile-card"
              >
                <Box sx={{ borderBottom: 1, borderColor: "#e0e0e0" }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                      "& .MuiTabs-flexContainer": {
                        display: "flex",
                        justifyContent: "space-between",
                      },
                      "& .MuiTab-root": {
                        py: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        width: "33.33%",
                        textAlign: "center",
                        color: "#757575",
                        "&.Mui-selected": {
                          color: "#4CAF50",
                        },
                      },
                      "& .MuiTabs-indicator": {
                        height: 3,
                        backgroundColor: "#4CAF50",
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                      },
                    }}
                  >
                    <Tab
                      label="Thông tin"
                      value={0}
                      icon={<Person fontSize="small" />}
                      iconPosition="start"
                      sx={{ padding: "0 8px" }}
                    />
                    <Tab
                      label={`Người theo dõi (${followersList.length})`}
                      value={1}
                      icon={<Favorite fontSize="small" />}
                      iconPosition="start"
                      sx={{ padding: "0 8px" }}
                    />
                    <Tab
                      label={`Đang theo dõi (${followingList.length})`}
                      value={2}
                      icon={<PersonAdd fontSize="small" />}
                      iconPosition="start"
                      sx={{ padding: "0 8px" }}
                    />
                  </Tabs>
                </Box>

                {tabValue === 0 ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        background: "linear-gradient(45deg, #4CAF50, #81C784)",
                      }}
                      className="profile-card-header"
                    >
                      <CardHeader
                        title="Thông tin cá nhân"
                        subheader="Cập nhật thông tin cá nhân của bạn"
                        titleTypographyProps={{
                          color: "white",
                          fontWeight: 600,
                        }}
                        subheaderTypographyProps={{
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                        className="profile-card-subheader"
                      />
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        {isEditing ? (
                          <>
                            <Button
                              variant="contained"
                              onClick={handleSubmit(onSubmit)}
                              sx={{
                                bgcolor: "#4CAF50",
                                color: "white",
                                borderRadius: 6,
                                textTransform: "none",
                                "&:hover": { bgcolor: "#45a049" },
                              }}
                            >
                              Lưu
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleCancel}
                              sx={{
                                color: "white",
                                borderColor: "white",
                                borderRadius: 6,
                                textTransform: "none",
                                "&:hover": {
                                  borderColor: "white",
                                  bgcolor: alpha("#ffffff", 0.1),
                                },
                              }}
                            >
                              Hủy
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                            sx={{
                              bgcolor: "#4CAF50",
                              color: "white",
                              borderRadius: 6,
                              textTransform: "none",
                              "&:hover": { bgcolor: "#45a049" },
                            }}
                            disabled={tabValue !== 0}
                          >
                            Cập nhật
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3 }} className="form-grid">
                      <Box sx={{ mb: 2 }} className="info-box">
                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="userName"
                        >
                          Tên hiển thị
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <Person
                            fontSize="small"
                            sx={{ color: "#4CAF50" }}
                            className="info-icon"
                          />
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
                      <Box sx={{ mb: 2 }} className="info-box">
                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="gender"
                        >
                          Giới tính
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <Person
                            fontSize="small"
                            sx={{ color: "#4CAF50" }}
                            className="info-icon"
                          />
                          {isEditing ? (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors.gender}
                            >
                              <InputLabel id="gender-label">
                                Giới tính
                              </InputLabel>
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
                      <Box sx={{ mb: 2 }} className="info-box bio-box">
                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="bio"
                        >
                          Giới thiệu bản thân
                        </Typography>
                        <Box sx={{ mt: 1 }}>
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

                    {/* Secondary Grid for Contact and Quit Smoking Info */}
                    <Grid
                      container
                      spacing={4}
                      sx={{ mt: 3 }}
                      className="secondary-grid"
                    >
                      {/* Contact Information */}
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <Card
                          sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                            background:
                              "linear-gradient(180deg, #ffffff 0%, #e8f5e9 100%)",
                            animation: "fadeIn 0.5s ease-in-out 0.2s",
                          }}
                          className="profile-card"
                        >
                          <CardHeader
                            title="Thông tin liên hệ"
                            subheader="Thông tin liên hệ và địa chỉ"
                            titleTypographyProps={{
                              color: "white",
                              fontWeight: 600,
                            }}
                            subheaderTypographyProps={{
                              color: "rgba(255, 255, 255, 0.9)",
                            }}
                            sx={{
                              background:
                                "linear-gradient(45deg, #4CAF50, #81C784)",
                            }}
                            className="profile-card-header"
                          />
                          <CardContent sx={{ p: 3 }} className="form-grid">
                            <Box sx={{ mb: 2 }} className="info-box">
                              <Typography
                                variant="body2"
                                component="label"
                                htmlFor="email"
                              >
                                Email
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: 1,
                                }}
                              >
                                <Email
                                  fontSize="small"
                                  sx={{ color: "#4CAF50" }}
                                  className="info-icon"
                                />
                                <Typography>{user.email}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mb: 2 }} className="info-box">
                              <Typography
                                variant="body2"
                                component="label"
                                htmlFor="phone"
                              >
                                Số điện thoại
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: 1,
                                }}
                              >
                                <Phone
                                  fontSize="small"
                                  sx={{ color: "#4CAF50" }}
                                  className="info-icon"
                                />
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
                            <Box sx={{ mb: 2 }} className="info-box">
                              <Typography
                                variant="body2"
                                component="label"
                                htmlFor="address"
                              >
                                Địa chỉ
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: 1,
                                }}
                              >
                                <LocationOn
                                  fontSize="small"
                                  sx={{ color: "#4CAF50" }}
                                  className="info-icon"
                                />
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
                      </Grid>

                      {/* Quit Smoking Information */}
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <Card
                          sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                            background:
                              "linear-gradient(180deg, #ffffff 0%, #e8f5e9 100%)",
                            animation: "fadeIn 0.5s ease-in-out 0.3s",
                          }}
                          className="profile-card"
                        >
                          <CardHeader
                            title="Thông tin cai thuốc lá"
                            subheader="Thông tin khảo sát về quá trình cai thuốc lá"
                            titleTypographyProps={{
                              color: "white",
                              fontWeight: 600,
                            }}
                            subheaderTypographyProps={{
                              color: "rgba(255, 255, 255, 0.9)",
                            }}
                            sx={{
                              background:
                                "linear-gradient(45deg, #4CAF50, #81C784)",
                            }}
                            className="profile-card-header"
                          />
                          <CardContent sx={{ p: 3 }} className="form-grid">
                            {assessmentData?.data?.length > 0 ? (
                              assessmentData.data.map((survey) => (
                                <Box
                                  key={survey._id}
                                  sx={{ mb: 2 }}
                                  className="info-box"
                                >
                                  <Box sx={{ mb: 1 }}>
                                    <Typography
                                      variant="body2"
                                      component="label"
                                      htmlFor="motivation"
                                      sx={{ fontSize: 16, fontWeight: "bold" }}
                                    >
                                      Động lực cai thuốc
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mt: 1,
                                      }}
                                    >
                                      <SmokeFree
                                        fontSize="small"
                                        sx={{ color: "#4CAF50" }}
                                        className="info-icon"
                                      />
                                      <Typography>
                                        {survey.motivation || "Chưa cập nhật"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography
                                      variant="body2"
                                      component="label"
                                      htmlFor="smokingDurationYear"
                                      sx={{ fontSize: 16, fontWeight: "bold" }}
                                    >
                                      Thời gian hút thuốc (năm)
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mt: 1,
                                      }}
                                    >
                                      <SmokeFree
                                        fontSize="small"
                                        sx={{ color: "#4CAF50" }}
                                        className="info-icon"
                                      />
                                      <Typography>
                                        {survey.smokingDurationYear ||
                                          "Chưa cập nhật"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography
                                      variant="body2"
                                      component="label"
                                      htmlFor="peakSmokingTimes"
                                      sx={{ fontSize: 16, fontWeight: "bold" }}
                                    >
                                      Thời điểm hút thuốc nhiều nhất
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mt: 1,
                                      }}
                                    >
                                      <SmokeFree
                                        fontSize="small"
                                        sx={{ color: "#4CAF50" }}
                                        className="info-icon"
                                      />
                                      <Typography>
                                        {survey.peakSmokingTimes ||
                                          "Chưa cập nhật"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography
                                      variant="body2"
                                      component="label"
                                      htmlFor="quitAttempts"
                                      sx={{ fontSize: 16, fontWeight: "bold" }}
                                    >
                                      Số lần thử cai thuốc
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mt: 1,
                                      }}
                                    >
                                      <SmokeFree
                                        fontSize="small"
                                        sx={{ color: "#4CAF50" }}
                                        className="info-icon"
                                      />
                                      <Typography>
                                        {survey.quitAttempts || "Chưa cập nhật"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography
                                      variant="body2"
                                      component="label"
                                      htmlFor="supportNeeded"
                                      sx={{ fontSize: 16, fontWeight: "bold" }}
                                    >
                                      Hỗ trợ cần thiết
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mt: 1,
                                      }}
                                    >
                                      <SmokeFree
                                        fontSize="small"
                                        sx={{ color: "#4CAF50" }}
                                        className="info-icon"
                                      />
                                      <Typography>
                                        {survey.supportNeeded ||
                                          "Chưa cập nhật"}
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
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Box sx={{ p: 2 }} className="profile-card-header">
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Button
                          startIcon={<ArrowBackIcon />}
                          onClick={() => setTabValue(0)}
                          variant="text"
                          sx={{
                            color: "#4CAF50",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha("#4CAF50", 0.1),
                              borderRadius: 2,
                            },
                          }}
                        >
                          Quay lại Thông tin
                        </Button>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <List disablePadding>
                        {currentData.length > 0 ? (
                          currentData.map((userData, index) => (
                            <React.Fragment key={userData.id}>
                              <ListItem
                                alignItems="flex-start"
                                sx={{
                                  py: 2,
                                  px: 3,
                                  transition: "background-color 0.2s",
                                  "&:hover": {
                                    bgcolor: alpha("#4CAF50", 0.1),
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => handleProfileClick(userData.id)}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    src={userData.avatar}
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      border: `2px solid ${alpha("#4CAF50", 0.3)}`,
                                    }}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ fontWeight: 600, color: "#2E7D32" }}
                                    >
                                      {userData.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      @{userData.username}
                                    </Typography>
                                  }
                                  sx={{ mr: 2 }}
                                />
                                {user?._id !== userData.id && (
                                  <ListItemSecondaryAction>
                                    <Button
                                      variant={
                                        localViewerFollowing.includes(
                                          userData.id
                                        )
                                          ? "outlined"
                                          : "contained"
                                      }
                                      size="small"
                                      startIcon={
                                        localViewerFollowing.includes(
                                          userData.id
                                        ) ? (
                                          <PersonRemove />
                                        ) : (
                                          <PersonAdd />
                                        )
                                      }
                                      sx={{
                                        borderRadius: 6,
                                        px: 2,
                                        bgcolor: !localViewerFollowing.includes(
                                          userData.id
                                        )
                                          ? "#4CAF50"
                                          : "transparent",
                                        color: localViewerFollowing.includes(
                                          userData.id
                                        )
                                          ? "#757575"
                                          : "white",
                                        borderColor:
                                          localViewerFollowing.includes(
                                            userData.id
                                          )
                                            ? "#757575"
                                            : "#4CAF50",
                                        textTransform: "none",
                                        fontWeight: 500,
                                        "&:hover": {
                                          bgcolor:
                                            !localViewerFollowing.includes(
                                              userData.id
                                            )
                                              ? "#45a049"
                                              : alpha("#757575", 0.1),
                                          borderColor:
                                            localViewerFollowing.includes(
                                              userData.id
                                            )
                                              ? "#616161"
                                              : "#45a049",
                                        },
                                      }}
                                      onClick={handleFollowToggle(userData.id)}
                                      disabled={
                                        followProcessing[userData.id] ||
                                        !user?._id
                                      }
                                    >
                                      {localViewerFollowing.includes(
                                        userData.id
                                      )
                                        ? "Đã theo dõi"
                                        : "Theo dõi"}
                                    </Button>
                                  </ListItemSecondaryAction>
                                )}
                              </ListItem>
                              {index < currentData.length - 1 && (
                                <Divider variant="inset" component="li" />
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ textAlign: "center", color: "#546e7a" }}
                                >
                                  {tabValue === 1
                                    ? "Chưa có người theo dõi"
                                    : "Chưa theo dõi ai"}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
