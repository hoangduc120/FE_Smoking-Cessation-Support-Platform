import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { disconnectSocket, resetSocketState } from '../store/slices/socketSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { currentUser, isLoading, error } = useSelector((state) => state.auth);

    const handleLogout = () => {
        // Logout và ngắt kết nối socket
        dispatch(logout());
        dispatch(disconnectSocket());
        dispatch(resetSocketState());
    };

    return {
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        error,
        logout: handleLogout,
    };
};

export default useAuth;