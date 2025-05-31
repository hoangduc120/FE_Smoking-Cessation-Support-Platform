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
  } = useChat();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
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
    </Box>
  );
}
