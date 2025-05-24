import React from 'react';
import { useOnlineUsers } from '../hooks/useSocket';

const OnlineUsers = () => {
    const { onlineUsers, onlineUsersCount, isUserOnline } = useOnlineUsers();

    return (
        <div className="bg-white rounded-lg shadow-md p-4 m-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Users Online ({onlineUsersCount})
            </h3>

            {onlineUsersCount === 0 ? (
                <p className="text-gray-500 text-sm">Không có user nào online</p>
            ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {onlineUsers.map((userId) => (
                        <div
                            key={userId}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-700 font-medium">
                                User: {userId}
                            </span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                Online
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OnlineUsers; 