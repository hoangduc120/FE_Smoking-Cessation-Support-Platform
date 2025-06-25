import fetcher from "../apis/fetcher";

export const accountService = {
  // Lấy tất cả tài khoản
  getAllAccounts: async () => {
    const response = await fetcher.get("/users/all");
    return response.data;
  },

  // Lấy thông tin tài khoản theo ID
  getAccountById: async (id) => {
    const response = await fetcher.get(`/users/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái tài khoản
  updateAccountStatus: async (id, status) => {
    const response = await fetcher.patch(`/users/${id}/status`, { isActive: status });
    return response.data;
  },

  // Cập nhật vai trò tài khoản
  updateAccountRole: async (id, role) => {
    const response = await fetcher.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  // Xóa tài khoản
  deleteAccount: async (id) => {
    const response = await fetcher.delete(`/users/${id}`);
    return response.data;
  }
}; 