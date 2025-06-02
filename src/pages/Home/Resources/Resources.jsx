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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Article,
  VideoLibrary,
  Forum,
  LocalLibrary,
} from "@mui/icons-material";

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

const Resources = () => {
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
            Tài Nguyên
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            Khám phá các tài liệu, công cụ và hỗ trợ để giúp bạn cai thuốc lá
            thành công
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
            Tìm Hiểu Thêm
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
            Tài Liệu Hữu Ích
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
            Chúng tôi cung cấp nhiều loại tài nguyên từ bài viết chuyên sâu,
            video hướng dẫn, đến các công cụ thực tiễn để hỗ trợ bạn trong hành
            trình cai thuốc lá.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <Article fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Bài Viết Chuyên Sâu
                </Typography>
                <Typography variant="body1">
                  Các bài viết được viết bởi chuyên gia về tác hại của thuốc lá,
                  lợi ích của việc cai thuốc và các chiến lược hiệu quả.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <VideoLibrary fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Video Hướng Dẫn
                </Typography>
                <Typography variant="body1">
                  Xem các video hướng dẫn từng bước về cách quản lý cơn thèm
                  thuốc và duy trì lối sống không thuốc lá.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <Forum fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Diễn Đàn Cộng Đồng
                </Typography>
                <Typography variant="body1">
                  Tham gia diễn đàn của chúng tôi để kết nối, chia sẻ kinh
                  nghiệm và nhận hỗ trợ từ những người cùng mục tiêu.
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
            Công Cụ Hỗ Trợ
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
          <List>
            <ListItem>
              <ListItemIcon>
                <LocalLibrary sx={{ color: "#2e7d32" }} />
              </ListItemIcon>
              <ListItemText
                primary="Ứng dụng theo dõi tiến trình"
                secondary="Theo dõi hành trình cai thuốc của bạn với ứng dụng thân thiện của chúng tôi."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalLibrary sx={{ color: "#2e7d32" }} />
              </ListItemIcon>
              <ListItemText
                primary="Kế hoạch cá nhân hóa"
                secondary="Nhận kế hoạch cai thuốc được thiết kế riêng dựa trên thói quen và mục tiêu của bạn."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalLibrary sx={{ color: "#2e7d32" }} />
              </ListItemIcon>
              <ListItemText
                primary="Tài liệu in sẵn"
                secondary="Tải xuống các hướng dẫn và nhật ký có thể in để hỗ trợ bạn mọi lúc."
              />
            </ListItem>
          </List>
          <Box sx={{ textAlign: "center", mt: 4 }}>
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
              Tải Công Cụ Ngay
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Resources;
