import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Chip,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Paper,
    Stack,
    Container,
    Badge,
    Button,
  } from "@mui/material"
  import {
    CheckCircle,
    Schedule,
    Person,
    SmokingRooms,
    Notes,
    CalendarToday,
    TrendingUp,
    Assessment,
    LocalHospital,
    EmojiEvents,
    Timeline,
    Favorite,
    ArrowBack,
  } from "@mui/icons-material"
  import { useEffect } from "react"
  import { useParams, useNavigate } from "react-router-dom"
  import { useDispatch, useSelector } from "react-redux"
  import { fetchProgressRecord } from "../../../store/slices/progressSlice"
  import Loading from "../../../components/Loading/Loading"
  
  const StageDetail = () => {
    const { stageId } = useParams()
    const dispatch = useDispatch()
    const { progress, isLoading, isError } = useSelector((state) => state.progress)
    const { stages } = useSelector((state) => state.plan)
    const navigate = useNavigate()
  
    // Tìm stage hiện tại dựa trên stageId
    const currentStage = stages?.find(stage => stage._id === stageId)
  
    useEffect(() => {
      if (stageId) {
        dispatch(fetchProgressRecord(stageId))
      }
    }, [stageId, dispatch])
  
    // Tính toán statistics từ dữ liệu thực tế
    const calculateStatistics = () => {
      if (!currentStage || !progress) {
        return {
          totalDays: 0,
          checkInCount: 0,
          completionPercentage: 0,
          remainingCheckIns: 0,
          canComplete: false,
          checkInsNeeded: 0,
        }
      }
  
      // Xử lý progress với cấu trúc từ API
      let progressArray = []
      if (Array.isArray(progress)) {
        progressArray = progress
      } else if (progress && typeof progress === 'object') {
        // API trả về { message, data: { progresses, stage, statistics } }
        if (progress.data && Array.isArray(progress.data.progresses)) {
          progressArray = progress.data.progresses
        } else if (Array.isArray(progress.data)) {
          progressArray = progress.data
        } else if (Array.isArray(progress.progresses)) {
          progressArray = progress.progresses
        } else if (Array.isArray(progress.records)) {
          progressArray = progress.records
        }
      }
  
      const checkInCount = progressArray.length || 0
      const totalDays = currentStage.duration || 1
      const completionPercentage = currentStage.completed ? 100 : Math.round((checkInCount / totalDays) * 100)
      const remainingCheckIns = Math.max(0, totalDays - checkInCount)
      const canComplete = checkInCount >= totalDays
      const checkInsNeeded = Math.max(0, totalDays - checkInCount)
  
      return {
        totalDays,
        checkInCount,
        completionPercentage,
        remainingCheckIns,
        canComplete,
        checkInsNeeded,
      }
    }
  
    const statistics = calculateStatistics()
    
    // Đảm bảo progressArray luôn là array để render
    const getProgressArray = () => {
      if (Array.isArray(progress)) {
        return progress
      } else if (progress && typeof progress === 'object') {
        // API trả về { message, data: { progresses, stage, statistics } }
        if (progress.data && Array.isArray(progress.data.progresses)) {
          return progress.data.progresses
        } else if (Array.isArray(progress.data)) {
          return progress.data
        } else if (Array.isArray(progress.progresses)) {
          return progress.progresses
        } else if (Array.isArray(progress.records)) {
          return progress.records
        }
      }
      return []
    }
    
    const progressArray = getProgressArray()
  
    if (isLoading) {
      return <Loading />
    }
  
    if (isError || !currentStage) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6" color="error">
            Không tìm thấy thông tin giai đoạn
          </Typography>
        </Box>
      )
    }
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  
    const getHealthStatusColor = (status) => {
      if (!status || typeof status !== 'string') {
        return "default"
      }
      
      switch (status.toLowerCase()) {
        case "tốt":
          return "success"
        case "khá":
          return "info"
        case "trung bình":
          return "warning"
        case "kém":
          return "error"
        default:
          return "default"
      }
    }
  
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#ffffff",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/roadmap")}
              sx={{ mb: 2 }}
            >
              Quay lại lộ trình
            </Button>
          </Box>
  
          {/* Hero Header */}
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              background: "linear-gradient(to right, #50b975 0%,rgb(155, 202, 141) 100%)",
              color: "white",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              overflow: "visible",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: 30,
                background: currentStage.completed
                  ? "linear-gradient(135deg, #4CAF50, #45a049)"
                  : "linear-gradient(135deg, #FF9800, #F57C00)",
                borderRadius: "50%",
                p: 2,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              {currentStage.completed ? (
                <EmojiEvents sx={{ fontSize: 40, color: "white" }} />
              ) : (
                <Timeline sx={{ fontSize: 40, color: "white" }} />
              )}
            </Box>
  
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      mb: 2,
                      color: "white",
                    }}
                  >
                    {currentStage.stage_name}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 400,
                      mb: 3,
                    }}
                  >
                    {currentStage.description}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      icon={currentStage.completed ? <CheckCircle /> : <Schedule />}
                      label={currentStage.completed ? "Hoàn thành xuất sắc!" : "Đang thực hiện"}
                      color={currentStage.completed ? "success" : "warning"}
                      sx={{
                        px: 2,
                        py: 1,
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                    <Chip
                      icon={<CalendarToday />}
                      label={`${currentStage.duration} ngày`}
                      variant="outlined"
                      sx={{ px: 2, py: 1, fontSize: "1rem" }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
  
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item size={{xs: 12, md: 6}}>
              {/* Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs: 6, md: 3}}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 2,
                          width: 60,
                          height: 60,
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {statistics.totalDays}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Tổng số ngày
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
  
                <Grid item size={{xs: 6, md: 3}}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      boxShadow: "0 10px 30px rgba(240, 147, 251, 0.3)",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 2,
                          width: 60,
                          height: 60,
                        }}
                      >
                        <Assessment sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {statistics.checkInCount}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Lần check-in
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
  
                <Grid item size={{xs: 6, md: 3}}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      color: "white",
                      boxShadow: "0 10px 30px rgba(79, 172, 254, 0.3)",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 2,
                          width: 60,
                          height: 60,
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {statistics.completionPercentage}%
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Hoàn thành
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
  
                <Grid item size={{xs: 6, md: 3}}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                      color: "white",
                      boxShadow: "0 10px 30px rgba(250, 112, 154, 0.3)",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 2,
                          width: 60,
                          height: 60,
                        }}
                      >
                        <Schedule sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {currentStage.duration}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Ngày dự kiến
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
  
              {/* Progress Section */}
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        mr: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      <Timeline />
                    </Avatar>
                    <Typography variant="h5" fontWeight="600">
                      Tiến độ giai đoạn
                    </Typography>
                  </Box>
  
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" fontWeight="500">
                        Mức độ hoàn thành
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {statistics.completionPercentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={statistics.completionPercentage}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: "rgba(0,0,0,0.1)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: "linear-gradient(90deg, #4CAF50, #45a049)",
                        },
                      }}
                    />
                  </Box>
  
                  <Box display="flex" justifyContent="center">
                    <Chip
                      icon={currentStage.completed ? <EmojiEvents /> : <Timeline />}
                      label={
                        currentStage.completed
                          ? "🎉 Chúc mừng! Bạn đã hoàn thành giai đoạn này!"
                          : "Đang trong quá trình thực hiện"
                      }
                      color={currentStage.completed ? "success" : "primary"}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
  
              {/* Progress Entries */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        mr: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      <Notes />
                    </Avatar>
                    <Typography variant="h5" fontWeight="600">
                      Nhật ký tiến độ
                    </Typography>
                  </Box>
  
                  <List sx={{ p: 0 }}>
                    {progressArray.length > 0 ? (
                      progressArray.map((progressItem) => {
                        // Kiểm tra progressItem có hợp lệ không
                        if (!progressItem || typeof progressItem !== 'object') {
                          return null
                        }
                        
                        return (
                          <Card
                            key={progressItem._id || Math.random()}
                            sx={{
                              mb: 2,
                              borderRadius: 2,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                              border: "1px solid rgba(0,0,0,0.05)",
                            }}
                          >
                            <ListItem sx={{ p: 3 }}>
                              <ListItemAvatar>
                                <Badge
                                  badgeContent={<Favorite sx={{ fontSize: 12 }} />}
                                  color="error"
                                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: "linear-gradient(135deg, #667eea, #764ba2)",
                                      width: 60,
                                      height: 60,
                                    }}
                                  >
                                    <Person sx={{ fontSize: 30 }} />
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                sx={{ ml: 2 }}
                                primary={
                                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                                    <Typography variant="h6" fontWeight="600">
                                      {progressItem.userId?.userName || progressItem.userName || "Người dùng"}
                                    </Typography>
                                    {progressItem.healthStatus && (
                                      <Chip
                                        icon={<LocalHospital />}
                                        label={`Sức khỏe: ${progressItem.healthStatus}`}
                                        size="small"
                                        color={getHealthStatusColor(progressItem.healthStatus)}
                                        sx={{ fontWeight: 500 }}
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Box display="flex" alignItems="center" gap={3}>
                                      <Paper
                                        sx={{
                                          p: 1.5,
                                          borderRadius: 2,
                                          bgcolor: "error.light",
                                          color: "error.contrastText",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <SmokingRooms />
                                        <Typography variant="body2" fontWeight="600">
                                          {progressItem.cigarettesSmoked || 0} điếu thuốc
                                        </Typography>
                                      </Paper>

                                      <Paper
                                        sx={{
                                          p: 1.5,
                                          borderRadius: 2,
                                          bgcolor: "info.light",
                                          color: "info.contrastText",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <CalendarToday />
                                        <Typography variant="body2" fontWeight="500">
                                          {progressItem.date ? formatDate(progressItem.date) : "N/A"}
                                        </Typography>
                                      </Paper>
                                    </Box>

                                    {progressItem.notes && (
                                      <Paper
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          bgcolor: "grey.100",
                                          border: "1px solid rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Notes color="action" />
                                          <Typography variant="body2" fontWeight="500" color="text.secondary">
                                            Ghi chú:
                                          </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                          {progressItem.notes}
                                        </Typography>
                                      </Paper>
                                    )}
                                  </Stack>
                                }
                              />
                            </ListItem>
                          </Card>
                        )
                      }).filter(Boolean) // Lọc bỏ các item null
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Chưa có dữ liệu cập nhật
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hãy cập nhật tình trạng của bạn để xem nhật ký tiến độ
                        </Typography>
                      </Box>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
  
            {/* Sidebar */}
            <Grid item size={{xs: 12, md: 6}}>
              {/* Stage Info */}
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: "warning.main",
                        mr: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      <Assessment />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">
                      Thông tin giai đoạn
                    </Typography>
                  </Box>
  
                  <Stack spacing={3}>
                    <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tên giai đoạn
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {currentStage.stage_name}
                      </Typography>
                    </Paper>
  
                    <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Mô tả
                      </Typography>
                      <Typography variant="body1">{currentStage.description}</Typography>
                    </Paper>
  
                    <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Thời gian dự kiến
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {currentStage.duration} ngày
                      </Typography>
                    </Paper>
  
                    <Box textAlign="center">
                      <Chip
                        icon={currentStage.completed ? <CheckCircle /> : <Schedule />}
                        label={currentStage.completed ? "✅ Hoàn thành" : "⏳ Đang thực hiện"}
                        color={currentStage.completed ? "success" : "warning"}
                        sx={{
                          px: 3,
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
  
              {/* Quick Stats */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: "success.main",
                        mr: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">
                      Thống kê nhanh
                    </Typography>
                  </Box>
  
                  <Stack spacing={3}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="body1" fontWeight="500">
                        Check-in còn lại
                      </Typography>
                      <Chip
                        label={statistics.remainingCheckIns}
                        color="primary"
                        sx={{ fontWeight: 600, fontSize: "1rem" }}
                      />
                    </Paper>
  
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="body1" fontWeight="500">
                        Check-in cần thiết
                      </Typography>
                      <Chip
                        label={statistics.checkInsNeeded}
                        color="secondary"
                        sx={{ fontWeight: 600, fontSize: "1rem" }}
                      />
                    </Paper>
  
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="body1" fontWeight="500">
                        Có thể hoàn thành
                      </Typography>
                      <Chip
                        icon={statistics.canComplete ? <CheckCircle /> : <Schedule />}
                        label={statistics.canComplete ? "Có" : "Không"}
                        color={statistics.canComplete ? "success" : "error"}
                        sx={{ fontWeight: 600, fontSize: "1rem" }}
                      />
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }
  
  export default StageDetail