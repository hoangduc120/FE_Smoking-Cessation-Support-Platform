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
import image from "../../../assets/—Pngtree—no smoking and world tobacco_15200908.png";
import {
  Timeline,
  Group,
  Lightbulb,
  HealthAndSafety,
  Assignment,
  EmojiEvents,
} from "@mui/icons-material";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchAssessment,
  resetAssessmentData,
} from "../../../store/slices/quitSmokingSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlan } from "../../../store/slices/planeSlice";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentData, isLoading, isError, errorMessage } = useSelector(
    (state) => state.quitSmoking
  );

  const { plans } = useSelector((state) => state.plan);

  const plan = plans?.data;

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  useEffect(() => {
    if (!currentUser || !currentUser.token) {
      navigate(PATH.LOGIN);
      return;
    }
    dispatch(resetAssessmentData());

    dispatch(fetchAssessment(currentUser?.user?.id || "1"));

    dispatch(fetchPlan({ page: 1, limit: 10 }));
  }, [currentUser, dispatch, navigate]);

  const handleStart = () => {
    if (!currentUser || !currentUser.token) {
      toast.error("Vui lòng đăng nhập để tiếp tục!");
      navigate(PATH.LOGIN);
      return;
    }

    if (isLoading) {
      toast("Đang tải dữ liệu, vui lòng đợi...");
      return;
    }

    if (isError) {
      toast.error(`Lỗi: ${errorMessage || "Không thể tải dữ liệu khảo sát"}`);
      return;
    }

    const hasSurvey = assessmentData?.data?.length > 0;
    navigate(hasSurvey ? "/coachPlan" : PATH.COASHPLANE);
  };

  const features = [
    {
      title: "Theo dõi tiến trình",
      description: "Ghi lại từng bước trong hành trình cai thuốc lá của bạn.",
      icon: "Timeline",
      color: "#1aa146", // Primary green
    },
    {
      title: "Hỗ trợ cộng đồng",
      description:
        "Kết nối với những người cùng mục tiêu để động viên lẫn nhau.",
      icon: "Group",
      color: "#0288d1", // Blue
    },
    {
      title: "Mẹo hàng ngày",
      description: "Nhận gợi ý và chiến lược để vượt qua cơn thèm thuốc.",
      icon: "Lightbulb",
      color: "#f57c00", // Orange
    },
    {
      title: "Thống kê sức khỏe",
      description: "Xem cải thiện sức khỏe qua các số liệu trực quan.",
      icon: "HealthAndSafety",
      color: "#d81b60", // Pink
    },
    {
      title: "Kế hoạch cá nhân",
      description: "Tùy chỉnh kế hoạch cai thuốc phù hợp với bạn.",
      icon: "Assignment",
      color: "#7b1fa2", // Purple
    },
    {
      title: "Thưởng thành tích",
      description: "Nhận huy hiệu khi đạt các cột mốc quan trọng.",
      icon: "EmojiEvents",
      color: "#388e3c", // Darker green
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Đăng ký",
      description: "Tạo tài khoản và thiết lập thông tin cá nhân",
    },
    {
      number: "2",
      title: "Thiết lập mục tiêu",
      description: "Xác định mục tiêu cai thuốc lá của bạn",
    },
    {
      number: "3",
      title: "Theo dõi tiến trình",
      description: "Cập nhật và theo dõi tiến trình hằng ngày",
    },
    {
      number: "4",
      title: "Đạt được mục tiêu",
      description: "Nhận thành tựu và tận hưởng cuộc sống khỏe mạnh",
    },
  ];

  const faqData = [
    {
      question: "QuitSmoke có hoàn toàn miễn phí không?",
      answer:
        "QuitSmoke cung cấp phiên bản miễn phí với đầy đủ tính năng cơ bản. Chúng tôi cũng có phiên bản Premium với các tính năng nâng cao.",
    },
    {
      question: "Làm thế nào để bắt đầu quá trình cai thuốc lá?",
      answer:
        "Đăng ký tài khoản, thiết lập thông tin cá nhân và mục tiêu cai thuốc lá, sau đó bắt đầu theo dõi tiến trình của bạn.",
    },
    {
      question: "QuitSmoke có hỗ trợ cai thuốc lá điện tử không?",
      answer:
        "Có, QuitSmoke hỗ trợ cai thuốc lá truyền thống và thuốc lá điện tử. Bạn có thể tùy chỉnh loại thuốc lá trong phần cài đặt.",
    },
    {
      question: "Dữ liệu của tôi có được bảo mật không?",
      answer:
        "Chúng tôi cam kết bảo mật dữ liệu người dùng. Tất cả thông tin cá nhân đều được mã hóa và chỉ bạn mới có quyền truy cập.",
    },
    {
      question: "Tôi có thể kết nối với bác sĩ qua ứng dụng không?",
      answer:
        "Phiên bản Premium của QuitSmoke cung cấp tính năng tư vấn với các chuyên gia y tế về cai thuốc lá.",
    },
    {
      question: "Làm thế nào để vượt qua cơn thèm thuốc?",
      answer:
        "QuitSmoke cung cấp nhiều mẹo và kỹ thuật để vượt qua cơn thèm thuốc, cùng với công cụ theo dõi và phân tích cơn thèm.",
    },
  ];

  return (
    <>
      {" "}
      <Box className="homePage">
        {/* Banner Section */}
        <Box className="banner">
          <Box sx={{ marginTop: "70px" }}>
            <Typography className="girdLeft__title">
              Bắt đầu hành trình <br />
              <span style={{ color: "#1aa146" }}>cai thuốc lá</span> của bạn
            </Typography>
            <Typography className="girdLeft__content">
              Theo dõi tiến trình, nhận hỗ trợ và khám phá một cuộc
              <br /> sống khỏe mạnh hơn không có thuốc lá với QuitSmoke.
            </Typography>
            <Box className="girdLeft__button">
              <Button
                className="button_start"
                onClick={handleStart}
                disabled={isLoading}
              >
                Bắt đầu ngay
              </Button>
              <Button className="button__more">Tìm hiểu thêm</Button>
            </Box>
          </Box>
          <Box className="banner_girdRight">
            <img src={image} alt="hình ảnh" />
          </Box>
        </Box>

        {/* Steps Section */}
        <Box className="quit-container">
          <Typography
            variant="h4"
            className="quit-title"
            sx={{ fontWeight: "bold" }}
          >
            Cách thức hoạt động
          </Typography>
          <Typography variant="body1" className="quit-subtitle">
            QuitSmoke giúp bạn cai thuốc lá một cách hiệu quả thông qua 4 bước
            đơn giản
          </Typography>
          <Box className="steps-wrapper">
            {steps.map((step, index) => (
              <Box key={index} className="step-item">
                <Box className="step-circle">{step.number}</Box>
                {index !== steps.length - 1 && <div className="line" />}
                <Typography className="step-title">{step.title}</Typography>
                <Typography className="step-desc">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Features Section */}
        <Box className="feature">
          <Box className="featute__title">
            <Typography
              variant="h4"
              sx={{ marginLeft: "22%", color: "#1e1520", fontWeight: "bold" }}
            >
              Tính năng nổi bật
            </Typography>
            <Typography sx={{ color: "#526467", marginTop: "10px" }}>
              QuitSmoke cung cấp đầy đủ công cụ để hỗ trợ bạn trong hành trình
              cai thuốc lá
            </Typography>
          </Box>
          <Box className="feature__card">
            <Grid container spacing={10}>
              {features.map((feature, index) => (
                <Grid item size={4} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.07)",
                      },
                    }}
                  >
                    <CardActionArea
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        height: "100%",
                        padding: "20px",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        {feature.icon === "Timeline" && (
                          <Timeline
                            sx={{
                              fontSize: 40,
                              color: feature.color,
                              marginBottom: "10px",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        {feature.icon === "Group" && (
                          <Group
                            sx={{
                              fontSize: 40,
                              color: feature.color,
                              marginBottom: "10px",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        {feature.icon === "Lightbulb" && (
                          <Lightbulb
                            sx={{
                              fontSize: 40,
                              color: feature.color,
                              marginBottom: "10px",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        {feature.icon === "HealthAndSafety" && (
                          <HealthAndSafety
                            sx={{
                              fontSize: 40,
                              color: feature.color,
                              marginBottom: "10px",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        {feature.icon === "Assignment" && (
                          <Assignment
                            sx={{
                              fontSize: 40,
                              color: feature.color,
                              marginBottom: "10px",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        {feature.icon === "EmojiEvents" && (
                          <EmojiEvents
                            sx={{
                              fontSize: 40,
                              color: feature.color,
                              marginBottom: "10px",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{
                            color: feature.color,
                            fontWeight: "bold",
                            marginBottom: "10px",
                          }}
                        >
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
        <Box sx={{ textAlign: "center", padding: "150px 0px" }}>
          <Typography
            variant="h4"
            sx={{ color: "#211114", marginBottom: "20px", fontWeight: "bold" }}
          >
            Ứng dụng cai thuốc lá được thiết kế dành cho bạn và cùng bạn!
          </Typography>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={50}
            slidesPerView={3}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {plan?.map((plans, index) => (
              <SwiperSlide key={index}>
                <Card
                  sx={{
                    width: 400,
                    height: 350,
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <img
                      src={plans.image}
                      alt="Plan avatar"
                      style={{
            
                        width: "100%",
                        height: "200px",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "20px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          position: "relative",
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
                        {plans.reason}
                      </Typography>
                    </Box>
                    <Button
                      variant="text"
                      sx={{
                        color: "white",
                        marginTop: "10px",
                        alignSelf: "center",
                        backgroundColor: "#229c49",
                        width: "100%",
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;",
                      }}
                    >
                      <Link to={PATH.COASHPLANE}>Xem thêm</Link>
                    </Button>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
      {/* Quit Smoking Banner Section */}
      <Box className="quit-smoking-banner">
        <Typography variant="h4" className="quit-smoking-banner-title">
          Bắt đầu hành trình cai thuốc lá ngay hôm nay
        </Typography>
        <Typography variant="body1" className="quit-smoking-banner-description">
          Đăng ký miễn phí và tham gia cùng hàng ngàn người dùng trên toàn cầu
          để
          <br /> cải thiện sức khỏe và cuộc sống không khói thuốc.
        </Typography>
        <Box className="quit-smoking-banner-buttons">
          <Button
            variant="contained"
            className="quit-smoking-banner-button register"
          >
            Đăng ký ngay
          </Button>
          <Button
            variant="outlined"
            className="quit-smoking-banner-button learn"
          >
            Tìm hiểu thêm
          </Button>
        </Box>
      </Box>
      <Box>
        {/* FAQ Section */}
        <Box className="faq-container">
          <Typography
            variant="h4"
            className="faq-title"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Câu hỏi thường gặp
          </Typography>
          <Typography
            variant="body1"
            className="faq-subtitle"
            sx={{ marginBottom: "50px" }}
          >
            Giải đáp những thắc mắc phổ biến về QuitSmoke và quá trình cai thuốc
            lá
          </Typography>
          <Box className="faq-grid">
            {faqData.map((item, index) => (
              <Box key={index} className="faq-item">
                <Typography
                  className="faq-question"
                  sx={{ fontWeight: "bold", marginBottom: "10px" }}
                >
                  {item.question}
                </Typography>
                <Typography
                  className="faq-answer"
                  sx={{ fontSize: "15px", color: "#828795" }}
                >
                  {item.answer}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
