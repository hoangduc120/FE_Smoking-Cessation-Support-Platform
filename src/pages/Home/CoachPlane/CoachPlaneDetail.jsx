import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./CoachPlaneDetail.css";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StairsIcon from "@mui/icons-material/Stairs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsightsIcon from "@mui/icons-material/Insights";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

import { getStageById } from "../../../store/slices/stagesSlice";
import CreateStageDialog from "../../Coacher/PlanManagementPage/CreateStageDialog";
import { format, differenceInDays, parse } from "date-fns";
import { fetchPlanById, selectPlan } from "../../../store/slices/planeSlice";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading/Loading";

export default function CoachPlaneDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plan, isLoading, isError, errorMessage } = useSelector(
    (state) => state.plan
  );
  const {
    stages,
    isLoading: isStageLoading,
    isError: stageError,
  } = useSelector((state) => state.stages);
  const auth = useSelector((state) => state.auth);
  const coach = auth?.currentUser?.user;

  const [openStageDialog, setOpenStageDialog] = useState(false);
  const [stageToEdit, setStageToEdit] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessageModal, setErrorMessageModal] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          await dispatch(fetchPlanById({ id })).unwrap();
          await dispatch(getStageById({ id, page: 1, limit: 100 })).unwrap();
        } catch (error) {
          console.error('Error fetching data:', error);
          // Xử lý lỗi ở đây
        }
      };
      fetchData();
    }
  }, [dispatch, id]);





  const handleRegisterPlan = () => {
    if (plan?.quitPlan?._id) {
      setIsRegistering(true); 
      dispatch(selectPlan({ quitPlanId: plan.quitPlan._id }))
        .unwrap()
        .then(() => {
          toast.success("Đăng ký kế hoạch thành công!");
          setIsRegistering(false); 
          navigate("/roadmap"); 
        })
        .catch((error) => {
          setIsRegistering(false);
          const errorMsg = error?.message || "Đã có lỗi xảy ra!";
          setErrorMessageModal(errorMsg);
          setOpenErrorModal(true);
        });
    } else {
      console.log("plan.quitPlan._id is undefined or null");
      setErrorMessageModal("Không tìm thấy ID kế hoạch!");
      setOpenErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
    navigate("/coachPlan");
  };

  // Xử lý trạng thái đang đăng ký
  if (isRegistering) {
    return (
      <Box className="homePage">
        <Typography>Đang xử lý đăng ký...</Typography>
      </Box>
    );
  }

  // Xử lý trạng thái đang tải
  if (isLoading ) {
    return (
      <Box className="homePage">
        <Typography><Loading /></Typography>
      </Box>
    );
  }

  // Xử lý lỗi tải dữ liệu
  if (isError && !openErrorModal && !isLoading) {
    return (
      <Box className="homePage">
        <Typography color="error">
          {errorMessage || "Có lỗi xảy ra khi tải dữ liệu!"}
        </Typography>
      </Box>
    );
  }

  // Xử lý trường hợp không tìm thấy kế hoạch
  if (!plan || !plan.quitPlan) {
    return (
      <Box className="homePage">
        <Typography>Không tìm thấy kế hoạch!</Typography>
      </Box>
    );
  }

  const totalStages = stages?.length || 0;

  return (
    <Box className="homePage">
      <Dialog open={openErrorModal} onClose={handleCloseErrorModal}>
        <DialogTitle>Lỗi đăng ký kế hoạch</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessageModal}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorModal} color="primary">
            Quay lại
          </Button>
        </DialogActions>
      </Dialog>

      <Box className="CoachPlaneDetail">
        <Grid container spacing={8}>
          <Grid item size={8} md={6}>
            <Box className="CoachPlaneDetail-content">
              <Box className="CoachPlaneDetail-content-title">
                <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                  {plan.quitPlan.title}
                </Typography>
                <span style={{ color: "#767676" }}>{plan.quitPlan.reason}</span>
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
                    <StairsIcon sx={{ color: "#e8bb4b" }} />
                    {totalStages} giai đoạn
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    <CalendarMonthIcon sx={{ color: "#e66f51" }} />
                    {plan.quitPlan.duration} ngày
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    <InsightsIcon sx={{ color: "#2a9d8e" }} />
                   Mục tiêu: {plan.quitPlan.targetCigarettesPerDay || 98} điếu
                  </Typography>
                </Box>
                <Box className="CoachPlaneDetail-steps">
                  {stages && stages.length > 0 ? (
                    stages.map((stage, index) => (
                      <Accordion
                        key={stage._id}
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
                            <StairsIcon sx={{ color: "#479062" }} />
                            {stage.stage_name}
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
                                <strong>Thời gian: </strong>
                                 {stage.duration} Ngày
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
                                <strong>Chi tiết: </strong> {stage.description}
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
                                <strong>Mục tiêu: </strong>
                                {stage.targetCigarettesPerDay || 98} điếu
                             
                              </Typography>
                            </MenuItem>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Typography>
                      Không có giai đoạn nào trong kế hoạch!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item size={4} md={6}>
            <Box className="CoachPlaneDetail-image">
              <img
                src={plan.quitPlan.image || "https://cdn2.tuoitre.vn/zoom/700_525/tto/i/s626/2014/02/17/Jq0uXJ0R.jpg"}
                alt={plan.quitPlan.title || "Kế hoạch"}
                style={{ width: "100%", height: "300px", objectFit: "contain" }}
              />
              <Box className="CoachPlaneDetail-image-text">
                <Button
                  className="btn-apply"
                  onClick={handleRegisterPlan}
                  disabled={isLoading || isRegistering || !plan?.quitPlan?._id}
                >
                  Đăng ký ngay
                </Button>
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
                    {plan?.quitPlan?.coachId?.userName || "N/A"}
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
                    <StairsIcon
                      sx={{ color: "#e8bb4b", paddingRight: "10px" }}
                    />
                    Tổng số giai đoạn: {totalStages}
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
                    <CalendarMonthIcon
                      sx={{ color: "#e66f51", paddingRight: "10px" }}
                    />
                    Thời gian lộ trình: {plan.quitPlan.duration} ngày
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
                    <InsightsIcon
                      sx={{ color: "#2a9d8e", paddingRight: "10px" }}
                    />
                    Mục tiêu: {plan.quitPlan.targetCigarettesPerDay || 98} 
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <CreateStageDialog
        open={openStageDialog}
        setOpen={setOpenStageDialog}
        plans={{ data: [plan.quitPlan] }}
        isLoading={isLoading}
        stageToEdit={stageToEdit}
      />
    </Box>
  );
}