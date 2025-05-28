import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Public as PublicIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Image as ImageIcon,
  PersonAdd as PersonAddIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  LocationOn as LocationOnIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import PostDetail from "./PostDetail";
import AuthorProfile from "./AuthorProfile";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import {
  fetchPostsApi,
  createPostApi,
  fetchPostBySlugApi,
  clearError,
} from "../../../store/slices/postSlice";

function CreatePostButton({ onClick }) {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        mb: 2,
        borderRadius: 8,
        px: 3,
        py: 1,
        textTransform: "none",
        fontWeight: "bold",
      }}
    >
      Tạo bài viết mới
    </Button>
  );
}

function CreatePostModal({ open, onClose, onSubmit, userName }) {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [visibilityAnchorEl, setVisibilityAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const quillFileInputRef = useRef(null);
  const quillRef = useRef(null);

  const handleVisibilityClick = (event) => {
    setVisibilityAnchorEl(event.currentTarget);
  };

  const handleVisibilityClose = () => {
    setVisibilityAnchorEl(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleQuillImageUpload = () => {
    quillFileInputRef.current.click();
  };

  const handleQuillFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", reader.result);
      quill.setSelection(range.index + 1);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!description.trim() || !title.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    const finalTitle = title.trim();
    const finalTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    onSubmit({
      title: finalTitle,
      description: description.trim(),
      tags: finalTags,
      imageUrl: imagePreview || "/placeholder.svg?height=300&width=500",
    });

    setDescription("");
    setTitle("");
    setTags("");
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  const isSubmitDisabled = !description.trim() || !title.trim();

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: handleQuillImageUpload,
      },
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          p: 2,
          fontWeight: "bold",
        }}
      >
        Tạo bài viết
        <IconButton
          aria-label="delete"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            bgcolor: (theme) => theme.palette.grey[400],
            "&:hover": {
              bgcolor: (theme) => theme.palette.grey[500],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar alt={userName} sx={{ mr: 1.5 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {userName}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PublicIcon fontSize="small" />}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleVisibilityClick}
                sx={{
                  textTransform: "none",
                  borderRadius: 4,
                  px: 1,
                  py: 0.5,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  borderColor: "divider",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                Bạn bè
              </Button>
              <Menu
                anchorEl={visibilityAnchorEl}
                open={Boolean(visibilityAnchorEl)}
                onClose={handleVisibilityClose}
              >
                <MenuItem onClick={handleVisibilityClose}>Công khai</MenuItem>
                <MenuItem onClick={handleVisibilityClose}>Bạn bè</MenuItem>
                <MenuItem onClick={handleVisibilityClose}>
                  Chỉ mình tôi
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <TextField
            fullWidth
            placeholder="Tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            placeholder="Thẻ (cách nhau bởi dấu phẩy)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            helperText="Ví dụ: cai thuốc lá, sức khỏe"
          />

          <ReactQuill
            ref={quillRef}
            value={description}
            onChange={setDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder={`${userName.split(" ")[0]} ơi, bạn đang nghĩ gì thế?`}
            style={{
              minHeight: 120,
              fontSize: "1.25rem",
              marginBottom: "16px",
            }}
          />

          <input
            type="file"
            ref={quillFileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleQuillFileChange}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />

          {imagePreview && (
            <Box sx={{ mt: 2, position: "relative" }}>
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Post preview"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  maxHeight: 300,
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
                onClick={removeImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 4,
              p: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Thêm vào bài viết của bạn
            </Typography>
            <Box>
              <IconButton color="success" onClick={triggerFileInput}>
                <ImageIcon />
              </IconButton>
              <IconButton color="primary">
                <PersonAddIcon />
              </IconButton>
              <IconButton color="warning">
                <EmojiEmotionsIcon />
              </IconButton>
              <IconButton color="error">
                <LocationOnIcon />
              </IconButton>
              <IconButton>
                <MoreHorizIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Đăng
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function FeaturedPosts({ posts, onPostClick }) {
  if (posts.length === 0) {
    return null;
  }

  const mainPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  return (
    <Box sx={{ mb: 4, display: "flex", flexDirection: "row", minWidth: 600 }}>
      <Box sx={{ width: "66.66%", height: 600, mr: 2 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            cursor: "pointer",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            },
            borderRadius: 2,
          }}
          onClick={() => onPostClick(mainPost)}
        >
          <CardMedia
            component="img"
            image={mainPost.imageUrl || "/placeholder.svg?height=300&width=500"}
            alt={mainPost.title}
            sx={{
              width: "100%",
              height: 450,
              objectFit: "cover",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px 8px 0 0",
            }}
          />
          <CardContent sx={{ flex: 1, p: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                mb: 1,
              }}
            >
              {mainPost.title || "Bài viết không có tiêu đề"}
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
                mb: 2,
              }}
            >
              {DOMPurify.sanitize(mainPost.description || "Không có nội dung", {
                ALLOWED_TAGS: [],
              }).slice(0, 150) +
                (mainPost.description.length > 150 ? "..." : "")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(
                new Date(mainPost.createdAt || new Date()),
                "dd MMM, yyyy",
                { locale: vi }
              )}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ width: "33.33%", height: 600 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
          }}
        >
          {secondaryPosts.map((post) => (
            <Card
              key={post.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 292,
                overflow: "hidden",
                cursor: "pointer",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                },
                borderRadius: 2,
              }}
              onClick={() => onPostClick(post)}
            >
              <CardMedia
                component="img"
                image={post.imageUrl || "/placeholder.svg?height=300&width=500"}
                alt={post.title}
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px 8px 0 0",
                }}
              />
              <CardContent sx={{ flex: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    mb: 1,
                  }}
                >
                  {post.title || "Bài viết không có tiêu đề"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(
                    new Date(post.createdAt || new Date()),
                    "dd MMM, yyyy",
                    { locale: vi }
                  )}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function LatestPosts({ posts, onPostClick }) {
  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Chưa có bài viết nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "space-between",
      }}
    >
      {posts.map((post) => (
        <Card
          key={post.id}
          sx={{
            width: "calc(25% - 18px)",
            display: "flex",
            flexDirection: "column",
            height: 350,
            overflow: "hidden",
            cursor: "pointer",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            },
            borderRadius: 2,
          }}
          onClick={() => onPostClick(post)}
        >
          <CardMedia
            component="img"
            image={post.imageUrl || "/placeholder.svg?height=300&width=500"}
            alt={post.title}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px 8px 0 0",
            }}
          />
          <CardContent sx={{ flex: 1, p: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              {post.title || "Bài viết không có tiêu đề"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(post.createdAt || new Date()), "dd MMM, yyyy", {
                locale: vi,
              })}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.posts);
  const { currentUser } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("posts");
  const [post, setPost] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    dispatch(fetchPostsApi());
  }, [dispatch]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const postSlug = url.searchParams.get("post");
    const author = url.searchParams.get("author");

    if (postSlug) {
      const foundPost = posts?.find((p) => p.slug === postSlug);
      if (foundPost) {
        setPost(foundPost);
        setCurrentView("postDetail");
      } else {
        dispatch(fetchPostBySlugApi(postSlug)).then((action) => {
          if (fetchPostBySlugApi.fulfilled.match(action)) {
            setPost(action.payload);
            setCurrentView("postDetail");
          } else {
            setCurrentView("posts");
            toast.error("Không tìm thấy bài viết");
          }
        });
      }
    } else if (author) {
      setSelectedAuthor(author);
      setCurrentView("author");
    } else {
      setCurrentView("posts");
      setPost(null);
    }
  }, [dispatch, posts]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("post");
    url.searchParams.delete("author");

    if (currentView === "postDetail" && post) {
      url.searchParams.set("post", post.slug);
    } else if (currentView === "author" && selectedAuthor) {
      url.searchParams.set("author", selectedAuthor);
    }

    window.history.pushState({}, "", url);
  }, [currentView, post, selectedAuthor]);

  const handleAddPost = (newPost) => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để tạo bài viết");
      return;
    }

    const postData = {
      title: newPost.title,
      description: newPost.description,
      tags: newPost.tags,
      imageUrl: newPost.imageUrl,
    };
    dispatch(createPostApi(postData));
    setIsModalOpen(false);
  };

  const handlePostClick = (post) => {
    setPost(post);
    setCurrentView("postDetail");
    window.scrollTo(0, 0);
  };

  const handleAuthorClick = (authorId) => {
    setSelectedAuthor(authorId);
    setCurrentView("author");
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    if (currentView === "postDetail") {
      setCurrentView("posts");
      setPost(null);
    } else if (currentView === "author") {
      if (post) {
        setCurrentView("postDetail");
      } else {
        setCurrentView("posts");
      }
    }
  };

  const filteredPosts = Array.isArray(posts) ? posts : [];

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Lỗi: {error.message || "Đã xảy ra lỗi"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">Đang tải...</Typography>
        </Box>
      )}

      {currentView !== "posts" && (
        <Box sx={{ mb: 3 }}>
          <IconButton onClick={handleBackClick} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      )}

      {currentView === "posts" && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            QuitSmoke Blog
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Chia sẻ kinh nghiệm, phương pháp và câu chuyện thành công trong hành
            trình bỏ hút thuốc
          </Typography>
          <CreatePostButton onClick={() => setIsModalOpen(true)} />
        </Box>
      )}

      {currentView === "posts" && filteredPosts?.length > 0 && (
        <>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
          >
            BÀI VIẾT MỚI NHẤT
          </Typography>
          <FeaturedPosts
            posts={filteredPosts.slice(0, 3)}
            onPostClick={handlePostClick}
          />
          <Divider sx={{ my: 6 }} />
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
          >
            BÀI VIẾT PHỔ BIẾN
          </Typography>
          <LatestPosts posts={filteredPosts} onPostClick={handlePostClick} />
        </>
      )}

      {currentView === "posts" && filteredPosts?.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có bài viết nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hãy tạo bài viết mới
          </Typography>
        </Box>
      )}

      {currentView === "postDetail" && post && (
        <PostDetail
          post={post}
          onAuthorClick={handleAuthorClick}
          onRelatedPostClick={handlePostClick}
          allPosts={filteredPosts}
        />
      )}

      {currentView === "author" && selectedAuthor && (
        <AuthorProfile
          authorId={selectedAuthor}
          onPostClick={handlePostClick}
          allPosts={filteredPosts}
        />
      )}

      <CreatePostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPost}
        userName={
          currentUser?.name ||
          currentUser?.email?.split("@")[0] ||
          "Người dùng ẩn danh"
        }
        userAvatar={
          currentUser?.avatar || "/placeholder.svg?height=40&width=40"
        }
      />
    </Container>
  );
}
