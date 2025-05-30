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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembership } from "../../../store/slices/membershipSlice";
import "./UpgradeMember.css";

// Bank data with image URLs (using placeholder CDN images for demo)
const bankOptions = [
  {
    value: "VNPay",
    name: "VNPay",
    logo: "https://cdn.pixabay.com/photo/2016/03/31/22/18/image-1298140_1280.png",
  },
  {
    value: "MoMo",
    name: "MoMo",
    logo: "https://cdn.pixabay.com/photo/2016/03/31/22/18/image-1298140_1280.png",
  },
];

const UpgradeMember = () => {
  const dispatch = useDispatch();
  const { membershipData, isLoading, isError, errorMessage } = useSelector(
    (state) => state.membership
  );


  const user = useSelector((state) => state.user) || {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
  };

  const info = user.user

  const [value, setValue] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showNoSelectionError, setShowNoSelectionError] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    dispatch(fetchMembership());
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
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
  };

  const handleConfirm = () => {
    if (selectedCard !== null && plans[selectedCard] && selectedBank) {
      console.log("Xác nhận thanh toán:", {
        user,
        plan: plans[selectedCard],
        paymentMethod: selectedBank.name,
      });
      // TODO: Thêm logic gọi API để xử lý thanh toán
    }
    setOpenModal(false);
    setSelectedBank(null);
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
    <Box className="homePage">
      <Box className="subscription-container">
        <Typography variant="h4" gutterBottom>
          Nâng Cấp Gói Thành Viên
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Chọn gói thành viên phù hợp với nhu cầu của bạn
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange} centered className="tabs">
            <Tab label="Gói thành viên" />
            <Tab label="So sánh tính năng" />
          </Tabs>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            Lỗi: {errorMessage?.message || errorMessage || "Không thể tải dữ liệu gói thành viên."}
          </Typography>
        ) : (
          <>
            {showNoSelectionError && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Vui lòng chọn một gói trước khi tiếp tục thanh toán.
              </Alert>
            )}
            {value === 0 ? (
              <div className="plans-container">
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <Card
                      key={index}
                      className={`plan-card ${selectedCard === index ? "highlighted" : ""}`}
                      onClick={() => handleCardSelect(index)}
                      sx={{
                        borderRadius: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            height: "100%",
                          }}
                        >
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            {plan.title}
                          </Typography>
                          <Typography variant="h5" color="black" gutterBottom sx={{ fontWeight: "bold" }}>
                            {plan.price}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {plan.duration}
                          </Typography>
                        </Box>
                        {selectedCard === index && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "0",
                              left: "0",
                              width: "80px",
                              height: "20px",
                              backgroundColor: "black",
                              borderBottomRightRadius: "8px",
                            }}
                          >
                            <Typography className="selected-text" variant="body2" color="white">
                              Đã chọn
                            </Typography>
                          </Box>
                        )}
                        <ul className="features-list">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>
                              <span className="check-mark">✓</span> {feature}
                            </li>
                          ))}
                        </ul>
                        <Button variant="contained" className="choose-button">
                          Chọn
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography align="center" sx={{ mt: 4 }}>
                    Không có gói thành viên nào để hiển thị.
                  </Typography>
                )}
              </div>
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
                              {info[plan.title] ? <span className="check-mark">✓</span> : "-"}
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

            {value === 0 && plans.length > 0 && (
              <Button
                variant="contained"
                className="continue-button"
                onClick={handleOpenModal}
              >
                Tiếp tục thanh toán
              </Button>
            )}
          </>
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
            {selectedCard !== null && plans[selectedCard] ? (
              <div className="modal-content-wrapper">
                <div className="modal-info-column">
                  <Box className="modal-info-section">
                    <Typography className="modal-info-title">Thông tin người dùng</Typography>
                    <Typography className="modal-info">Họ tên: {info.userName}</Typography>
                    <Typography className="modal-info">Email: {info.email}</Typography>
                    <Typography className="modal-info">
                      Số điện thoại: {info.phone}
                    </Typography>
                  </Box>

                  <Box className="modal-info-section">
                    <Typography className="modal-info-title">Thông tin gói</Typography>
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
                  </Box>
                </div>

                <div className="modal-bank-column">
                  <Box className="modal-info-section">
                    <Typography className="modal-info-title">
                      Chọn phương thức thanh toán
                    </Typography>
                    <div className="bank-grid">
                      {bankOptions.map((bank) => (
                        <div
                          key={bank.value}
                          className={`bank-option ${
                            selectedBank?.value === bank.value ? "bank-option-selected" : ""
                          }`}
                          onClick={() => handleSelectBank(bank)}
                        >
                          <img
                            src={bank.logo}
                            alt={bank.name}
                            className="bank-logo"
                          />
                          <Typography className="bank-name">{bank.name}</Typography>
                        </div>
                      ))}
                    </div>
                  </Box>
                </div>
              </div>
            ) : (
              <Typography>Không có thông tin để xác nhận.</Typography>
            )}
            <Box className="modal-buttons">
              <Button
                variant="outlined"
                className="modal-cancel-button"
                onClick={handleCloseModal}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                className="modal-confirm-button"
                onClick={handleConfirm}
                disabled={!selectedBank}
              >
                Xác nhận
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default UpgradeMember;