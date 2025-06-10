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

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/chat/conversations");
      return response.data.data || [];
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
      console.log("Fetching messages for receiver:", receiverId);
      const response = await fetcher.get(`/chat/messages/${receiverId}`);
      const rawMessages = response.data.data || [];
      console.log("Raw messages from API:", rawMessages);

      // Pre-process messages để đảm bảo cấu trúc đúng
      const processedMessages = rawMessages.map(msg => ({
        ...msg,
        _id: msg._id || msg.id,
        senderId: msg.senderId && typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId,
        receiverId: msg.receiverId && typeof msg.receiverId === 'object' ? msg.receiverId._id : msg.receiverId,
        text: msg.text || msg.content || "",
        createdAt: msg.createdAt || new Date().toISOString()
      }));

      console.log("Processed messages:", processedMessages);
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
  async ({ receiverId, text, image }, { rejectWithValue, dispatch, getState }) => {
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
        await dispatch(fetchMessages(receiverId));
        return response.data.data || response.data;
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

      await dispatch(fetchMessages(receiverId));
      return response.data.data || response.data;
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

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    users: [],
    conversations: [],
    messages: {},
    unreadCount: 0,
    selectedUserId: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUserId = action.payload;
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
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
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

        console.log("Before processing, messages:", messages);

        // Ensure messages is always an array before setting in state
        if (Array.isArray(messages)) {
          state.messages[receiverId] = messages.map((msg) => {
            console.log("Processing message:", msg);
            return {
              ...msg,
              _id: msg._id || msg.id, // Ensure _id exists
              id: msg._id || msg.id,
              senderId: typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId,
              receiverId: typeof msg.receiverId === "object" ? msg.receiverId._id : msg.receiverId,
              text: msg.text || msg.content || "", // Support both text and content fields
              createdAt: msg.createdAt || new Date().toISOString(),
            };
          });

          console.log("After processing, state.messages[receiverId]:", state.messages[receiverId]);
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
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const payload = action.payload;
        const receiverId =
          typeof payload.receiverId === "object"
            ? payload.receiverId._id
            : payload.receiverId;
        const senderId =
          typeof payload.senderId === "object"
            ? payload.senderId._id
            : payload.senderId;
        if (!state.messages[receiverId]) state.messages[receiverId] = [];
        state.messages[receiverId].push({
          ...payload,
          id: payload._id,
          senderId: senderId || "unknown",
          receiverId: receiverId || "unknown",
          content: payload.text || "",
          image: payload.image || null,
          createdAt: payload.createdAt || new Date().toISOString(),
          isRead: payload.isRead || false,
        });
        state.unreadCount += 1;
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

export const { selectUser } = chatSlice.actions;
export default chatSlice.reducer;
