import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Grid,
  CardMedia,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import {
  fetchPostBySlugApi,
  toggleLikePostApi,
  addCommentApi,
  updateLike,
  addComment,
} from "../../../store/slices/postSlice";

const cleanContent = (content) => {
  if (!content) return "";
  return content.replace(/<span class="ql-ui"[^>]*><\/span>/g, "");
};

const removeDuplicateListItems = (content) => {
  const sanitizedContent = DOMPurify.sanitize(cleanContent(content));
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedContent, "text/html");
  const listItems = doc.querySelectorAll("ol > li");
  const uniqueItems = new Set();
  listItems.forEach((item) => {
    const text = item.textContent.trim();
    if (uniqueItems.has(text)) {
      item.remove();
    } else {
      uniqueItems.add(text);
    }
  });
  return doc.body.innerHTML;
};

const getFirstImageFromContent = (description) => {
  if (!description) return "/placeholder.svg?height=300&width=500";
  const sanitizedContent = DOMPurify.sanitize(cleanContent(description));
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedContent, "text/html");
  const img = doc.querySelector("img");
  if (img && img.src) {
    if (
      img.src.startsWith("data:image") &&
      img.src.includes("base64,") &&
      img.src.length > 100
    ) {
      return img.src;
    } else if (img.src.startsWith("http")) {
      return img.src;
    }
  }
  return "/placeholder.svg?height=300&width=500";
};

