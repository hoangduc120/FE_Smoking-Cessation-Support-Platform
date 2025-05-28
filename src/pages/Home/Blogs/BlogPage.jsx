import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchBlogsApi, toggleLikeBlogApi } from "../../../store/slices/blogSlice";
import AddIcon from "@mui/icons-material/Add";
import ReactQuill from "react-quill-new";

const BlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { blogs, pagination, isLoading } = useSelector((state) => state.blogs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // Parse current page from URL or default to 1
  const urlParams = new URLSearchParams(location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;

  useEffect(() => {
    const fetchBlogs = () => {
      const params = {
        page: currentPage,
        limit: 9,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (selectedTag) {
        params.tag = selectedTag;
      }

      if (searchTerm) {
        params.slug = searchTerm;
      }

      dispatch(fetchBlogsApi(params));
    };

    fetchBlogs();
  }, [dispatch, currentPage, selectedTag, searchTerm]);

  const handlePageChange = (event, value) => {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("page", value);
    window.history.pushState({}, "", newUrl);
    navigate(`?page=${value}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("?page=1");
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    navigate("?page=1");
  };

  const handleLike = (blogId) => {
    if (isAuthenticated) {
      dispatch(toggleLikeBlogApi(blogId));
    } else {
      navigate("/auth/login");
    }
  };

  const navigateToBlog = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Blog
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Khám phá những kiến thức, thông tin và chia sẻ hữu ích về cai thuốc lá và lối sống khỏe mạnh
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => {
            if (isAuthenticated) {
              navigate("/blog/create");
            } else {
              navigate("/auth/login", { state: { returnUrl: "/blog/create" } });
            }
          }}
        >
          Tạo bài viết
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
        </Grid>
      </Box>

      {selectedTag && (
        <Box sx={{ mb: 4 }}>
          <Chip
            label={`Tag: ${selectedTag}`}
            onDelete={() => setSelectedTag(null)}
            color="primary"
          />
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Blog List */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : blogs.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography variant="h6">Không tìm thấy bài viết nào</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => navigateToBlog(blog.slug)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.imageUrl || "/placeholder.svg?height=200&width=300"}
                  alt={blog.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      height: "3.6rem",
                    }}
                  >
                    {blog.title}
                  </Typography>
                  {/* Hiển thị description với react-quill-new */}
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      height: "4.5rem",
                      color: "text.secondary",
                    }}
                  >
                    <ReactQuill
                      value={blog.description}
                      readOnly={true}
                      modules={{ toolbar: false }} // Tắt toolbar
                      className="quill-content"
                      style={{ border: "none", padding: 0 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(blog.createdAt), "dd MMM, yyyy", {
                        locale: vi,
                      })}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(blog.id);
                        }}
                      >
                        {blog.isLiked ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <Typography variant="body2">{blog.likeCount}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default BlogPage;