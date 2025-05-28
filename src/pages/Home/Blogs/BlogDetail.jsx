import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchBlogBySlugApi, toggleLikeBlogApi, addCommentApi } from "../../../store/slices/blogSlice";

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedBlog, isLoading } = useSelector((state) => state.blogs);
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlugApi(slug));
    }
  }, [dispatch, slug]);

  const handleLike = () => {
    if (isAuthenticated) {
      dispatch(toggleLikeBlogApi(selectedBlog.id));
    } else {
      navigate("/auth/login");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã sao chép đường dẫn bài viết vào clipboard!");
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim() && isAuthenticated) {
      dispatch(addCommentApi(selectedBlog.id, comment));
      setComment("");
    } else if (!isAuthenticated) {
      navigate("/auth/login");
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/blog?tag=${tag}`);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM, yyyy", { locale: vi });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedBlog) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5">Không tìm thấy bài viết</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/blog")}
            sx={{ mt: 2 }}
          >
            Quay lại trang blog
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Back button */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/blog")}
          variant="text"
        >
          Quay lại danh sách bài viết
        </Button>
      </Box>

      {/* Blog Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {selectedBlog.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            alt={selectedBlog.authorName}
            src={selectedBlog.avatar}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {selectedBlog.authorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(selectedBlog.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {selectedBlog.tags && selectedBlog.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color="primary"
              variant="outlined"
              clickable
            />
          ))}
        </Box>
      </Box>

      {/* Blog Featured Image */}
      <Box
        component="img"
        src={selectedBlog.imageUrl}
        alt={selectedBlog.title}
        sx={{
          width: "100%",
          borderRadius: 2,
          height: { xs: 250, md: 400 },
          objectFit: "cover",
          mb: 4,
        }}
      />

      {/* Blog Content */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, mb: 4, whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
        />
      </Box>

      {/* Like and Share */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleLike}
              color={selectedBlog.isLiked ? "error" : "default"}
            >
              {selectedBlog.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2">
              {selectedBlog.likeCount} lượt thích
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      {/* Comments Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Bình luận ({selectedBlog.comments ? selectedBlog.comments.length : 0})
        </Typography>

        {/* Comment Form */}
        {isAuthenticated ? (
          <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Viết bình luận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!comment.trim()}
            >
              Đăng bình luận
            </Button>
          </Box>
        ) : (
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: "#f8f9fa" }}>
            <Typography variant="body1" paragraph>
              Vui lòng đăng nhập để bình luận.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/auth/login")}
            >
              Đăng nhập
            </Button>
          </Paper>
        )}

        {/* Comments List */}
        {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
          <Grid container spacing={3}>
            {selectedBlog.comments.map((comment, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ bgcolor: "#f8f9fa" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", mb: 2 }}>
                      <Avatar
                        alt={comment.author?.name}
                        src="/placeholder.svg?height=40&width=40"
                        sx={{ width: 36, height: 36, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">
                          {comment.author?.name || "Người dùng"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.createdAt
                            ? formatDate(comment.createdAt)
                            : "Vừa xong"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">{comment.text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Related Articles - Would be implemented with actual data in a real app */}
      <Box>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Bài viết liên quan
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                  height: "100%",
                }}
                onClick={() => navigate(`/blog/sample-${item}`)}
              >
                <Box
                  component="img"
                  src={`/placeholder.svg?height=150&width=250&text=Bài viết liên quan ${item}`}
                  alt={`Bài viết liên quan ${item}`}
                  sx={{ width: "100%", height: 150, objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Bài viết liên quan {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mô tả ngắn về bài viết liên quan đến chủ đề cai thuốc lá.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default BlogDetail;
