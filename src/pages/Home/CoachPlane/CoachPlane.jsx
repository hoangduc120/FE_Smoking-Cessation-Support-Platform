import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchPlan } from "../../../store/slices/planeSlice";
import { Link } from "react-router-dom";

const CoachPlane = () => {
  const dispatch = useDispatch();
  const { plans, isLoading, isError, errorMessage } = useSelector(
    (state) => state.plane
  );

  console.log("mockCoachPlans", plans);

  useEffect(() => {
    dispatch(fetchPlan());
  }, [dispatch]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSuccess, setFilterSuccess] = useState("all");

  const filteredPlans = plans
    .flatMap((coach) => coach.plans)
    .filter(
      (plan) =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterSuccess === "all" ||
          (filterSuccess === "high" && plan.successRate >= 80) ||
          (filterSuccess === "low" && plan.successRate < 80))
    );

  const getCoachInfo = (plan) => {
    const coach = plans.find((c) => c.plans.some((p) => p.id === plan.id));
    return coach || { name: "Không xác định", specialty: "Không xác định" };
  };

  if (isLoading) return <Typography>Đang tải...</Typography>;
  if (isError)
    return (
      <Typography color="error">{errorMessage || "Có lỗi xảy ra!"}</Typography>
    );

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
          className="planeCoach-filterButton"
          sx={{
            backgroundColor:
              filterSuccess === "all" ? "#4CAF50" : "transparent",
            color: filterSuccess === "all" ? "#fff" : "#000",
            borderColor: "#4CAF50",
            "&:hover": {
              backgroundColor: filterSuccess === "all" ? "#45a049" : "#e8f5e9",
              borderColor: "#4CAF50",
              color: filterSuccess === "all" ? "#fff" : "#000",
            },
          }}
        >
          Tất cả
        </Button>
        <Button
          variant={filterSuccess === "high" ? "contained" : "outlined"}
          onClick={() => setFilterSuccess("high")}
          startIcon={<FilterListIcon />}
          className="planeCoach-filterButton"
          sx={{
            backgroundColor:
              filterSuccess === "high" ? "#4CAF50" : "transparent",
            color: filterSuccess === "high" ? "#fff" : "#000",
            borderColor: "#4CAF50",
            "&:hover": {
              backgroundColor: filterSuccess === "high" ? "#45a049" : "#e8f5e9",
              borderColor: "#4CAF50",
              color: filterSuccess === "high" ? "#fff" : "#000",
            },
          }}
        >
          Thành công cao (&gt;80%)
        </Button>
        <Button
          variant={filterSuccess === "low" ? "contained" : "outlined"}
          onClick={() => setFilterSuccess("low")}
          startIcon={<FilterListIcon />}
          sx={{
            backgroundColor:
              filterSuccess === "low" ? "#4CAF50" : "transparent",
            color: filterSuccess === "low" ? "#fff" : "#000",
            borderColor: "#4CAF50",
            "&:hover": {
              backgroundColor: filterSuccess === "low" ? "#45a049" : "#e8f5e9",
              color: filterSuccess === "low" ? "#fff" : "#000",
            },
          }}
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
                  <Box
                    className="planeCoach-description"
                    color="text.secondary"
                  >
                    {plan.description}
                  </Box>

                  <Button
                    variant="text"
                    color="primary"
                    className="planeCoach-viewButton"
                    component={Link}
                    to={`/coachPlane/${plan.id}`}
                    sx={{
                      backgroundColor: "#357a2f",
                      color: "#fff",
                      width: "200px",
                    }}
                  >
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
