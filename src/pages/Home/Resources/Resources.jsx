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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Article,
  VideoLibrary,
  Forum,
  LocalLibrary,
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

const Resources = () => {
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
              Tài Nguyên
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
              Khám phá các tài liệu, công cụ và hỗ trợ để giúp bạn cai thuốc lá
              thành công
            </Typography>
          </Fade>
          <Zoom in={true} timeout={1600}>
            <StyledButton variant="contained" size="large">
              Tìm Hiểu Thêm
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
              Tài Liệu Hữu Ích
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
              Chúng tôi cung cấp nhiều loại tài nguyên từ bài viết chuyên sâu,
              video hướng dẫn, đến các công cụ thực tiễn để hỗ trợ bạn trong
              hành trình cai thuốc lá.
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4} sx={{ mb: 10 }}>
          {[
            {
              icon: <Article fontSize="large" />,
              title: "Bài Viết Chuyên Sâu",
              text: "Các bài viết được viết bởi chuyên gia về tác hại của thuốc lá, lợi ích của việc cai thuốc và các chiến lược hiệu quả.",
            },
            {
              icon: <VideoLibrary fontSize="large" />,
              title: "Video Hướng Dẫn",
              text: "Xem các video hướng dẫn từng bước về cách quản lý cơn thèm thuốc và duy trì lối sống không thuốc lá.",
            },
            {
              icon: <Forum fontSize="large" />,
              title: "Diễn Đàn Cộng Đồng",
              text: "Tham gia diễn đàn của chúng tôi để kết nối, chia sẻ kinh nghiệm và nhận hỗ trợ từ những người cùng mục tiêu.",
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
              Công Cụ Hỗ Trợ
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
          <List>
            {[
              {
                primary: "Ứng dụng theo dõi tiến trình",
                secondary:
                  "Theo dõi hành trình cai thuốc của bạn với ứng dụng thân thiện của chúng tôi.",
              },
              {
                primary: "Kế hoạch cá nhân hóa",
                secondary:
                  "Nhận kế hoạch cai thuốc được thiết kế riêng dựa trên thói quen và mục tiêu của bạn.",
              },
              {
                primary: "Tài liệu in sẵn",
                secondary:
                  "Tải xuống các hướng dẫn và nhật ký có thể in để hỗ trợ bạn mọi lúc.",
              },
            ].map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <LocalLibrary sx={{ color: "#2e7d32" }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                  primaryTypographyProps={{ sx: { lineHeight: 1.7 } }}
                  secondaryTypographyProps={{ sx: { lineHeight: 1.7 } }}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Zoom in={true} timeout={1600}>
              <StyledButton variant="contained" size="large">
                Tải Công Cụ Ngay
              </StyledButton>
            </Zoom>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Resources;
