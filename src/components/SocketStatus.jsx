import React from 'react';
import { useSocket } from '../hooks/useSocket';

const SocketStatus = () => {
    const { isConnected, isConnecting, socketId, status, error } = useSocket();

    const getStatusColor = () => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500';
            case 'disconnected': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'connected': return 'Đã kết nối';
            case 'connecting': return 'Đang kết nối...';
            case 'disconnected': return 'Mất kết nối';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className={`px-3 py-2 rounded-lg shadow-lg text-white text-sm font-medium flex items-center space-x-2 ${getStatusColor()}`}
            >
                <div
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-200' : isConnecting ? 'bg-yellow-200' : 'bg-red-200'
                        }`}
                />
                <span>{getStatusText()}</span>

                {socketId && (
                    <span className="text-xs opacity-75">
                        ID: {socketId.slice(0, 6)}...
                    </span>
                )}

                {error && (
                    <span className="text-xs opacity-75" title={error}>
                        ⚠️
                    </span>
                )}
            </div>
        </div>
    );
};

export default SocketStatus; 