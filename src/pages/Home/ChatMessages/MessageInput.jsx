import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Input,
  Typography,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";

export default function MessageInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);

  const handleSendMessage = () => {
    if (newMessage.trim() || image) {
      onSendMessage({ text: newMessage, image });
      setNewMessage("");
      setImage(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton component="label">
          <AttachFileIcon />
          <Input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
        />
        <IconButton>
          <EmojiIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() && !image}
        >
          <SendIcon />
        </IconButton>
      </Box>
      {image && <Typography variant="caption">{image.name}</Typography>}
    </Paper>
  );
}
