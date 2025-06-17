import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  CircularProgress,
  Paper,
  alpha,
  Container,
  TextField,
  IconButton,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  fetchAuthorById,
  followUser,
  unfollowUser,
  fetchUser,
  fetchUserStats,
  fetchFollowing,
  updateStats,
} from "../../../store/slices/userSlice";
import {
  fetchBlogsByUserApi,
  toggleLikeBlogApi,
  addCommentApi,
} from "../../../store/slices/blogSlice";
import toast from "react-hot-toast";

export default function AuthorProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    author,
    user,
    viewerFollowing,
    stats,
    isLoading,
    isError,
    errorMessage,
  } = useSelector((state) => state.user);
  const {
    blogs,
    isLoading: blogsLoading,
    isError: blogsError,
  } = useSelector((state) => state.blogs);
  const [isFollowProcessing, setIsFollowProcessing] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const hasFetchedStats = useRef(false);
  const hasFetchedFollowing = useRef(false);

  // State cho Theo dõi
  const [localFollowState, setLocalFollowState] = useState(null);

  // State cho bình luận
  const [localComments, setLocalComments] = useState({});

  // Đồng bộ localFollowState
  useEffect(() => {
    if (Array.isArray(viewerFollowing) && userId) {
      setLocalFollowState(viewerFollowing.some((f) => f._id === userId));
    }
  }, [viewerFollowing, userId]);

  const isFollowing =
    localFollowState ?? viewerFollowing.some((f) => f._id === userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAuthorById(userId));
      dispatch(fetchBlogsByUserApi({ userId }));
      dispatch(fetchUser());
    } else {
      console.error("Không có userId được cung cấp");
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && !hasFetchedStats.current) {
      dispatch(fetchUserStats(userId));
      hasFetchedStats.current = true;
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user?._id && !hasFetchedFollowing.current) {
      console.log("Fetching following for user:", user._id);
      dispatch(fetchFollowing(user._id))
        .unwrap()
        .then(() => {
          hasFetchedFollowing.current = true;
        })
        .catch((error) => {
          console.error("Failed to fetch following:", error);
        });
    }
  }, [dispatch, user?._id]);

  const authorPosts = blogs.filter((post) => post.userId === userId);

  const handleNavigateToFollowPage = (tab) => {
    navigate(`/follow/${userId}?tab=${tab}`, { replace: true });
  };

  const handleFollowToggle = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isFollowProcessing || !userId || !user?._id) {
        toast.error("Vui lòng đăng nhập để thực hiện hành động này!");
        return;
      }

      const wasFollowing = isFollowing;
      setIsFollowProcessing(true);
      setLocalFollowState(!wasFollowing);

      // Optimistic update cho stats.followersCount
      const currentStats = stats || { followersCount: 0, followingCount: 0 };
      const updatedStats = {
        ...currentStats,
        followersCount: wasFollowing
          ? Math.max(0, currentStats.followersCount - 1)
          : currentStats.followersCount + 1,
      };
      dispatch(updateStats(updatedStats));

      try {
        const action = wasFollowing ? unfollowUser : followUser;
        const result = await dispatch(action(userId)).unwrap();

        if (result.success) {
          toast.success(wasFollowing ? "Đã bỏ theo dõi!" : "Đã theo dõi!");
          setLocalFollowState(!wasFollowing);
        }
      } catch (error) {
        // Rollback optimistic updates
        setLocalFollowState(wasFollowing);
        dispatch(
          updateStats({
            ...currentStats,
            followersCount: currentStats.followersCount,
          })
        );
        console.error("Lỗi khi thực hiện hành động theo dõi:", error);
        toast.error(
          error.message ||
            error ||
            `Lỗi khi ${wasFollowing ? "bỏ theo dõi" : "theo dõi"}`
        );
      } finally {
        setIsFollowProcessing(false);
      }
    },
    [isFollowProcessing, userId, user?._id, isFollowing, dispatch, stats]
  );

  const handleMessage = () => {
    toast.info("Chức năng nhắn tin đang được phát triển!");
  };

  const handleToggleLike = (blogId) => {
    dispatch(toggleLikeBlogApi(blogId));
  };

  const handleSubmitComment = (blogId) => (e) => {
    e.preventDefault();
    const commentText = commentTexts[blogId] || "";

    if (commentText.trim() && user?._id) {
      const tempComment = {
        id: `temp-${Date.now()}`,
        text: commentText,
        author: {
          id: user._id,
          name: user?.email?.split("@")[0] || "Người dùng",
          avatar: user?.avatar || "/placeholder.svg",
        },
        createdAt: new Date().toISOString(),
      };

      // Thêm bình luận vào localComments để hiển thị ngay
      setLocalComments((prev) => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), tempComment],
      }));

      // Gửi lên server
      dispatch(addCommentApi({ blogId, comment: commentText }))
        .unwrap()
        .then(() => {
          toast.success("Bình luận đã được gửi!");
        })
        .catch((error) => {
          // Xóa bình luận tạm nếu API thất bại
          setLocalComments((prev) => ({
            ...prev,
            [blogId]: (prev[blogId] || []).filter(
              (c) => c.id !== tempComment.id
            ),
          }));
          toast.error(error.message || "Không thể gửi bình luận");
        });

      // Xóa nội dung ô nhập
      setCommentTexts((prev) => ({
        ...prev,
        [blogId]: "",
      }));
    }
  };

  const handleKeyPress = (blogId) => (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitComment(blogId)(event);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.error("Chuỗi ngày không hợp lệ: null hoặc undefined", dateStr);
      return "Không xác định";
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error("Định dạng ngày không hợp lệ");
      }
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      console.error("Định dạng ngày không hợp lệ:", dateStr, error);
      return "Không xác định";
    }
  };

  const authorData = {
    name: author?.name || "Không xác định",
    avatar:
      author?.avatar ||
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    joinDate: author?.joinDate || new Date().toISOString(),
  };

  const handleGoBack = () => {
    navigate(-1, { replace: true });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${alpha(
            "#4CAF50",
            0.2
          )} 0%, ${alpha("#81C784", 0.2)} 100%)`,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#4CAF50" }} />
      </Box>
    );
  }

  if (isError) {
    toast.error(errorMessage || "Lỗi tải thông tin tác giả");
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="#2E7D32">
          {errorMessage || "Lỗi tải thông tin tác giả"}
        </Typography>
      </Box>
    );
  }

  if (!author || Object.keys(author).length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="#2E7D32">
          Không tìm thấy thông tin tác giả
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          "#E8F5E8",
          0.3
        )} 0%, ${alpha("#F1F8E9", 0.5)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 8 } }}>
        <Box sx={{ mb: 4 }}>
          <Button
            type="button"
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
            Quay lại bài viết
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 6,
            p: 3,
            borderRadius: 4,
            border: "1px solid #E0E0E0",
            background: "white",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", mr: 2 }}>
            <Avatar
              src={authorData.avatar}
              alt={authorData.name}
              sx={{
                width: 80,
                height: 80,
                border: "4px solid #00A1F1",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {authorData.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              <span
                onClick={() => handleNavigateToFollowPage("followers")}
                style={{ color: "#4CAF50", fontWeight: "bold" }}
              >
                {stats?.followersCount || 0} người theo dõi
              </span>{" "}
              •{" "}
              <span
                onClick={() => handleNavigateToFollowPage("following")}
                style={{ color: "#4CAF50", fontWeight: "bold" }}
              >
                {stats?.followingCount || 0} người đang theo dõi
              </span>
            </Typography>
          </Box>
          {user && user._id !== userId && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                type="button"
                variant={isFollowing ? "outlined" : "contained"}
                startIcon={
                  isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />
                }
                onClick={handleFollowToggle}
                disabled={isFollowProcessing || !user}
                sx={{
                  bgcolor: !isFollowing ? "#4CAF50" : "transparent",
                  color: isFollowing ? "#757575" : "white",
                  borderColor: isFollowing ? "#757575" : "#4CAF50",
                  "&:hover": {
                    bgcolor: !isFollowing ? "#45a049" : alpha("#757575", 0.1),
                    borderColor: isFollowing ? "#616161" : "#45a049",
                  },
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontSize: "1rem",
                  textTransform: "none",
                }}
              >
                {isFollowing ? "Đã theo dõi" : "Theo dõi"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleMessage}
                sx={{
                  color: "#757575",
                  borderColor: "#B0B0B0",
                  "&:hover": {
                    borderColor: "#757575",
                    backgroundColor: "transparent",
                  },
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontSize: "1rem",
                  textTransform: "none",
                }}
              >
                Nhắn tin
              </Button>
            </Box>
          )}
        </Paper>

        <Divider sx={{ mb: 4, borderColor: alpha("#4CAF50", 0.2) }} />

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, color: "#2E7D32" }}
        >
          Bài viết của {authorData.name}
        </Typography>

        {blogsLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress size={40} sx={{ color: "#4CAF50" }} />
          </Box>
        ) : blogsError ? (
          <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
            <Typography variant="h6" color="#2E7D32">
              Lỗi tải bài viết
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {authorPosts.length > 0 ? (
              authorPosts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                // Kết hợp comments từ server và localComments
                const mergedComments = [
                  ...(post.comments || []),
                  ...(localComments[post.id] || []),
                ];
                const visibleComments = showAllComments[post.id]
                  ? mergedComments
                  : mergedComments.slice(0, 2);

                const cleanDescription = post.description
                  ?.replace(/<img[^>]*>/g, "")
                  .replace(/data:image\/[a-zA-Z]*;base64[^"]*/g, "");

                return (
                  <Grid item xs={12} key={post.id}>
                    <Card
                      sx={{
                        border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={authorData.avatar}
                          alt={post.authorName}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {authorData.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(post.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <CardMedia
                        component="img"
                        height="200"
                        image={post.imageUrl}
                        alt={post.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {post.title || "Không có tiêu đề"}
                        </Typography>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: cleanDescription || "Không có nội dung",
                          }}
                          style={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: isExpanded ? "none" : 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        />
                        {!isExpanded && (
                          <Button
                            type="button"
                            variant="text"
                            onClick={() => setExpandedPostId(post.id)}
                            sx={{ color: "#4CAF50", textTransform: "none" }}
                          >
                            Xem thêm
                          </Button>
                        )}
                        {isExpanded && (
                          <Button
                            type="button"
                            variant="text"
                            onClick={() => setExpandedPostId(null)}
                            sx={{ color: "#4CAF50", textTransform: "none" }}
                          >
                            Thu gọn
                          </Button>
                        )}
                      </CardContent>

                      <Box
                        sx={{
                          p: 2,
                          borderTop: `1px solid ${alpha("#4CAF50", 0.2)}`,
                        }}
                      >
                        {/* <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <IconButton
                            onClick={() => handleToggleLike(post.id)}
                            color={post.isLiked ? "primary" : "default"}
                          >
                            {post.isLiked ? (
                              <ThumbUpIcon />
                            ) : (
                              <ThumbUpOutlinedIcon />
                            )}
                          </IconButton>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {post.likeCount} lượt thích
                          </Typography>
                        </Box> */}
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <IconButton
                            onClick={() => handleToggleLike(post.id)}
                            sx={{
                              color: post.isLiked
                                ? "#1976d2"
                                : "rgba(0, 0, 0, 0.54)", // blue nếu liked, xám nếu không
                              transition: "color 0.3s ease",
                              "&:hover": {
                                color: post.isLiked ? "#115293" : "#1976d2", // hover đổi nhẹ
                                backgroundColor: "transparent", // tránh bị MUI hover background làm mờ
                              },
                            }}
                          >
                            {post.isLiked ? (
                              <ThumbUpIcon />
                            ) : (
                              <ThumbUpOutlinedIcon />
                            )}
                          </IconButton>

                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                              fontWeight: 500,
                              color: post.isLiked
                                ? "#1976d2"
                                : "text.secondary",
                            }}
                          >
                            {post.likeCount} lượt thích
                          </Typography>
                        </Box>

                        <Box>
                          {visibleComments.map((comment) => (
                            <Box
                              key={comment.id}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                                mb: 2,
                                px: 2,
                                py: 1.5,
                                borderRadius: 2,
                                bgcolor: "#f5f5f5",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              }}
                            >
                              <Avatar
                                src={
                                  comment.author.avatar || "/placeholder.svg"
                                }
                                alt={comment.author.name}
                                sx={{ width: 36, height: 36 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 600, color: "#2E7D32" }}
                                >
                                  {comment.author.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#333",
                                    mt: 0.3,
                                    wordWrap: "break-word",
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {comment.text}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                          {mergedComments.length > 2 &&
                            !showAllComments[post.id] && (
                              <Button
                                type="button"
                                variant="text"
                                onClick={() =>
                                  setShowAllComments((prev) => ({
                                    ...prev,
                                    [post.id]: true,
                                  }))
                                }
                                sx={{ color: "#4CAF50", textTransform: "none" }}
                              >
                                Xem thêm {mergedComments.length - 2} bình luận
                              </Button>
                            )}
                          {showAllComments[post.id] && (
                            <Button
                              type="button"
                              variant="text"
                              onClick={() =>
                                setShowAllComments((prev) => ({
                                  ...prev,
                                  [post.id]: false,
                                }))
                              }
                              sx={{ color: "#4CAF50", textTransform: "none" }}
                            >
                              Ẩn bớt
                            </Button>
                          )}
                        </Box>
                        <form
                          onSubmit={handleSubmitComment(post.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 8,
                          }}
                        >
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Viết bình luận..."
                            value={commentTexts[post.id] || ""}
                            onChange={(e) =>
                              setCommentTexts((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyPress={handleKeyPress(post.id)}
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                          <IconButton
                            type="submit"
                            color="primary"
                            disabled={
                              !commentTexts[post.id]?.trim() || !user?._id
                            }
                          >
                            <SendIcon />
                          </IconButton>
                        </form>
                      </Box>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
                <Typography variant="h6" color="#2E7D32">
                  Tác giả chưa có bài viết
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
