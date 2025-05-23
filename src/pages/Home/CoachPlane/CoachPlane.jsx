import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./CoachPlane.css";

// Dữ liệu giả
const mockCoachPlans = {
  coaches: [
    {
      id: 1,
      name: "Huấn Luyện Viên Minh",
      specialty: "Tư vấn bỏ thuốc lá lâu năm",
      plans: [
        {
          id: 1,
          title: "Kế hoạch 7 ngày giảm dần",
          description:
            "Giảm số điếu thuốc từ 10 xuống 0 trong 7 ngày với hỗ trợ tâm lý.",
          steps: [
            {
              step: 1,
              task: "Giảm 2 điếu/ngày, tập hít thở sâu",
              duration: "Ngày 1-2",
            },
            {
              step: 2,
              task: "Thay thế bằng kẹo cao su nicotine",
              duration: "Ngày 3-4",
            },
            {
              step: 3,
              task: "Tham gia nhóm hỗ trợ trực tuyến",
              duration: "Ngày 5-7",
            },
          ],
          targetSavings: 500000,
          successRate: 75,
          thumbnail:
            "https://img.baobacgiang.vn/Medias/2023/11/30/09/20231130094256-15.jpg",
        },
        {
          id: 2,
          title: "Kế hoạch 30 ngày thay đổi thói quen",
          description:
            "Thay đổi lối sống và loại bỏ thuốc lá hoàn toàn trong 1 tháng.",
          steps: [
            {
              step: 1,
              task: "Xác định nguyên nhân hút thuốc",
              duration: "Tuần 1",
            },
            { step: 2, task: "Tập thể dục 30 phút/ngày", duration: "Tuần 2-3" },
            {
              step: 3,
              task: "Đánh giá tiến độ với huấn luyện viên",
              duration: "Tuần 4",
            },
          ],
          targetSavings: 2000000,
          successRate: 85,
          thumbnail: "https://via.placeholder.com/150x100?text=Plan+30+Days",
        },
      ],
    },
    {
      id: 2,
      name: "Huấn Luyện Viên Lan",
      specialty: "Chuyên gia tâm lý bỏ thuốc",
      plans: [
        {
          id: 3,
          title: "Kế hoạch 14 ngày giải tỏa căng thẳng",
          description:
            "Sử dụng kỹ thuật thiền và tư vấn để giảm căng thẳng không cần thuốc.",
          steps: [
            {
              step: 1,
              task: "Thực hành thiền 10 phút/ngày",
              duration: "Ngày 1-5",
            },
            { step: 2, task: "Ghi nhật ký cảm xúc", duration: "Ngày 6-10" },
            {
              step: 3,
              task: "Họp với huấn luyện viên",
              duration: "Ngày 11-14",
            },
          ],
          targetSavings: 1000000,
          successRate: 70,
          thumbnail: "https://via.placeholder.com/150x100?text=Plan+14+Days",
        },
      ],
    },
  ],
};

const CoachPlane = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSuccess, setFilterSuccess] = useState("all");

  const filteredPlans = mockCoachPlans.coaches
    .flatMap((coach) => coach.plans)
    .filter(
      (plan) =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterSuccess === "all" ||
          (filterSuccess === "high" && plan.successRate >= 80) ||
          (filterSuccess === "low" && plan.successRate < 80))
    );

  const getCoachInfo = (plan) => {
    const coach = mockCoachPlans.coaches.find((c) =>
      c.plans.some((p) => p.id === plan.id)
    );
    return coach || { name: "Không xác định", specialty: "Không xác định" };
  };

  return (
    <Box className="homePage">
      <Box className="planeCoach-headerSection">
        <Box>
          <Typography variant="h4">Kế hoạch bỏ thuốc lá</Typography>
          <Typography variant="body1">
            Tìm kiếm và lọc các kế hoạch bỏ thuốc lá từ các huấn luyện viên
            chuyên nghiệp.
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm kế hoạch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          className="planeCoach-searchBar"
        />
      </Box>
      <Box className="planeCoach-filterButtons">
        <Button
          variant={filterSuccess === "all" ? "contained" : "outlined"}
          onClick={() => setFilterSuccess("all")}
          startIcon={<FilterListIcon />}
        >
          Tất cả
        </Button>
        <Button
          variant={filterSuccess === "high" ? "contained" : "outlined"}
          onClick={() => setFilterSuccess("high")}
          startIcon={<FilterListIcon />}
        >
          Thành công cao (&gt;80%)
        </Button>
        <Button
          variant={filterSuccess === "low" ? "contained" : "outlined"}
          onClick={() => setFilterSuccess("low")}
          startIcon={<FilterListIcon />}
        >
          Thành công thấp (&lt;80%)
        </Button>
      </Box>
      <Box className="planeCoach-container">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const coach = getCoachInfo(plan);
            return (
              <Card key={plan.id} className="planeCoach-planCard">
                <CardMedia
                  component="img"
                  className="planeCoach-planImage"
                  image={plan.thumbnail}
                  alt={plan.title}
                />
                <CardContent className="planeCoach-planContent">
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "25px", fontWeight: "bold" }}
                  >
                    {plan.title}
                    {coach.specialty}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {coach.name}
                  </Typography>
                  <Box className="planeCoach-description">
                    {plan.description}
                  </Box>

                  <Button variant="text" color="primary">
                    Xem thêm
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography variant="body1">Không tìm thấy kế hoạch nào.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CoachPlane;
