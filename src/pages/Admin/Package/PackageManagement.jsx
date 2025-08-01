import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Fade,
  Slide,
  Tooltip,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Inventory as PackageIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  createPackage,
  fetchPackages,
  updatePackage,
  deletePackage,
  resetPackageData,
} from "../../../store/slices/packageSlice";

const CreatePackageForm = ({ onSuccess, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.package
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    level: 1,
    features: [],
    limitations: {
      blogPostsPerDay: null,
      maxActiveQuitPlans: 5,
      customQuitPlanAccess: true,
    },
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const result = await dispatch(createPackage(formData));
    if (createPackage.fulfilled.match(result)) {
      setLocalSuccess("Tạo package thành công!");
      setFormData({
        name: "",
        description: "",
        price: 0,
        duration: 0,
        level: 1,
        features: [],
        limitations: {
          blogPostsPerDay: null,
          maxActiveQuitPlans: 5,
          customQuitPlanAccess: true,
        },
        isActive: true,
      });
      setNewFeature("");
      onSuccess();
      setTimeout(() => {
        setLocalSuccess("");
        onClose();
      }, 3000);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 4,
        p: 4,
        mb: 4,
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Tạo Package Mới
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "text.primary" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Fade in={isError}>
        <Box sx={{ mb: 2 }}>
          {isError && (
            <Alert
              severity="error"
              onClose={() => dispatch(resetPackageData())}
              sx={{
                borderRadius: 2,
                "& .MuiAlert-icon": { fontSize: "1.5rem" },
              }}
            >
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Fade>
      <Fade in={!!localSuccess}>
        <Box sx={{ mb: 2 }}>
          {localSuccess && (
            <Alert
              severity="success"
              onClose={() => setLocalSuccess("")}
              sx={{
                borderRadius: 2,
                "& .MuiAlert-icon": { fontSize: "1.5rem" },
              }}
            >
              {localSuccess}
            </Alert>
          )}
        </Box>
      </Fade>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Tên Package"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Level"
            type="number"
            value={formData.level}
            onChange={(e) =>
              handleInputChange("level", Number.parseInt(e.target.value))
            }
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Mô tả"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Giá"
            type="number"
            value={formData.price}
            onChange={(e) =>
              handleInputChange("price", Number.parseInt(e.target.value))
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Thời hạn (ngày)"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              handleInputChange("duration", Number.parseInt(e.target.value))
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                color="primary"
              />
            }
            label="Kích hoạt package"
          />
        </Grid>
        <Grid itemsize={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            color="primary.main"
            fontWeight="bold"
          >
            Tính năng
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Thêm tính năng"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFeature()}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              onClick={addFeature}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Thêm
            </Button>
          </Box>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, maxHeight: 200, overflow: "auto" }}
          >
            <List dense>
              {formData.features.map((feature, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={feature}
                    sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFeature(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {formData.features.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Chưa có tính năng nào"
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            color="primary.main"
            fontWeight="bold"
          >
            Giới hạn
          </Typography>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Bài blog mỗi ngày"
            type="number"
            value={formData.limitations.blogPostsPerDay || ""}
            onChange={(e) =>
              handleInputChange(
                "limitations.blogPostsPerDay",
                e.target.value ? Number.parseInt(e.target.value) : null
              )
            }
            helperText="Để trống nếu không giới hạn"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Số kế hoạch cai nghiện tối đa"
            type="number"
            value={formData.limitations.maxActiveQuitPlans}
            onChange={(e) =>
              handleInputChange(
                "limitations.maxActiveQuitPlans",
                Number.parseInt(e.target.value)
              )
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.limitations.customQuitPlanAccess}
                onChange={(e) =>
                  handleInputChange(
                    "limitations.customQuitPlanAccess",
                    e.target.checked
                  )
                }
                color="primary"
              />
            }
            label="Truy cập kế hoạch cai nghiện tùy chỉnh"
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading || !formData.name}
              sx={{
                borderRadius: 2,
                px: 4,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Tạo"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const PackageManagement = () => {
  const dispatch = useDispatch();
  const { packagesList, isLoading, isError, errorMessage } = useSelector(
    (state) => state.package
  );
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deletePackageId, setDeletePackageId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    level: 1,
    features: [],
    limitations: {
      blogPostsPerDay: null,
      maxActiveQuitPlans: 5,
      customQuitPlanAccess: true,
    },
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState("");

  // Fetch packages on mount
  useEffect(() => {
    dispatch(fetchPackages());
    return () => {
      dispatch(resetPackageData());
    };
  }, [dispatch]);

  // Handle success messages for edit and delete
  //   useEffect(() => {
  //     if (!isLoading && !isError && editingPackage && openDialog) {
  //       setSuccess("Cập nhật package thành công!");
  //       setEditingPackage(null);
  //       setOpenDialog(false);
  //     }
  //   }, [isLoading, isError, editingPackage, openDialog]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Open edit dialog
  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      level: pkg.level,
      features: [...pkg.features],
      limitations: { ...pkg.limitations },
      isActive: pkg.isActive,
    });
    setOpenDialog(true);
  };

  // Update package
  const handleSave = async () => {
    // dispatch(updatePackage({ id: editingPackage._id, packageData: formData }));
    const result = await dispatch(
      updatePackage({ id: editingPackage._id, packageData: formData })
    );

    if (updatePackage.fulfilled.match(result)) {
      setSuccess("Cập nhật package thành công!");
      setEditingPackage(null);
      setOpenDialog(false);
      dispatch(fetchPackages());
    }
  };

  // Delete package
  const handleDelete = async () => {
    dispatch(deletePackage(deletePackageId)).then((result) => {
      if (deletePackage.fulfilled.match(result)) {
        setSuccess("Xóa package thành công!");
        setOpenDeleteDialog(false);
      }
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get level color
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "#4caf50";
      case 2:
        return "#ff9800";
      case 3:
        return "#9c27b0";
      default:
        return "#2196f3";
    }
  };

  // Get level name
  const getLevelName = (level) => {
    switch (level) {
      case 1:
        return "Cơ bản";
      case 2:
        return "Chuyên nghiệp";
      case 3:
        return "Cao cấp";
      default:
        return `Level ${level}`;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            p: 4,
            mb: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <PackageIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  Quản lý Packages
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Tạo và quản lý các gói dịch vụ của hệ thống
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateForm(true)}
              disabled={isLoading}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                },
              }}
            >
              Tạo Package Mới
            </Button>
          </Box>
        </Paper>

        {/* Create Package Form */}
        {showCreateForm && (
          <CreatePackageForm
            onSuccess={() => dispatch(fetchPackages())}
            onClose={() => setShowCreateForm(false)}
          />
        )}

        {/* Alerts for edit/delete */}
        <Fade in={isError && !showCreateForm && !openDialog}>
          <Box sx={{ mb: 2 }}>
            {isError && (
              <Alert
                severity="error"
                onClose={() => dispatch(resetPackageData())}
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: "1.5rem" },
                }}
              >
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Fade>
        <Fade in={!!success}>
          <Box sx={{ mb: 2 }}>
            {success && (
              <Alert
                severity="success"
                onClose={() => setSuccess("")}
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: "1.5rem" },
                }}
              >
                {success}
              </Alert>
            )}
          </Box>
        </Fade>

        {/* Packages Grid */}
        <Grid container spacing={3}>
          {isLoading && packagesList.length === 0 ? (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 8,
                  textAlign: "center",
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Đang tải dữ liệu...
                </Typography>
              </Paper>
            </Grid>
          ) : (
            packagesList.map((pkg, index) => (
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }} key={pkg._id}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Package Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: getLevelColor(pkg.level),
                              width: 48,
                              height: 48,
                            }}
                          >
                            <StarIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              {pkg.name}
                            </Typography>
                            <Chip
                              label={getLevelName(pkg.level)}
                              size="small"
                              sx={{
                                bgcolor: getLevelColor(pkg.level),
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          </Box>
                        </Box>
                        <Chip
                          icon={pkg.isActive ? <CheckIcon /> : <CancelIcon />}
                          label={pkg.isActive ? "Hoạt động" : "Tạm dừng"}
                          color={pkg.isActive ? "success" : "default"}
                          variant={pkg.isActive ? "filled" : "outlined"}
                        />
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          minHeight: 40,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {pkg.description}
                      </Typography>

                      {/* Price and Duration */}
                      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "rgba(33, 150, 243, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <MoneyIcon color="primary" />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Giá
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              {formatPrice(pkg.price)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ScheduleIcon color="success" />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Thời hạn
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="success.main"
                            >
                              {/* {pkg.duration} ngày */}
                              {pkg.duration === 0
                                ? "Vĩnh viễn"
                                : `${pkg.duration} ngày`}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Features */}
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        Tính năng:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 2,
                        }}
                      >
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              fontSize: "0.75rem",
                            }}
                          />
                        ))}
                        {pkg.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              fontSize: "0.75rem",
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(pkg)}
                        disabled={isLoading}
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          borderColor: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setDeletePackageId(pkg._id);
                          setOpenDeleteDialog(true);
                        }}
                        disabled={isLoading}
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "white",
                          },
                        }}
                      >
                        Xóa
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>

        {/* Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          TransitionComponent={Slide}
          TransitionProps={{ direction: "up" }}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Chỉnh sửa Package
            </Typography>
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Tên Package"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Level"
                  type="number"
                  value={formData.level}
                  onChange={(e) =>
                    handleInputChange("level", Number.parseInt(e.target.value))
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Giá"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", Number.parseInt(e.target.value))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">VND</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Thời hạn (ngày)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange(
                      "duration",
                      Number.parseInt(e.target.value)
                    )
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Kích hoạt package"
                />
              </Grid>

              <Grid item size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary.main"
                  fontWeight="bold"
                >
                  Tính năng
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Thêm tính năng"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={addFeature}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Thêm
                  </Button>
                </Box>
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  <List dense>
                    {formData.features.map((feature, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={feature}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontWeight: 500,
                            },
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => removeFeature(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {formData.features.length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary="Chưa có tính năng nào"
                          sx={{ textAlign: "center", color: "text.secondary" }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>

              <Grid item size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary.main"
                  fontWeight="bold"
                >
                  Giới hạn
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bài blog mỗi ngày"
                  type="number"
                  value={formData.limitations.blogPostsPerDay || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "limitations.blogPostsPerDay",
                      e.target.value ? Number.parseInt(e.target.value) : null
                    )
                  }
                  helperText="Để trống nếu không giới hạn"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Số kế hoạch cai nghiện tối đa"
                  type="number"
                  value={formData.limitations.maxActiveQuitPlans}
                  onChange={(e) =>
                    handleInputChange(
                      "limitations.maxActiveQuitPlans",
                      Number.parseInt(e.target.value)
                    )
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid itemsize={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.limitations.customQuitPlanAccess}
                      onChange={(e) =>
                        handleInputChange(
                          "limitations.customQuitPlanAccess",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Truy cập kế hoạch cai nghiện tùy chỉnh"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading || !formData.name}
              sx={{
                borderRadius: 2,
                px: 4,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.98)",
            },
          }}
        >
          <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DeleteIcon />
              Xác nhận xóa
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Bạn có chắc chắn muốn xóa package này? Hành động này không thể
              hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PackageManagement;
