import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/chat/users");
      return response.data.data || [];
    } catch (error) {
      console.error("fetchUsers error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  "chat/searchUsers",
  async (searchQuery, { rejectWithValue }) => {
    try {
      if (!searchQuery || searchQuery.trim().length < 2) {
        return [];
      }
      const response = await fetcher.get(`/chat/search-users?q=${encodeURIComponent(searchQuery)}`);
      return response.data.data || [];
    } catch (error) {
      console.error("searchUsers error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/chat/conversations");
      const result = response.data.data || [];
      return result;
    } catch (error) {
      console.error("fetchConversations error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "chat/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/chat/unread-count");
      return response.data.data?.unreadCount || 0;
    } catch (error) {
      console.error("fetchUnreadCount error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (receiverId, { rejectWithValue, getState }) => {
    try {
      if (!receiverId) {
        throw new Error("Không có ID người nhận");
      }
      const response = await fetcher.get(`/chat/messages/${receiverId}`);
      const rawMessages = response.data.data || [];

      const processedMessages = rawMessages.map(msg => ({
        ...msg,
        _id: msg._id || msg.id,
        senderId: msg.senderId && typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId,
        receiverId: msg.receiverId && typeof msg.receiverId === 'object' ? msg.receiverId._id : msg.receiverId,
        text: msg.text || msg.content || "",
        createdAt: msg.createdAt || new Date().toISOString()
      }));

      return { receiverId, messages: processedMessages };
    } catch (error) {
      console.error("fetchMessages error:", error);
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, text, image }, { rejectWithValue }) => {
    try {
      if (!receiverId) {
        throw new Error("Không có ID người nhận");
      }

      if (!text?.trim() && !image) {
        throw new Error("Tin nhắn phải có văn bản hoặc hình ảnh");
      }

      if (!image) {
        const payload = { text: text?.trim() };
        const response = await fetcher.post(
          `/chat/messages/${receiverId}`,
          payload
        );

        return { ...response.data.data || response.data, receiverId };
      }

      const formData = new FormData();
      if (text?.trim()) formData.append("text", text.trim());

      if (typeof image === 'string' && image.startsWith('data:')) {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("image", blob, "image.jpg");
      } else if (image instanceof File) {
        formData.append("image", image);
      } else {
        throw new Error("Định dạng hình ảnh không hợp lệ");
      }

      const response = await fetcher.postForm(
        `/chat/messages/${receiverId}`,
        formData
      );

      return { ...response.data.data || response.data, receiverId };
    } catch (error) {
      console.error(
        "sendMessage error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

export const markMessageRead = createAsyncThunk(
  "chat/markMessageRead",
  async (senderId, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/chat/mark-read/${senderId}`);
      return { senderId, data: response.data.data || response.data };
    } catch (error) {
      console.error("markMessageRead error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await fetcher.delete(`/chat/messages/${messageId}`);
      return { messageId, data: response.data.data || response.data };
    } catch (error) {
      console.error("deleteMessage error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const loadFromLocalStorage = (key, defaultValue = {}) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const result = JSON.parse(item);

    return result;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    users: [],
    conversations: [],
    messages: {},
    unreadCount: 0,
    selectedUserId: null,
    currentUserId: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
    userSidebarOrder: {},
    unreadMessages: loadFromLocalStorage('chatUnreadMessages', {}),
    conversationsData: loadFromLocalStorage('chatConversationsData', {}),
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUserId = action.payload;
    },
    addNewMessage: (state, action) => {

      const { message, conversationId } = action.payload;
      const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
      const receiverId = typeof message.receiverId === 'object' ? message.receiverId._id : message.receiverId;


      const targetConversationId = conversationId;

      if (!state.messages[targetConversationId]) {
        state.messages[targetConversationId] = [];
      }


      const existingMessage = state.messages[targetConversationId].find(
        msg => msg._id === message._id || msg.id === message._id
      );

      if (!existingMessage) {

        const newMessage = {
          ...message,
          _id: message._id || message.id,
          id: message._id || message.id,
          senderId: senderId,
          receiverId: receiverId,
          text: message.text || message.content || "",
          content: message.text || message.content || "",
          image: message.image || null,
          createdAt: message.createdAt || new Date().toISOString(),
          isRead: message.isRead || false,
        };

        state.messages[targetConversationId].push(newMessage);

        const conversationUserId = senderId;
        if (!state.conversationsData[conversationUserId]) {
          state.conversationsData[conversationUserId] = {
            lastMessageText: "",
            lastMessageAt: null,
            unreadCount: 0
          };
        }

        if (targetConversationId !== state.selectedUserId) {
          if (!state.unreadMessages[senderId]) {
            state.unreadMessages[senderId] = 0;
          }
          state.unreadMessages[senderId] += 1;

          state.conversationsData[conversationUserId].unreadCount = state.unreadMessages[senderId];
        }

        state.conversationsData[conversationUserId] = {
          ...state.conversationsData[conversationUserId],
          lastMessageText: newMessage.text || (newMessage.image ? "Đã gửi một hình ảnh" : ""),
          lastMessageAt: newMessage.createdAt
        };

        try {
          localStorage.setItem('chatUnreadMessages', JSON.stringify(state.unreadMessages));
          localStorage.setItem('chatConversationsData', JSON.stringify(state.conversationsData));
        } catch (error) {
          console.error('Error saving to localStorage after new message:', error);
        }
      } else {
      }
    },
    setUnreadMessages: (state, action) => {
      const conversations = action.payload;

      conversations.forEach(conv => {
        if (conv.user) {
          const userId = conv.user._id;

          const existingData = state.conversationsData[userId] || {};
          const existingUnreadCount = state.unreadMessages[userId] || 0;

          const serverUnreadCount = conv.unreadCount || 0;
          const finalUnreadCount = Math.max(existingUnreadCount, serverUnreadCount);

          const serverLastMessage = conv.lastMessageText && conv.lastMessageText !== "Chưa có tin nhắn" ? conv.lastMessageText : null;
          const finalLastMessage = serverLastMessage || existingData.lastMessageText || "Chưa có tin nhắn";

          const serverLastMessageAt = conv.lastMessageAt ? conv.lastMessageAt : null;
          const finalLastMessageAt = serverLastMessageAt || existingData.lastMessageAt || null;

          if (finalUnreadCount > 0) {
            state.unreadMessages[userId] = finalUnreadCount;
          } else if (state.unreadMessages[userId]) {
            if (serverUnreadCount === 0 && existingUnreadCount > 0) {
              state.unreadMessages[userId] = existingUnreadCount;
            }
          }

          state.conversationsData[userId] = {
            lastMessageText: finalLastMessage,
            lastMessageAt: finalLastMessageAt,
            unreadCount: finalUnreadCount
          };

        }
      });

      try {
        localStorage.setItem('chatUnreadMessages', JSON.stringify(state.unreadMessages));
        localStorage.setItem('chatConversationsData', JSON.stringify(state.conversationsData));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    markMessagesAsRead: (state, action) => {
      const userId = action.payload;
      if (state.unreadMessages[userId]) {
        state.unreadMessages[userId] = 0;
      }
      if (state.conversationsData[userId]) {
        state.conversationsData[userId] = {
          ...state.conversationsData[userId],
          unreadCount: 0
        };
      }

      try {
        localStorage.setItem('chatUnreadMessages', JSON.stringify(state.unreadMessages));
        localStorage.setItem('chatConversationsData', JSON.stringify(state.conversationsData));
      } catch (error) {
        console.error('Error saving to localStorage after markAsRead:', error);
      }
    },
    initializeSidebarOrder: (state, action) => {
      const { currentUserId, users } = action.payload;

      const savedOrder = localStorage.getItem(`sidebarOrder_${currentUserId}`);
      if (savedOrder) {
        try {
          state.userSidebarOrder[currentUserId] = JSON.parse(savedOrder);
        } catch (error) {
          console.error('Error parsing saved sidebar order:', error);
          state.userSidebarOrder[currentUserId] = [];
        }
      } else {
        state.userSidebarOrder[currentUserId] = users.map(user => user._id);
      }
    },
    moveUserToTopForCurrentUser: (state, action) => {
      const { currentUserId, userToMoveId } = action.payload;

      if (!state.userSidebarOrder[currentUserId]) {
        state.userSidebarOrder[currentUserId] = [];
      }

      const currentOrder = state.userSidebarOrder[currentUserId];
      const userIndex = currentOrder.indexOf(userToMoveId);

      if (userIndex > 0) {
        currentOrder.splice(userIndex, 1);
        currentOrder.unshift(userToMoveId);

        localStorage.setItem(`sidebarOrder_${currentUserId}`, JSON.stringify(currentOrder));
      } else if (userIndex === -1) {
        currentOrder.unshift(userToMoveId);
        localStorage.setItem(`sidebarOrder_${currentUserId}`, JSON.stringify(currentOrder));
      }
    },
    moveUserToTop: (state, action) => {
      const userId = action.payload;
      if (!state.users || state.users.length === 0) return;

      const userIndex = state.users.findIndex(user => user._id === userId);
      if (userIndex > 0) {
        const user = state.users[userIndex];
        state.users.splice(userIndex, 1);
        state.users.unshift(user);
      }
    },
    clearSearchUsers: (state) => {
      state.searchResults = [];
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    restoreFromLocalStorage: (state) => {
      try {
        const savedUnreadMessages = loadFromLocalStorage('chatUnreadMessages', {});
        const savedConversationsData = loadFromLocalStorage('chatConversationsData', {});

        state.unreadMessages = { ...state.unreadMessages, ...savedUnreadMessages };
        state.conversationsData = { ...state.conversationsData, ...savedConversationsData };

      } catch (error) {
        console.error('Error restoring from localStorage:', error);
      }
    },
    clearLocalStorageData: (state) => {
      try {
        localStorage.removeItem('chatUnreadMessages');
        localStorage.removeItem('chatConversationsData');
        state.unreadMessages = {};
        state.conversationsData = {};
        console.log('Cleared localStorage chat data');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Failed to fetch users";
        state.users = [];
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoadingSearch = true;
        state.isError = false;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoadingSearch = false;
        state.isError = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoadingSearch = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Failed to search users";
        state.users = [];
      })
      .addCase(fetchConversations.pending, (state) => {
        state.isError = false;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.conversations = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Failed to fetch conversations";
        state.conversations = [];
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.unreadCount = action.payload || 0;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Failed to fetch unread count";
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const { receiverId, messages } = action.payload;


        if (Array.isArray(messages)) {
          state.messages[receiverId] = messages.map((msg) => {
            return {
              ...msg,
              _id: msg._id || msg.id,
              id: msg._id || msg.id,
              senderId: typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId,
              receiverId: typeof msg.receiverId === "object" ? msg.receiverId._id : msg.receiverId,
              text: msg.text || msg.content || "",
              createdAt: msg.createdAt || new Date().toISOString(),
            };
          });

        } else {
          console.error("Received non-array messages:", messages);
          state.messages[receiverId] = [];
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Failed to fetch messages";
        console.error("Failed to fetch messages:", action.payload);
      })
      .addCase(sendMessage.pending, (state) => {
        state.isError = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const payload = action.payload;

        const receiverId = payload.receiverId;

        const senderId =
          typeof payload.senderId === "object"
            ? payload.senderId._id
            : payload.senderId;

        if (!state.messages[receiverId]) {
          state.messages[receiverId] = [];
        }

        const newMessage = {
          ...payload,
          _id: payload._id || payload.id,
          id: payload._id || payload.id,
          senderId: senderId,
          receiverId: receiverId,
          text: payload.text || payload.content || "",
          content: payload.text || payload.content || "",
          image: payload.image || null,
          createdAt: payload.createdAt || new Date().toISOString(),
          isRead: payload.isRead || false,
        };

        state.messages[receiverId].push(newMessage);

        if (!state.conversationsData[receiverId]) {
          state.conversationsData[receiverId] = {
            lastMessageText: "",
            lastMessageAt: null,
            unreadCount: 0
          };
        }
        state.conversationsData[receiverId] = {
          ...state.conversationsData[receiverId],
          lastMessageText: newMessage.text || (newMessage.image ? "Đã gửi một hình ảnh" : ""),
          lastMessageAt: newMessage.createdAt
        };

        try {
          localStorage.setItem('chatUnreadMessages', JSON.stringify(state.unreadMessages));
          localStorage.setItem('chatConversationsData', JSON.stringify(state.conversationsData));
        } catch (error) {
          console.error('Error saving to localStorage after sendMessage:', error);
        }

      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Failed to send message";
      })
      .addCase(markMessageRead.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(markMessageRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const { senderId } = action.payload;
        if (state.messages[senderId]) {
          state.messages[senderId] = state.messages[senderId].map((msg) =>
            msg.senderId === senderId ? { ...msg, isRead: true } : msg
          );
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markMessageRead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Failed to mark message read";
      })
      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const { messageId } = action.payload;
        Object.keys(state.messages).forEach((receiverId) => {
          state.messages[receiverId] = state.messages[receiverId].filter(
            (msg) => msg.id !== messageId
          );
        });
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Failed to delete message";
      });
  },
});

export const {
  selectUser,
  addNewMessage,
  setUnreadMessages,
  markMessagesAsRead,
  initializeSidebarOrder,
  moveUserToTopForCurrentUser,
  moveUserToTop,
  clearSearchUsers,
  setCurrentUserId,
  restoreFromLocalStorage,
  clearLocalStorageData,
} = chatSlice.actions;
export default chatSlice.reducer;
