import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socketService from '../../services/socket';

// Async thunk để kết nối socket
export const connectSocket = createAsyncThunk(
    'socket/connect',
    async ({ userId, token }, { rejectWithValue }) => {
        try {
            const socket = socketService.connect(userId, token);
            return {
                socketId: socket.id,
                userId,
                connected: true
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk để ngắt kết nối socket
export const disconnectSocket = createAsyncThunk(
    'socket/disconnect',
    async (_, { rejectWithValue }) => {
        try {
            socketService.disconnect();
            return { connected: false };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        isConnected: false,
        socketId: null,
        onlineUsers: [],
        error: null,
        isConnecting: false,
        lastActivity: null,
        notifications: [],
        typingUsers: {},
    },
    reducers: {
        // Set connection status
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
            if (!action.payload) {
                state.socketId = null;
            }
        },

        // Set socket ID
        setSocketId: (state, action) => {
            state.socketId = action.payload;
        },

        // Update online users
        updateOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },

        // Add notification
        addNotification: (state, action) => {
            state.notifications.push({
                id: Date.now(),
                ...action.payload,
                timestamp: new Date().toISOString()
            });
        },

        // Remove notification
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },

        // Clear all notifications
        clearNotifications: (state) => {
            state.notifications = [];
        },

        // Set typing users
        setTypingUsers: (state, action) => {
            const { conversationId, userId, isTyping } = action.payload;
            if (!state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = [];
            }

            if (isTyping) {
                if (!state.typingUsers[conversationId].includes(userId)) {
                    state.typingUsers[conversationId].push(userId);
                }
            } else {
                state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
                    id => id !== userId
                );
            }
        },

        // Update last activity
        updateLastActivity: (state) => {
            state.lastActivity = new Date().toISOString();
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset socket state
        resetSocketState: (state) => {
            state.isConnected = false;
            state.socketId = null;
            state.onlineUsers = [];
            state.error = null;
            state.isConnecting = false;
            state.notifications = [];
            state.typingUsers = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // Connect socket
            .addCase(connectSocket.pending, (state) => {
                state.isConnecting = true;
                state.error = null;
            })
            .addCase(connectSocket.fulfilled, (state, action) => {
                state.isConnecting = false;
                state.isConnected = true;
                state.socketId = action.payload.socketId;
                state.error = null;
                state.lastActivity = new Date().toISOString();
            })
            .addCase(connectSocket.rejected, (state, action) => {
                state.isConnecting = false;
                state.isConnected = false;
                state.error = action.payload;
            })

            // Disconnect socket
            .addCase(disconnectSocket.fulfilled, (state) => {
                state.isConnected = false;
                state.socketId = null;
                state.onlineUsers = [];
                state.typingUsers = {};
            });
    },
});

export const {
    setConnectionStatus,
    setSocketId,
    updateOnlineUsers,
    addNotification,
    removeNotification,
    clearNotifications,
    setTypingUsers,
    updateLastActivity,
    clearError,
    resetSocketState,
} = socketSlice.actions;

export default socketSlice.reducer; 