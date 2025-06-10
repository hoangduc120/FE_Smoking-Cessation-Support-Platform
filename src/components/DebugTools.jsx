import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectSocket } from '../store/slices/socketSlice';
import socketService from '../services/socket';
import { Box, Button, Paper, Typography, TextField, Divider, Stack } from '@mui/material';

const DebugTools = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const { isConnected, socketId } = useSelector((state) => state.socket);
    const [userId, setUserId] = useState(currentUser?._id || '');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    useEffect(() => {
        addLog('DebugTools mounted');
        addLog(`Auth state: ${currentUser ? 'Logged in' : 'Not logged in'}`);
        addLog(`Socket state: ${isConnected ? 'Connected' : 'Disconnected'}`);

        // Override console.log temporarily
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            originalLog(...args);
            addLog(`LOG: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`);
        };

        console.error = (...args) => {
            originalError(...args);
            addLog(`ERROR: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`);
        };

        console.warn = (...args) => {
            originalWarn(...args);
            addLog(`WARN: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`);
        };

        return () => {
            // Restore original console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, [currentUser, isConnected]);

    const handleConnect = () => {
        addLog(`Attempting manual socket connect: userId=${userId}, tokenLength=${token?.length || 0}`);

        if (userId && token) {
            localStorage.setItem('token', token);
            dispatch(connectSocket({ userId, token }));
        } else {
            addLog('ERROR: UserId and Token are required');
        }
    };

    const handleReconnect = () => {
        if (socketService.socket) {
            addLog('Forcing socket reconnect');
            socketService.socket.disconnect();
            socketService.socket.connect();
        } else {
            addLog('No socket instance to reconnect');
        }
    };

    const handleCheckStatus = () => {
        const status = {
            isSocketInitialized: !!socketService.socket,
            isSocketConnected: socketService.socket?.connected || false,
            socketId: socketService.socket?.id || 'none',
            isStoreSet: !!socketService.store,
            userId: socketService.userId,
            tokenInLocalStorage: !!localStorage.getItem('token'),
        };

        addLog(`Status check: ${JSON.stringify(status)}`);
    };

    return (
        <Paper sx={{ p: 2, maxWidth: 800, margin: '20px auto' }}>
            <Typography variant="h6" gutterBottom>Socket Debug Tools</Typography>

            <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
                <TextField
                    label="User ID"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    size="small"
                    fullWidth
                />
                <TextField
                    label="JWT Token"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    size="small"
                    fullWidth
                />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleConnect}>
                    Connect Socket
                </Button>
                <Button variant="outlined" onClick={handleReconnect}>
                    Force Reconnect
                </Button>
                <Button variant="outlined" color="info" onClick={handleCheckStatus}>
                    Check Status
                </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">
                Status: {isConnected ? 'Connected' : 'Disconnected'} {socketId ? `(${socketId})` : ''}
            </Typography>

            <Typography variant="subtitle2">Debug Logs:</Typography>
            <Box
                sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    maxHeight: 300,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                }}
            >
                {logs.map((log, i) => (
                    <Box key={i} sx={{ mb: 0.5 }}>{log}</Box>
                ))}
            </Box>
        </Paper>
    );
};

export default DebugTools; 