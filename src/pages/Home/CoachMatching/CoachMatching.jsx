import {
  Box,
  Tab,
  Tabs,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from "react";
import "./CoachMatching.css";

// Sample coach data with additional fields to match the image
const coaches = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    specialty: "Hỗ trợ Cai Thuốc Lá",
    rating: 4.9,
    experience: 10,
    successRate: 95,
    averageHours: 124,
    language: "Tiếng Việt",
    image:
      "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482752rhD/anh-mo-ta.png",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    specialty: "Tư vấn Tâm lý",
    rating: 4.7,
    experience: 8,
    successRate: 90,
    averageHours: 108,
    language: "Tiếng Việt",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Lê Minh Châu",
    specialty: "Sức khỏe Toàn diện",
    rating: 4.8,
    experience: 12,
    successRate: 88,
    averageHours: 155,
    language: "Tiếng Việt",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Phạm Quốc Đạt",
    specialty: "Tập luyện Thể chất",
    rating: 4.6,
    experience: 5,
    successRate: 85,
    averageHours: 76,
    language: "Tiếng Việt",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Hoàng Thị Mai",
    specialty: "Dinh dưỡng Cai nghiện",
    rating: 4.7,
    experience: 7,
    successRate: 80,
    averageHours: 112,
    language: "Tiếng Việt",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Vũ Đức Thắng",
    specialty: "Thiền và Thư giãn",
    rating: 4.9,
    experience: 15,
    successRate: 78,
    averageHours: 187,
    language: "Tiếng Việt",
    image: "https://via.placeholder.com/150",
  },
];

export default function CoachMatching() {
  const [value, setValue] = useState(0);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectCoach = (coach) => {
    setSelectedCoach(coach);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCoach(null);
  };

  const handleViewOtherCoach = () => {
    setOpenModal(false);
    setSelectedCoach(null);
  };

  const handleChooseCoach = () => {
    console.log("Chọn huấn luyện viên:", selectedCoach.name);
    setOpenModal(false);
  };

  // Get top 3 coaches based on rating
  const topCoaches = [...coaches]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <Box className="homePage">
      <Box className="coaching__title">
        <Typography variant="h4" component="h1" fontWeight={700} color="#000">
          Huấn Luyện Viên Cai Thuốc Lá
        </Typography>
        <span className="coaching__title--sub">
          Chọn huấn luyện viên phù hợp để đồng hành cùng bạn trong hành trình
          cai thuốc lá
        </span>
      </Box>
      <Box className="coaching__content">
        <Box className="coaching__tabs" sx={{ width: "100%" }}>
          <Tabs
            onChange={handleChange}
            value={value}
            aria-label="Tabs where selection follows focus"
            selectionFollowsFocus
          >
            <Tab label="Đề xuất cho bạn" />
            <Tab label="Tất cả huấn luyện viên" />
          </Tabs>
        </Box>
        {/* Tab Content */}
        <Box sx={{ marginTop: 5 }}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            color="#000"
            sx={{ mb: 5 }}
          >
            {value === 0
              ? "Top huấn luyện viên phù hợp"
              : "Tất cả huấn luyện viên"}
          </Typography>

          {value === 0 && (
            <Grid container spacing={3}>
              {topCoaches.map((coach) => (
                <Grid item size={4} sm={6} md={4} key={coach.id}>
                  <Card className="coaching__card">
                    <Box className="coaching__card-header">
                      <CardMedia
                        component="img"
                        className="coaching__avatar"
                        image={coach.image}
                        alt={coach.name}
                      />
                      <Box className="coaching__recommended-badge">Đề xuất</Box>
                    </Box>
                    <CardContent className="coaching__card-content">
                      <Typography variant="h6" className="coaching__name">
                        {coach.name.toUpperCase()}
                      </Typography>
                      <Box className="coaching__rating">
                        <span className="coaching__star">★</span>
                        <Typography variant="body2" component="span">
                          {coach.rating} ({coach.averageHours} đánh giá)
                        </Typography>
                      </Box>
                      <Box className="coaching__info">
                        <Typography variant="body2">
                          <strong>Mức độ phù hợp:</strong>{" "}
                          <span className="coaching__highlight">
                            {coach.successRate}%
                          </span>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Kinh nghiệm:</strong> {coach.experience} năm
                        </Typography>
                        <Typography variant="body2">
                          <strong>Tỷ lệ thành công:</strong> {coach.successRate}
                          %
                        </Typography>
                        <Typography variant="body2">
                          <strong>Ngôn ngữ:</strong> {coach.language}
                        </Typography>
                      </Box>
                      <Button
                        className="coaching__button"
                        onClick={() => handleSelectCoach(coach)}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {value === 1 && (
            <Grid container spacing={3}>
              {coaches.map((coach) => (
                <Grid item size={4} sm={6} md={4} key={coach.id}>
                  <Card className="coaching__card">
                    <Box className="coaching__card-header">
                      <CardMedia
                        component="img"
                        className="coaching__avatar"
                        image={coach.image}
                        alt={coach.name}
                      />
                    </Box>
                    <CardContent className="coaching__card-content">
                      <Typography variant="h6" className="coaching__name">
                        {coach.name.toUpperCase()}
                      </Typography>
                      <Box className="coaching__rating">
                        <span className="coaching__star">★</span>
                        <Typography variant="body2" component="span">
                          {coach.rating} ({coach.averageHours} đánh giá)
                        </Typography>
                      </Box>
                      <Box className="coaching__info">
                        <Typography variant="body2">
                          <strong>Mức độ phù hợp:</strong>{" "}
                          <span className="coaching__highlight">
                            {coach.successRate}%
                          </span>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Kinh nghiệm:</strong> {coach.experience} năm
                        </Typography>
                        <Typography variant="body2">
                          <strong>Tỷ lệ thành công:</strong> {coach.successRate}
                          %
                        </Typography>
                        <Typography variant="body2">
                          <strong>Ngôn ngữ:</strong> {coach.language}
                        </Typography>
                      </Box>
                      <Button
                        className="coaching__button"
                        onClick={() => handleSelectCoach(coach)}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Modal for Coach Details */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">{selectedCoach?.name}</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              <strong>Tỷ lệ thành công:</strong>{" "}
              {selectedCoach?.successRate || 91}% trong số người được huấn luyện
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Phù hợp:</strong> 75% phù hợp với nhu cầu của bạn
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Kinh nghiệm:</strong> {selectedCoach?.experience || 10}{" "}
              năm kinh nghiệm trong việc huấn luyện cai thuốc lá
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Lợi ích:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Hỗ trợ từ xa" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Hỗ trợ từ huấn luyện viên" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Giảm thiểu căng thẳng" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Hỗ trợ cai thuốc thành công" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Tài liệu và bài tập hỗ trợ" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Theo dõi tiến trình hàng ngày" />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewOtherCoach} color="primary">
              Xem huấn luyện viên khác
            </Button>
            <Button
              onClick={handleChooseCoach}
              color="success"
              variant="contained"
            >
              Chọn huấn luyện viên này
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
