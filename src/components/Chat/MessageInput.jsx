import React, { useRef, useState, useEffect } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const MessageInput = ({ messageText, handleTyping, handleKeyDown, handleSendMessage, selectedImage, setSelectedImage, isConnected, handleImageSelect }) => {
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ((messageText && messageText.trim()) || selectedImage) {
            handleSendMessage(e);
        }
    };

    const handleSendClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ((messageText && messageText.trim()) || selectedImage) {
            handleSendMessage(e);
        }
    };

    const isSendDisabled = !isConnected || ((!messageText || !messageText.trim()) && !selectedImage);

    const handleImageSelectWithPreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            handleImageSelect(e);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (!selectedImage && imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    }, [selectedImage, imagePreview]);

    return (
        <div className="p-4 border-t border-gray-200 bg-white z-10 shadow-lg">
            {selectedImage && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 animate-fade-in">
                    <div className="flex items-start gap-3">
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="flex-shrink-0">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                                />
                            </div>
                        )}

                        {/* Image Info */}
                        <div className="flex-grow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="flex items-center text-blue-700 text-sm font-medium">
                                        <span className="mr-2 text-lg">📷</span>
                                        {selectedImage.name}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="bg-none border-none text-red-500 cursor-pointer hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-all duration-200 ml-2"
                                    title="Xóa hình ảnh"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex gap-3 items-end">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelectWithPreview}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-none border-none text-indigo-500 cursor-pointer text-2xl transition-all duration-200 hover:scale-110 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    title="Chọn ảnh"
                >
                    <InsertPhotoIcon />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        className={`
                            w-full min-h-[40px] max-h-[100px] rounded-lg border px-4 py-3 text-sm resize-none
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                            ${isConnected
                                ? 'border-gray-300 bg-white placeholder-gray-500 hover:border-gray-400'
                                : 'border-gray-200 bg-gray-50 placeholder-gray-400 cursor-not-allowed'
                            }
                        `}
                        placeholder="Nhập tin nhắn..."
                        value={messageText}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!isConnected}
                    />
                    {!isConnected && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                                Đang kết nối...
                            </span>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSendClick}
                    disabled={isSendDisabled}
                    className={`
                        border-none rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 font-medium text-sm
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isSendDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 focus:ring-indigo-500 shadow-lg hover:shadow-xl'
                        }
                    `}
                    title={!isConnected ? "Đang kết nối..." : "Gửi tin nhắn"}
                >
                    <span className="text-lg">➤</span>
                </button>
            </form>

            {/* Status indicator */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span>{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
                </div>
                {messageText && messageText.length > 0 && (
                    <span className="text-gray-400">
                        {messageText.length} ký tự
                    </span>
                )}
            </div>
        </div>
    );
};

export default MessageInput;