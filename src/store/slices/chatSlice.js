import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/chat/users");
      console.log("fetchUsers response:", response.data);
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
      console.log("fetchConversations response:", response.data);
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
      console.log("fetchUnreadCount response:", response.data);
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
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/chat/messages/${receiverId}`);
      console.log("fetchMessages response:", response.data);
      return { receiverId, messages: response.data.data || [] };
    } catch (error) {
      console.error("fetchMessages error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, text, image }, { rejectWithValue, dispatch }) => {
    try {
      if (!text?.trim() && !image) {
        throw new Error("Message must have either text or image");
      }

      // Gửi JSON nếu không có image
      if (!image) {
        const payload = { text: text?.trim() };
        console.log("sendMessage JSON payload:", payload);
        const response = await fetcher.post(
          `/chat/messages/${receiverId}`,
          payload
        );
        console.log("sendMessage response:", response.data);
        // Gọi fetchMessages để đồng bộ nếu cần
        dispatch(fetchMessages(receiverId));
        return response.data.data || response.data;
      }

      // Gửi FormData nếu có image
      const formData = new FormData();
      if (text?.trim()) formData.append("text", text.trim());
      if (image) formData.append("image", image);
      console.log("sendMessage FormData:", Object.fromEntries(formData));

      const response = await fetcher.postForm(
        `/chat/messages/${receiverId}`,
        formData
      );
      console.log("sendMessage response:", response.data);
      // Gọi fetchMessages để đồng bộ nếu cần
      dispatch(fetchMessages(receiverId));
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
      console.log("markMessageRead response:", response.data);
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
      console.log("deleteMessage response:", response.data);
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
        state.messages[action.payload.receiverId] = Array.isArray(
          action.payload.messages
        )
          ? action.payload.messages.map((msg) => ({
              ...msg,
              id: msg._id,
              senderId:
                typeof msg.senderId === "object"
                  ? msg.senderId._id
                  : msg.senderId,
              receiverId:
                typeof msg.receiverId === "object"
                  ? msg.receiverId._id
                  : msg.receiverId,
            }))
          : [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Failed to fetch messages";
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
