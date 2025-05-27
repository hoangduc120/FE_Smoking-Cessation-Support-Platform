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
  MenuItem,
} from "@mui/material";
import "./UpgradeMember.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembership } from "../../../store/slices/membershipSlice";

const UpgradeMember = () => {
  const dispatch = useDispatch();
  const { membershipData, isLoading, isError, errorMessage } = useSelector(
    (state) => state.membership
  );

  const [value, setValue] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showNoSelectionError, setShowNoSelectionError] = useState(false);

  // Gọi API khi component được tải
  useEffect(() => {
    dispatch(fetchMembership());
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardSelect = (index) => {
    setSelectedCard(index);
    setShowNoSelectionError(false); // Xóa lỗi khi chọn gói
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
  };

  const handleConfirm = () => {
    if (selectedCard !== null && plans[selectedCard]) {
      console.log("Gói được xác nhận:", plans[selectedCard]);
      // TODO: Thêm logic gọi API hoặc xử lý xác nhận ở đây, ví dụ:
      // dispatch(fetchMembershipById(plans[selectedCard]._id));
    }
    setOpenModal(false);
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
          <Tabs value={value} onChange={handleChange} centered>
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
            Lỗi:{" "}
            {errorMessage?.message ||
              errorMessage ||
              "Không thể tải dữ liệu gói thành viên."}
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
                      className="plan-card"
                      onClick={() => handleCardSelect(index)}
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
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                          >
                            {plan.title}
                          </Typography>
                          <Typography
                            variant="h5"
                            color="black"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                          >
                            {plan.price}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
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
                            <Typography
                              className="selected-text"
                              variant="body2"
                              color="white"
                            >
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

        {/* Modal hiển thị chi tiết gói */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Xác Nhận Gói Thành Viên
            </Typography>
            {selectedCard !== null && plans[selectedCard] ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Gói thành viên: {plans[selectedCard].title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Giá: {plans[selectedCard].price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Thời gian: {plans[selectedCard].duration}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Các tính năng:
                </Typography>
                <MenuItem sx={{ display: "block" }}>
                  {plans[selectedCard].features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </MenuItem>
              
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button variant="outlined" onClick={handleCloseModal}>
                    Hủy
                  </Button>
                  <Button variant="contained" onClick={handleConfirm} sx={{ backgroundColor: "black", color: "white" }}>
                    Xác nhận
                  </Button>
                </Box>
              </>
            ) : (
              <Typography>Không có gói nào được chọn.</Typography>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default UpgradeMember;
