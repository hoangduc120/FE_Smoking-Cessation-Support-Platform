import { Box, Avatar, Typography, IconButton } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

export default function ChatHeader({ contact }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        position: "sticky", // Cố định ChatHeader ở đầu ChatArea
        top: 0, // Đặt ở đỉnh của container cha
        zIndex: 1050, // Dưới ChatPage (zIndex: 1100) và Header chính (zIndex: 1200)
      }}
    >
      <Avatar src={contact?.avatar} sx={{ mr: 2 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{contact?.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {contact?.isOnline ? "Đang hoạt động" : "Không hoạt động"}
        </Typography>
      </Box>
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
}
