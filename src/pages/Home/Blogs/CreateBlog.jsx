import React, { useState, useRef, useEffect } from "react";
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
    Divider,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createBlogApi } from "../../../store/slices/blogSlice";

const CreateBlog = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.blogs);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [errors, setErrors] = useState({});

    // Xử lý tải ảnh
    const fileInputRef = useRef(null);

    // Cấu hình đơn giản hóa cho React Quill
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    // Các thẻ gợi ý
    const suggestedTags = [
        "cai thuốc lá",
        "sức khỏe",
        "tâm lý",
        "phương pháp",
        "kinh nghiệm",
        "lợi ích",
        "hỗ trợ",
    ];

    // Xử lý ảnh khi chọn file
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Giả lập tải ảnh lên (trong ứng dụng thực tế sẽ tải lên server)
            const reader = new FileReader();
            reader.onloadend = () => {
                // Trong thực tế, sẽ gửi file lên server và nhận về URL
                // Tạm thời sử dụng base64 cho demo
                setImageUrl(reader.result);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý thêm thẻ tag
    const handleAddTag = (tag) => {
        if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
            setSelectedTags([...selectedTags, tag]);
            setTagInput("");
        }
    };

    // Kiểm tra lỗi
    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Tiêu đề không được để trống";
        if (title.length > 100) newErrors.title = "Tiêu đề không được quá 100 ký tự";
        if (!content.trim()) newErrors.content = "Nội dung không được để trống";
        if (content.length < 50) newErrors.content = "Nội dung quá ngắn (tối thiểu 50 ký tự)";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isUserLoggedIn) {
            navigate("/auth/login", { state: { returnUrl: "/blog/create" } });
            return;
        }

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

    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    useEffect(() => {
        if (!isUserLoggedIn) {
            navigate("/auth/login", { state: { returnUrl: "/blog/create" } });
        }
    }, [isUserLoggedIn, navigate]);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/blog")}
                    variant="text"
                >
                    Quay lại danh sách bài viết
                </Button>
            </Box>

            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Tạo bài viết mới
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* Tiêu đề */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Tiêu đề bài viết
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập tiêu đề bài viết..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Grid>

                        {/* Hình ảnh */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Hình ảnh bìa
                            </Typography>
                            <Box
                                sx={{
                                    border: "1px dashed grey",
                                    borderRadius: 2,
                                    p: 2,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    mb: 2,
                                    height: previewImage ? "auto" : 200,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    bgcolor: "background.paper",
                                }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                {previewImage ? (
                                    <Box
                                        component="img"
                                        src={previewImage}
                                        alt="Blog preview"
                                        sx={{
                                            maxHeight: 300,
                                            maxWidth: "100%",
                                            borderRadius: 1,
                                        }}
                                    />
                                ) : (
                                    <>
                                        <AddPhotoAlternateIcon
                                            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                                        />
                                        <Typography variant="body1" color="text.secondary">
                                            Nhấp để tải lên hình ảnh bìa
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
                                >
                                    Xóa ảnh
                                </Button>
                            )}
                        </Grid>

                        {/* Thẻ Tags */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Thẻ (tối đa 5 thẻ)
                            </Typography>
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
                                    />
                                )}
                                disabled={selectedTags.length >= 5}
                            />
                            <FormHelperText>
                                Thêm các từ khóa liên quan đến bài viết của bạn
                            </FormHelperText>

                            {/* Thẻ gợi ý */}
                            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    Gợi ý:
                                </Typography>
                                {suggestedTags
                                    .filter((tag) => !selectedTags.includes(tag))
                                    .slice(0, 5)
                                    .map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            onClick={() => handleAddTag(tag)}
                                            sx={{ cursor: "pointer" }}
                                        />
                                    ))}
                            </Box>
                        </Grid>

                        {/* Nội dung */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Nội dung bài viết
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    placeholder="Viết nội dung bài viết của bạn ở đây..."
                                    style={{ height: 400, marginBottom: 60 }}
                                />
                                {errors.content && (
                                    <FormHelperText error sx={{ mt: 8 }}>{errors.content}</FormHelperText>
                                )}
                            </Box>
                        </Grid>

                        {/* Nút Submit */}
                        <Grid item xs={12} sx={{ mt: 8 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isLoading}
                                sx={{ minWidth: 150 }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Đăng bài viết"
                                )}
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={() => navigate("/blog")}
                                sx={{ ml: 2, minWidth: 150 }}
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateBlog; 