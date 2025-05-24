import { io } from 'socket.io-client';

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
        if (this.socket && this.socket.connected) {
            return this.socket;
        }

        const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        this.socket = io(serverUrl, {
            query: { userId },
            auth: { token },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.userId = userId;
        this.setupEventHandlers();

        return this.socket;
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
        const {
            setConnectionStatus,
            setSocketId,
            updateOnlineUsers,
            addNotification,
            setTypingUsers,
            updateLastActivity
        } = require('../store/slices/socketSlice');

        this.socket.on('connect', () => {
            console.log('Connected to server:', this.socket.id);
            dispatch(setConnectionStatus(true));
            dispatch(setSocketId(this.socket.id));
            dispatch(updateLastActivity());
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
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
                const { updateLastActivity } = require('../store/slices/socketSlice');
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