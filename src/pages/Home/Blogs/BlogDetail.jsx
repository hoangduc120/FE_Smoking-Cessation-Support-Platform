import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  Stack,
  alpha,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  fetchBlogBySlugApi,
  toggleLikeBlogApi,
  addCommentApi,
} from "../../../store/slices/blogSlice";
import { fetchUser } from "../../../store/slices/userSlice";
import toast from "react-hot-toast";

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedBlog, isLoading } = useSelector((state) => state.blogs);
  const { currentUser } = useSelector((state) => state.auth);
  const viewer = useSelector((state) => state.user.user); // từ userSlice

  const currentUserId = currentUser?.user?.id;
  const isLikedByCurrentUser = selectedBlog?.likes?.includes(currentUserId);

  const [comment, setComment] = useState("");
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);

  useEffect(() => {
    if (!viewer) {
      dispatch(fetchUser());
    }
  }, [dispatch, viewer]);

  const handleShowMoreComments = () => {
    setVisibleComments((prev) =>
      Math.min(prev + 10, selectedBlog?.comments?.length || 0)
    );
  };

  const handleHideComments = () => {
    setVisibleComments((prev) => Math.max(prev - 10, 5));
  };

  const displayedComments =
    selectedBlog?.comments?.slice(0, visibleComments) || [];
  const remainingComments = selectedBlog?.comments?.length
    ? selectedBlog.comments.length - visibleComments
    : 0;

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlugApi(slug));
    }
  }, [dispatch, slug]);

  const handleLike = () => {
    if (isLikeProcessing || !selectedBlog) return;

    setIsLikeProcessing(true);

    dispatch(toggleLikeBlogApi(selectedBlog.id))
      .unwrap()
      .then(() => {
        // Xử lý thành công sẽ được xử lý bởi reducer
      })
      .catch((error) => {
        console.error("Lỗi khi thực hiện like/unlike:", error);
      })
      .finally(() => {
        setIsLikeProcessing(false);
      });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép đường dẫn bài viết vào clipboard!");
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim() && selectedBlog) {
      const tempComment = {
        id: `temp-${Date.now()}`,
        text: comment,
        author: {
          id: viewer?._id || "unknown",
          name:
            viewer?.userName || viewer?.email?.split("@")[0] || "Người dùng",
          avatar: viewer?.profilePicture || "/placeholder.svg",
        },
        createdAt: new Date().toISOString(),
      };
      dispatch({
        type: "blogs/addComment",
        payload: { blogId: selectedBlog.id, comment: tempComment },
      });
      dispatch(
        addCommentApi({
          blogId: selectedBlog.id,
          comment: comment,
        })
      )
        .unwrap()
        .catch((error) => {
          dispatch({
            type: "blogs/addCommentApi/rejected",
            payload: { blogId: selectedBlog.id, commentId: tempComment.id },
          });
          toast.error(error.message || "Không thể thêm bình luận");
        });

      setComment("");
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/blog?tag=${tag}`);
  };

  const handleAuthorClick = () => {
    if (selectedBlog?.userId) {
      navigate(`/author/${selectedBlog.userId}`);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM, yyyy", { locale: vi });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: `linear-gradient(135deg, ${alpha("#4CAF50", 0.1)} 0%, ${alpha("#81C784", 0.1)} 100%)`,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#4CAF50" }} />
      </Box>
    );
  }

  if (!selectedBlog) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha("#4CAF50", 0.1)} 0%, ${alpha("#81C784", 0.1)} 100%)`,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: "#2E7D32" }}>
            Không tìm thấy bài viết
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/blog")}
            sx={{
              bgcolor: "#4CAF50",
              "&:hover": { bgcolor: "#45a049" },
              borderRadius: 2,
              px: 4,
              py: 1.5,
            }}
          >
            Quay lại trang blog
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha("#E8F5E8", 0.3)} 0%, ${alpha("#F1F8E9", 0.3)} 100%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 8 } }}>
        {/* Back button */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/blog")}
            variant="text"
            sx={{
              color: "#4CAF50",
              "&:hover": {
                bgcolor: alpha("#4CAF50", 0.1),
                borderRadius: 2,
              },
            }}
          >
            Quay lại danh sách bài viết
          </Button>
        </Box>

        {/* Main Content Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${alpha("#4CAF50", 0.2)}`,
            background: "white",
          }}
        >
          {/* Blog Header */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#2E7D32",
                fontSize: { xs: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              {selectedBlog.title}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={selectedBlog.authorName}
                  src={selectedBlog.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    border: `2px solid ${alpha("#4CAF50", 0.3)}`,
                    cursor: "pointer",
                  }}
                  onClick={handleAuthorClick}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    sx={{ color: "#2E7D32", cursor: "pointer" }}
                    onClick={handleAuthorClick}
                  >
                    {selectedBlog.authorName}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "text.secondary",
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {formatDate(selectedBlog.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedBlog.tags &&
                  selectedBlog.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onClick={() => handleTagClick(tag)}
                      clickable
                      sx={{
                        bgcolor: alpha("#4CAF50", 0.1),
                        color: "#2E7D32",
                        border: `1px solid ${alpha("#4CAF50", 0.3)}`,
                        "&:hover": {
                          bgcolor: alpha("#4CAF50", 0.2),
                        },
                      }}
                    />
                  ))}
              </Box>
            </Stack>
          </Box>

          {/* Blog Featured Image */}
          <Box
            component="img"
            src={selectedBlog.imageUrl}
            alt={selectedBlog.title}
            sx={{
              width: "100%",
              height: { xs: 250, md: 400 },
              objectFit: "cover",
            }}
          />

          {/* Blog Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 2,
                  margin: "16px 0",
                  display: "block",
                  boxShadow: `0 4px 12px ${alpha("#4CAF50", 0.2)}`,
                },
                "& p": {
                  marginBottom: "16px",
                },
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  color: "#2E7D32",
                  marginTop: "24px",
                  marginBottom: "16px",
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mb: 4,
                  whiteSpace: "pre-line",
                  fontSize: "1.1rem",
                  color: "#424242",
                }}
                dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
              />
            </Box>

            {/* Like and Share */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: alpha("#4CAF50", 0.05),
                border: `1px solid ${alpha("#4CAF50", 0.2)}`,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={handleLike}
                    disabled={isLikeProcessing}
                    sx={{
                      color: isLikedByCurrentUser ? "#E53E3E" : "#4CAF50",
                      "&:hover": {
                        bgcolor: isLikedByCurrentUser
                          ? alpha("#E53E3E", 0.1)
                          : alpha("#4CAF50", 0.1),
                      },
                    }}
                  >
                    {isLikedByCurrentUser ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2E7D32", fontWeight: 500 }}
                  >
                    {selectedBlog.likeCount} lượt thích
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleShare}
                  sx={{
                    color: "#4CAF50",
                    "&:hover": { bgcolor: alpha("#4CAF50", 0.1) },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Stack>
            </Paper>

            <Divider sx={{ mb: 4, borderColor: alpha("#4CAF50", 0.2) }} />

            {/* Comments Section */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <ChatBubbleOutlineIcon sx={{ color: "#4CAF50", mr: 1 }} />
                <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{ color: "#2E7D32" }}
                >
                  Bình luận ({selectedBlog.comments?.length || 0})
                </Typography>
              </Box>

              {/* Comment Form */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  bgcolor: alpha("#4CAF50", 0.05),
                  border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                }}
              >
                <Box component="form" onSubmit={handleSubmitComment}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Viết bình luận của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#4CAF50",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4CAF50",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!comment.trim()}
                    sx={{
                      bgcolor: "#4CAF50",
                      "&:hover": { bgcolor: "#45a049" },
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Đăng bình luận
                  </Button>
                </Box>
              </Paper>

              {/* Comments List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {displayedComments.map((comment, index) => (
                  <Paper
                    key={comment.id || index}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha("#F1F8E9", 0.5),
                      border: `1px solid ${alpha("#4CAF50", 0.1)}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        alt={comment.author?.name || "Người dùng"}
                        src={comment.author?.avatar || "/placeholder.svg"}
                        sx={{
                          width: 40,
                          height: 40,
                          border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (comment.author?.id)
                            navigate(`/author/${comment.author.id}`);
                        }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2E7D32",
                            fontWeight: 600,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => {
                            if (comment.author?.id)
                              navigate(`/author/${comment.author.id}`);
                          }}
                        >
                          {comment.author?.name || "Người dùng"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.createdAt
                            ? formatDate(comment.createdAt)
                            : "Vừa xong"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#424242" }}>
                      {comment.text}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              {/* Show More/Hide Comments Buttons */}
              {selectedBlog.comments && selectedBlog.comments.length > 5 && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  {remainingComments > 0 && (
                    <Button
                      variant="outlined"
                      onClick={handleShowMoreComments}
                      sx={{
                        borderColor: "#4CAF50",
                        color: "#4CAF50",
                        mr: 2,
                        "&:hover": {
                          borderColor: "#45a049",
                          bgcolor: alpha("#4CAF50", 0.1),
                        },
                      }}
                    >
                      Xem thêm ({remainingComments}) bình luận
                    </Button>
                  )}
                  {visibleComments > 5 && (
                    <Button
                      variant="text"
                      onClick={handleHideComments}
                      sx={{
                        color: "#4CAF50",
                        "&:hover": {
                          bgcolor: alpha("#4CAF50", 0.1),
                        },
                      }}
                    >
                      Ẩn bình luận
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BlogDetail;
