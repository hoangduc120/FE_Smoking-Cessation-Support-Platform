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
import { styled } from "@mui/material/styles";
import {
  VolunteerActivism,
  Psychology,
  HealthAndSafety,
  Diversity3,
  Timeline,
} from "@mui/icons-material";
import image1 from "../../../assets/63.jpg";
import image2 from "../../../assets/20.jpg";
import image3 from "../../../assets/51.jpg";
import image4 from "../../../assets/19.jpg";

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

const AboutUs = () => {
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
            Về Chúng Tôi
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            Hỗ trợ bạn trong hành trình cai thuốc lá và hướng tới một cuộc sống
            khỏe mạnh hơn
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
            Bắt đầu ngay
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
            Sứ Mệnh Của Chúng Tôi
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
            QuitSmoke được thành lập với mục tiêu giúp mọi người từ bỏ thói quen
            hút thuốc lá, cải thiện sức khỏe và nâng cao chất lượng cuộc sống.
            Chúng tôi cung cấp thông tin, công cụ và sự hỗ trợ cần thiết để giúp
            bạn vượt qua thách thức trong hành trình cai thuốc.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <HealthAndSafety fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Chuyên Môn Y Tế
                </Typography>
                <Typography variant="body1">
                  Đội ngũ chuyên gia y tế của chúng tôi có nhiều năm kinh nghiệm
                  trong lĩnh vực cai nghiện và sức khỏe hô hấp, luôn sẵn sàng tư
                  vấn và hỗ trợ bạn.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <Psychology fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Phương Pháp Khoa Học
                </Typography>
                <Typography variant="body1">
                  Các phương pháp và lời khuyên của chúng tôi đều dựa trên
                  nghiên cứu khoa học và được chứng minh hiệu quả trong việc
                  giúp người hút thuốc cai nghiện thành công.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <StyledCard elevation={3}>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <StyledAvatar>
                  <VolunteerActivism fontSize="large" />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  Hỗ Trợ Cộng Đồng
                </Typography>
                <Typography variant="body1">
                  Chúng tôi xây dựng một cộng đồng hỗ trợ mạnh mẽ, nơi mọi người
                  có thể chia sẻ kinh nghiệm, thách thức và thành công trong
                  hành trình cai thuốc.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Paper
          elevation={3}
          sx={{ p: 4, mb: 8, borderRadius: 4, backgroundColor: "#f1f8e9" }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                color="#1b5e20"
                fontWeight="bold"
              >
                Lịch Sử Của Chúng Tôi
              </Typography>
              <Typography variant="body1" paragraph>
                QuitSmoke được thành lập bởi một nhóm các chuyên gia y tế và
                những người đã từng trải qua hành trình cai thuốc thành công.
                Chúng tôi bắt đầu như một dự án nhỏ nhưng đã nhanh chóng phát
                triển thành một tổ chức toàn diện.
              </Typography>
              <Typography variant="body1" paragraph>
                Trong những năm qua, chúng tôi đã giúp hàng nghìn người từ bỏ
                thói quen hút thuốc lá và tìm lại sức khỏe cũng như sự tự do.
                Chúng tôi không ngừng cải tiến phương pháp và mở rộng dịch vụ để
                đáp ứng nhu cầu ngày càng tăng.
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }} sx={{ textAlign: "center" }}>
              <Timeline sx={{ fontSize: 180, color: "#2e7d32" }} />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            color="#1b5e20"
            fontWeight="bold"
          >
            Đội Ngũ Của Chúng Tôi
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

          <Grid container spacing={4}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <Avatar
                  src={image1}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mt: 3,
                    border: "4px solid #4caf50",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    Nguyễn Văn An
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Giám đốc Y tế
                  </Typography>
                  <Typography variant="body2">
                    Với hơn 15 năm kinh nghiệm trong lĩnh vực y tế và cai
                    nghiện.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <Avatar
                  src={image2}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mt: 3,
                    border: "4px solid #4caf50",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    Trần Thị Bình
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Chuyên gia Tâm lý
                  </Typography>
                  <Typography variant="body2">
                    Chuyên gia tâm lý với 12 năm kinh nghiệm hỗ trợ cai nghiện.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <Avatar
                  src={image3}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mt: 3,
                    border: "4px solid #4caf50",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    Lê Văn Cường
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Cố vấn Dinh dưỡng
                  </Typography>
                  <Typography variant="body2">
                    Với 10 năm kinh nghiệm xây dựng chế độ ăn lành mạnh.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <Avatar
                  src={image4}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mt: 3,
                    border: "4px solid #4caf50",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    Phạm Thị Duyên
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Điều phối viên Cộng đồng
                  </Typography>
                  <Typography variant="body2">
                    8 năm kinh nghiệm tổ chức và quản lý các chương trình cộng
                    đồng.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Diversity3 sx={{ fontSize: 80, color: "#2e7d32", mb: 2 }} />
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            color="#1b5e20"
            fontWeight="bold"
          >
            Tham Gia Cùng Chúng Tôi
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Hãy trở thành một phần của cộng đồng QuitSmoke và bắt đầu hành trình
            hướng tới một cuộc sống khỏe mạnh hơn, không có thuốc lá. Chúng tôi
            luôn sẵn sàng đồng hành cùng bạn trong mỗi bước đi.
          </Typography>
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
            Đăng Ký Tư Vấn Miễn Phí
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;
