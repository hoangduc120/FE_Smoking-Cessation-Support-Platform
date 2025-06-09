import { useEffect, useState, useCallback } from "react";
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
  Chip,
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
} from "../../../store/slices/userSlice";
import {
  fetchBlogsByUserApi,
  toggleLikeBlogApi,
  addCommentApi,
} from "../../../store/slices/blogSlice";
import toast from "react-hot-toast";

export default function AuthorProfile() {
  const { authorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { author, user, following, stats, isLoading, isError, errorMessage } =
    useSelector((state) => state.user);
  const { blogs, isLoading: blogsLoading } = useSelector(
    (state) => state.blogs
  );
  const [isFollowProcessing, setIsFollowProcessing] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  // Fetch author, blogs, user, stats, and following
  useEffect(() => {
    if (authorId) {
      dispatch(fetchAuthorById(authorId));
      dispatch(fetchBlogsByUserApi({ userId: authorId }));
      dispatch(fetchUser());
      dispatch(fetchUserStats(authorId));
      if (user?._id) {
        dispatch(fetchFollowing(user._id));
      }
    } else {
      console.error("No authorId provided");
    }
  }, [dispatch, authorId, user?._id]);

  const authorPosts = blogs.filter((post) => post.authorId === authorId);

  // Check if the current user is following the author
  const isFollowing = Array.isArray(following) && following.includes(authorId);

  const handleFollowToggle = useCallback(
    (event) => {
      event.preventDefault();
      if (isFollowProcessing || !authorId || !user?._id) return;

      setIsFollowProcessing(true);
      const action = isFollowing ? unfollowUser : followUser;

      dispatch(action(authorId))
        .unwrap()
        .then(() => {
          toast.success(isFollowing ? "Đã bỏ theo dõi!" : "Đã theo dõi!");
        })
        .catch((error) => {
          console.error("Follow action error:", error);
          if (error === "Already following this user") {
            toast.error("Bạn đã theo dõi người dùng này!");
            dispatch(fetchFollowing(user._id));
          } else {
            toast.error(
              error || `Lỗi khi ${isFollowing ? "bỏ theo dõi" : "theo dõi"}`
            );
          }
        })
        .finally(() => {
          setIsFollowProcessing(false);
        });
    },
    [isFollowProcessing, authorId, user?._id, isFollowing, dispatch]
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
          id: user?._id || "unknown",
          name: user?.email?.split("@")[0] || "Người dùng",
          avatar: user?.avatar || "/placeholder.svg",
        },
        createdAt: new Date().toISOString(),
      };

      // Thêm bình luận tạm thời vào state Redux
      dispatch({
        type: "blogs/addComment",
        payload: { blogId, comment: tempComment },
      });

      // Gửi bình luận lên server
      dispatch(addCommentApi({ blogId, comment: commentText }))
        .unwrap()
        .then(() => {
          toast.success("Bình luận đã được gửi!");
          // Làm mới danh sách bài viết
          dispatch(fetchBlogsByUserApi({ userId: authorId }));
        })
        .catch((error) => {
          // Xóa bình luận tạm thời nếu API thất bại
          dispatch({
            type: "blogs/addCommentFailed",
            payload: { blogId, commentId: tempComment.id },
          });
          toast.error(error.message || "Không thể gửi bình luận");
        });

      // Xóa nội dung bình luận sau khi gửi
      setCommentTexts((prev) => ({ ...prev, [blogId]: "" }));
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
      console.error("Invalid date string: null or undefined", dateStr);
      return "Không xác định";
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      console.error("Invalid date format:", dateStr, error);
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
    navigate(-1);
  };

  if (isLoading) {
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
        background: `linear-gradient(135deg, ${alpha("#E8F5E8", 0.3)} 0%, ${alpha("#F1F8E9", 0.5)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 8 } }}>
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
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
            Quay lại bài viết
          </Button>
        </Box>

        {/* Author Header */}
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
              }}
            >
              {stats.followersCount || 0} người theo dõi •{" "}
              {stats[0]?.followingCount || 0} người đang theo dõi
            </Typography>
          </Box>
          {user && user._id !== authorId && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
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

        {/* Author's Posts */}
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
        ) : (
          <Grid container spacing={3}>
            {authorPosts.length > 0 ? (
              authorPosts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                const visibleComments = showAllComments[post.id]
                  ? post.comments
                  : post.comments?.slice(0, 2) || [];

                // Làm sạch description, loại bỏ base64 và giữ HTML
                const cleanDescription = post.description
                  ?.replace(/<img[^>]*>/g, "") // Loại bỏ thẻ img
                  .replace(/data:image\/[a-zA-Z]*;base64[^"]*/g, ""); // Loại bỏ base64

                return (
                  <Grid item xs={12} key={post.id}>
                    <Card
                      sx={{
                        border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      {/* Post Header */}
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

                      {/* Post Content */}
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.imageUrl}
                        alt={post.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        {/* Hiển thị tiêu đề bài viết */}
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
                            variant="text"
                            onClick={() => setExpandedPostId(post.id)}
                            sx={{ color: "#4CAF50", textTransform: "none" }}
                          >
                            Xem thêm
                          </Button>
                        )}
                        {isExpanded && (
                          <Button
                            variant="text"
                            onClick={() => setExpandedPostId(null)}
                            sx={{ color: "#4CAF50", textTransform: "none" }}
                          >
                            Thu gọn
                          </Button>
                        )}
                      </CardContent>

                      {/* Like and Comment Section */}
                      <Box
                        sx={{
                          p: 2,
                          borderTop: `1px solid ${alpha("#4CAF50", 0.2)}`,
                        }}
                      >
                        <Box
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
                        </Box>
                        <Box>
                          {visibleComments.map((comment) => (
                            <Box key={comment.id} sx={{ mb: 1 }}>
                              <Typography variant="body2">
                                <strong>{comment.author.name}:</strong>{" "}
                                {comment.text}
                              </Typography>
                            </Box>
                          ))}
                          {post.comments &&
                            post.comments.length > 2 &&
                            !showAllComments[post.id] && (
                              <Button
                                variant="text"
                                onClick={() =>
                                  setShowAllComments({
                                    ...showAllComments,
                                    [post.id]: true,
                                  })
                                }
                                sx={{ color: "#4CAF50", textTransform: "none" }}
                              >
                                Xem thêm {post.comments.length - 2} bình luận
                              </Button>
                            )}
                          {showAllComments[post.id] && (
                            <Button
                              variant="text"
                              onClick={() =>
                                setShowAllComments({
                                  ...showAllComments,
                                  [post.id]: false,
                                })
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
