
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getStageById, deleteStageApi } from "../../../store/slices/stagesSlice";

export default function StageListDialog({
  open,
  setOpen,
  planId,
  onEditStage,
}) {
  const dispatch = useDispatch();
  const { stages, isLoading: isStageLoading, isError: stageError } = useSelector(
    (state) => state.stages
  );
  const [stageToDelete, setStageToDelete] = useState(null);

  useEffect(() => {
    if (open && planId) {
      dispatch(getStageById({ id: planId, page: 1, limit: 100 }))
        .unwrap()
        .catch((error) => {
          toast.error(
            "Không thể tải danh sách giai đoạn: " +
              (error.message || "Lỗi không xác định")
          );
        });
    }
  }, [open, planId, dispatch]);

  const handleDeleteStage = async () => {
    if (stageToDelete) {
      try {
        await dispatch(deleteStageApi({ id: stageToDelete._id })).unwrap();
        toast.success("Xóa giai đoạn thành công");
        // Refresh stages
        if (planId) {
          await dispatch(getStageById({ id: planId, page: 1, limit: 100 })).unwrap();
        }
      } catch (error) {
        toast.error(
          "Xóa giai đoạn thất bại: " + (error.message || "Lỗi không xác định")
        );
      } finally {
        setStageToDelete(null);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Danh sách giai đoạn</DialogTitle>
        <DialogContent>
          {isStageLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
            >
              <CircularProgress />
              <Typography ml={2}>Đang tải danh sách giai đoạn...</Typography>
            </Box>
          ) : stageError ? (
            <Typography color="error">
              Lỗi: {stageError.message || "Không thể tải danh sách giai đoạn"}
            </Typography>
          ) : !Array.isArray(stages) || stages.length === 0 ? (
            <Typography>Không có giai đoạn nào cho kế hoạch này</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>Thứ tự</TableCell>
                    <TableCell>Tên giai đoạn</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Thời gian giai đoạn</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stages.map((stage) => (
                    <TableRow key={stage._id}>
                       <TableCell>{stage.order_index}</TableCell>
                      <TableCell>{stage.stage_name}</TableCell>
                      <TableCell>{stage.description}</TableCell>
                      <TableCell>{stage.duration}</TableCell>
                    
                      <TableCell>
                        <Chip
                          label={
                            stage.status === "draft"
                              ? "Nháp"
                              : stage.status === "active"
                              ? "Đang hoạt động"
                              : "Hoàn thành"
                          }
                          color={
                            stage.status === "draft"
                              ? "default"
                              : stage.status === "active"
                              ? "primary"
                              : "secondary"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => onEditStage(stage)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => setStageToDelete(stage)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!stageToDelete}
        onClose={() => setStageToDelete(null)}
        aria-labelledby="confirm-delete-stage-dialog-title"
      >
        <DialogTitle id="confirm-delete-stage-dialog-title">
          Xác nhận xóa giai đoạn
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa giai đoạn "{stageToDelete?.stage_name}"? Hành động
            này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageToDelete(null)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteStage} color="error" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
