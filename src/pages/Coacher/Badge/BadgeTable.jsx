import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
  Stack,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import BadgeDialog from "./BadgeDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchBadgesByPlan } from "../../../store/slices/badgeSlice";
import { fetchAllPlan } from "../../../store/slices/planeSlice";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import "./BadgeTable.css";

export default function BadgeTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    badges,
    isLoading: badgesLoading,
    isError: badgesError,
  } = useSelector((state) => state.badge);
  const {
    plans,
    isLoading: plansLoading,
    isError: plansError,
  } = useSelector((state) => state.plan);
  const auth = useSelector((state) => state.auth);
  const coachId = auth?.currentUser?.user?.id;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    if (!auth?.currentUser) {
      navigate(PATH.LOGIN);
    } else if (coachId) {
      console.log("Fetching plans with coachId:", coachId);
      dispatch(fetchAllPlan({ coachId, page: 1, limit: 1000 }));
    } else {
      console.warn("coachId is undefined, cannot fetch plans.");
    }
  }, [auth, coachId, dispatch, navigate]);

  const handleViewBadges = (planId) => {
    setSelectedPlanId(planId);
    dispatch(fetchBadgesByPlan({ quitPlanId: planId, page: 1, limit: 10 }));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPlanId(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Phân trang
  const filteredPlans = plans?.data || [];
  const totalPlans = filteredPlans.length;
  const totalPages = Math.ceil(totalPlans / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (!auth?.currentUser) {
    return null;
  }

  return (
    <div className="badge-containers">
      <div className="badge-title">
        <h1>Quản lý huy hiệu</h1>
        <Button
          variant="contained"
          className="badge-add-button"
          onClick={handleOpenDialog}
        >
          Thêm huy hiệu
        </Button>
      </div>
      <TableContainer component={Paper} className="badge-table-container">
        <Table>
          <TableHead>
            <TableRow className="badge-table-header">
              <TableCell>Tên kế hoạch</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plansLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="badge-table-cell">
                  Đang tải kế hoạch...
                </TableCell>
              </TableRow>
            ) : plansError ? (
              <TableRow>
                <TableCell colSpan={3} className="badge-table-cell badge-error">
                  Lỗi:{" "}
                  {plansError.message || "Không thể tải danh sách kế hoạch"}
                </TableCell>
              </TableRow>
            ) : !currentPlans || currentPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="badge-table-cell">
                  Không có kế hoạch nào
                </TableCell>
              </TableRow>
            ) : (
              currentPlans.map((plan) => (
                <TableRow key={plan._id} className="badge-table-row">
                  <TableCell className="badge-table-cell">
                    {plan.title}
                  </TableCell>
                  <TableCell className="badge-table-cell">
                    {plan.reason}
                  </TableCell>
                  <TableCell className="badge-table-cell">
                    <IconButton onClick={() => handleViewBadges(plan._id)}>
                      <VisibilityIcon className="badge-icon" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* Modal hiển thị badges */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="badge-modal">
          <div className="badge-modal-header">
            <h2>Danh sách huy hiệu</h2>
            <button className="badge-modal-close" onClick={handleCloseModal}>
              ×
            </button>
          </div>
          <div className="badge-modal-content">
            {badgesLoading ? (
              <p className="badge-modal-loading">Đang tải huy hiệu...</p>
            ) : badgesError ? (
              <p className="badge-modal-error">
                Lỗi: {badgesError.message || "Không thể tải huy hiệu"}
              </p>
            ) : !badges || badges.length === 0 ? (
              <p className="badge-modal-empty">Không có huy hiệu nào</p>
            ) : (
              <div className="badge-modal-grid">
                {badges.map((badge) => (
                  <div key={badge._id} className="badge-card">
                    {badge.icon_url ? (
                      <img
                        src={badge.icon_url}
                        alt={badge.name}
                        className="badge-card-icon"
                      />
                    ) : (
                      <img
                        src="/fallback-badge.png"
                        alt="Default Badge"
                        className="badge-card-icon"
                      />
                    )}
                    <h3 className="badge-card-title">{badge.name}</h3>
                    <p className="badge-card-description">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Box>
      </Modal>

      <BadgeDialog
        open={openDialog}
        setOpen={setOpenDialog}
        plans={plans?.data || []}
      />
    </div>
  );
}
