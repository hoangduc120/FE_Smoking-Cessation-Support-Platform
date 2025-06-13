import React from 'react';
import TypingIndicator from '../TypingIndicator';

const ChatHeader = ({ selectedUser, isUserOnline, typingUsers }) => {
    if (!selectedUser) return null;

    return (
        <div className="p-4 border-b border-gray-200 bg-white shadow-sm min-h-[70px] z-10">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={selectedUser.profilePicture || "/default-avatar.png"}
                        alt={selectedUser.userName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-200"
                    />
                    {isUserOnline(selectedUser._id) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 m-0">
                        {selectedUser.userName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        {isUserOnline(selectedUser._id) ? (
                            <span className="flex items-center text-green-600 text-sm font-medium">
                                Đang hoạt động
                            </span>
                        ) : (
                            <span className="text-gray-500 text-sm">
                                Không hoạt động
                            </span>
                        )}
                        {typingUsers && typingUsers.has && typingUsers.has(selectedUser._id) && (
                            <TypingIndicator />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;