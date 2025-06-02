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
} from "@mui/material";
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

const QuillFallback = ({ text }) => {
  const plainText = text?.replace(/<[^>]*>/g, "") || "";
  return (
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
      }}
    >
      {plainText.substring(0, 150)}
      {plainText.length > 150 ? "..." : ""}
    </Typography>
  );
};

const BlogItem = memo(
  ({ blog, onTagClick, onLike, onNavigate, isLastElement, refCallback }) => {
    return (
      <Grid
        item
        xs={12}
        sm={6}
        md={3}
        key={blog.id}
        ref={isLastElement ? refCallback : null}
      >
        <Card
          sx={{
            height: "100%",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            borderRadius: 3,
            width: "100%", // Đảm bảo Card chiếm toàn bộ chiều rộng của Grid item
            border: `1px solid ${alpha("#4CAF50", 0.2)}`,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: `0 12px 24px ${alpha("#4CAF50", 0.15)}`,
              borderColor: "#4CAF50",
            },
          }}
          onClick={() => onNavigate(blog.slug)}
        >
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
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: alpha("#4CAF50", 0.9),
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
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                  sx={{
                    bgcolor: alpha("#4CAF50", 0.1),
                    color: "#2E7D32",
                    border: `1px solid ${alpha("#4CAF50", 0.3)}`,
                    fontSize: "0.75rem",
                    "&:hover": {
                      bgcolor: alpha("#4CAF50", 0.2),
                    },
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#2E7D32",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                height: "3.6rem",
                mb: 2,
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
                lineHeight: 1.5,
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
                borderTop: `1px solid ${alpha("#4CAF50", 0.1)}`,
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
                    color: blog.isLiked ? "#E53E3E" : "#4CAF50",
                    "&:hover": {
                      bgcolor: blog.isLiked
                        ? alpha("#E53E3E", 0.1)
                        : alpha("#4CAF50", 0.1),
                    },
                  }}
                >
                  {blog.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ color: "#2E7D32", fontWeight: 500 }}
                >
                  {blog.likeCount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  }
);

