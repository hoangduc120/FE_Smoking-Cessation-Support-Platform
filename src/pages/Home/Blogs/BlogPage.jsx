import React, { useEffect, useState, useRef, useCallback, memo, Suspense } from "react";
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
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchBlogsApi, toggleLikeBlogApi } from "../../../store/slices/blogSlice";
import AddIcon from "@mui/icons-material/Add";
import { PATH } from "../../../routes/path";

const ReactQuill = React.lazy(() => import("react-quill-new"));

const QuillFallback = ({ text }) => {
  const plainText = text?.replace(/<[^>]*>/g, '') || '';
  return (
    <Typography variant="body2" color="text.secondary" sx={{
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      height: "4.5rem"
    }}>
      {plainText.substring(0, 150)}
      {plainText.length > 150 ? '...' : ''}
    </Typography>
  );
};

const BlogItem = memo(({ blog, onTagClick, onLike, onNavigate, isLastElement, refCallback }) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={blog.id}
      ref={isLastElement ? refCallback : null}
    >
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
        onClick={() => onNavigate(blog.slug)}
      >
        <Box sx={{ position: 'relative', pt: '56.25%', height: 0 }}>
          {/* Sử dụng loading="lazy" để lazy load hình ảnh */}
          <CardMedia
            component="img"
            loading="lazy"
            image={blog.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={blog.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: "cover"
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
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

          {/* Hiển thị description với react-quill-new trong Suspense */}
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
            <Suspense fallback={<QuillFallback text={blog.description} />}>
              <ReactQuill
                value={blog.description}
                readOnly={true}
                modules={{ toolbar: false }}
                className="quill-content"
                style={{ border: "none", padding: 0 }}
              />
            </Suspense>
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
                  onLike(blog.id);
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
  );
});

// Blog Skeleton để hiển thị khi đang tải dữ liệu
const BlogSkeleton = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    setLocalBlogs([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm, selectedTag]);

  useEffect(() => {
    if (isSearching) return;

    const fetchBlogs = async () => {
      setIsSearching(true);

      const params = {
        page,
        limit: 9,
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
          setLocalBlogs(prev => [...prev, ...result.blogs]);
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

  const lastBlogElementRef = useCallback(node => {
    if (isLoading || isSearching) return;
    if (loader.current) loader.current.disconnect();

    loader.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, { rootMargin: '200px' });

    if (node) loader.current.observe(node);
  }, [isLoading, isSearching, hasMore]);

  const handleSearch = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.append('search', searchTerm);
    if (selectedTag) urlParams.append('tag', selectedTag);

    navigate(`/blog?${urlParams.toString()}`);
  };

  const handleTagClick = (tag) => {
    const newTag = tag === selectedTag ? null : tag;
    setSelectedTag(newTag);

    const urlParams = new URLSearchParams();
    if (newTag) urlParams.append('tag', newTag);
    if (debouncedSearchTerm) urlParams.append('search', debouncedSearchTerm);

    navigate(`/blog?${urlParams.toString()}`);
  };

  const handleLike = useCallback((blogId) => {
    dispatch(toggleLikeBlogApi(blogId));
  }, [dispatch]);

  const navigateToBlog = useCallback((slug) => {
    navigate(`/blog/${slug}`);
  }, [navigate]);

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
          onClick={() => navigate(PATH.CREATEBLOG)}
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
            onDelete={() => handleTagClick(null)}
            color="primary"
          />
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Blog List */}
      {isLoading && page === 1 ? (
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <BlogSkeleton key={index} />
          ))}
        </Grid>
      ) : localBlogs.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography variant="h6">Không tìm thấy bài viết nào</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {localBlogs.map((blog, index) => {
              const isLastElement = index === localBlogs.length - 1;
              return (
                <BlogItem
                  key={blog.id + '-' + index}
                  blog={blog}
                  onTagClick={handleTagClick}
                  onLike={handleLike}
                  onNavigate={navigateToBlog}
                  isLastElement={isLastElement}
                  refCallback={lastBlogElementRef}
                />
              );
            })}

            {/* Placeholder skeletons when loading more */}
            {(isLoading || isSearching) && page > 1 && hasMore && (
              [...Array(3)].map((_, index) => (
                <BlogSkeleton key={`skeleton-${index}`} />
              ))
            )}
          </Grid>

          {/* Loading indicator for infinite scroll */}
          {(isLoading || isSearching) && page > 1 && hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default BlogPage;