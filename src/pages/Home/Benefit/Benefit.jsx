import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Fade,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Favorite,
  AccessTime,
  LocalHospital,
  Spa,
  MonetizationOn,
  Psychology,
  Restaurant,
  SelfImprovement,
  CheckCircle,
  Timeline,
} from "@mui/icons-material";

// Keyframes for animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const slideIn = keyframes`
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1b5e20 0%, #4caf50 50%, #81c784 100%)",
  color: "white",
  padding: theme.spacing(14, 0),
  textAlign: "center",
  borderRadius: "0 0 70% 70% / 15%",
  marginBottom: theme.spacing(10),
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: "-20%",
    left: "-20%",
    width: "140%",
    height: "140%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
  background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
  borderRadius: theme.spacing(3),
  border: "1px solid rgba(76, 175, 80, 0.2)",
  "&:hover": {
    transform: "translateY(-20px) scale(1.03)",
    boxShadow: theme.shadows[15],
    animation: `${pulse} 1.5s infinite`,
  },
}));

const TimelineCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderLeft: `5px solid #2e7d32`,
  background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
  borderRadius: theme.spacing(2),
  transition: "transform 0.5s ease-in-out",
  "&:hover": {
    transform: "translateX(15px)",
    animation: `${slideIn} 0.5s ease-in-out`,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)",
  color: "#1b5e20",
  fontWeight: "bold",
  marginRight: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(3),
  transition: "transform 0.4s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    animation: `${pulse} 1s infinite`,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
  color: "white",
  padding: theme.spacing(2, 5),
  borderRadius: theme.spacing(4),
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "1.1rem",
  "&:hover": {
    background: "linear-gradient(45deg, #81c784 30%, #4caf50 90%)",
    transform: "scale(1.1)",
    animation: `${pulse} 1.5s infinite`,
  },
}));

