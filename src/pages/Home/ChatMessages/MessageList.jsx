import { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        p: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: "flex",
            justifyContent: message.isOwn ? "flex-end" : "flex-start",
            mb: 1,
          }}
        >
          <Paper
            sx={{
              p: 1.5,
              maxWidth: "70%",
              backgroundColor: message.isOwn ? "primary.main" : "white",
              color: message.isOwn ? "white" : "text.primary",
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "right",
                mt: 0.5,
                opacity: 0.7,
              }}
            >
              {message.timestamp}
            </Typography>
          </Paper>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}
