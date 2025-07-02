import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  VolunteerActivism,
  Psychology,
  HealthAndSafety,
  Diversity3,
  Timeline,
} from "@mui/icons-material";
import { Fade, Zoom } from "@mui/material";
import image1 from "../../../assets/63.jpg";
import image2 from "../../../assets/20.jpg";
import image3 from "../../../assets/51.jpg";
import image4 from "../../../assets/19.jpg";

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

const StyledCard = styled(Card)(({ theme }) => ({
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(45deg, #2e7d32 30%, #81c784 90%)",
  width: theme.spacing(9),
  height: theme.spacing(9),
  margin: "0 auto",
  marginBottom: theme.spacing(3),
  transition: "transform 0.5s ease-in-out",
  "&:hover": {
    transform: "scale(1.15) rotate(10deg)",
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

const AboutUs = () => {
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
              Về Chúng Tôi
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
              Hỗ trợ bạn trong hành trình cai thuốc lá và hướng tới một cuộc
              sống khỏe mạnh hơn
            </Typography>
          </Fade>
          <Zoom in={true} timeout={1600}>
            <StyledButton
              variant="contained"
              size="large"
              onClick={handleClick}
            >
              Bắt đầu ngay
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
              Sứ Mệnh Của Chúng Tôi
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
          <Fade in={true} timeout={1400}>
            <Typography
              variant="body1"
              paragraph
              align="center"
              sx={{
                maxWidth: "900px",
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: 1.7,
              }}
            >
              QuitSmoke được thành lập với mục tiêu giúp mọi người từ bỏ thói
              quen hút thuốc lá, cải thiện sức khỏe và nâng cao chất lượng cuộc
              sống. Chúng tôi cung cấp thông tin, công cụ và sự hỗ trợ cần thiết
              để giúp bạn vượt qua thách thức trong hành trình cai thuốc.
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4} sx={{ mb: 10 }}>
          {[
            {
              icon: <HealthAndSafety fontSize="large" />,
              title: "Chuyên Môn Y Tế",
              text: "Đội ngũ chuyên gia y tế của chúng tôi có nhiều năm kinh nghiệm trong lĩnh vực cai nghiện và sức khỏe hô hấp, luôn sẵn sàng tư vấn và hỗ trợ bạn.",
            },
            {
              icon: <Psychology fontSize="large" />,
              title: "Phương Pháp Khoa Học",
              text: "Các phương pháp và lời khuyên của chúng tôi đều dựa trên nghiên cứu khoa học và được chứng minh hiệu quả trong việc giúp người hút thuốc cai nghiện thành công.",
            },
            {
              icon: <VolunteerActivism fontSize="large" />,
              title: "Hỗ Trợ Cộng Đồng",
              text: "Chúng tôi xây dựng một cộng đồng hỗ trợ mạnh mẽ, nơi mọi người có thể chia sẻ kinh nghiệm, thách thức và thành công trong hành trình cai thuốc.",
            },
          ].map((item, index) => (
            <Grid item size={{ xs: 12, md: 4 }} key={index}>
              <Zoom
                in={true}
                style={{ transitionDelay: `${200 * (index + 1)}ms` }}
              >
                <StyledCard elevation={4}>
                  <CardContent sx={{ textAlign: "center", flexGrow: 1, p: 4 }}>
                    <StyledAvatar>{item.icon}</StyledAvatar>
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
                </StyledCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>

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
          <Grid container spacing={4} alignItems="center">
            <Grid item size={{ xs: 12, md: 6 }}>
              <Fade in={true} timeout={1200}>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{
                    color: "#1b5e20",
                    fontWeight: "bold",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                  }}
                >
                  Lịch Sử Của Chúng Tôi
                </Typography>
              </Fade>
              <Fade in={true} timeout={1400}>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.7, mb: 2 }}
                >
                  QuitSmoke được thành lập bởi một nhóm các chuyên gia y tế và
                  những người đã từng trải qua hành trình cai thuốc thành công.
                  Chúng tôi bắt đầu như một dự án nhỏ nhưng đã nhanh chóng phát
                  triển thành một tổ chức toàn diện.
                </Typography>
              </Fade>
              <Fade in={true} timeout={1600}>
                <Typography variant="body">
                  Trong những năm qua, chúng tôi đã giúp hàng nghìn người từ bỏ
                  thói quen hút thuốc lá và tìm lại sức khỏe cũng như sự tự do.
                  Chúng tôi không ngừng cải tiến phương pháp và mở rộng dịch vụ
                  để đáp ứng nhu cầu ngày càng tăng.
                </Typography>
              </Fade>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }} sx={{ textAlign: "center" }}>
              <Zoom in={true} timeout={1800}>
                <Timeline sx={{ fontSize: 200, color: "#2e7d32" }} />
              </Zoom>
            </Grid>
          </Grid>
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
              Đội Ngũ Của Chúng Tôi
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
                src: image1,
                name: "Nguyễn Văn An",
                role: "Giám đốc Y tế",
                desc: "Với hơn 15 năm kinh nghiệm trong lĩnh vực y tế và cai nghiện.",
              },
              {
                src: image2,
                name: "Trần Thị Bình",
                role: "Chuyên gia Tâm lý",
                desc: "Chuyên gia tâm lý với 12 năm kinh nghiệm hỗ trợ cai nghiện và hỗ trợ cộng đồng.",
              },
              {
                src: image3,
                name: "Lê Văn Cường",
                role: "Cố vấn Dinh dưỡng",
                desc: "Chuyên gia dinh dưỡng với 10 năm kinh nghiệm xây dựng chế độ ăn lành mạnh.",
              },
              {
                src: image4,
                name: "Phạm Thị Duyên",
                role: "Điều phối viên Cộng đồng",
                desc: "8 năm kinh nghiệm tổ chức và quản lý các chương trình cộng đồng.",
              },
            ].map((member, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Zoom
                  in={true}
                  style={{ transitionDelay: `${200 * (index + 1)}ms` }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      textAlign: "center",
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #c8e6c9 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                      transition: "transform 0.5s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-20px) scale(1.03)",
                        animation: `${pulse} 1.5s infinite`,
                      },
                    }}
                  >
                    <Avatar
                      src={member.src}
                      sx={{
                        width: 130,
                        height: 130,
                        mx: "auto",
                        mt: 4,
                        border: "4px solid #4caf50",
                        transition: "transform 0.5s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.15) rotate(10deg)",
                          animation: `${pulse} 1s infinite`,
                        },
                      }}
                    />
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {member.role}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                        {member.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Zoom in={true} timeout={1400}>
            <Diversity3 sx={{ fontSize: 90, color: "#2e7d32", mb: 3 }} />
          </Zoom>
          <Fade in={true} timeout={1600}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                color: "#1b5e20",
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Tham Gia Cùng Chúng Tôi
            </Typography>
          </Fade>
          <Fade in={true} timeout={1800}>
            <Typography
              variant="body1"
              paragraph
              sx={{
                maxWidth: "800px",
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: 1.7,
              }}
            >
              Hãy trở thành một phần của cộng đồng QuitSmoke và bắt đầu hành
              trình hướng tới một cuộc sống khỏe mạnh hơn, không có thuốc lá.
              Chúng tôi luôn sẵn sàng đồng hành cùng bạn trong mỗi bước đi.
            </Typography>
          </Fade>
          <Zoom in={true} timeout={2000}>
            <StyledButton
              variant="contained"
              size="large"
              onClick={handleClick}
            >
              Đăng Ký Ngay Hôm Nay
            </StyledButton>
          </Zoom>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;
