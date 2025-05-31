import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  FormHelperText,
  Autocomplete,
  Stack,
  alpha,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateIcon from "@mui/icons-material/Create";
import ImageIcon from "@mui/icons-material/Image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArticleIcon from "@mui/icons-material/Article";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createBlogApi } from "../../../store/slices/blogSlice";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.blogs);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const suggestedTags = [
    "cai thuốc lá",
    "sức khỏe",
    "tâm lý",
    "phương pháp",
    "kinh nghiệm",
    "lợi ích",
    "hỗ trợ",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (title.length > 100)
      newErrors.title = "Tiêu đề không được quá 100 ký tự";
    if (!content.trim()) newErrors.content = "Nội dung không được để trống";
    if (content.length < 50)
      newErrors.content = "Nội dung quá ngắn (tối thiểu 50 ký tự)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const blogData = {
        title,
        description: content,
        tags: selectedTags,
        imageUrl: imageUrl || "",
      };

      dispatch(createBlogApi(blogData))
        .unwrap()
        .then(() => {
          navigate("/blog");
        })
        .catch((error) => {
          console.error("Lỗi khi tạo bài viết:", error);
        });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha("#E8F5E8", 0.3)} 0%, ${alpha("#F1F8E9", 0.3)} 100%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
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

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha("#4CAF50", 0.2)}`,
            background: "white",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha("#4CAF50", 0.1)} 0%, ${alpha("#81C784", 0.1)} 100%)`,
              borderBottom: `1px solid ${alpha("#4CAF50", 0.2)}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <CreateIcon sx={{ fontSize: 32, color: "#4CAF50" }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#2E7D32",
                    mb: 1,
                  }}
                >
                  Tạo bài viết mới
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Chia sẻ kinh nghiệm và kiến thức về cai thuốc lá
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid
                container
                spacing={4}
                sx={{
                  display: "flex",
                  flexDirection: "column", // Đảm bảo các thành phần xếp dọc
                  alignItems: "stretch", // Đảm bảo các phần tử trải rộng toàn bộ chiều ngang
                }}
              >
                {/* Title Section - Thứ tự 1 */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha("#F1F8E9", 0.5),
                      border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <ArticleIcon sx={{ color: "#4CAF50" }} />
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: "#2E7D32" }}
                      >
                        Tiêu đề bài viết
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={!!errors.title}
                      helperText={errors.title}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "white",
                          "&:hover fieldset": {
                            borderColor: "#4CAF50",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4CAF50",
                          },
                        },
                      }}
                    />
                  </Paper>
                </Grid>

                {/* Image Section - Thứ tự 2 */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha("#F1F8E9", 0.5),
                      border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <ImageIcon sx={{ color: "#4CAF50" }} />
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: "#2E7D32" }}
                      >
                        Hình ảnh bìa
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        border: `2px dashed ${alpha("#4CAF50", 0.5)}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                        height: previewImage ? "auto" : 200,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: alpha("#4CAF50", 0.05),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#4CAF50",
                          bgcolor: alpha("#4CAF50", 0.1),
                        },
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      {previewImage ? (
                        <Box
                          component="img"
                          src={previewImage}
                          alt="Blog preview"
                          sx={{
                            width: "100%",
                            maxWidth: 600,
                            height: 300,
                            objectFit: "cover",
                            borderRadius: 2,
                            boxShadow: `0 4px 12px ${alpha("#4CAF50", 0.2)}`,
                          }}
                        />
                      ) : (
                        <>
                          <AddPhotoAlternateIcon
                            sx={{ fontSize: 60, color: "#4CAF50", mb: 2 }}
                          />
                          <Typography
                            variant="h6"
                            sx={{ color: "#2E7D32", mb: 1 }}
                          >
                            Nhấp để tải lên hình ảnh bìa
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Hỗ trợ JPG, PNG, GIF (tối đa 5MB) - Kích thước đề
                            xuất: 600x300px
                          </Typography>
                        </>
                      )}
                    </Box>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    {previewImage && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage("");
                          setImageUrl("");
                        }}
                        sx={{ mt: 2 }}
                      >
                        Xóa ảnh
                      </Button>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "rgba(241, 248, 233, 0.5)", // Thay alpha
                      border: "1px solid rgba(76, 175, 80, 0.2)", // Thay alpha
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <LocalOfferIcon sx={{ color: "#4CAF50" }} />
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: "#2E7D32" }}
                      >
                        Thẻ (tối đa 5 thẻ)
                      </Typography>
                    </Stack>
                    <Autocomplete
                      multiple
                      id="tags-autocomplete"
                      options={suggestedTags.filter(
                        (tag) => !selectedTags.includes(tag)
                      )}
                      freeSolo
                      value={selectedTags}
                      onChange={(event, newValue) => {
                        setSelectedTags(newValue);
                      }}
                      inputValue={tagInput}
                      onInputChange={(event, newInputValue) => {
                        setTagInput(newInputValue);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            sx={{
                              bgcolor: "#4CAF50",
                              color: "white",
                              "& .MuiChip-deleteIcon": {
                                color: "white",
                                "&:hover": {
                                  color: "rgba(255, 255, 255, 0.8)", // Thay alpha
                                },
                              },
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder={
                            selectedTags.length >= 5
                              ? "Đã đạt số lượng thẻ tối đa"
                              : "Thêm thẻ..."
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "white",
                              "&:hover fieldset": {
                                borderColor: "#4CAF50",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#4CAF50",
                              },
                            },
                          }}
                        />
                      )}
                      disabled={selectedTags.length >= 5}
                    />
                    <FormHelperText sx={{ mt: 1 }}>
                      Thêm các từ khóa liên quan đến bài viết của bạn
                    </FormHelperText>

                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#2E7D32", fontWeight: 500 }}
                      >
                        Gợi ý thẻ phổ biến:
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {suggestedTags
                          .filter((tag) => !selectedTags.includes(tag))
                          .slice(0, 5)
                          .map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              onClick={() => handleAddTag(tag)}
                              sx={{
                                cursor: "pointer",
                                bgcolor: "rgba(76, 175, 80, 0.1)", // Thay alpha
                                color: "#2E7D32",
                                border: "1px solid rgba(76, 175, 80, 0.3)", // Thay alpha
                                "&:hover": {
                                  bgcolor: "rgba(76, 175, 80, 0.2)", // Thay alpha
                                },
                              }}
                            />
                          ))}
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
                {/* Content Section - Thứ tự 4 */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha("#F1F8E9", 0.5),
                      border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <CreateIcon sx={{ color: "#4CAF50" }} />
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: "#2E7D32" }}
                      >
                        Nội dung bài viết
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        bgcolor: "white",
                        borderRadius: 2,
                        border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                        overflow: "hidden",
                      }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        placeholder="Viết nội dung bài viết của bạn ở đây..."
                        style={{ height: 400, marginBottom: 60 }}
                      />
                    </Box>
                    {errors.content && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {errors.content}
                      </FormHelperText>
                    )}
                  </Paper>
                </Grid>

                {/* Submit Buttons - Thứ tự 5 */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha("#4CAF50", 0.05),
                      border: `1px solid ${alpha("#4CAF50", 0.2)}`,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{ justifyContent: "center" }} // Căn giữa các nút
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                          bgcolor: "#4CAF50",
                          "&:hover": { bgcolor: "#45a049" },
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          boxShadow: `0 4px 12px ${alpha("#4CAF50", 0.3)}`,
                          minWidth: 180,
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "Đăng bài viết"
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/blog")}
                        disabled={isLoading}
                        sx={{
                          borderColor: "#4CAF50",
                          color: "#4CAF50",
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          minWidth: 180,
                          "&:hover": {
                            borderColor: "#45a049",
                            bgcolor: alpha("#4CAF50", 0.1),
                          },
                        }}
                      >
                        Hủy
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateBlog;
