import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import image from "../../../assets/pngtree-leaf-icon-png-image_4816090.png";
import "./HomePage.css";

export default function HomePage() {
  // Sample data for carousel cards with avatars
  const testimonials = [
    {
      quote:
        "QuitSmoke đã thay đổi cuộc sống của tôi. Sau 15 năm hút thuốc, tôi đã cai được 6 tháng và cảm thấy khỏe mạnh hơn bao giờ hết",
      author: "Perilys",
      avatar: "../../../assets/avatars/perilys.png",
    },
    {
      quote:
        "Tính năng theo dõi tiền tiết kiệm đã thực sự tạo động lực cho tôi. Tôi đã tiết kiệm được hơn 18 triệu đồng sau 1 năm không hút thuốc!",
      author: "Charlotte",
      avatar: "../../../assets/avatars/charlotte.png",
    },
    {
      quote:
        "Cộng đồng hỗ trợ trên QuitSmoke thật tuyệt vời. Mỗi khi tôi cảm thấy muốn quay lại hút thuốc, tôi đều nhận được sự động viên từ mọi người.",
      author: "Damien",
      avatar: "../../../assets/avatars/damien.png",
    },
    {
      quote:
        "Ứng dụng này giúp tôi có động lực bằng những lời nhắc nhở và mẹo hàng ngày. Nó đã thay đổi cuộc chơi đối với sức khỏe của tôi!",
      author: "Sophie",
      avatar: "../../../assets/avatars/sophie.png",
    },
    {
      quote:
        "Tôi thích khía cạnh cộng đồng; cảm giác như tôi không đơn độc trong hành trình này.",
      author: "Alex",
      avatar: "../../../assets/avatars/alex.png",
    },
    {
      quote:
        "Việc theo dõi tiến trình của mình khiến việc cai thuốc trở nên dễ dàng và bổ ích hơn rất nhiều.",
      author: "Emma",
      avatar: "../../../assets/avatars/emma.png",
    },
  ];

  // Sample data for features (unchanged)
  const features = [
    {
      title: "Theo dõi tiến trình",
      description: "Ghi lại từng bước trong hành trình cai thuốc lá của bạn.",
    },
    {
      title: "Hỗ trợ cộng đồng",
      description:
        "Kết nối với những người cùng mục tiêu để động viên lẫn nhau.",
    },
    {
      title: "Mẹo hàng ngày",
      description: "Nhận gợi ý và chiến lược để vượt qua cơn thèm thuốc.",
    },
    {
      title: "Thống kê sức khỏe",
      description: "Xem cải thiện sức khỏe qua các số liệu trực quan.",
    },
    {
      title: "Kế hoạch cá nhân",
      description: "Tùy chỉnh kế hoạch cai thuốc phù hợp với bạn.",
    },
    {
      title: "Thưởng thành tích",
      description: "Nhận huy hiệu khi đạt các cột mốc quan trọng.",
    },
  ];

  return (
    <>
    <Box className="homePage">
      <Box className="banner">
        <Box sx={{ marginTop: "70px" }}>
          <Box>
            <Typography className="girdLeft__title">
              Bắt đầu hành trình <br />
              <span style={{ color: "#1aa146" }}>cai thuốc lá</span> của bạn
            </Typography>
          </Box>
          <Box>
            <Typography className="girdLeft__content">
              Theo dõi tiến trình, nhận hỗ trợ và khám phá một cuộc
              <br /> sống khỏe mạnh hơn không có thuốc lá với QuitSmoke.
            </Typography>
          </Box>
          <Box className="girdLeft__button">
            <Button className="button_start">Bắt đầu miễn phí</Button>
            <Button className="button__more">Tìm hiểu thêm</Button>
          </Box>
        </Box>

        <Box className="banner_girdRight">
          <img src={image} alt="hình ảnh" />
        </Box>
      </Box>

      <Box className="feature">
        <Box className="featute__title">
          <Typography variant="h4" sx={{ marginLeft: "22%", color: "#209d4b" }}>
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
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <CardActionArea
                    sx={{
                      alignItems: "center",
                      textAlign: "center",
                      height: "150px",
                      "&[data-active]": {
                        backgroundColor: "action.selected",
                        "&:hover": {
                          backgroundColor: "action.selectedHover",
                        },
                      },
                    }}
                  >
                    <CardContent>
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

      {/* Carousel Section */}
      <Box sx={{ textAlign: "center", padding: "40px 150px" }}>
        <Typography
          variant="h4"
          sx={{ color: "#209d4b", marginBottom: "20px" }}
        >
          Ứng dụng cai thuốc lá được thiết kế dành cho bạn và cùng bạn!
        </Typography>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={3}
          // pagination={{ clickable: true }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Card
                sx={{
                  width: 400,
                  height: 350,
                  padding: "20px",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        position: "relative",
                        minHeight: "120px", 
                        "&:before": {
                          content: '"“"',
                          color: "#1aa146",
                          fontSize: "2rem",
                          position: "absolute",
                          left: "-20px",
                          top: "-10px",
                        },
                        "&:after": {
                          content: '"”"',
                          color: "#1aa146",
                          fontSize: "2rem",
                          position: "absolute",
                          right: "-20px",
                          bottom: "-10px",
                        },
                      }}
                    >
                      {testimonial.quote}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <img
                      src={testimonial.avatar}
                      alt={`${testimonial.author} avatar`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "#209d4b" }}>
                      {testimonial.author}
                    </Typography>
                  </Box>
                  <Button
                    variant="text"
                    sx={{
                      color: "#1aa146",
                      marginTop: "10px",
                      alignSelf: "center",
                    }}
                  >
                    Read more
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
    <Box className="quit-smoking-banner">
      <Typography variant="h4" className="quit-smoking-banner-title">
        Bắt đầu hành trình cai thuốc lá ngay hôm nay
      </Typography>
      <Typography variant="body1" className="quit-smoking-banner-description">
        Đăng ký miễn phí và tham gia cùng hàng ngàn người dùng trên toàn cầu để
        <br /> cải thiện sức khỏe và cuộc sống không khói thuốc.
      </Typography>
      <Box className="quit-smoking-banner-buttons">
        <Button variant="contained" className="quit-smoking-banner-button register">
          Đăng ký ngay
        </Button>
        <Button variant="outlined" className="quit-smoking-banner-button learn">
          Tìm hiểu thêm
        </Button>
      </Box>
    </Box>
    </>
  );
}
