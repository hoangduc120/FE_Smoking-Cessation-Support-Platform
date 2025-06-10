import React, { useEffect, useRef } from 'react';
import { formatMessageTime } from '../../utils/fomatTime';
import { useSelector } from 'react-redux';

const ChatContainer = ({ currentMessages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentMessages]);

    const currentUser = useSelector((state) => state.user.user);
    const selectedUserId = useSelector((state) => state.chat.selectedUserId);
    const users = useSelector((state) => state.chat.users);
    const selectedUser = users.find(user => user._id === selectedUserId);

    if (!currentUser || !selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Đang tải dữ liệu người dùng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative z-10 p-2 sm:p-4">
                {currentMessages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Bắt đầu trò chuyện</h3>
                            <p className="text-slate-600">
                                Hãy bắt đầu cuộc trò chuyện với <span className="font-medium text-blue-600">{selectedUser?.userName || 'người dùng này'}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pb-6">
                        {currentMessages.map((message, index) => {
                            const isCurrentUser = message.senderId === currentUser._id;
                            return (
                                <div
                                    key={message._id}
                                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-fade-in-up w-full`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} gap-2 w-full max-w-[90%] sm:max-w-[80%]`}>
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                                <img
                                                    src={
                                                        isCurrentUser
                                                            ? currentUser.profilePicture || "/avatar.png"
                                                            : selectedUser.profilePicture || "/avatar.png"
                                                    }
                                                    alt="profile pic"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Message Content */}
                                        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                                            {/* Timestamp */}
                                            <div className="mb-1">
                                                <time className="text-xs text-slate-500 font-medium">
                                                    {formatMessageTime(message.createdAt)}
                                                </time>
                                            </div>

                                            {/* Message Bubble */}
                                            <div
                                                className={`relative px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm border transition-all duration-200 hover:shadow-lg ${isCurrentUser
                                                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400/30"
                                                    : "bg-white/80 text-slate-800 border-white/50"
                                                    } w-full`}
                                            >
                                                {/* Message tail */}
                                                <div
                                                    className={`absolute top-3 w-3 h-3 rotate-45 ${isCurrentUser
                                                        ? "bg-blue-500 -right-1.5 border-r border-b border-blue-400/30"
                                                        : "bg-white/80 -left-1.5 border-l border-t border-white/50"
                                                        }`}
                                                ></div>

                                                {/* Image */}
                                                {message.image && (
                                                    <div className="mb-3">
                                                        <img
                                                            src={message.image}
                                                            alt="message image"
                                                            className="max-w-[200px] rounded-lg shadow-sm border border-white/20"
                                                        />
                                                    </div>
                                                )}

                                                {/* Text */}
                                                {message.text && (
                                                    <p className={`leading-relaxed ${isCurrentUser ? "text-white" : "text-slate-800"}`}>
                                                        {message.text}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatContainer;