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
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </Box>
  );
}
