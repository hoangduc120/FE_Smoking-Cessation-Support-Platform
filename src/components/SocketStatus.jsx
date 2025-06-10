import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectSocket } from '../store/slices/socketSlice';
import {
    Box,
    Chip,
    Stack,
    Typography,
    Button,
    Paper,
    Alert,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import {
    Circle as CircleIcon,
    Refresh as RefreshIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const SocketStatus = ({ showDetails = false }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const {
        isConnected,
        isConnecting,
        socketId,
        error,
        onlineUsers
    } = useSelector((state) => state.socket);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        try {
            const storedData = JSON.parse(localStorage.getItem('currentUser'));
            
            if (storedData) {
                const realUser = storedData.user || storedData;
                const realToken = storedData.token || localStorage.getItem('token');
                const userId = realUser.id || realUser._id;

                if (userId && !isConnected && !isConnecting) {
                    dispatch(connectSocket({
                        userId: userId,
                        token: realToken
                    }));
                }
            } else if (user && user._id && !isConnected && !isConnecting) {
                const token = localStorage.getItem('token') || (user.token || '');
                dispatch(connectSocket({
                    userId: user._id,
                    token: token
                }));
            } else {
                console.warn('Cannot connect socket - no valid user data found');
            }
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }
    }, [user, isConnected, isConnecting, dispatch]);

    const handleReconnect = () => {
        if (user && user._id) {
            dispatch(connectSocket({
                userId: user._id,
                token: localStorage.getItem('token')
            }));
        }
    };

    const getStatusColor = () => {
        if (isConnecting) return 'warning';
        if (isConnected) return 'success';
        return 'error';
    };

    const getStatusText = () => {
        if (isConnecting) return 'Đang kết nối...';
        if (isConnected) return 'Đã kết nối';
        return 'Chưa kết nối';
    };

    const getStatusIcon = () => {
        if (isConnecting) return <CircleIcon sx={{ fontSize: 12, animation: 'pulse 1s infinite' }} />;
        if (isConnected) return <CheckIcon sx={{ fontSize: 12 }} />;
        return <ErrorIcon sx={{ fontSize: 12 }} />;
    };

    const [expanded, setExpanded] = useState(showDetails);

    if (!expanded) {
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                    icon={getStatusIcon()}
                    label={getStatusText()}
                    color={getStatusColor()}
                    size="small"
                    variant="filled"
                    sx={{ fontWeight: 500 }}
                />
                <IconButton
                    size="small"
                    onClick={() => setExpanded(true)}
                    color="primary"
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        width: 24,
                        height: 24
                    }}
                >
                    <InfoIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Stack>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                        Socket Connection Status
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setExpanded(false)}
                        sx={{
                            bgcolor: alpha(theme.palette.grey[400], 0.1),
                            width: 24,
                            height: 24
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                        icon={getStatusIcon()}
                        label={getStatusText()}
                        color={getStatusColor()}
                        variant="filled"
                    />
                    {!isConnected && !isConnecting && (
                        <Button
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={handleReconnect}
                            variant="outlined"
                        >
                            Kết nối lại
                        </Button>
                    )}
                </Stack>

                {error && (
                    <Alert severity="error" variant="outlined">
                        <Typography variant="body2">
                            <strong>Lỗi:</strong> {error}
                        </Typography>
                    </Alert>
                )}

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Online Users:</strong> {onlineUsers.length}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default SocketStatus; 