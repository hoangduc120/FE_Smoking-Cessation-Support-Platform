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
import { styled } from "@mui/material/styles";
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

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#1b5e20",
  color: "white",
  padding: theme.spacing(10, 0),
  textAlign: "center",
  borderRadius: "0 0 50% 50% / 10%",
  marginBottom: theme.spacing(6),
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[10],
  },
}));

const TimelineCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid #2e7d32`,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateX(10px)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#e8f5e9",
  color: "#1b5e20",
  fontWeight: "bold",
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const Benefits = () => {
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
            Lợi Ích Cai Thuốc Lá
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            Khám phá những thay đổi tích cực đến với cơ thể và cuộc sống của bạn
            khi từ bỏ thuốc lá
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
            Bắt đầu hành trình cai thuốc
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
            Lợi Ích Sức Khỏe
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
            <Grid item xs={12} md={4}>
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <BenefitCard elevation={3}>
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <Favorite sx={{ fontSize: 60, color: "#2e7d32", mb: 2 }} />
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Cải Thiện Tim Mạch
                    </Typography>
                    <Typography variant="body1">
                      Chỉ sau 20 phút cai thuốc, nhịp tim và huyết áp của bạn
                      bắt đầu trở về mức bình thường. Sau 1 năm, nguy cơ mắc
                      bệnh tim mạch giảm một nửa so với người hút thuốc.
                    </Typography>
                  </CardContent>
                </BenefitCard>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={4}>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <BenefitCard elevation={3}>
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <LocalHospital
                      sx={{ fontSize: 60, color: "#2e7d32", mb: 2 }}
                    />
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Giảm Nguy Cơ Ung Thư
                    </Typography>
                    <Typography variant="body1">
                      Cai thuốc lá giúp giảm đáng kể nguy cơ mắc các bệnh ung
                      thư liên quan đến thuốc lá như ung thư phổi, ung thư
                      miệng, ung thư thực quản và nhiều loại ung thư khác.
                    </Typography>
                  </CardContent>
                </BenefitCard>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={4}>
              <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                <BenefitCard elevation={3}>
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <Spa sx={{ fontSize: 60, color: "#2e7d32", mb: 2 }} />
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Phục Hồi Phổi
                    </Typography>
                    <Typography variant="body1">
                      Sau 2-12 tuần cai thuốc, chức năng phổi được cải thiện,
                      giúp bạn dễ dàng hít thở và vận động. Các triệu chứng như
                      ho, khó thở và nhiễm trùng đường hô hấp cũng giảm đáng kể.
                    </Typography>
                  </CardContent>
                </BenefitCard>
              </Zoom>
            </Grid>
          </Grid>
        </Box>

        <Paper
          elevation={3}
          sx={{ p: 4, mb: 8, borderRadius: 4, backgroundColor: "#f1f8e9" }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            color="#1b5e20"
            fontWeight="bold"
            align="center"
          >
            Lợi Ích Theo Thời Gian
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

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Timeline sx={{ fontSize: 60, color: "#2e7d32", mr: 2 }} />
            <Typography variant="h5" component="h3" color="#2e7d32">
              Hành trình phục hồi của cơ thể sau khi cai thuốc lá
            </Typography>
          </Box>

          <Fade in={true}>
            <Box>
              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  20 phút sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Nhịp tim và huyết áp giảm xuống mức bình thường. Nhiệt độ của
                  bàn tay và bàn chân tăng lên mức bình thường.
                </Typography>
              </TimelineCard>

              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  8-12 giờ sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Nồng độ carbon monoxide trong máu giảm xuống mức bình thường.
                  Nồng độ oxy trong máu tăng lên mức bình thường.
                </Typography>
              </TimelineCard>

              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  24-48 giờ sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Nguy cơ đau tim bắt đầu giảm. Các dây thần kinh bắt đầu tái
                  sinh. Khả năng ngửi và nếm thức ăn được cải thiện.
                </Typography>
              </TimelineCard>

              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  2-12 tuần sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Tuần hoàn máu cải thiện. Chức năng phổi tăng lên đến 30%. Đi
                  bộ trở nên dễ dàng hơn.
                </Typography>
              </TimelineCard>

              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  1-9 tháng sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Ho, nghẹt mũi và khó thở giảm. Phổi tăng khả năng tự làm sạch,
                  giảm nhiễm trùng. Mức năng lượng tổng thể tăng lên.
                </Typography>
              </TimelineCard>

              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  1 năm sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Nguy cơ mắc bệnh tim mạch vành giảm một nửa so với người hút
                  thuốc.
                </Typography>
              </TimelineCard>

              <TimelineCard elevation={2}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  color="#2e7d32"
                  fontWeight="bold"
                >
                  5-15 năm sau khi cai thuốc
                </Typography>
                <Typography variant="body1">
                  Nguy cơ đột quỵ giảm xuống tương đương với người không hút
                  thuốc. Nguy cơ ung thư miệng, họng và thực quản giảm một nửa.
                </Typography>
              </TimelineCard>
            </Box>
          </Fade>
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
            Lợi Ích Khác
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
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MonetizationOn
                      sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }}
                    />
                    <Typography
                      variant="h5"
                      component="h3"
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Lợi Ích Tài Chính
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Tiết kiệm đáng kể chi phí mua thuốc lá hàng ngày" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Giảm chi phí y tế và bảo hiểm sức khỏe" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Giảm chi phí vệ sinh, giặt giũ và khử mùi" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Tăng giá trị tài sản (nhà, xe) không bị ám mùi thuốc lá" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Psychology
                      sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }}
                    />
                    <Typography
                      variant="h5"
                      component="h3"
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Lợi Ích Tâm Lý
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Giảm căng thẳng và lo âu sau giai đoạn cai nghiện" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Tăng cường sự tự tin và lòng tự trọng" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Cải thiện tâm trạng và giảm nguy cơ trầm cảm" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Tự hào về thành tựu cai thuốc thành công" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Restaurant
                      sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }}
                    />
                    <Typography
                      variant="h5"
                      component="h3"
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Lợi Ích Cảm Quan
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Khứu giác được cải thiện đáng kể" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Vị giác trở nên nhạy bén hơn, thưởng thức thức ăn ngon hơn" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Hơi thở, tóc và quần áo không còn mùi thuốc lá" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Răng và móng tay không còn bị ố vàng" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SelfImprovement
                      sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }}
                    />
                    <Typography
                      variant="h5"
                      component="h3"
                      color="#2e7d32"
                      fontWeight="bold"
                    >
                      Lợi Ích Xã Hội
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Không còn bị hạn chế bởi các khu vực cấm hút thuốc" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Trở thành hình mẫu tích cực cho con cái và người thân" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Bảo vệ người thân khỏi tác hại của khói thuốc thụ động" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Cải thiện mối quan hệ với những người không hút thuốc" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            color="#1b5e20"
            fontWeight="bold"
          >
            Những Thay Đổi Bạn Sẽ Nhận Thấy
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

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <StyledChip label="Hơi thở thơm mát hơn" />
                <StyledChip label="Da dẻ hồng hào" />
                <StyledChip label="Tăng sức bền thể chất" />
                <StyledChip label="Ngủ ngon hơn" />
                <StyledChip label="Giảm ho và đờm" />
                <StyledChip label="Tăng khả năng tập trung" />
                <StyledChip label="Tăng cường miễn dịch" />
                <StyledChip label="Giảm nguy cơ nhiễm trùng" />
                <StyledChip label="Cải thiện tuần hoàn máu" />
                <StyledChip label="Tăng mức năng lượng" />
                <StyledChip label="Giảm nguy cơ bệnh nướu răng" />
                <StyledChip label="Cải thiện khả năng sinh sản" />
                <StyledChip label="Giảm nếp nhăn sớm" />
                <StyledChip label="Tăng tuổi thọ" />
                <StyledChip label="Cải thiện sức khỏe tình dục" />
              </Box>
            </Grid>
          </Grid>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: "#e8f5e9",
              textAlign: "center",
            }}
          >
            <AccessTime sx={{ fontSize: 60, color: "#2e7d32", mb: 2 }} />
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              color="#1b5e20"
              fontWeight="bold"
            >
              Không Bao Giờ Là Quá Muộn
            </Typography>
            <Typography variant="body1" paragraph>
              Bất kể bạn đã hút thuốc bao lâu, cơ thể của bạn sẽ bắt đầu phục
              hồi ngay từ khi bạn hút điếu thuốc cuối cùng. Nghiên cứu cho thấy
              cai thuốc ở bất kỳ độ tuổi nào đều mang lại lợi ích sức khỏe đáng
              kể.
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
              Bắt Đầu Hành Trình Cai Thuốc Ngay Hôm Nay
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Benefits;
