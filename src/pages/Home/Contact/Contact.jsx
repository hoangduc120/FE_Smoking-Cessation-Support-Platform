import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  TextField,
  Fade,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Email, Phone, LocationOn } from "@mui/icons-material";

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
  backgroundColor: "#2e7d32",
  width: theme.spacing(7),
  height: theme.spacing(7),
  margin: "0 auto",
  marginBottom: theme.spacing(2),
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

const Contact = () => {
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
              Liên Hệ
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
              Kết nối với chúng tôi để nhận hỗ trợ và tư vấn trong hành trình
              cai thuốc lá
            </Typography>
          </Fade>
          <Zoom in={true} timeout={1600}>
            <StyledButton variant="contained" size="large">
              Gửi Tin Nhắn
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
              Thông Tin Liên Hệ
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
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều kênh liên lạc. Hãy
              liên hệ để được tư vấn miễn phí hoặc tham gia cộng đồng của chúng
              tôi.
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4} sx={{ mb: 10 }}>
          {[
            {
              icon: <Email fontSize="large" />,
              title: "Email",
              text: (
                <>
                  Gửi thắc mắc của bạn tới: <br />
                  <a href="mailto:support@quitsmoke.com">
                    support@quitsmoke.com
                  </a>
                </>
              ),
            },
            {
              icon: <Phone fontSize="large" />,
              title: "Điện Thoại",
              text: (
                <>
                  Gọi chúng tôi tại: <br />
                  <a href="tel:+842412345678">+84 24 1234 5678</a>
                </>
              ),
            },
            {
              icon: <LocationOn fontSize="large" />,
              title: "Văn Phòng",
              text: "Tầng 5, Tòa nhà Sức Khỏe, 123 Đường Láng, Hà Nội, Việt Nam",
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

        <Box
          sx={{
            mb: 10,
            p: 5,
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
              align="center"
              sx={{
                color: "#1b5e20",
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Gửi Tin Nhắn Cho Chúng Tôi
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
          <Box
            sx={{
              maxWidth: "600px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Fade in={true} timeout={1400}>
              <TextField
                label="Họ và Tên"
                variant="outlined"
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            </Fade>
            <Fade in={true} timeout={1600}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            </Fade>
            <Fade in={true} timeout={1800}>
              <TextField
                label="Tin Nhắn"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ backgroundColor: "white" }}
              />
            </Fade>
            <Zoom in={true} timeout={2000}>
              <StyledButton variant="contained" size="large">
                Gửi
              </StyledButton>
            </Zoom>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
