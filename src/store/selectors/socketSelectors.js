import { createSelector } from '@reduxjs/toolkit';

export const selectSocketState = (state) => state.socket;

export const selectIsConnected = createSelector(
    [selectSocketState],
    (socket) => socket.isConnected
);

export const selectIsConnecting = createSelector(
    [selectSocketState],
    (socket) => socket.isConnecting
);

export const selectSocketId = createSelector(
    [selectSocketState],
    (socket) => socket.socketId
);

export const selectConnectionError = createSelector(
    [selectSocketState],
    (socket) => socket.error
);

export const selectOnlineUsers = createSelector(
    [selectSocketState],
    (socket) => socket.onlineUsers
);

export const selectOnlineUsersCount = createSelector(
    [selectOnlineUsers],
    (onlineUsers) => onlineUsers.length
);

export const selectIsUserOnline = createSelector(
    [selectOnlineUsers],
    (onlineUsers) => (userId) => onlineUsers.includes(userId)
);

export const selectNotifications = createSelector(
    [selectSocketState],
    (socket) => socket.notifications
);

export const selectUnreadNotificationsCount = createSelector(
    [selectNotifications],
    (notifications) => notifications.filter(n => !n.read).length
);

export const selectNotificationsByType = createSelector(
    [selectNotifications],
    (notifications) => (type) => notifications.filter(n => n.type === type)
);

export const selectTypingUsers = createSelector(
    [selectSocketState],
    (socket) => socket.typingUsers
);

export const selectTypingUsersInConversation = createSelector(
    [selectTypingUsers],
    (typingUsers) => (conversationId) => typingUsers[conversationId] || []
);

export const selectIsTypingInConversation = createSelector(
    [selectTypingUsers],
    (typingUsers) => (conversationId, userId) => {
        const users = typingUsers[conversationId] || [];
        return users.includes(userId);
    }
);

export const selectLastActivity = createSelector(
    [selectSocketState],
    (socket) => socket.lastActivity
);

export const selectSocketStatus = createSelector(
    [selectIsConnected, selectIsConnecting, selectConnectionError, selectSocketId],
    (isConnected, isConnecting, error, socketId) => ({
        isConnected,
        isConnecting,
        error,
        socketId,
        status: isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected'
    })
);

export const selectSocketStats = createSelector(
    [selectOnlineUsersCount, selectUnreadNotificationsCount, selectLastActivity],
    (onlineUsersCount, unreadCount, lastActivity) => ({
        onlineUsersCount,
        unreadNotificationsCount: unreadCount,
        lastActivity
    })
); 