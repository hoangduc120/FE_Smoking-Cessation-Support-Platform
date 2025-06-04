import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchConversations,
  fetchUnreadCount,
  fetchMessages,
  sendMessage,
  markMessageRead,
  selectUser,
} from "../../../../store/slices/chatSlice";

export const useChat = () => {
  const dispatch = useDispatch();
  const {
    users,
    conversations,
    messages,
    unreadCount,
    selectedUserId,
    isLoading,
    isError,
    errorMessage,
  } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const contacts = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.map((user) => {
      const conversation = Array.isArray(conversations)
        ? conversations.find((conv) =>
            conv.participants?.some(
              (p) => p.id === user._id || p._id === user._id
            )
          )
        : null;
      return {
        id: user._id,
        name: user.userName || "Unknown",
        avatar: user.profilePicture || "",
        isOnline: false,
        lastMessage:
          conversation?.lastMessage?.text ||
          conversation?.lastMessage?.image ||
          "",
        timestamp: conversation?.lastMessage?.createdAt
          ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString(
              "vi-VN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )
          : "",
        unreadCount: conversation?.lastMessage?.isRead ? 0 : 1,
      };
    });
  }, [users, conversations]);

  const currentContact = useMemo(() => {
    return contacts.find((contact) => contact.id === selectedUserId) || null;
  }, [contacts, selectedUserId]);

  const currentMessages = useMemo(() => {
    if (!selectedUserId || !Array.isArray(messages[selectedUserId])) return [];
    console.log("currentMessages updated:", messages[selectedUserId]); // Debug
    return messages[selectedUserId].map((msg) => ({
      id: msg.id,
      text: msg.text || msg.content || "",
      image: msg.image || null,
      timestamp: msg.createdAt
        ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      isOwn: msg.senderId !== selectedUserId,
    }));
  }, [messages, selectedUserId]);

  const setSelectedContact = (contactId) => {
    dispatch(selectUser(contactId));
    dispatch(fetchMessages(contactId));
    dispatch(markMessageRead(contactId));
  };

  const setContacts = (updateFn) => {};

  const handleSendMessage = ({ text, image }) => {
    console.log("Sending message:", { text, image });
    if (selectedUserId && (text?.trim() || image)) {
      dispatch(
        sendMessage({ receiverId: selectedUserId, text: text?.trim(), image })
      );
    } else {
      console.warn("Cannot send empty message without image");
    }
  };

  return {
    contacts,
    setContacts,
    selectedContact: selectedUserId,
    setSelectedContact,
    currentContact,
    currentMessages,
    handleSendMessage,
    isLoading,
    isError,
    errorMessage,
    unreadCount,
  };
};
