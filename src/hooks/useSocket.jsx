import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import socketService from '../services/socket';
import {
    connectSocket,
    disconnectSocket,
    addNotification,
    removeNotification,
    clearNotifications,
    setTypingUsers,
} from '../store/slices/socketSlice';
import {
    selectIsConnected,
    selectIsConnecting,
    selectSocketId,
    selectConnectionError,
    selectOnlineUsers,
    selectOnlineUsersCount,
    selectIsUserOnline,
    selectNotifications,
    selectUnreadNotificationsCount,
    selectTypingUsersInConversation,
    selectSocketStatus,
    selectSocketStats,
} from '../store/selectors/socketSelectors';

export const useSocket = () => {
    const dispatch = useDispatch();
    const isConnected = useSelector(selectIsConnected);
    const isConnecting = useSelector(selectIsConnecting);
    const socketId = useSelector(selectSocketId);
    const error = useSelector(selectConnectionError);
    const onlineUsers = useSelector(selectOnlineUsers);
    const socketStatus = useSelector(selectSocketStatus);
    const socketStats = useSelector(selectSocketStats);

    const connect = useCallback((userId, token) => {
        dispatch(connectSocket({ userId, token }));
    }, [dispatch]);

    const disconnect = useCallback(() => {
        dispatch(disconnectSocket());
    }, [dispatch]);

    const emit = useCallback((event, data) => {
        if (isConnected) {
            socketService.emit(event, data);
        } else {
            console.warn('Socket is not connected. Cannot emit event:', event);
        }
    }, [isConnected]);

    return {
        isConnected,
        isConnecting,
        socketId,
        error,
        status: socketStatus.status,

        onlineUsers,
        onlineUsersCount: socketStats.onlineUsersCount,

        connect,
        disconnect,
        emit,

        socketService,

        stats: socketStats,
    };
};

export const useOnlineUsers = () => {
    const onlineUsers = useSelector(selectOnlineUsers);
    const onlineUsersCount = useSelector(selectOnlineUsersCount);
    const isUserOnline = useSelector(selectIsUserOnline);

    return {
        onlineUsers,
        onlineUsersCount,
        isUserOnline,
    };
};

export const useSocketNotifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
    const unreadCount = useSelector(selectUnreadNotificationsCount);

    const addNotificationAction = useCallback((notification) => {
        dispatch(addNotification(notification));
    }, [dispatch]);

    const removeNotificationAction = useCallback((notificationId) => {
        dispatch(removeNotification(notificationId));
    }, [dispatch]);

    const clearAllNotifications = useCallback(() => {
        dispatch(clearNotifications());
    }, [dispatch]);

    return {
        notifications,
        unreadCount,
        addNotification: addNotificationAction,
        removeNotification: removeNotificationAction,
        clearNotifications: clearAllNotifications,
    };
};

export const useTypingIndicator = (conversationId) => {
    const dispatch = useDispatch();
    const { emit, isConnected } = useSocket();
    const typingUsers = useSelector(selectTypingUsersInConversation)(conversationId);

    const startTyping = useCallback(() => {
        if (isConnected && conversationId) {
            emit('typing', { conversationId, isTyping: true });
        }
    }, [emit, isConnected, conversationId]);

    const stopTyping = useCallback(() => {
        if (isConnected && conversationId) {
            emit('typing', { conversationId, isTyping: false });
        }
    }, [emit, isConnected, conversationId]);

    return {
        typingUsers,
        startTyping,
        stopTyping,
    };
};

export const useSocketEvent = (event, handler, dependencies = []) => {
    const { isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected || !socketService.getSocket()) return;

        const socket = socketService.getSocket();
        socket.on(event, handler);

        return () => {
            socket.off(event, handler);
        };
    }, [event, handler, isConnected, ...dependencies]);
};

export const useSocketEmit = () => {
    const { emit, isConnected } = useSocket();

    return useCallback((event, data) => {
        if (isConnected) {
            emit(event, data);
        } else {
            console.warn('Socket is not connected. Cannot emit event:', event);
        }
    }, [emit, isConnected]);
};

export const useSocketChat = () => {
    const { emit, isConnected } = useSocket();

    const sendMessage = useCallback((messageData) => {
        if (isConnected) {
            socketService.sendMessage(messageData);
        }
    }, [isConnected]);

    const joinRoom = useCallback((roomId) => {
        if (isConnected) {
            socketService.joinRoom(roomId);
        }
    }, [isConnected]);

    const leaveRoom = useCallback((roomId) => {
        if (isConnected) {
            socketService.leaveRoom(roomId);
        }
    }, [isConnected]);

    return {
        sendMessage,
        joinRoom,
        leaveRoom,
    };
};

export default useSocket; 