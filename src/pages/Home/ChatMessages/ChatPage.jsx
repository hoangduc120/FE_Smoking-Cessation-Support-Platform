import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markMessageRead,
    selectUser,
    addNewMessage,
    setUnreadMessages,
    markMessagesAsRead,
    initializeSidebarOrder,
    moveUserToTopForCurrentUser,
    setCurrentUserId,
    restoreFromLocalStorage,
    clearLocalStorageData
} from "../../../store/slices/chatSlice";
import { connectSocket } from "../../../store/slices/socketSlice";
import { useSocket, useSocketEvent, useOnlineUsers } from "../../../hooks/useSocket";
import toast from "react-hot-toast";

import SideBarChat from "../../../components/Chat/SideBarChat";
import ChatHeader from "../../../components/Chat/ChatHeader";
import ChatContainer from "../../../components/Chat/ChatContainer";
import MessageInput from "../../../components/Chat/MessageInput";

export default function ChatPage() {
    const dispatch = useDispatch();
    const {
        users,
        conversations,
        messages,
        selectedUserId,
        currentUserId: reduxCurrentUserId,
        isLoading,
        userSidebarOrder,
        unreadMessages,
        conversationsData
    } = useSelector((state) => state.chat);

    const currentUser = useSelector((state) => {
        const authUser = state.auth.currentUser;

        if (!authUser) {
            try {
                const storedData = JSON.parse(localStorage.getItem('currentUser'));
                if (storedData) {
                    const user = storedData.user || storedData;
                    return user;
                }
            } catch (error) {
                console.error("Error reading user from localStorage:", error);
            }
        }

        return authUser;
    });

    const getCurrentUserId = useMemo(() => {
        if (reduxCurrentUserId) return reduxCurrentUserId;

        if (currentUser) {
            if (currentUser.id) return currentUser.id;
            if (currentUser._id) return currentUser._id;

            if (currentUser.user?.id) return currentUser.user.id;
            if (currentUser.user?._id) return currentUser.user._id;

            if (currentUser.data?.user?.id) return currentUser.data.user.id;
            if (currentUser.data?.user?._id) return currentUser.data.user._id;
        }

        return null;
    }, [reduxCurrentUserId, currentUser]);

    const currentUserId = getCurrentUserId;

    const finalCurrentUserId = currentUserId || "temp_user_id_for_testing";

    useEffect(() => {
        if (currentUserId && currentUserId !== reduxCurrentUserId) {
            dispatch(setCurrentUserId(currentUserId));
        }
    }, [currentUserId, reduxCurrentUserId, dispatch]);



    const { onlineUsers, isUserOnline } = useOnlineUsers();
    const { emit, isConnected } = useSocket();

    const [messageText, setMessageText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (finalCurrentUserId) {
            try {
                const storedConversationsData = localStorage.getItem('chatConversationsData');
                if (storedConversationsData) {
                    const parsed = JSON.parse(storedConversationsData);
                    const hasDateObjects = Object.values(parsed).some(conv =>
                        conv.lastMessageAt && typeof conv.lastMessageAt === 'string' &&
                        conv.lastMessageAt.includes('GMT')
                    );
                    if (hasDateObjects) {
                        console.log('Clearing old localStorage format with Date objects');
                        dispatch(clearLocalStorageData());
                    }
                }
            } catch (error) {
                dispatch(clearLocalStorageData());
            }

            dispatch(restoreFromLocalStorage());

            dispatch(fetchUsers()).then((result) => {
                if (result.type === 'chat/fetchUsers/fulfilled') {
                    dispatch(initializeSidebarOrder({
                        currentUserId: finalCurrentUserId,
                        users: result.payload
                    }));
                }
            });

            dispatch(fetchConversations()).then((result) => {
                if (result.type === 'chat/fetchConversations/fulfilled') {
                    dispatch(setUnreadMessages(result.payload));
                }
            });

        }
    }, [dispatch, finalCurrentUserId]);

    useEffect(() => {
        const connectManually = () => {
            const storedData = JSON.parse(localStorage.getItem('currentUser'));
            if (storedData) {
                const realUser = storedData.user || storedData;
                const realToken = storedData.token || localStorage.getItem('token');
                const userId = realUser.id || realUser._id;

                if (userId && !isConnected) {
                    dispatch(connectSocket({
                        userId: userId,
                        token: realToken
                    }));
                }
            }
        };

        if (!isConnected) {
            const timer = setTimeout(connectManually, 2000);
            return () => clearTimeout(timer);
        }
    }, [isConnected, onlineUsers, dispatch]);

    useEffect(() => {
        if (selectedUserId) {
            if (!messages[selectedUserId] || messages[selectedUserId].length === 0) {
                dispatch(fetchMessages(selectedUserId))
                    .unwrap()
                    .catch(error => {
                        toast.error("Không thể tải tin nhắn: " + (error.message || "Lỗi không xác định"));
                    });
            }
        }
    }, [selectedUserId, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [messages[selectedUserId]]);

    useSocketEvent('newMessage', (message) => {
        const messageSenderId = message.senderId?._id || message.senderId;
        const messageReceiverId = message.receiverId?._id || message.receiverId;

        let conversationId = null;
        if (messageReceiverId === finalCurrentUserId) {
            conversationId = messageSenderId;
        } else if (messageSenderId === finalCurrentUserId) {
            conversationId = messageReceiverId;
        }

        if (conversationId) {
            dispatch(addNewMessage({
                message,
                conversationId
            }));

            if (conversationId === selectedUserId) {
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }
        }

        if (messageReceiverId === finalCurrentUserId && messageSenderId !== finalCurrentUserId) {
            dispatch(moveUserToTopForCurrentUser({
                currentUserId: finalCurrentUserId,
                userToMoveId: messageSenderId
            }));
        }
    });

    useSocketEvent('userTyping', ({ senderId, isTyping }) => {
        if (senderId === selectedUserId) {
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                if (isTyping) {
                    newSet.add(senderId);
                    setTimeout(() => {
                        setTypingUsers(currentSet => {
                            const updatedSet = new Set(currentSet);
                            updatedSet.delete(senderId);
                            return updatedSet;
                        });
                    }, 5000);
                } else {
                    newSet.delete(senderId);
                }
                return newSet;
            });
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSelectUser = (userId) => {
        dispatch(selectUser(userId));
        dispatch(markMessageRead(userId));
        dispatch(markMessagesAsRead(userId));
    };

    const handleSendMessage = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!selectedUserId || (!messageText.trim() && !selectedImage)) {
            toast.error("Vui lòng chọn người nhận và nhập nội dung tin nhắn");
            return;
        }

        try {
            const textToSend = messageText.trim();
            const imageToSend = selectedImage;

            setMessageText("");
            setSelectedImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            const result = await dispatch(sendMessage({
                receiverId: selectedUserId,
                text: textToSend,
                image: imageToSend
            })).unwrap();

            setTimeout(scrollToBottom, 100);

            if (finalCurrentUserId && selectedUserId) {
                dispatch(moveUserToTopForCurrentUser({
                    currentUserId: finalCurrentUserId,
                    userToMoveId: selectedUserId
                }));
            }
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            toast.error("Gửi tin nhắn thất bại: " + (error.message || "Đã xảy ra lỗi"));

            setMessageText(messageText);
            setSelectedImage(selectedImage);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleSendMessage();
        }
    };

    const handleTyping = (value) => {
        setMessageText(value);

        if (!selectedUserId || !isConnected) return;

        if (!isTyping) {
            setIsTyping(true);
            emit('typing', { receiverId: selectedUserId, isTyping: true });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            emit('typing', { receiverId: selectedUserId, isTyping: false });
        }, 2000);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sortedUsers = useMemo(() => {
        if (!users || !finalCurrentUserId || !userSidebarOrder[finalCurrentUserId]) {
            return users || [];
        }

        const sidebarOrder = userSidebarOrder[finalCurrentUserId];
        const userMap = new Map(users.map(user => [user._id, user]));

        const orderedUsers = [];

        sidebarOrder.forEach(userId => {
            if (userMap.has(userId)) {
                orderedUsers.push(userMap.get(userId));
                userMap.delete(userId);
            }
        });

        userMap.forEach(user => {
            orderedUsers.push(user);
        });

        return orderedUsers;
    }, [users, finalCurrentUserId, userSidebarOrder]);

    const selectedUser = useMemo(() =>
        users?.find(user => user._id === selectedUserId),
        [users, selectedUserId]
    );

    const currentMessages = useMemo(() =>
        messages[selectedUserId] || [],
        [messages, selectedUserId]
    );

    return (
        <div className="w-full h-[calc(100vh-64px)] flex bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex w-full h-full m-0 shadow-2xl rounded-lg overflow-hidden bg-white">
                {/* Sidebar - User List */}
                <div className="w-full max-w-xs h-full border-r border-gray-200 bg-white shadow-lg">
                    <SideBarChat
                        users={sortedUsers}
                        selectedUserId={selectedUserId}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        isUserOnline={isUserOnline}
                        handleSelectUser={handleSelectUser}
                        unreadMessages={unreadMessages}
                        conversationsData={conversationsData}
                    />
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 h-full flex flex-col bg-white relative">
                    {selectedUser ? (
                        <>
                            <ChatHeader
                                selectedUser={selectedUser}
                                isUserOnline={isUserOnline}
                                typingUsers={typingUsers}
                            />
                            <ChatContainer
                                currentMessages={currentMessages}
                                currentUser={currentUser || {}}
                                selectedUser={selectedUser}
                                formatTime={formatTime}
                                scrollToBottom={scrollToBottom}
                            />
                            <MessageInput
                                messageText={messageText}
                                handleTyping={handleTyping}
                                handleKeyDown={handleKeyDown}
                                handleSendMessage={handleSendMessage}
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                                isConnected={isConnected}
                                handleImageSelect={handleImageSelect}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                            <div className="text-center animate-fade-in-up">
                                {/* Animated Chat Icon */}
                                <div className="relative mb-8">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-6xl shadow-2xl mx-auto animate-bounce-slow">
                                        💬
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white animate-pulse delay-300"></div>
                                </div>

                                {/* Welcome Message */}
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Chào mừng đến với Chat!
                                    </h2>
                                    <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                                        Chọn một người dùng từ danh sách bên trái để bắt đầu cuộc trò chuyện thú vị
                                    </p>

                                    {/* Feature Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                                        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="text-2xl mb-2">⚡</div>
                                            <h3 className="font-semibold text-gray-800">Tin nhắn nhanh</h3>
                                            <p className="text-sm text-gray-600">Gửi và nhận tin nhắn trong thời gian thực</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="text-2xl mb-2">📷</div>
                                            <h3 className="font-semibold text-gray-800">Chia sẻ hình ảnh</h3>
                                            <p className="text-sm text-gray-600">Gửi hình ảnh và media dễ dàng</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="text-2xl mb-2">🌟</div>
                                            <h3 className="font-semibold text-gray-800">Trạng thái online</h3>
                                            <p className="text-sm text-gray-600">Xem ai đang trực tuyến</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin-reverse"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Đang tải...</h3>
                            <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}