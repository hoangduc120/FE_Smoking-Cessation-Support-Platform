import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  Email,
  Phone,
  Chat,
  SmokeFree,
} from "@mui/icons-material";

const QuitSmokeFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        bgcolor: "#2e7d32",
        color: "white",
        py: 4,
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Contact Information - Left Side */}
          <Grid item xs={12} md={3}>
            <Box mb={2} display="flex" alignItems="center">
              <Chat sx={{ mr: 1, color: "#4caf50", fontSize: 18 }} />
              <Typography variant="body2">Trò chuyện để được hỗ trợ</Typography>
            </Box>

            <Box mb={2} display="flex" alignItems="center">
              <Phone sx={{ mr: 1, color: "#4caf50", fontSize: 18 }} />
              <Typography variant="body2">1 (800) QUIT-NOW</Typography>
            </Box>

            <Box mb={2} display="flex" alignItems="center">
              <Email sx={{ mr: 1, color: "#4caf50", fontSize: 18 }} />
              <Typography variant="body2">support@quitsmoke.com</Typography>
            </Box>
          </Grid>

          {/* Solutions Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography
              variant="h6"
              color="#4caf50"
              fontWeight="bold"
              mb={2}
              fontSize="1rem"
            >
              Giải pháp
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {[
                "Kế hoạch bỏ thuốc cá nhân",
                "Thay thế nicotine",
                "Nhóm hỗ trợ",
                "Hỗ trợ qua ứng dụng",
                "Tư vấn chuyên nghiệp",
                "Chương trình sức khỏe",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  color="inherit"
                  underline="none"
                  variant="body2"
                  sx={{
                    "&:hover": { color: "#4caf50" },
                    fontSize: "0.875rem",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Company Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography
              variant="h6"
              color="#4caf50"
              fontWeight="bold"
              mb={2}
              fontSize="1rem"
            >
              Công ty
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {[
                "Về chúng tôi",
                "Cơ hội nghề nghiệp",
                "Câu chuyện thành công",
                "Liên hệ",
                "Pháp lý",
                "Tài liệu báo chí",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  color="inherit"
                  underline="none"
                  variant="body2"
                  sx={{
                    "&:hover": { color: "#4caf50" },
                    fontSize: "0.875rem",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Resources Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography
              variant="h6"
              color="#4caf50"
              fontWeight="bold"
              mb={2}
              fontSize="1rem"
            >
              Tài nguyên
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {[
                "Blog",
                "Sách điện tử",
                "Kho kiến thức",
                "Đánh giá khách hàng",
                "Chương trình cộng tác viên",
                "Đối tác chiến lược",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  color="inherit"
                  underline="none"
                  variant="body2"
                  sx={{
                    "&:hover": { color: "#4caf50" },
                    fontSize: "0.875rem",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Social Media Icons */}
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent={isMobile ? "center" : "flex-end"}
          >
            <Box display="flex" gap={1}>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "#4caf50" } }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "#4caf50" } }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "#4caf50" } }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "#4caf50" } }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "#4caf50" } }}
              >
                <YouTube fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Bottom Section */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item display="flex" alignItems="center">
            <SmokeFree sx={{ mr: 1, color: "#4caf50", fontSize: 20 }} />
            <Typography variant="body2">Được hỗ trợ bởi QuitSmoke</Typography>
          </Grid>
          <Grid item>
            <Link
              href="#"
              color="inherit"
              underline="none"
              sx={{ "&:hover": { color: "#4caf50" } }}
            >
              <Typography variant="body2">
                Bắt đầu hành trình không thuốc lá hôm nay
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default QuitSmokeFooter;
