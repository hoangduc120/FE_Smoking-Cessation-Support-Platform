import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./CoachPlaneDetail.css";
import { fetchPlan } from "../../../store/slices/planeSlice";
import LastPageIcon from "@mui/icons-material/LastPage";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StairsIcon from "@mui/icons-material/Stairs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsightsIcon from "@mui/icons-material/Insights";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

export default function CoachPlaneDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { plans, isLoading, isError, errorMessage } = useSelector(
    (state) => state.plane
  );

  useEffect(() => {
    dispatch(fetchPlan()); // Fetch all plans to search for the specific plan ID
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box className="homePage">
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="homePage">
        <Typography color="error">
          {errorMessage || "Có lỗi xảy ra khi tải kế hoạch!"}
        </Typography>
      </Box>
    );
  }

  // Find the coach and plan by plan.id
  const coach = Array.isArray(plans)
    ? plans.find((c) => c.plans.some((p) => p.id === parseInt(id)))
    : null;
  const plan = coach?.plans.find((p) => p.id === parseInt(id)) || null;

  if (!coach || !plan) {
    return (
      <Box className="homePage">
        <Typography>Không tìm thấy kế hoạch!</Typography>
      </Box>
    );
  }

  const totalSteps = plan.steps?.length || 0;

  return (
    <Box className="homePage">
      <Box className="CoachPlaneDetail">
        <Grid container spacing={8}>
          <Grid item size={8} md={6}>
            <Box className="CoachPlaneDetail-content">
              <Box className="CoachPlaneDetail-content-title">
                <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                  {plan.title}
                </Typography>
                <span style={{ color: "#767676" }}>{plan.description}</span>
              </Box>
              <Box className="CoachPlaneDetail-content-text">
                <Typography
                  variant="body1"
                  sx={{
                    marginBottom: "10px",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  Nội dung lộ trình
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    {" "}
                    <StairsIcon sx={{ color: "#e8bb4b" }} />
                    {totalSteps} bước
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    {" "}
                    <CalendarMonthIcon sx={{ color: "#e66f51" }} />
                    30 ngày
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    {" "}
                    <InsightsIcon sx={{ color: "#2a9d8e" }} />
                    98% thành công
                  </Typography>
                </Box>
                <Box className="CoachPlaneDetail-steps">
                  {plan.steps && plan.steps.length > 0 ? (
                    plan.steps.map((step, index) => (
                      <Accordion
                        key={index}
                        className="CoachPlaneDetail-accordion"
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${index}-content`}
                          id={`panel${index}-header`}
                        >
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "18px",
                            }}
                          >
                            {" "}
                            <LastPageIcon sx={{ color: "#479062" }} />
                            {step.step}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            component="ul"
                            sx={{ paddingLeft: 2, margin: 0 }}
                          >
                            <MenuItem>
                              <Typography
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <PlayCircleFilledIcon
                                  sx={{
                                    color: "#44b194",
                                    paddingRight: "10px",
                                  }}
                                />
                                <strong>Thời gian: </strong> {step.duration}
                              </Typography>
                            </MenuItem>
                            <MenuItem>
                              <Typography
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <PlayCircleFilledIcon
                                  sx={{
                                    color: "#44b194",
                                    paddingRight: "10px",
                                  }}
                                />
                                <strong>Chi tiết: </strong> {step.task}
                              </Typography>
                            </MenuItem>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Typography>Không có bước nào trong kế hoạch!</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item size={4} md={6}>
            <Box className="CoachPlaneDetail-image">
              <img
                src={plan.thumbnail || "https://via.placeholder.com/150"}
                alt={plan.title || "Kế hoạch"}
                style={{ width: "100%", height: "auto" }}
              />
              <Box className="CoachPlaneDetail-image-text">
                <Button className="btn-apply">Đăng ký ngay</Button>
                <Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    className="CoachPlaneDetail-image-text-title"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      lineHeight: "2.5",
                    }}
                  >
                    <PermIdentityIcon
                      sx={{ color: "#6967ac", paddingRight: "10px" }}
                    />
                    {coach.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      lineHeight: "2.5",
                    }}
                  >
                    {" "}
                    <StairsIcon
                      sx={{ color: "#e8bb4b", paddingRight: "10px" }}
                    />
                    Tổng số bước {totalSteps}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      lineHeight: "2.5",
                    }}
                  >
                    {" "}
                    <CalendarMonthIcon
                      sx={{ color: "#e66f51", paddingRight: "10px" }}
                    />
                    Thời gian lộ trình 30 ngày
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      lineHeight: "2.5",
                    }}
                  >
                    {" "}
                    <InsightsIcon
                      sx={{ color: "#2a9d8e", paddingRight: "10px" }}
                    />
                    Tỷ lệ thành công 98%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
