import { Box, Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import image from "../../../assets/pngtree-leaf-icon-png-image_4816090.png";
import "./HomePage.css";

export default function HomePage() {
  // Sample data for cards
  const features = [
    { title: "Theo dõi tiến trình", description: "Ghi lại từng bước trong hành trình cai thuốc lá của bạn." },
    { title: "Hỗ trợ cộng đồng", description: "Kết nối với những người cùng mục tiêu để động viên lẫn nhau." },
    { title: "Mẹo hàng ngày", description: "Nhận gợi ý và chiến lược để vượt qua cơn thèm thuốc." },
    { title: "Thống kê sức khỏe", description: "Xem cải thiện sức khỏe qua các số liệu trực quan." },
    { title: "Kế hoạch cá nhân", description: "Tùy chỉnh kế hoạch cai thuốc phù hợp với bạn." },
    { title: "Thưởng thành tích", description: "Nhận huy hiệu khi đạt các cột mốc quan trọng." },
  ];

  return (
    <Box className="homePage">
      <Box className="banner">
        <Box sx={{ marginTop: "70px" }}>
          <Box>
            <Typography className="girdLeft__title">
              Bắt đầu hành trình <br />
              <span style={{ color: "#1aa146" }}> cai thuốc lá</span> của bạn
            </Typography>
          </Box>
          <Box>
            <Typography className="girdLeft__content">
              Theo dõi tiến trình, nhận hỗ trợ và khám phá một cuộc
              <br /> sống khỏe mạnh hơn không có thuốc lá với QuitSmoke.
            </Typography>
          </Box>
          <Box className="girdLeft__button">
            <Button className="button_start"> Bắt đầu miễn phí</Button>
            <Button className="button__more">Tìm hiểu thêm</Button>
          </Box>
        </Box>

        <Box className="banner_girdRight">
          <img src={image} alt="hình ảnh" />
        </Box>
      </Box>

      <Box className="feature">
        <Box className="featute__title">
          <Typography variant="h4" sx={{ marginLeft: "22%", color:"#209d4b" }}>
            Tính năng nổi bật
          </Typography>
          <Typography sx={{ color: "#526467", marginTop: "10px" }}>
            QuitSmoke cung cấp đầy đủ công cụ để hỗ trợ bạn trong hành trình cai
            thuốc lá
          </Typography>
        </Box>
        <Box className="feature__card">
          <Grid container spacing={10}>
            {features.map((feature, index) => (
              <Grid item size={4} key={index}>
                <Card sx={{ height: "100%", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                  <CardActionArea
                    sx={{
                      alignItems:"center",
                      textAlign:"center",
                      height: "150px",
                      "&[data-active]": {
                        backgroundColor: "action.selected",
                        "&:hover": {
                          backgroundColor: "action.selectedHover",
                        },
                      },
                    }}
                  >
                    <CardContent >
                      <Typography variant="h5" component="div">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}