import { useState, useEffect } from "react";

// Mock data
const initialContacts = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Chào bạn, hôm nay thế nào?",
    timestamp: "10:30",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Cảm ơn bạn nhiều!",
    timestamp: "09:15",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hẹn gặp lại sau nhé",
    timestamp: "Hôm qua",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Được rồi, tôi sẽ gửi file cho bạn",
    timestamp: "Hôm qua",
    unreadCount: 0,
    isOnline: false,
  },
];

const initialMessages = {
  1: [
    {
      id: 1,
      senderId: 1,
      text: "Chào bạn!",
      timestamp: "10:25",
      isOwn: false,
    },
    {
      id: 2,
      senderId: "me",
      text: "Chào! Bạn khỏe không?",
      timestamp: "10:26",
      isOwn: true,
    },
    {
      id: 3,
      senderId: 1,
      text: "Tôi khỏe, cảm ơn bạn. Hôm nay thế nào?",
      timestamp: "10:30",
      isOwn: false,
    },
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      text: "Cảm ơn bạn đã giúp đỡ!",
      timestamp: "09:10",
      isOwn: false,
    },
    {
      id: 2,
      senderId: "me",
      text: "Không có gì, luôn sẵn sàng giúp đỡ bạn",
      timestamp: "09:12",
      isOwn: true,
    },
    {
      id: 3,
      senderId: 2,
      text: "Cảm ơn bạn nhiều!",
      timestamp: "09:15",
      isOwn: false,
    },
  ],
};

export function useChat() {
  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedContact, setSelectedContact] = useState(1);

  // Simulate real-time message receiving
  useEffect(() => {
    const interval = setInterval(() => {
      const randomContact =
        contacts[Math.floor(Math.random() * contacts.length)];
      const randomMessages = [
        "Bạn có rảnh không?",
        "Tôi vừa xem tin tức thú vị",
        "Cuối tuần này có kế hoạch gì không?",
        "Cảm ơn bạn!",
        "Hẹn gặp lại",
      ];

      if (Math.random() > 0.7) {
        const randomMessage =
          randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const newMsg = {
          id: Date.now(),
          senderId: randomContact.id,
          text: randomMessage,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: false,
        };

        setMessages((prev) => ({
          ...prev,
          [randomContact.id]: [...(prev[randomContact.id] || []), newMsg],
        }));

        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === randomContact.id
              ? {
                  ...contact,
                  lastMessage: randomMessage,
                  timestamp: newMsg.timestamp,
                  unreadCount:
                    selectedContact === contact.id
                      ? 0
                      : contact.unreadCount + 1,
                }
              : contact
          )
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [contacts, selectedContact]);

  const handleSendMessage = (messageText) => {
    const message = {
      id: Date.now(),
      senderId: "me",
      text: messageText,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), message],
    }));

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedContact
          ? {
              ...contact,
              lastMessage: messageText,
              timestamp: message.timestamp,
            }
          : contact
      )
    );
  };

  const currentContact = contacts.find((c) => c.id === selectedContact);
  const currentMessages = messages[selectedContact] || [];

  return {
    contacts,
    setContacts,
    messages,
    selectedContact,
    setSelectedContact,
    currentContact,
    currentMessages,
    handleSendMessage,
  };
}
