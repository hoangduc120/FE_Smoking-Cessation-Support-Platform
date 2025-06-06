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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Email, Phone, LocationOn } from "@mui/icons-material";

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#1b5e20",
  color: "white",
  padding: theme.spacing(10, 0),
  textAlign: "center",
  borderRadius: "0 0 50% 50% / 10%",
  marginBottom: theme.spacing(6),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[10],
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: "#2e7d32",
  width: theme.spacing(7),
  height: theme.spacing(7),
  margin: "0 auto",
  marginBottom: theme.spacing(2),
}));

const Contact = () => {
  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Liên Hệ
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            Kết nối với chúng tôi để nhận hỗ trợ và tư vấn trong hành trình cai
            thuốc lá
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: "#1b5e20",
              "&:hover": {
                backgroundColor: "#e8f5e9",
              },
            }}
          >
            Gửi Tin Nhắn
          </Button>
        </Container>
      </HeroSection>

      <Container>
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            color="#1b5e20"
            fontWeight="bold"
          >
            Thông Tin Liên Hệ
          </Typography>
          <Divider
            sx={{
              mb: 4,
              width: "100px",
              borderWidth: 2,
              backgroundColor: "#4caf50",
              mx: "auto",
            }}
          />
          <Typography
            variant="body1"
            paragraph
            align="center"
            sx={{ maxWidth: "800px", mx: "auto", fontSize: "1.1rem" }}
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều kênh liên lạc. Hãy liên
            hệ để được tư vấn miễn phí hoặc tham gia cộng đồng của chúng tôi.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <Email fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Email
                </Typography>
                <Typography variant="body1">
                  Gửi thắc mắc của bạn tới: <br />
                  <a href="mailto:support@quitsmoke.com">
                    support@quitsmoke.com
                  </a>
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <Phone fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Điện Thoại
                </Typography>
                <Typography variant="body1">
                  Gọi chúng tôi tại: <br />
                  <a href="tel:+842412345678">+84 24 1234 5678</a>
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <LocationOn fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Văn Phòng
                </Typography>
                <Typography variant="body1">
                  Tầng 5, Tòa nhà Sức Khỏe, 123 Đường Láng, Hà Nội, Việt Nam
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Box sx={{ mb: 8, backgroundColor: "#f1f8e9", p: 4, borderRadius: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            color="#1b5e20"
            fontWeight="bold"
          >
            Gửi Tin Nhắn Cho Chúng Tôi
          </Typography>
          <Divider
            sx={{
              mb: 4,
              width: "100px",
              borderWidth: 2,
              backgroundColor: "#4caf50",
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
            <TextField
              label="Họ và Tên"
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
            <TextField
              label="Tin Nhắn"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{ backgroundColor: "white" }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
            >
              Gửi
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
