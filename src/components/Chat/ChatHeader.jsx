import React from 'react';
import TypingIndicator from '../TypingIndicator';
import { useSelector } from 'react-redux';

const ChatHeader = ({ isUserOnline }) => {
    const selectedUser = useSelector((state) => state.chat.selectedUser);
    const typingUsers = useSelector((state) => state.chat.typingUsers);
    
    if (!selectedUser) return null;

    return (
        <div style={{
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minHeight: '70px',
            backgroundColor: '#ffffff',
            zIndex: 10
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{ position: 'relative' }}>
                    <img
                        src={selectedUser.profilePicture || "/default-avatar.png"}
                        alt={selectedUser.userName}
                        style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%'
                        }}
                    />
                    {isUserOnline(selectedUser._id) && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#4caf50',
                            borderRadius: '50%',
                            border: '2px solid #ffffff'
                        }}></div>
                    )}
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        margin: 0
                    }}>
                        {selectedUser.userName}
                    </h2>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {isUserOnline(selectedUser._id) ? (
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#4caf50',
                                fontSize: '0.875rem'
                            }}>
                                • Đang hoạt động
                            </span>
                        ) : (
                            <span style={{
                                color: '#666',
                                fontSize: '0.875rem'
                            }}>
                                Không hoạt động
                            </span>
                        )}
                        {typingUsers.has(selectedUser._id) && (
                            <TypingIndicator />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;