import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Paper,
  Stack,
  alpha,
  Pagination,
  Fade,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArticleIcon from "@mui/icons-material/Article";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  fetchBlogsApi,
  toggleLikeBlogApi,
} from "../../../store/slices/blogSlice";
import { PATH } from "../../../routes/path";

// Keyframes for animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

// Custom styled components
const HeroSection = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #1b5e20 0%, #4caf50 50%, #81c784 100%)",
  color: "white",
  padding: theme.spacing(4, 3),
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: "-20%",
    left: "-20%",
    width: "140%",
    height: "140%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: "100%",
  minHeight: 420,
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  borderRadius: theme.spacing(3),
  border: `1px solid ${alpha("#4caf50", 0.2)}`,
  background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
  transition: "transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px) scale(1.03)",
    boxShadow: `0 12px 24px ${alpha("#4caf50", 0.3)}`,
    animation: `${pulse} 1.5s infinite`,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)",
  color: "#1b5e20",
  fontWeight: "bold",
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(2),
  transition: "transform 0.4s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    animation: `${pulse} 1s infinite`,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
  color: "white",
  padding: theme.spacing(2, 4),
  borderRadius: theme.spacing(3),
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "1rem",
  "&:hover": {
    background: "linear-gradient(45deg, #81c784 30%, #4caf50 90%)",
    transform: "scale(1.1)",
    animation: `${pulse} 1.5s infinite`,
  },
}));

const SearchPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
  border: `1px solid ${alpha("#4caf50", 0.2)}`,
  boxShadow: `0 4px 20px ${alpha("#000000", 0.15)}`,
}));

