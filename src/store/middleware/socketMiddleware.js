import socketService from '../../services/socket';
import {
    connectSocket,
    disconnectSocket,
    resetSocketState
} from '../slices/socketSlice';


export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    if (!socketService.store) {
        socketService.setStore(store);
    }

    switch (action.type) {
        case 'auth/loginApi/fulfilled':
        case 'auth/registerApi/fulfilled':
        case 'auth/login': {
            const user = action.payload?.data || action.payload;
            if (user && user._id) {
                setTimeout(() => {
                    store.dispatch(connectSocket({
                        userId: user._id,
                        token: user.token || localStorage.getItem('token')
                    }));
                }, 100);
            } else {
                console.warn('Login completed but no user data found', action.payload);
            }
            break;
        }

        case 'auth/logoutApi/fulfilled':
        case 'auth/logout': {
            store.dispatch(disconnectSocket());
            store.dispatch(resetSocketState());
            break;
        }

        case connectSocket.fulfilled.type: {
            break;
        }

        case connectSocket.rejected.type: {
            console.error('Socket connection rejected', action.error);
            break;
        }

        case disconnectSocket.fulfilled.type: {
            break;
        }

        default:
            break;
    }

    return result;
};

export default socketMiddleware; 