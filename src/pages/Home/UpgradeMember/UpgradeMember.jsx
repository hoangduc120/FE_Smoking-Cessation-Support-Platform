import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Modal,
  Alert,
  LinearProgress,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembership } from "../../../store/slices/membershipSlice";
import { createPaymentUrl, clearPaymentState } from "../../../store/slices/paymentSlice";
import "./UpgradeMember.css";
import { fetchUser } from "../../../store/slices/userSlice";
import PaymentService from "../../../services/paymentService";

// Bank data with image URLs (using placeholder CDN images for demo)
const bankOptions = [
  {
    value: "VNPay",
    name: "VNPay",
    logo: "https://yt3.googleusercontent.com/JM1m2wng0JQUgSg9ZSEvz7G4Rwo7pYb4QBYip4PAhvGRyf1D_YTbL2DdDjOy0qOXssJPdz2r7Q=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    value: "MoMo",
    name: "MoMo",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s",
  },
];

const UpgradeMember = () => {
  const dispatch = useDispatch();
  const { membershipData } = useSelector((state) => state.membership);
  const { isLoading: paymentLoading, isError: paymentError, errorMessage: paymentErrorMessage } = useSelector((state) => state.payment);

  const user = useSelector((state) => state.user);
  const info = user.user;

  const [value, setValue] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [step, setStep] = useState(1);
  const [showNoSelectionError, setShowNoSelectionError] = useState(false);

  useEffect(() => {
    dispatch(fetchMembership());
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    // Clear payment state khi component unmount
    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardSelect = (index) => {
    setSelectedCard(index);
    setShowNoSelectionError(false);
  };

  const handleOpenModal = () => {
    if (selectedCard === null) {
      setShowNoSelectionError(true);
    } else {
      setOpenModal(true);
      setShowNoSelectionError(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBank(null);
    setStep(1);
    dispatch(clearPaymentState()); // Clear payment state khi đóng modal
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleConfirm = async () => {
    if (selectedCard !== null && plans[selectedCard] && selectedBank && membershipData) {
      try {
        const selectedPlan = membershipData[selectedCard];

        // Dispatch action để tạo payment URL
        const result = await dispatch(createPaymentUrl({
          memberShipPlanId: selectedPlan._id,
          paymentMethod: selectedBank.value, // "VNPay" hoặc "MoMo"
          amount: selectedPlan.price
        })).unwrap();

        // Nếu thành công, redirect đến payment gateway
        if (result.paymentUrl) {
          PaymentService.redirectToPayment(result.paymentUrl);
        }
      } catch (error) {
        console.error("Payment error:", error);
        // Error sẽ được hiển thị thông qua Redux state
      }
    }
    setOpenModal(false);
    setSelectedBank(null);
    setStep(1);
  };

  const plans = Array.isArray(membershipData)
    ? membershipData.map((plan) => ({
      title: plan.name,
      price: `${plan.price.toLocaleString()}₫`,
      duration: `${plan.duration} ngày`,
      features: plan.features || [],
    }))
    : [];

  const comparisonData = Array.isArray(membershipData)
    ? Array.from(
      new Set(membershipData.flatMap((plan) => plan.features || []))
    ).map((feature) => {
      const row = { feature };
      membershipData.forEach((plan) => {
        row[plan.name] = (plan.features || []).includes(feature);
      });
      return row;
    })
    : [];

  return (
    <Box className="upgrade-root">
      {/* Banner đầu trang */}
      <Box className="main-banner">
        <Box className="banner-icon-wrap">
          <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="Heart" className="main-banner-icon" />
        </Box>
        <Typography className="main-banner-title" variant="h2">Hành Trình Cai Thuốc Lá</Typography>
        <Typography className="main-banner-desc" variant="h5">
          Bắt đầu cuộc sống khỏe mạnh với sự hỗ trợ chuyên nghiệp và công nghệ tiên tiến
        </Typography>
        <Box className="main-banner-benefits">
          <Box className="benefit-item"><span className="benefit-icon">✔</span> Tỷ lệ thành công 85%</Box>
          <Box className="benefit-item"><span className="benefit-icon">🛡️</span> Phương pháp khoa học</Box>
          <Box className="benefit-item"><span className="benefit-icon">📈</span> Theo dõi sức khỏe 24/7</Box>
        </Box>
      </Box>
      {/* Section: Tại Sao Chọn Chúng Tôi */}
      <Box className="why-choose-section">
        <Typography className="why-choose-title" variant="h4">Tại Sao Chọn Chúng Tôi?</Typography>
        <Typography className="why-choose-desc">Phương pháp cai thuốc lá khoa học, an toàn và hiệu quả được hàng nghìn người tin tưởng</Typography>
        <Box className="why-choose-cards">
          <Box className="why-card">
            <div className="why-card-icon"><img src="https://cdn-icons-png.flaticon.com/512/3208/3208720.png" alt="Tâm lý học" /></div>
            <div className="why-card-title">Tâm Lý Học Ứng Dụng</div>
            <div className="why-card-desc">Phương pháp dựa trên nghiên cứu tâm lý học để thay đổi thói quen</div>
          </Box>
          <Box className="why-card">
            <div className="why-card-icon"><img src="https://cdn-icons-png.flaticon.com/512/2920/2920256.png" alt="Theo dõi sức khỏe" /></div>
            <div className="why-card-title">Theo Dõi Sức Khỏe</div>
            <div className="why-card-desc">Giám sát sự phục hồi của cơ thể theo thời gian thực</div>
          </Box>
          <Box className="why-card">
            <div className="why-card-icon"><img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="Cộng đồng hỗ trợ" /></div>
            <div className="why-card-title">Cộng Đồng Hỗ Trợ</div>
            <div className="why-card-desc">Kết nối với những người cùng hành trình và chuyên gia</div>
          </Box>
        </Box>
      </Box>
      {/* Section: Gói thành viên */}
      <Box className="subscription-container">
        <Tabs value={value} onChange={handleChange} centered className="tabs">
          <Tab label="Gói Hỗ Trợ" />
          <Tab label="So Sánh" />
        </Tabs>
        {showNoSelectionError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Vui lòng chọn một gói trước khi tiếp tục thanh toán.
          </Alert>
        )}
        {paymentError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {paymentErrorMessage || "Có lỗi xảy ra khi xử lý thanh toán"}
          </Alert>
        )}
        {value === 0 ? (
          <Box className="plans-section">
            <Grid container spacing={4} className="plans-container" justifyContent="center">
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      className={`plan-card ${selectedCard === index ? "highlighted" : ""} ${index === 1 ? "popular" : ""}`}
                      onClick={() => handleCardSelect(index)}
                    >
                      {index === 1 && <div className="popular-badge">🌟 Được Chọn Nhiều Nhất</div>}
                      <CardContent>
                        <Box className="plan-icon-wrap">
                          <img src={index === 0 ? "https://cdn-icons-png.flaticon.com/512/2910/2910791.png" : index === 1 ? "https://cdn-icons-png.flaticon.com/512/2910/2910788.png" : "https://cdn-icons-png.flaticon.com/512/2910/2910782.png"} alt="icon" className="plan-icon" />
                        </Box>
                        <Typography className="plan-title">{plan.title}</Typography>
                        <Typography className="plan-price">{plan.price}<span className="plan-duration"> /{plan.duration}</span></Typography>
                        <ul className="features-list">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}><span className="check-mark">✓</span> {feature}</li>
                          ))}
                        </ul>
                        <Button
                          variant="contained"
                          className={`choose-button ${selectedCard === index ? "chosen" : ""}`}
                          disabled={selectedCard === index}
                        >
                          {selectedCard === index ? "✓ Đã Chọn" : "Chọn Gói Này"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography align="center" sx={{ mt: 4 }}>
                  Không có gói thành viên nào để hiển thị.
                </Typography>
              )}
            </Grid>
            <Button
              variant="contained"
              className="continue-button"
              onClick={handleOpenModal}
              disabled={plans.length === 0}
            >
              Bắt Đầu Hành Trình
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              So Sánh Tính Năng Các Gói
            </Typography>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Tính năng</TableCell>
                  {plans.map((plan, index) => (
                    <TableCell key={index} align="center">
                      {plan.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonData.length > 0 ? (
                  comparisonData.map((info, index) => (
                    <TableRow key={index}>
                      <TableCell>{info.feature}</TableCell>
                      {plans.map((plan, idx) => (
                        <TableCell key={idx} align="center">
                          {info[plan.title] ? (
                            <span className="check-mark">✓</span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={plans.length + 1} align="center">
                      Không có tính năng nào để so sánh.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Single Payment Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
        >
          <Box className="modal-content">
            <Typography id="modal-title" className="modal-title">
              Xác Nhận Thanh Toán
            </Typography>
            <Typography className="modal-step">Bước {step} / 3</Typography>
            <Box className="modal-progress">
              <LinearProgress
                variant="determinate"
                value={(step / 3) * 100}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#1c9f47",
                  },
                }}
              />
            </Box>

            {step === 1 && (
              <Box className="modal-info-section">
                <Typography className="modal-info-title">
                  Thông tin người dùng
                </Typography>
                <Typography className="modal-info">
                  Họ tên: {info?.userName}
                </Typography>
                <Typography className="modal-info">
                  Email: {info?.email}
                </Typography>
                <Typography className="modal-info">
                  Số điện thoại: {info?.phone}
                </Typography>
              </Box>
            )}

            {step === 2 && selectedCard !== null && plans[selectedCard] && (
              <Box className="modal-info-section">
                <Typography className="modal-info-title">
                  Thông tin gói & Phương thức thanh toán
                </Typography>
                <Typography className="modal-info">
                  Gói thành viên: {plans[selectedCard].title}
                </Typography>
                <Typography className="modal-info">
                  Giá: {plans[selectedCard].price}
                </Typography>
                <Typography className="modal-info">
                  Thời gian: {plans[selectedCard].duration}
                </Typography>
                <Typography className="modal-info">Các tính năng:</Typography>
                <ul className="modal-features">
                  {plans[selectedCard].features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="check-mark">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Typography className="modal-info-title" sx={{ mt: 2 }}>
                  Chọn phương thức thanh toán
                </Typography>
                <div className="bank-grid">
                  {bankOptions.map((bank) => (
                    <div
                      key={bank.value}
                      className={`bank-option ${selectedBank?.value === bank.value
                        ? "bank-option-selected"
                        : ""
                        }`}
                      onClick={() => handleSelectBank(bank)}
                    >
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="bank-logo"
                      />
                      <Typography
                        className={`bank-name ${selectedBank?.value === bank.value ? "bank-name-selected" : ""}`}
                      >
                        {bank.name}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Box>
            )}

            {step === 3 &&
              selectedCard !== null &&
              plans[selectedCard] &&
              selectedBank && (
                <Box className="step3-container">
                  <Card className="step3-card">
                    <CardContent>
                      <Typography className="step3-card-title">
                        Thông tin người dùng
                      </Typography>
                      <Typography className="step3-card-text">
                        Họ tên: {info.userName || "Không có dữ liệu"}
                      </Typography>
                      <Typography className="step3-card-text">
                        Email: {info.email || "Không có dữ liệu"}
                      </Typography>
                      <Typography className="step3-card-text">
                        Số điện thoại: {info.phone || "Không có dữ liệu"}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className="step3-card">
                    <CardContent>
                      <Typography className="step3-card-title">
                        Thông tin gói thành viên
                      </Typography>
                      <Typography className="step3-card-text">
                        Gói: {plans[selectedCard].title}
                      </Typography>
                      <Typography className="step3-card-text">
                        Giá: {plans[selectedCard].price}
                      </Typography>
                      <Typography className="step3-card-text">
                        Thời gian: {plans[selectedCard].duration}
                      </Typography>
                      <Typography className="step3-card-text">
                        Tính năng:
                      </Typography>
                      <ul className="modal-features">
                        {plans[selectedCard].features.map((feature, idx) => (
                          <li key={idx}>
                            <span className="check-mark">✓</span> {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="step3-card">
                    <CardContent>
                      <Typography className="step3-card-title">
                        Phương thức thanh toán
                      </Typography>
                      <Typography className="step3-card-text">
                        Phương thức: {selectedBank.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}

            <Box className="modal-buttons">
              {step > 1 && (
                <Button className="modal-back-button" onClick={handleBackStep}>
                  Quay lại
                </Button>
              )}
              <Button
                className="modal-cancel-button"
                onClick={handleCloseModal}
              >
                Hủy
              </Button>
              {step < 3 ? (
                <Button
                  className="modal-next-button"
                  onClick={handleNextStep}
                  disabled={step === 2 && !selectedBank}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  className="modal-confirm-button"
                  onClick={handleConfirm}
                  disabled={!selectedBank || paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </Button>
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default UpgradeMember;