const BlogItem = memo(({ blog, onTagClick, onLike, onNavigate, user }) => {
  const isLikedByCurrentUser = blog.likes?.includes(user?._id);

  return (
    <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={blog.id}>
      <Zoom in={true} style={{ transitionDelay: `${200 * (blog.id % 8)}ms` }}>
        <BlogCard onClick={() => onNavigate(blog.slug)}>
          <Box sx={{ position: "relative", pt: "56.25%", height: 0 }}>
            <CardMedia
              component="img"
              loading="lazy"
              image={blog.imageUrl || "/placeholder.svg?height=200&width=300"}
              alt={blog.title}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px 12px 0 0",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: alpha("#4caf50", 0.9),
                borderRadius: 1,
                px: 1,
                py: 0.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 14, color: "white", mr: 0.5 }} />
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: 500 }}
              >
                {format(new Date(blog.createdAt), "dd MMM", { locale: vi })}
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Fade in={true} timeout={800 + index * 200} key={index}>
                  <StyledChip
                    label={tag}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(tag);
                    }}
                  />
                </Fade>
              ))}
            </Box>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#2e7d32",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                height: "3.6rem",
                mb: 2,
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {blog.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                height: "4.5rem",
                mb: 2,
                lineHeight: 1.7,
              }}
            >
              {blog.description?.replace(/<[^>]*>/g, "").substring(0, 120)}
              {blog.description?.replace(/<[^>]*>/g, "").length > 120
                ? "..."
                : ""}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "auto",
                pt: 2,
                borderTop: `1px solid ${alpha("#4caf50", 0.1)}`,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {format(new Date(blog.createdAt), "dd MMM, yyyy", {
                  locale: vi,
                })}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(blog.id);
                  }}
                  sx={{
                    color: isLikedByCurrentUser ? "#e53e3e" : "#4caf50",
                    "&:hover": {
                      bgcolor: isLikedByCurrentUser
                        ? alpha("#e53e3e", 0.1)
                        : alpha("#4caf50", 0.1),
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
                  sx={{ color: "#2e7d32", fontWeight: 500 }}
                >
                  {blog.likeCount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </BlogCard>
      </Zoom>
    </Grid>
  );
});

const BlogSkeleton = () => (
  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: `1px solid ${alpha("#4caf50", 0.2)}`,
        background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ borderRadius: "12px 12px 0 0" }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2, display: "flex", gap: 0.5 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={80} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={50} />
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

const BlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { blogs, pagination, isLoading } = useSelector((state) => state.blogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const isMounted = useRef(true);
  const user = useSelector((state) => state.user.user);

  // Sync state with URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagParam = urlParams.get("tag");
    const searchParam = urlParams.get("search");
    const pageParam = urlParams.get("page") || "1";

    const newPage = parseInt(pageParam, 10) || 1;
    const newTag = tagParam || null;
    const newSearch = searchParam || "";

    setSelectedTag(newTag);
    setSearchTerm(newSearch);
    setDebouncedSearchTerm(newSearch);
    setPage(newPage);
  }, [location.search]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch blogs
  useEffect(() => {
    if (!isMounted.current) return;

    const fetchBlogs = async () => {
      setIsFetching(true);
      const params = {
        page,
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (selectedTag) params.tag = selectedTag;
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;

      // Debug: Log the API parameters
      console.log("Fetching blogs with params:", params);

      try {
        const result = await dispatch(fetchBlogsApi(params)).unwrap();
        if (!isMounted.current) return;
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        if (isMounted.current) setIsFetching(false);
      }
    };

    fetchBlogs();
  }, [dispatch, page, debouncedSearchTerm, selectedTag]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.append("search", searchTerm);
    if (selectedTag) urlParams.append("tag", selectedTag);
    urlParams.append("page", "1");
    navigate(`/blog?${urlParams.toString()}`);
  };

  const handleTagClick = useCallback(
    (tag) => {
      const newTag = tag === selectedTag ? null : tag;
      setSelectedTag(newTag);
      setPage(1); // Reset to page 1 when changing tags
      const urlParams = new URLSearchParams();
      if (newTag) urlParams.append("tag", newTag);
      if (debouncedSearchTerm) urlParams.append("search", debouncedSearchTerm);
      urlParams.append("page", "1");
      navigate(`/blog?${urlParams.toString()}`);
    },
    [selectedTag, debouncedSearchTerm, navigate]
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    const urlParams = new URLSearchParams();
    if (debouncedSearchTerm) urlParams.append("search", debouncedSearchTerm);
    if (selectedTag) urlParams.append("tag", selectedTag);
    urlParams.append("page", value);
    navigate(`/blog?${urlParams.toString()}`);
  };

  const handleLike = useCallback(
    (blogId) => {
      dispatch(toggleLikeBlogApi(blogId));
    },
    [dispatch]
  );

  const navigateToBlog = useCallback(
    (slug) => {
      navigate(`/blog/${slug}`);
    },
    [navigate]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f5f5f5 0%, #e8f5e9 100%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header Section */}
        <HeroSection elevation={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={3}
          >
            <Box>
              <Fade in={true} timeout={1200}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ArticleIcon sx={{ fontSize: 50, color: "white", mr: 2 }} />
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    Blog QuitSmoke
                  </Typography>
                </Box>
              </Fade>
              <Fade in={true} timeout={1400}>
                <Typography
                  variant="h6"
                  sx={{
                    maxWidth: 600,
                    lineHeight: 1.6,
                    color: "white",
                    fontWeight: 300,
                  }}
                >
                  Khám phá những kiến thức, thông tin và chia sẻ hữu ích về cai
                  thuốc lá và lối sống khỏe mạnh
                </Typography>
              </Fade>
            </Box>
            <Zoom in={true} timeout={1600}>
              <StyledButton
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate(PATH.CREATEBLOG)}
              >
                Tạo bài viết
              </StyledButton>
            </Zoom>
          </Stack>
        </HeroSection>
        {/* Search Section */}
        <SearchPaper elevation={4}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm bài viết về cai thuốc lá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Zoom in={true} timeout={1200}>
                      <IconButton
                        type="submit"
                        sx={{
                          color: "#4caf50",
                          "&:hover": { bgcolor: alpha("#4caf50", 0.1) },
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Zoom>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "&:hover fieldset": {
                    borderColor: "#4caf50",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4caf50",
                  },
                },
              }}
            />
          </form>
        </SearchPaper>
        {selectedTag && (
          <Box sx={{ mb: 4 }}>
            <Zoom in={true} timeout={1200}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
                  border: `1px solid ${alpha("#4caf50", 0.3)}`,
                  display: "inline-block",
                  boxShadow: `0 4px 20px ${alpha("#000000", 0.15)}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalOfferIcon
                    sx={{ color: "#4caf50", mr: 1, fontSize: 20 }}
                  />
                  <StyledChip
                    label={`Tag: ${selectedTag}`}
                    onDelete={() => handleTagClick(null)}
                    sx={{
                      bgcolor: alpha("#4caf50", 0.9),
                      color: "#ffffff",
                      "& .MuiChip-deleteIcon": {
                        color: "#ffffff",
                        "&:hover": {
                          color: alpha("#ffffff", 0.8),
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Zoom>
          </Box>
        )}
        <Divider
          sx={{
            mb: 4,
            borderWidth: 2,
            background: "linear-gradient(to right, #4caf50, #81c784)",
          }}
        />
        {/* Blog List */}
        {isLoading || isFetching ? (
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </Grid>
        ) : blogs.length === 0 ? (
          <Zoom in={true} timeout={1200}>
            <Paper
              elevation={4}
              sx={{
                textAlign: "center",
                py: 8,
                borderRadius: 3,
                background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
                border: `1px solid ${alpha("#4caf50", 0.2)}`,
                boxShadow: `0 4px 20px ${alpha("#000000", 0.15)}`,
              }}
            >
              <ArticleIcon
                sx={{ fontSize: 64, color: alpha("#4caf50", 0.5), mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#2e7d32",
                  mb: 1,
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Không tìm thấy bài viết nào
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                Hãy thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới
              </Typography>
            </Paper>
          </Zoom>
        ) : (
          <Grid container spacing={2}>
            {blogs.map((blog, index) => (
              <BlogItem
                key={blog.id + "-" + index}
                blog={blog}
                onTagClick={handleTagClick}
                onLike={handleLike}
                onNavigate={navigateToBlog}
                user={user}
              />
            ))}
          </Grid>
        )}
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Zoom in={true} timeout={1400}>
              <Pagination
                count={pagination.totalPages || 1}
                page={page}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#2e7d32",
                    "&:hover": {
                      bgcolor: alpha("#4caf50", 0.1),
                      transform: "scale(1.1)",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#4caf50",
                      color: "#ffffff",
                      "&:hover": {
                        bgcolor: "#45a049",
                        transform: "scale(1.1)",
                      },
                    },
                  },
                }}
              />
            </Zoom>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogPage;