export default function PostDetail({
  post: initialPost,
  onAuthorClick,
  onRelatedPostClick,
  allPosts,
}) {
  const dispatch = useDispatch();
  const { selectedPost, isLoading, error } = useSelector(
    (state) => state.posts
  );
  const { currentUser } = useSelector((state) => state.auth);
  const post = selectedPost || initialPost;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(4);

  useEffect(() => {
    if (
      initialPost?.slug &&
      (!selectedPost || selectedPost.id !== initialPost.id)
    ) {
      dispatch(fetchPostBySlugApi(initialPost.slug));
    }
  }, [dispatch, initialPost, selectedPost]);

  const relatedPosts = allPosts
    .filter((p) => {
      if (!post || p.id === post.id) return false;
      const postTags = Array.isArray(post.tags) ? post.tags : [];
      const otherTags = Array.isArray(p.tags) ? p.tags : [];
      return postTags.some((tag) => otherTags.includes(tag));
    })
    .slice(0, 6);

  const handleShare = () => {
    if (!post) {
      toast.error("Không thể chia sẻ bài viết!");
      return;
    }
    if (navigator.share) {
      navigator
        .share({
          title: post.title || "Bài viết",
          text:
            DOMPurify.sanitize(post.description || "Không có nội dung", {
              ALLOWED_TAGS: [],
            }).substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link đã được sao chép!");
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link đã được sao chép!");
    }
  };

  const toggleLike = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    if (!post?.id) {
      toast.error("Không thể thích bài viết!");
      return;
    }

    const newIsLiked = !post.isLiked;
    const newLikeCount = newIsLiked ? post.likeCount + 1 : post.likeCount - 1;
    dispatch(
      updateLike({
        postId: post.id,
        isLiked: newIsLiked,
        likeCount: newLikeCount,
      })
    );

    dispatch(toggleLikePostApi(post.id)).catch(() => {
      // Rollback optimistic update on error
      dispatch(
        updateLike({
          postId: post.id,
          isLiked: !newIsLiked,
          likeCount: post.likeCount,
        })
      );
      toast.error("Không thể cập nhật lượt thích!");
    });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết");
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }
    if (!post?.id) {
      toast.error("Không thể bình luận!");
      return;
    }

    // Tạo object comment để hiển thị trên giao diện
    const commentForDisplay = {
      id: Date.now().toString(), // Temporary ID
      userName: currentUser?.name || currentUser?.email?.split("@")[0],
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    // Cập nhật giao diện trước (optimistic update)
    dispatch(
      addComment({
        postId: post.id,
        comment: commentForDisplay,
      })
    );

    // Gửi dữ liệu API với định dạng { comment: string }
    dispatch(
      addCommentApi({
        postId: post.id,
        commentData: { comment: newComment.trim() },
      })
    )
      .unwrap()
      .then((response) => {
        // Cập nhật lại comment với dữ liệu từ server (nếu cần)
        dispatch(
          addComment({
            postId: post.id,
            comment: {
              ...commentForDisplay,
              id: response.id || commentForDisplay.id, // Cập nhật ID từ server
              createdAt: response.createdAt || commentForDisplay.createdAt,
            },
          })
        );
      })
      .catch(() => {
        // Rollback nếu API thất bại
        dispatch(
          addComment({
            postId: post.id,
            comment: null, // Xóa bình luận vừa thêm
          })
        );
        toast.error("Không thể thêm bình luận!");
      });

    setNewComment("");
  };

  const handleLoadMoreComments = () => {
    setVisibleCommentsCount((prevCount) => prevCount + 10);
  };

  const handleCollapseComments = () => {
    setVisibleCommentsCount(4);
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h6">Đang tải...</Typography>
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Lỗi: {error?.message || "Không tìm thấy bài viết"}
        </Typography>
      </Box>
    );
  }

  const heroImage =
    post.imageUrl || getFirstImageFromContent(post.description || "");
  const visibleComments = (
    Array.isArray(post.comments) ? post.comments : []
  ).slice(0, visibleCommentsCount);
  const hasMoreComments = (post.comments?.length || 0) > visibleCommentsCount;
  const canCollapseComments = (post.comments?.length || 0) > 4;

  return (
    <>
      <Box
        sx={{
          height: { xs: 200, sm: 300, md: 400 },
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          borderRadius: 2,
          mb: 4,
        }}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {(Array.isArray(post.tags) ? post.tags : []).map((tag, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                >
                  #{tag}
                </Typography>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(post.createdAt || new Date()), "dd MMMM yyyy", {
                locale: vi,
              })}
            </Typography>
          </Box>

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            {post.title || "Không có tiêu đề"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={post.avatar || "/placeholder.svg?height=40&width=40"}
              alt={post.authorName}
              sx={{ mr: 2 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "medium",
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
                onClick={() => onAuthorClick(post.authorId || "unknown")}
              >
                {post.authorName || "Người dùng ẩn danh"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tác giả
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              lineHeight: 1.6,
              fontSize: "1.1rem",
              mb: 4,
            }}
            dangerouslySetInnerHTML={{
              __html: removeDuplicateListItems(post.description || ""),
            }}
          />

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                color="error"
                size="large"
                onClick={toggleLike}
                aria-label={post.isLiked ? "Bỏ thích" : "Thích bài viết"}
              >
                {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton color="primary" size="large" aria-label="Bình luận">
                <CommentIcon />
              </IconButton>
              <IconButton
                color="default"
                size="large"
                onClick={handleShare}
                aria-label="Chia sẻ bài viết"
              >
                <ShareIcon />
              </IconButton>
            </Box>
            <IconButton
              color="warning"
              size="large"
              onClick={toggleBookmark}
              aria-label={isBookmarked ? "Bỏ lưu bài viết" : "Lưu bài viết"}
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 3, mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {post.likeCount || 0} lượt thích
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.comments?.length || 0} bình luận
            </Typography>
            <Typography variant="body2" color="text.secondary">
              156 lượt xem
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Avatar
                src={
                  currentUser?.avatar || "/placeholder.svg?height=40&width=40"
                }
                alt={currentUser?.name || "Anonymous"}
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!newComment.trim()}
                sx={{ mt: 1 }}
                aria-label="Gửi bình luận"
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>

          {visibleComments.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
                Bình luận ({post.comments.length})
              </Typography>
              <List>
                {visibleComments.map((comment) => (
                  <ListItem
                    key={comment.id || comment._id || Date.now()}
                    alignItems="flex-start"
                    sx={{ py: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={"/placeholder.svg?height=40&width=40"}
                        alt={comment.userName}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {comment.userName || "Người dùng ẩn danh"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(
                              new Date(comment.createdAt || new Date()),
                              {
                                addSuffix: true,
                                locale: vi,
                              }
                            )}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.primary">
                          {comment.text || ""}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {canCollapseComments && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  {hasMoreComments && (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={handleLoadMoreComments}
                      sx={{ textTransform: "none" }}
                      aria-label="Xem thêm bình luận"
                    >
                      Xem thêm ({post.comments.length - visibleCommentsCount})
                    </Button>
                  )}
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={handleCollapseComments}
                    sx={{ textTransform: "none" }}
                    aria-label="Thu gọn bình luận"
                  >
                    Thu gọn
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </Typography>
          )}

          {relatedPosts.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                Bài viết liên quan
              </Typography>
              <Grid container spacing={3}>
                {relatedPosts.map((relatedPost) => (
                  <Grid item xs={12} sm={6} md={4} key={relatedPost.id}>
                    <Box
                      sx={{
                        cursor: "pointer",
                        transition:
                          "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                      onClick={() => onRelatedPostClick(relatedPost)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          relatedPost.imageUrl ||
                          getFirstImageFromContent(
                            relatedPost.description || ""
                          )
                        }
                        alt={relatedPost.title}
                        sx={{ borderRadius: "4px 4px 0 0" }}
                      />
                      <CardContent sx={{ padding: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          {(Array.isArray(relatedPost.tags)
                            ? relatedPost.tags
                            : []
                          ).map((tag, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              color="primary"
                              sx={{ cursor: "pointer" }}
                            >
                              #{tag}
                            </Typography>
                          ))}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "medium", mb: 0.5 }}
                        >
                          {relatedPost.title || "Không có tiêu đề"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {format(
                            new Date(relatedPost.createdAt || new Date()),
                            "dd MMM yyyy",
                            { locale: vi }
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {DOMPurify.sanitize(
                            relatedPost.description || "Không có nội dung",
                            {
                              ALLOWED_TAGS: [],
                            }
                          ).slice(0, 100)}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
}
