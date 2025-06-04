import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../../../store/slices/chatSlice";

const MessageList = ({ messages }) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState(null);

  useEffect(() => {
    console.log("MessageList messages updated:", messages); // Debug
  }, [messages]);

  const handleOpenDialog = (messageId) => {
    console.log("Opening dialog for message id:", messageId);
    setMessageIdToDelete(messageId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessageIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (messageIdToDelete) {
      console.log("Deleting message with id:", messageIdToDelete);
      dispatch(deleteMessage(messageIdToDelete));
    }
    handleCloseDialog();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent: message.isOwn ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: message.isOwn ? "primary.main" : "grey.200",
                color: message.isOwn ? "white" : "black",
                p: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {message.text && <Typography>{message.text}</Typography>}
                {message.image && (
                  <Box sx={{ mt: message.text ? 1 : 0 }}>
                    <img
                      src={message.image}
                      alt="Message attachment"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        console.error("Failed to load image:", message.image);
                      }}
                    />
                  </Box>
                )}
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {message.timestamp}
                </Typography>
              </Box>
              {message.isOwn && (
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(message.id)}
                  sx={{ ml: 1, color: message.isOwn ? "white" : "inherit" }}
                  title="Delete message"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa tin nhắn"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessageList;
