import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Container,
  Grid,
  Paper,
  Badge,
  CssBaseline,
  Card,
  CardContent,
  Tab,
  Tabs,
  useMediaQuery,
  Tooltip,
  CircularProgress,
  alpha,
} from "@mui/material";
import {
  Star,
  PersonAdd,
  PersonRemove,
  EmojiEvents,
  Favorite,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  fetchAuthorById,
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
} from "../../../store/slices/userSlice";
import { getMyBadge } from "../../../store/slices/badgeSlice";
import toast from "react-hot-toast";

const FollowPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const {
    author, // tác giả đang xem
    user, // người dùng đang đăng nhập
    stats,
    isLoading: userLoading,
    isError: userError,
    errorMessage: userErrorMessage,
  } = useSelector((state) => state.user);
  const {
    badges,
    isLoading: badgeLoading,
    isError: badgeError,
    isError: badgeErrorMessage,
  } = useSelector((state) => state.badge);

  const query = new URLSearchParams(location.search);
  const initialTab = query.get("tab") === "following" ? 1 : 0;
  const [tabValue, setTabValue] = useState(initialTab);
  const [followProcessing, setFollowProcessing] = useState({});
  const [localViewerFollowing, setLocalViewerFollowing] = useState([]);
  const [localFollowers, setLocalFollowers] = useState([]);
  const [localFollowing, setLocalFollowing] = useState([]);

  // Fetch data và đồng bộ local states
  useEffect(() => {
    if (userId) {
      dispatch(fetchAuthorById(userId));
      dispatch(fetchFollowers(userId)).then((res) => {
        setLocalFollowers(res.payload || []);
      });
      dispatch(fetchFollowing(userId)).then((res) => {
        setLocalFollowing(res.payload || []);
      });
      dispatch(getMyBadge());
    }
    if (user?._id) {
      dispatch(fetchFollowing(user._id)).then((res) => {
        setLocalViewerFollowing(res.payload.map((u) => u._id));
      });
    }
  }, [dispatch, userId, user?._id]);

  const normalizeUser = (user) => ({
    id: user._id || "",
    name: user.userName || "Người dùng",
    username: user.userName || "unknown",
    avatar:
      user.profilePicture ||
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    role: user.role || "user",
    _id: user._id || "", // Đảm bảo có _id
  });

  const followersList = localFollowers.map(normalizeUser);
  const followingList = localFollowing.map(normalizeUser);
  const currentData = tabValue === 0 ? followersList : followingList;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(
      `/follow/${userId}?tab=${newValue === 0 ? "followers" : "following"}`
    );
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

        // Cập nhật localViewerFollowing
        setLocalViewerFollowing((prev) =>
          isFollowing
            ? prev.filter((id) => id !== targetUserId)
            : [...prev, targetUserId]
        );

        // Xử lý theo/dừng theo dõi tác giả A
        if (targetUserId === userId) {
          setLocalFollowers((prev) =>
            isFollowing
              ? prev.filter((u) => u._id !== user._id)
              : [...prev, user]
          );
        }

        // Nếu đang xem trang follow của chính mình
        if (userId === user._id) {
          if (isFollowing) {
            setLocalFollowing((prev) =>
              prev.filter((u) => u._id !== targetUserId)
            );
          } else {
            // Tìm trong currentData (vì user đang hiển thị ở đó)
            const foundUser = currentData.find((u) => u._id === targetUserId);
            const newUser = foundUser
              ? normalizeUser(foundUser)
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
              prev.some((u) => u._id === targetUserId)
                ? prev
                : [...prev, newUser]
            );
          }
        }
      }
    } catch (err) {
      console.error("Follow action error:", err);
      toast.error("Lỗi khi cập nhật theo dõi");
    } finally {
      setFollowProcessing((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleGoBack = () => {
    navigate(`/author/${userId}`);
  };
  const handleProfileClick = (profileUserId) => {
    navigate(`/author/${profileUserId}`);
  };
  const authorData = {
    name: author?.name || "Không xác định",
    username: author?.email?.split("@")[0] || "",
    avatar:
      author?.avatar ||
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/ac_default_pfp.jpg",
  };

  if (userLoading || badgeLoading) {
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

  if (userError || badgeError) {
    toast.error(userErrorMessage || badgeErrorMessage || "Lỗi tải thông tin");
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="#2E7D32">
          {userErrorMessage || badgeErrorMessage || "Lỗi tải thông tin"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #e8f5e9, #f5f5f5)",
        py: 4,
      }}
    >
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
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
            Quay lại
          </Button>

          {user?._id === userId && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/profile")}
              variant="text"
              sx={{
                color: "#2E7D32",
                textTransform: "none",
                "&:hover": {
                  bgcolor: alpha("#2E7D32", 0.1),
                  borderRadius: 2,
                },
              }}
            >
              Hồ sơ của tôi
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Left Profile Section */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "visible",
                position: "relative",
                mb: 3,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  height: 80,
                  bgcolor: "#4CAF50",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              />
              <CardContent sx={{ pt: 0, pb: 3, px: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: -5,
                  }}
                >
                  <Avatar
                    src={authorData.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "4px solid white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      mb: 2,
                    }}
                  />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "#263238" }}
                    >
                      {authorData.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#546e7a", mb: 1 }}
                    >
                      @{authorData.name}
                    </Typography>
                  </Box>
                </Box>

                {user && user._id !== userId && (
                  <Button
                    variant={
                      localViewerFollowing.includes(userId)
                        ? "outlined"
                        : "contained"
                    }
                    fullWidth
                    sx={{
                      my: 2,
                      borderRadius: 6,
                      py: 1,
                      bgcolor: !localViewerFollowing.includes(userId)
                        ? "#4CAF50"
                        : "transparent",
                      color: localViewerFollowing.includes(userId)
                        ? "#757575"
                        : "white",
                      borderColor: localViewerFollowing.includes(userId)
                        ? "#757575"
                        : "#4CAF50",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: !localViewerFollowing.includes(userId)
                          ? "#45a049"
                          : alpha("#757575", 0.1),
                        borderColor: localViewerFollowing.includes(userId)
                          ? "#616161"
                          : "#45a049",
                      },
                    }}
                    startIcon={
                      localViewerFollowing.includes(userId) ? (
                        <PersonRemove />
                      ) : (
                        <PersonAdd />
                      )
                    }
                    onClick={handleFollowToggle(userId)}
                    disabled={followProcessing[userId] || !user?._id}
                  >
                    {localViewerFollowing.includes(userId)
                      ? "Đã theo dõi"
                      : "Theo dõi"}
                  </Button>
                )}

                <Paper
                  sx={{
                    bgcolor: "#f5f5f5",
                    p: 2,
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-around",
                    boxShadow: "none",
                  }}
                >
                  <Box
                    onClick={() => setTabValue(0)}
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      p: 1,
                      borderRadius: 8,
                      bgcolor: tabValue === 0 ? "#4CAF50" : "transparent",
                      color: tabValue === 0 ? "white" : "#263238",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor:
                          tabValue === 0 ? "#4CAF50" : "rgba(76, 175, 80, 0.1)",
                      },
                      flex: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {stats?.followersCount || followersList.length}
                    </Typography>
                    <Typography variant="body2">Người theo dõi</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box
                    onClick={() => setTabValue(1)}
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      p: 1,
                      borderRadius: 8,
                      bgcolor: tabValue === 1 ? "#4CAF50" : "transparent",
                      color: tabValue === 1 ? "white" : "#263238",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor:
                          tabValue === 1 ? "#4CAF50" : "rgba(76, 175, 80, 0.1)",
                      },
                      flex: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {stats?.followingCount || followingList.length}
                    </Typography>
                    <Typography variant="body2">Đang theo dõi</Typography>
                  </Box>
                </Paper>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card
              sx={{
                borderRadius: 4,
                mb: 3,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmojiEvents sx={{ color: "#4CAF50", mr: 1 }} />
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
                    badges.map((badge, index) => (
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

            {/* Highlights Card */}
          </Grid>

          {/* Right List Section */}
          <Grid item size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              }}
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
                      width: "400px",
                      minWidth: "400px",
                      maxWidth: "400px",
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
                    label={`Người theo dõi (${followersList.length})`}
                    value={0}
                    icon={<Favorite fontSize="small" />}
                    iconPosition="start"
                    sx={{ padding: "0 8px" }}
                  />
                  <Tab
                    label={`Đang theo dõi (${followingList.length})`}
                    value={1}
                    icon={<PersonAdd fontSize="small" />}
                    iconPosition="start"
                    sx={{ padding: "0 8px" }}
                  />
                </Tabs>
              </Box>

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
                            <Typography variant="body2" color="text.secondary">
                              @{userData.username}
                            </Typography>
                          }
                          sx={{ mr: 2 }}
                        />
                        {user?._id !== userData.id && (
                          <ListItemSecondaryAction>
                            <Button
                              variant={
                                localViewerFollowing.includes(userData.id)
                                  ? "outlined"
                                  : "contained"
                              }
                              size="small"
                              startIcon={
                                localViewerFollowing.includes(userData.id) ? (
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
                                borderColor: localViewerFollowing.includes(
                                  userData.id
                                )
                                  ? "#757575"
                                  : "#4CAF50",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: !localViewerFollowing.includes(
                                    userData.id
                                  )
                                    ? "#45a049"
                                    : alpha("#757575", 0.1),
                                  borderColor: localViewerFollowing.includes(
                                    userData.id
                                  )
                                    ? "#616161"
                                    : "#45a049",
                                },
                              }}
                              onClick={handleFollowToggle(userData.id)}
                              disabled={
                                followProcessing[userData.id] || !user?._id
                              }
                            >
                              {!isMobile &&
                                (localViewerFollowing.includes(userData.id)
                                  ? "Đã theo dõi"
                                  : "Theo dõi")}
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
                          {tabValue === 0
                            ? "Chưa có người theo dõi"
                            : "Chưa theo dõi ai"}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FollowPage;
