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
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import "./CoachMatching.css";

// Sample coach data with unique roadmaps
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
    roadmap: {
      title: "Lộ trình Cai Thuốc Lá Tăng Cường Ý Chí",
      description:
        "Tập trung vào xây dựng ý chí mạnh mẽ và thay đổi thói quen thông qua các kỹ thuật tâm lý và hỗ trợ cá nhân hóa.",
      steps: [
        "Đánh giá mức độ nghiện và thiết lập mục tiêu cá nhân.",
        "Thực hành kỹ thuật kiểm soát căng thẳng không dùng thuốc lá.",
        "Tham gia các buổi tư vấn 1:1 hàng tuần để duy trì động lực.",
        "Xây dựng kế hoạch thay thế thói quen hút thuốc bằng hoạt động tích cực.",
        "Theo dõi tiến độ và điều chỉnh chiến lược sau 30 ngày.",
      ],
    },
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
    roadmap: {
      title: "Lộ trình Cai Thuốc Lá Tâm Lý Chuyên Sâu",
      description:
        "Sử dụng liệu pháp nhận thức hành vi (CBT) để thay đổi tư duy và hành vi liên quan đến thuốc lá.",
      steps: [
        "Phân tích nguyên nhân tâm lý dẫn đến hút thuốc.",
        "Áp dụng kỹ thuật CBT để thay đổi suy nghĩ tiêu cực.",
        "Thực hành thiền định để giảm căng thẳng và lo âu.",
        "Tạo nhật ký hành vi để theo dõi tiến trình cai thuốc.",
        "Đánh giá và củng cố kết quả sau mỗi 2 tuần.",
      ],
    },
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
    roadmap: {
      title: "Lộ trình Cai Thuốc Lá Toàn Diện",
      description:
        "Kết hợp dinh dưỡng, tập luyện và tư vấn để cải thiện sức khỏe tổng thể, hỗ trợ cai thuốc hiệu quả.",
      steps: [
        "Đánh giá sức khỏe tổng quát và mức độ nghiện nicotine.",
        "Xây dựng chế độ ăn uống tăng cường năng lượng và giảm thèm thuốc.",
        "Kế hoạch tập thể dục nhẹ nhàng để cải thiện tâm trạng.",
        "Tham gia nhóm hỗ trợ để chia sẻ kinh nghiệm.",
        "Kiểm tra sức khỏe định kỳ và điều chỉnh lộ trình sau 4 tuần.",
      ],
    },
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
    roadmap: {
      title: "Lộ trình Cai Thuốc Lá Qua Tập Luyện",
      description:
        "Sử dụng các bài tập thể chất để giảm căng thẳng và thay thế thói quen hút thuốc bằng lối sống năng động.",
      steps: [
        "Khởi động với các bài tập thể dục nhẹ nhàng (yoga, đi bộ).",
        "Tăng cường độ tập luyện để cải thiện sức khỏe tim mạch.",
        "Tham gia các buổi tập nhóm để duy trì động lực.",
        "Học kỹ thuật hít thở sâu để kiểm soát cơn thèm thuốc.",
        "Đánh giá tiến độ sau 3 tuần và điều chỉnh kế hoạch.",
      ],
    },
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
    roadmap: {
      title: "Lộ trình Cai Thuốc Lá Qua Dinh Dưỡng",
      description:
        "Tập trung vào chế độ ăn uống lành mạnh để giảm cảm giác thèm nicotine và cải thiện sức khỏe tổng thể.",
      steps: [
        "Đánh giá thói quen ăn uống và mức độ nghiện thuốc.",
        "Xây dựng thực đơn giàu vitamin và khoáng chất để hỗ trợ cơ thể.",
        "Hướng dẫn sử dụng thực phẩm thay thế khi thèm thuốc.",
        "Tư vấn dinh dưỡng cá nhân hóa mỗi tuần.",
        "Theo dõi và đánh giá hiệu quả sau 1 tháng.",
      ],
    },
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
    roadmap: {
      title: "Lộ trình Cai Thuốc Lá Qua Thiền Định",
      description:
        "Sử dụng thiền và các kỹ thuật thư giãn để kiểm soát tâm trí, giảm căng thẳng và cai thuốc lá bền vững.",
      steps: [
        "Học kỹ thuật thiền cơ bản để kiểm soát tâm trí.",
        "Thực hành các bài tập thư giãn mỗi ngày (10-15 phút).",
        "Tham gia các buổi thiền nhóm để tăng cường động lực.",
        "Sử dụng ứng dụng theo dõi thiền để duy trì thói quen.",
        "Đánh giá mức độ thèm thuốc và điều chỉnh sau 2 tuần.",
      ],
    },
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
            <Box>
              <Typography
                variant="body1"
                sx={{ fontSize: "20px", fontWeight: "bold" }}
              >
                Lộ trình cai thuốc được đề xuất
              </Typography>
              <span style={{ fontSize: "14px", color: "#666" }}>
                Dựa trên đánh giá và kế hoạch của bạn, chúng tôi đề xuất lộ
                trình cai thuốc sau
              </span>
            </Box>
            <Box className="coaching__modal-header">
              <Avatar src={selectedCoach?.image} />
              <Typography
                variant="h5"
                sx={{ marginLeft: "20px", fontSize: "18px" }}
              >
                {selectedCoach?.name}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box className="coaching__modal-content">
              <Box className="coaching__modal-title">
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  {selectedCoach?.roadmap.title}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    padding: "2px 8px",
                    width: "auto",
                    height: "20px",
                    lineHeight: "20px",
                    backgroundColor: "#d3fde1",
                    color: "#538766",
                    borderRadius: "10px",
                    textAlign: "center",
                    marginLeft: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  98% phù hợp
                </Typography>
              </Box>
              <Box className="coaching__modal-sup">
                <Typography className="coaching__modal-sup-des">
                  {" "}
                  12 tuần
                </Typography>
                <Typography
                  className="coaching__modal-sup-des"
                  sx={{ marginLeft: "20px" }}
                >
                  {selectedCoach?.successRate || 91}% thành công
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedCoach?.roadmap.description}
              </Typography>
              <List>
                {selectedCoach?.roadmap.steps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "20px" }}>
            <Button
              onClick={handleViewOtherCoach}
              color="primary"
              sx={{
                color: "black",
                border: "1px solid #ccc",
                textTransform: "none",
              }}
            >
              Xem huấn luyện viên khác
            </Button>
            <Button
              onClick={handleChooseCoach}
              color="success"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#388e3c",
                },
              }}
            >
              Chọn huấn luyện viên này
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
