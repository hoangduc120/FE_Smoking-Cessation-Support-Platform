import React, { useState } from "react";
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
} from "@mui/material";
import "./UpgradeMember.css";

const UpgradeMember = () => {
  const [value, setValue] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardSelect = (index) => {
    setSelectedCard(index);
  };

  const plans = [
    {
      title: "3 Months",
      price: "299,000₫",
      decrision: "Dành cho người mới bắt đầu",
      savings: "Save 15%",
      features: [
        "Early access to new features",
        "Priority customer support",
        "Access to premium content",
        "Daily member updates",
      ],
      buttonText: "Choose Plan",
    },
    {
      title: "6 Months",
      price: "499,000₫",
      decrision: "Dành cho người quyết tâm",
      savings: "Save 20%",
      features: [
        "Extend membership for 3 months",
        "Priority customer support",
        "Access to premium content",
        "Health check with nutrition advice",
      ],
      buttonText: "Choose Plan",
      highlighted: true,
    },
    {
      title: "1 Year",
      price: "799,000₫",
      decrision: "Dành cho người cam kết lâu dài",
      savings: "Save 25%",
      features: [
        "Extend membership for 6 months",
        "VIP priority support",
        "Early access to new features",
        "Health check with nutrition advice",
        "24/7 premium member support",
      ],
      buttonText: "Choose",
    },
  ];

  const comparisonData = [
    {
      feature: "Theo dõi tình trạng chi tiết",
      "3 Months": true,
      "6 Months": true,
      "1 Year": true,
    },
    {
      feature: "Thông báo động viên",
      "3 Months": true,
      "6 Months": true,
      "1 Year": true,
    },
    {
      feature: "Tham gia cộng đồng hỗ trợ",
      "3 Months": true,
      "6 Months": true,
      "1 Year": true,
    },
    {
      feature: "Tư vấn với huấn luyện viên",
      "3 Months": "2 buổi/tháng",
      "6 Months": "Không giới hạn",
      "1 Year": "Không giới hạn (VIP)",
    },
    {
      feature: "Kế hoạch cá thực cơ bản hóa",
      "3 Months": "Cơ bản",
      "6 Months": "Nâng cao",
      "1 Year": "Chuyên sâu",
    },
    {
      feature: "Báo cáo sức khỏe",
      "3 Months": "Hàng tháng",
      "6 Months": "Hàng tuần",
      "1 Year": "Hàng ngày",
    },
    {
      feature: "Truy cập khóa học",
      "3 Months": "Cơ bản",
      "6 Months": "Nâng cao",
      "1 Year": "Tất cả (bao gồm độc quyền)",
    },
    {
      feature: "Hỗ trợ",
      "3 Months": "Giờ hành chính",
      "6 Months": "Giờ hành chính",
      "1 Year": "24/7",
    },
    {
      feature: "Ưu tiên phản hồi",
      "3 Months": "-",
      "6 Months": "-",
      "1 Year": true,
    },
  ];

  return (
    <div className="subscription-container">
      <Typography variant="h4" gutterBottom>
        Nâng Cấp Gói Thành Viên
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Chọn gói thành viên phù hợp với nhu cầu của bạn
      </Typography>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Gói thành viên" />
          <Tab label="So sánh tính năng" />
        </Tabs>
      </Box>

      {value === 0 ? (
        <div className="plans-container">
          {plans.map((plan, index) => (
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
                    gutterBottom
                    sx={{ fontSize: "12px", color: "#737577" }}
                  >
                    {plan.decrision}
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
                    gutterBottom
                    sx={{
                      width: "100px",
                      height: "20px",
                      border: "1px solid #737577",
                      borderRadius: "10px",
                    }}
                  >
                    {plan.savings}
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
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
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
                <TableCell align="center">Gói 3 tháng</TableCell>
                <TableCell align="center">Gói 6 tháng</TableCell>
                <TableCell align="center">Gói 1 năm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonData.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>{info.feature}</TableCell>
                  <TableCell align="center">
                    {info["3 Months"] === true ? (
                      <span className="check-mark">✓</span>
                    ) : (
                      info["3 Months"]
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {info["6 Months"] === true ? (
                      <span className="check-mark">✓</span>
                    ) : (
                      info["6 Months"]
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {info["1 Year"] === true ? (
                      <span className="check-mark">✓</span>
                    ) : (
                      info["1 Year"]
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {value === 0 && (
        <Button variant="contained" className="continue-button">
          Tiếp tục thanh toán
        </Button>
      )}
    </div>
  );
};

export default UpgradeMember;