const Benefits = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/upgradeMember`);
  };
  return (
    <Box
      sx={{ background: "linear-gradient(180deg, #f5f5f5 0%, #e8f5e9 100%)" }}
    >
      <HeroSection>
        <Container>
          <Fade in={true} timeout={1200}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              Lợi Ích Cai Thuốc Lá
            </Typography>
          </Fade>
          <Fade in={true} timeout={1400}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 5,
                maxWidth: "900px",
                mx: "auto",
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Khám phá những thay đổi tích cực đến với cơ thể và cuộc sống của
              bạn khi từ bỏ thuốc lá
            </Typography>
          </Fade>
          <Zoom in={true} timeout={1600}>
            <StyledButton
              variant="contained"
              size="large"
              onClick={handleClick}
            >
              Bắt đầu hành trình cai thuốc
            </StyledButton>
          </Zoom>
        </Container>
      </HeroSection>

      <Container>
        <Box sx={{ mb: 10 }}>
          <Fade in={true} timeout={1200}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              align="center"
              sx={{
                color: "#1b5e20",
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Lợi Ích Sức Khỏe
            </Typography>
          </Fade>
          <Divider
            sx={{
              mb: 5,
              width: "120px",
              borderWidth: 3,
              background: "linear-gradient(to right, #4caf50, #81c784)",
              mx: "auto",
            }}
          />

          <Grid container spacing={4}>
            {[
              {
                icon: (
                  <Favorite sx={{ fontSize: 70, color: "#2e7d32", mb: 3 }} />
                ),
                title: "Cải Thiện Tim Mạch",
                text: "Chỉ sau 20 phút cai thuốc, nhịp tim và huyết áp của bạn bắt đầu trở về mức bình thường. Sau 1 năm, nguy cơ mắc bệnh tim mạch giảm một nửa so với người hút thuốc.",
              },
              {
                icon: (
                  <LocalHospital
                    sx={{ fontSize: 70, color: "#2e7d32", mb: 3 }}
                  />
                ),
                title: "Giảm Nguy Cơ Ung Thư",
                text: "Cai thuốc lá giúp giảm đáng kể nguy cơ mắc các bệnh ung thư liên quan đến thuốc lá như ung thư phổi, ung thư miệng, ung thư thực quản và nhiều loại ung thư khác.",
              },
              {
                icon: <Spa sx={{ fontSize: 70, color: "#2e7d32", mb: 3 }} />,
                title: "Phục Hồi Phổi",
                text: "Sau 2-12 tuần cai thuốc, chức năng phổi được cải thiện, giúp bạn dễ dàng hít thở và vận động. Các triệu chứng như ho, khó thở và nhiễm trùng đường hô hấp cũng giảm đáng kể.",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom
                  in={true}
                  style={{ transitionDelay: `${200 * (index + 1)}ms` }}
                >
                  <BenefitCard elevation={4}>
                    <CardContent
                      sx={{ textAlign: "center", flexGrow: 1, p: 4 }}
                    >
                      {item.icon}
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{ color: "#2e7d32", fontWeight: "bold", mb: 2 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {item.text}
                      </Typography>
                    </CardContent>
                  </BenefitCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: 5,
            mb: 10,
            borderRadius: 5,
            background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Fade in={true} timeout={1200}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                color: "#1b5e20",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Lợi Ích Theo Thời Gian
            </Typography>
          </Fade>
          <Divider
            sx={{
              mb: 5,
              width: "120px",
              borderWidth: 3,
              background: "linear-gradient(to right, #4caf50, #81c784)",
              mx: "auto",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
            <Zoom in={true} timeout={1400}>
              <Timeline sx={{ fontSize: 70, color: "#2e7d32", mr: 3 }} />
            </Zoom>
            <Fade in={true} timeout={1600}>
              <Typography
                variant="h5"
                component="h3"
                sx={{ color: "#2e7d32", fontWeight: "bold" }}
              >
                Hành trình phục hồi của cơ thể sau khi cai thuốc lá
              </Typography>
            </Fade>
          </Box>

          <Fade in={true} timeout={1800}>
            <Box>
              {[
                {
                  time: "20 phút sau khi cai thuốc",
                  text: "Nhịp tim và huyết áp giảm xuống mức bình thường. Nhiệt độ của bàn tay và bàn chân tăng lên mức bình thường.",
                },
                {
                  time: "8-12 giờ sau khi cai thuốc",
                  text: "Nồng độ carbon monoxide trong máu giảm xuống mức bình thường. Nồng độ oxy trong máu tăng lên mức bình thường.",
                },
                {
                  time: "24-48 giờ sau khi cai thuốc",
                  text: "Nguy cơ đau tim bắt đầu giảm. Các dây thần kinh bắt đầu tái sinh. Khả năng ngửi và nếm thức ăn được cải thiện.",
                },
                {
                  time: "2-12 tuần sau khi cai thuốc",
                  text: "Tuần hoàn máu cải thiện. Chức năng phổi tăng lên đến 30%. Đi bộ trở nên dễ dàng hơn.",
                },
                {
                  time: "1-9 tháng sau khi cai thuốc",
                  text: "Ho, nghẹt mũi và khó thở giảm. Phổi tăng khả năng tự làm sạch, giảm nhiễm trùng. Mức năng lượng tổng thể tăng lên.",
                },
                {
                  time: "1 năm sau khi cai thuốc",
                  text: "Nguy cơ mắc bệnh tim mạch vành giảm một nửa so với người hút thuốc.",
                },
                {
                  time: "5-15 năm sau khi cai thuốc",
                  text: "Nguy cơ đột quỵ giảm xuống tương đương với người không hút thuốc. Nguy cơ ung thư miệng, họng và thực quản giảm một nửa.",
                },
              ].map((item, index) => (
                <Zoom
                  in={true}
                  style={{ transitionDelay: `${200 * (index + 1)}ms` }}
                  key={index}
                >
                  <TimelineCard elevation={3}>
                    <Typography
                      variant="h6"
                      component="h4"
                      gutterBottom
                      sx={{ color: "#2e7d32", fontWeight: "bold", mb: 2 }}
                    >
                      {item.time}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {item.text}
                    </Typography>
                  </TimelineCard>
                </Zoom>
              ))}
            </Box>
          </Fade>
        </Paper>

        <Box sx={{ mb: 10 }}>
          <Fade in={true} timeout={1200}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              align="center"
              sx={{
                color: "#1b5e20",
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Lợi Ích Khác
            </Typography>
          </Fade>
          <Divider
            sx={{
              mb: 5,
              width: "120px",
              borderWidth: 3,
              background: "linear-gradient(to right, #4caf50, #81c784)",
              mx: "auto",
            }}
          />

          <Grid container spacing={4}>
            {[
              {
                icon: (
                  <MonetizationOn
                    sx={{ fontSize: 50, color: "#2e7d32", mr: 3 }}
                  />
                ),
                title: "Lợi Ích Tài Chính",
                items: [
                  "Tiết kiệm đáng kể chi phí mua thuốc lá hàng ngày",
                  "Giảm chi phí y tế và bảo hiểm sức khỏe",
                  "Giảm chi phí vệ sinh, giặt giũ và khử mùi",
                  "Tăng giá trị tài sản (nhà, xe) không bị ám mùi thuốc lá",
                ],
              },
              {
                icon: (
                  <Psychology sx={{ fontSize: 50, color: "#2e7d32", mr: 3 }} />
                ),
                title: "Lợi Ích Tâm Lý",
                items: [
                  "Giảm căng thẳng và lo âu sau giai đoạn cai nghiện",
                  "Tăng cường sự tự tin và lòng tự trọng",
                  "Cải thiện tâm trạng và giảm nguy cơ trầm cảm",
                  "Tự hào về thành tựu cai thuốc thành công",
                ],
              },
              {
                icon: (
                  <Restaurant sx={{ fontSize: 50, color: "#2e7d32", mr: 3 }} />
                ),
                title: "Lợi Ích Cảm Quan",
                items: [
                  "Khứu giác được cải thiện đáng kể",
                  "Vị giác trở nên nhạy bén hơn, thưởng thức thức ăn ngon hơn",
                  "Hơi thở, tóc và quần áo không còn mùi thuốc lá",
                  "Răng và móng tay không còn bị ố vàng",
                ],
              },
              {
                icon: (
                  <SelfImprovement
                    sx={{ fontSize: 50, color: "#2e7d32", mr: 3 }}
                  />
                ),
                title: "Lợi Ích Xã Hội",
                items: [
                  "Không còn bị hạn chế bởi các khu vực cấm hút thuốc",
                  "Trở thành hình mẫu tích cực cho con cái và người thân",
                  "Bảo vệ người thân khỏi tác hại của khói thuốc thụ động",
                  "Cải thiện mối quan hệ với những người không hút thuốc",
                ],
              },
            ].map((benefit, index) => (
              <Grid item size={{ xs: 12, md: 6 }} key={index}>
                <Zoom
                  in={true}
                  style={{ transitionDelay: `${200 * (index + 1)}ms` }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      height: "100%",
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        {benefit.icon}
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{ color: "#2e7d32", fontWeight: "bold" }}
                        >
                          {benefit.title}
                        </Typography>
                      </Box>
                      <List>
                        {benefit.items.map((item, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <CheckCircle sx={{ color: "#4caf50" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={item}
                              sx={{ lineHeight: 1.7 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Fade in={true} timeout={1200}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              align="center"
              sx={{
                color: "#1b5e20",
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Những Thay Đổi Bạn Sẽ Nhận Thấy
            </Typography>
          </Fade>
          <Divider
            sx={{
              mb: 5,
              width: "120px",
              borderWidth: 3,
              background: "linear-gradient(to right, #4caf50, #81c784)",
              mx: "auto",
            }}
          />

          <Grid container spacing={2} sx={{ mb: 5 }}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {[
                  "Hơi thở thơm mát hơn",
                  "Da dẻ hồng hào",
                  "Tăng sức bền thể chất",
                  "Ngủ ngon hơn",
                  "Giảm ho và đờm",
                  "Tăng khả năng tập trung",
                  "Tăng cường miễn dịch",
                  "Giảm nguy cơ nhiễm trùng",
                  "Cải thiện tuần hoàn máu",
                  "Tăng mức năng lượng",
                  "Giảm nguy cơ bệnh nướu răng",
                  "Cải thiện khả năng sinh sản",
                  "Giảm nếp nhăn sớm",
                  "Tăng tuổi thọ",
                  "Cải thiện sức khỏe tình dục",
                ].map((label, index) => (
                  <Zoom
                    in={true}
                    style={{ transitionDelay: `${150 * (index + 1)}ms` }}
                    key={index}
                  >
                    <StyledChip label={label} />
                  </Zoom>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Paper
            elevation={4}
            sx={{
              p: 5,
              borderRadius: 5,
              background: "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <Zoom in={true} timeout={1400}>
              <AccessTime sx={{ fontSize: 70, color: "#2e7d32", mb: 3 }} />
            </Zoom>
            <Fade in={true} timeout={1600}>
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                sx={{ color: "#1b5e20", fontWeight: "bold", mb: 2 }}
              >
                Không Bao Giờ Là Quá Muộn
              </Typography>
            </Fade>
            <Fade in={true} timeout={1800}>
              <Typography
                variant="body1"
                paragraph
                sx={{ lineHeight: 1.7, mb: 3 }}
              >
                Bất kể bạn đã hút thuốc bao lâu, cơ thể của bạn sẽ bắt đầu phục
                hồi ngay từ khi bạn hút điếu thuốc cuối cùng. Nghiên cứu cho
                thấy cai thuốc ở bất kỳ độ tuổi nào đều mang lại lợi ích sức
                khỏe đáng kể.
              </Typography>
            </Fade>
            <Zoom in={true} timeout={2000}>
              <StyledButton
                variant="contained"
                size="large"
                onClick={handleClick}
              >
                Bắt Đầu Hành Trình Cai Thuốc Ngay Hôm Nay
              </StyledButton>
            </Zoom>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Benefits;
