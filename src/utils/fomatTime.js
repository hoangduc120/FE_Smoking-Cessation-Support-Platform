export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function formatSidebarTime(date) {
    if (!date) return '';

    const now = new Date();
    const messageDate = new Date(date);

    if (isNaN(messageDate.getTime())) return '';

    const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
        return 'Vừa xong';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} phút`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ`;
    } else if (diffInDays < 7) {
        return `${diffInDays} ngày`;
    } else {
        return messageDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        });
    }
}