const BlogSkeleton = () => (
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: `1px solid ${alpha("#4CAF50", 0.1)}`,
      }}
    >
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 1, display: "flex", gap: 0.5 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
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
  const [localBlogs, setLocalBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const loader = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagParam = urlParams.get("tag");
    const searchParam = urlParams.get("search");

    if (tagParam && tagParam !== selectedTag) {
      setSelectedTag(tagParam);
    }

    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
      setDebouncedSearchTerm(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (isSearching) return;

    const fetchBlogs = async () => {
      setIsSearching(true);

      const params = {
        page,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (selectedTag) {
        params.tag = selectedTag;
      }

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      try {
        const result = await dispatch(fetchBlogsApi(params)).unwrap();
        if (!isMounted.current) return;

        if (page === 1) {
          setLocalBlogs(result.blogs);
        } else {
          setLocalBlogs((prev) => [...prev, ...result.blogs]);
        }

        setHasMore(page < result.pagination.totalPages);
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
      } finally {
        if (isMounted.current) {
          setIsSearching(false);
        }
      }
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => fetchBlogs());
    } else {
      setTimeout(fetchBlogs, 0);
    }
  }, [dispatch, page, debouncedSearchTerm, selectedTag]);

  const lastBlogElementRef = useCallback(
    (node) => {
      if (isLoading || isSearching) return;
      if (loader.current) loader.current.disconnect();

      loader.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) loader.current.observe(node);
    },
    [isLoading, isSearching, hasMore]
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.append("search", searchTerm);
    if (selectedTag) urlParams.append("tag", selectedTag);

    navigate(`/blog?${urlParams.toString()}`);
  };

  const handleTagClick = (tag) => {
    const newTag = tag === selectedTag ? null : tag;
    setSelectedTag(newTag);

    const urlParams = new URLSearchParams();
    if (newTag) urlParams.append("tag", newTag);
    if (debouncedSearchTerm) urlParams.append("search", debouncedSearchTerm);

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
        background: `linear-gradient(135deg, ${alpha("#E8F5E8", 0.3)} 0%, ${alpha("#F1F8E9", 0.3)} 100%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha("#4CAF50", 0.1)} 0%, ${alpha("#81C784", 0.1)} 100%)`,
            border: `1px solid ${alpha("#4CAF50", 0.2)}`,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={3}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ArticleIcon sx={{ fontSize: 40, color: "#4CAF50", mr: 2 }} />
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#2E7D32",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Blog QuitSmoke
                </Typography>
              </Box>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  lineHeight: 1.6,
                  color: "#424242",
                }}
              >
                Khám phá những kiến thức, thông tin và chia sẻ hữu ích về cai
                thuốc lá và lối sống khỏe mạnh
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate(PATH.CREATEBLOG)}
              sx={{
                bgcolor: "#4CAF50",
                "&:hover": { bgcolor: "#45a049" },
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: `0 4px 12px ${alpha("#4CAF50", 0.3)}`,
                minWidth: { xs: "100%", md: "auto" },
              }}
            >
              Tạo bài viết
            </Button>
          </Stack>
        </Paper>
        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha("#4CAF50", 0.2)}`,
            background: "white",
          }}
        >
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm bài viết về cai thuốc lá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      sx={{
                        color: "#4CAF50",
                        "&:hover": { bgcolor: alpha("#4CAF50", 0.1) },
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#4CAF50",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4CAF50",
                  },
                },
              }}
            />
          </form>
        </Paper>
        {selectedTag && (
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#4CAF50", 0.1),
                border: `1px solid ${alpha("#4CAF50", 0.3)}`,
                display: "inline-block",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalOfferIcon
                  sx={{ color: "#4CAF50", mr: 1, fontSize: 20 }}
                />
                <Chip
                  label={`Tag: ${selectedTag}`}
                  onDelete={() => handleTagClick(null)}
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#FFFFFF",
                    "& .MuiChip-deleteIcon": {
                      color: "#FFFFFF",
                      "&:hover": {
                        color: alpha("#FFFFFF", 0.8),
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        )}
        <Divider sx={{ mb: 4, borderColor: alpha("#4CAF50", 0.2) }} />
        {/* Blog List */}
        {isLoading && page === 1 ? (
          <Grid container spacing={2}>
            {[...Array(8)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </Grid>
        ) : localBlogs.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: 3,
              bgcolor: alpha("#F1F8E9", 0.5),
              border: `1px solid ${alpha("#4CAF50", 0.2)}`,
            }}
          >
            <ArticleIcon
              sx={{ fontSize: 64, color: alpha("#4CAF50", 0.5), mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: "#2E7D32", mb: 1 }}>
              Không tìm thấy bài viết nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid
              container
              spacing={2} // Giảm spacing để đảm bảo 4 cột vừa khít
              sx={{
                width: "100%", // Đảm bảo Grid container chiếm toàn bộ chiều rộng
                margin: 0, // Loại bỏ margin mặc định
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {localBlogs.map((blog, index) => {
                const isLastElement = index === localBlogs.length - 1;
                return (
                  <BlogItem
                    key={blog.id + "-" + index}
                    blog={blog}
                    onTagClick={handleTagClick}
                    onLike={handleLike}
                    onNavigate={navigateToBlog}
                    isLastElement={isLastElement}
                    refCallback={lastBlogElementRef}
                    xs={12} // Chiếm toàn bộ chiều rộng trên màn hình nhỏ
                    sm={6} // 2 cột trên màn hình nhỏ
                    md={3}
                  />
                );
              })}
              {(isLoading || isSearching) &&
                page > 1 &&
                hasMore &&
                [...Array(4)].map((_, index) => (
                  <BlogSkeleton key={`skeleton-${index}`} />
                ))}
            </Grid>
            {(isLoading || isSearching) && page > 1 && hasMore && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress size={30} sx={{ color: "#4CAF50" }} />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default BlogPage;
