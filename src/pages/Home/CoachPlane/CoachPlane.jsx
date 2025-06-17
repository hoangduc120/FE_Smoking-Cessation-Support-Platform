import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./CoachPlane.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPlan } from "../../../store/slices/planeSlice";
import Loading from "../../../components/Loading/Loading";

const CoachPlane = () => {
  const dispatch = useDispatch();
  const { plans, isLoading, isError, errorMessage } = useSelector(
    (state) =>
      state.plan || {
        plans: { data: [] },
        isLoading: false,
        isError: false,
        errorMessage: "",
      }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchPlan({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredPlans = (plans?.data || []).filter(
    (plan) =>
      plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" || plan.status === filterStatus)
  );

  const totalPlans = filteredPlans.length;
  const totalPages = Math.ceil(totalPlans / pageSize);

  // Lấy dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (isLoading) return <Typography>
    <Loading />
  </Typography>;
  if (isError)
    return (
      <Typography color="error">{errorMessage || "Có lỗi xảy ra!"}</Typography>
    );
  if (!plans?.data || plans.data.length === 0)
    return <Typography>Không có kế hoạch nào.</Typography>;

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
          variant={filterStatus === "all" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("all")}
          startIcon={<FilterListIcon />}
          className="planeCoach-filterButton"
          sx={{
            backgroundColor: filterStatus === "all" ? "#4CAF50" : "transparent",
            color: filterStatus === "all" ? "#fff" : "#000",
            borderColor: "#4CAF50",
            "&:hover": {
              backgroundColor: filterStatus === "all" ? "#45a049" : "#e8f5e9",
              borderColor: "#4CAF50",
              color: filterStatus === "all" ? "#fff" : "#000",
            },
          }}
        >
          Tất cả
        </Button>
        <Button
          variant={filterStatus === "ongoing" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("ongoing")}
          startIcon={<FilterListIcon />}
          className="planeCoach-filterButton"
          sx={{
            backgroundColor:
              filterStatus === "ongoing" ? "#4CAF50" : "transparent",
            color: filterStatus === "ongoing" ? "#fff" : "#000",
            borderColor: "#4CAF50",
            "&:hover": {
              backgroundColor:
                filterStatus === "ongoing" ? "#45a049" : "#e8f5e9",
              borderColor: "#4CAF50",
              color: filterStatus === "ongoing" ? "#fff" : "#000",
            },
          }}
        >
          Đang hoạt động
        </Button>
        <Button
          variant={filterStatus === "template" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("template")}
          startIcon={<FilterListIcon />}
          sx={{
            backgroundColor:
              filterStatus === "template" ? "#4CAF50" : "transparent",
            color: filterStatus === "template" ? "#fff" : "#000",
            borderColor: "#4CAF50",
            "&:hover": {
              backgroundColor: filterStatus === "template" ? "#45a049" : "#e8f5e9",
              color: filterStatus === "template" ? "#fff" : "#000",
            },
          }}
        >
          Bản nháp
        </Button>
      </Box>
      <Box className="planeCoach-container">
        {currentPlans.map((plan) => (
          <Card key={plan._id} className="planeCoach-planCard">
            <CardMedia
              component="img"
              className="planeCoach-planImage"
              image={plan.image}
              alt={plan.title}
            />
            <CardContent className="planeCoach-planContent">
              <Typography
                variant="h6"
                sx={{ fontSize: "25px", fontWeight: "bold" }}
              >
                {plan.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Huấn luyện viên: {plan.coachId?.email || "Không xác định"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lý do: {plan.reason || "Không có lý do"}
              </Typography>
             <Typography variant="body2" color="text.secondary">
                Trạng thái:{" "}
                {plan.status === "ongoing" ? "Đang hoạt động" : "Bản nháp"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="planeCoach-viewButton"
                component={Link}
                to={`/coachPlane/${plan._id}`}
                sx={{
                  backgroundColor: "#357a2f",
                  color: "#fff",
                  width: "200px",
                  "&:hover": { backgroundColor: "#2e6b27" },
                }}
              >
                Xem thêm
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default CoachPlane;
