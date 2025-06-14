import React from 'react';
import SocketStatus from '../SocketStatus';
import SearchIcon from '@mui/icons-material/Search';
import SmsIcon from '@mui/icons-material/Sms';
import { formatSidebarTime } from '../../utils/fomatTime';

const SideBarChat = ({ users, selectedUserId, searchQuery, setSearchQuery, isUserOnline, handleSelectUser, unreadMessages, conversationsData }) => {
    const filteredUsers = users?.filter(user =>
        user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="h-full flex flex-col border-r border-gray-200 bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <SmsIcon className="text-2xl text-indigo-500" />
                    <h2 className="text-xl font-bold text-indigo-500 m-0">
                        Tin nhắn
                    </h2>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <SearchIcon />
                    </span>
                </div>
            </div>

            {/* User List */}
            <div className="flex-grow overflow-y-auto">
                {filteredUsers.filter(user => user.role !== 'admin').map((user, index) => {
                    const unreadCount = unreadMessages?.[user._id] || 0;
                    const conversationData = conversationsData?.[user._id] || {};
                    const lastMessage = conversationData.lastMessageText || '';
                    const lastMessageTime = conversationData.lastMessageAt;

                    return (
                        <div
                            key={user._id}
                            onClick={() => handleSelectUser(user._id)}
                            className={`
                                flex items-center p-3 border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50
                                ${selectedUserId === user._id
                                    ? 'bg-indigo-500 text-white border-l-4 border-l-indigo-600 shadow-lg'
                                    : 'bg-white text-gray-800 hover:shadow-md'
                                }
                            `}
                            style={{
                                animation: `fadeIn 0.3s ease-out ${0.1 + index * 0.05}s both`
                            }}
                        >
                            <div className="relative mr-3">
                                <img
                                    src={user.profilePicture || "/default-avatar.png"}
                                    alt={user.userName}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-200"
                                />
                                {isUserOnline(user._id) && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-base truncate pr-2">
                                        {user.userName}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {/* Time */}
                                        {lastMessageTime && (
                                            <span className={`text-xs ${selectedUserId === user._id ? 'text-white/80' : 'text-gray-500'}`}>
                                                {formatSidebarTime(lastMessageTime)}
                                            </span>
                                        )}

                                        {/* Online status */}
                                        {isUserOnline(user._id) && !lastMessageTime && (
                                            <span className={`
                                                text-xs font-bold px-2 py-1 rounded-full border text-center
                                                ${selectedUserId === user._id
                                                    ? 'text-white border-white bg-white/20'
                                                    : 'text-green-600 border-green-500 bg-green-50'
                                                }
                                            `}>
                                                Online
                                            </span>
                                        )}

                                        {/* Unread messages badge */}
                                        {unreadCount > 0 && (
                                            <div className={`
                                                min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-bold
                                                ${selectedUserId === user._id
                                                    ? 'bg-white text-indigo-600'
                                                    : 'bg-red-500 text-white'
                                                }
                                                animate-pulse shadow-sm
                                            `}>
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Last message - Always show */}
                                <div className="text-sm truncate pr-2">
                                    <span className={`${selectedUserId === user._id ? 'text-white/90' : 'text-gray-600'}`}>
                                        {lastMessage ?
                                            (lastMessage.length > 35 ? `${lastMessage.substring(0, 35)}...` : lastMessage) :
                                            "Chưa có tin nhắn"
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        <div className="mb-2 text-2xl">
                            {searchQuery ? '🔍' : '👥'}
                        </div>
                        <p>{searchQuery ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}</p>
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-gray-200 flex justify-center bg-gray-50">
                <SocketStatus showDetails={false} />
            </div>
        </div>
    );
};

export default SideBarChat;