import { Box } from "@mui/material";
import ContactList from "./ContactList";
import ChatArea from "./ChatArea";
import { useChat } from "./hooks/useChat";

export default function ChatApp() {
  const {
    contacts,
    setContacts,
    selectedContact,
    setSelectedContact,
    currentContact,
    currentMessages,
    handleSendMessage,
    isLoading,
    isError,
    errorMessage,
  } = useChat();

  // Thêm xử lý trạng thái loading và error
  if (isLoading) {
    return <Box>Đang tải...</Box>;
  }

  if (isError) {
    return <Box>Lỗi: {errorMessage}</Box>;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "row",
        zIndex: 1100,
        overflow: "hidden",
      }}
    >
      <ContactList
        contacts={contacts}
        selectedContact={selectedContact}
        onContactSelect={setSelectedContact}
        onContactUpdate={setContacts}
      />
      <ChatArea
        contact={currentContact}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
      />
    </Box>
  );
}
