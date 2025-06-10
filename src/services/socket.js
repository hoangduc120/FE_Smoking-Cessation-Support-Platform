import { io } from 'socket.io-client';
import {
    setConnectionStatus,
    setSocketId,
    updateOnlineUsers,
    addNotification,
    setTypingUsers,
    updateLastActivity
} from '../store/slices/socketSlice';

class SocketService {
    constructor() {
        this.socket = null;
        this.userId = null;
        this.store = null;
    }

    setStore(store) {
        this.store = store;
    }

    connect(userId, token) {
        if (!userId) {
            console.error('Cannot connect socket: Missing userId');
            return null;
        }

        if (!token) {
            console.warn('Attempting to connect socket without token');
        }

        if (this.socket && this.socket.connected) {
            return this.socket;
        }

        const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            const sanitizedUserId = typeof userId === 'string' ? userId : String(userId);
            const sanitizedToken = token || '';

            this.socket = io(serverUrl, {
                query: {
                    userId: sanitizedUserId,
                    debug: window.location.search.includes('debug=true') ? 'true' : 'false'
                },
                auth: { token: sanitizedToken },
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            this.socket.on('connect_error', (err) => {
                console.error('Socket connect_error:', err.message);
            });
            this.socket.on('error', (err) => {
                console.error('Socket error:', err);
            });

            this.userId = userId;
            this.setupEventHandlers();

            return this.socket;
        } catch (error) {
            console.error('Error creating socket connection:', error);
            return null;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.userId = null;
        }
    }

    setupEventHandlers() {
        if (!this.socket || !this.store) return;

        const { dispatch } = this.store;

        this.socket.on('connect', () => {
            dispatch(setConnectionStatus(true));
            dispatch(setSocketId(this.socket.id));
            dispatch(updateLastActivity());
        });

        this.socket.on('disconnect', (reason) => {
            dispatch(setConnectionStatus(false));
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            dispatch(setConnectionStatus(false));
        });

        this.socket.on('getOnLineUsers', (users) => {
            dispatch(updateOnlineUsers(users));
            dispatch(updateLastActivity());
        });

        this.socket.on('notification', (notification) => {
            dispatch(addNotification(notification));
        });

        this.socket.on('newMessage', (message) => {
            dispatch(addNotification({
                type: 'message',
                title: 'Tin nhắn mới',
                message: message.text,
                from: message.from
            }));
        });

        this.socket.on('userTyping', ({ conversationId, userId, isTyping }) => {
            dispatch(setTypingUsers({ conversationId, userId, isTyping }));
        });

        this.socket.on('friendRequest', (request) => {
            dispatch(addNotification({
                type: 'friendRequest',
                title: 'Lời mời kết bạn',
                message: `${request.from.name} đã gửi lời mời kết bạn`,
                data: request
            }));
        });
    }

    emit(event, data) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, data);

            if (this.store) {
                this.store.dispatch(updateLastActivity());
            }
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    isConnected() {
        return this.socket && this.socket.connected;
    }

    getSocket() {
        return this.socket;
    }

    getSocketId() {
        return this.socket ? this.socket.id : null;
    }

    sendMessage(messageData) {
        this.emit('sendMessage', messageData);
    }

    sendTyping(conversationId, isTyping) {
        this.emit('typing', { conversationId, isTyping });
    }

    joinRoom(roomId) {
        this.emit('joinRoom', roomId);
    }

    leaveRoom(roomId) {
        this.emit('leaveRoom', roomId);
    }
}

const socketService = new SocketService();

export default socketService; 