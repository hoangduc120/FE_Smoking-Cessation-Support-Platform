import { Box } from "@mui/material";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatArea({ contact, messages, onSendMessage }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ChatHeader contact={contact} />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto", // Cho phép cuộn nội dung
          backgroundColor: "#f5f5f5", // Đồng nhất nền với MessageList
        }}
      >
        <MessageList messages={messages} />
      </Box>
      <MessageInput onSendMessage={onSendMessage} />
    </Box>
  );
}
