import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL;

const fetcher = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

fetcher.interceptors.request.use(
  (config) => {
    // Chỉ log trong development
    if (process.env.NODE_ENV === "development") {
      console.log("Request:", config); // Debug
    }

    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Chỉ áp dụng Content-Type: application/json nếu không phải FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

fetcher.interceptors.response.use(
  (response) => {
    // Chỉ log trong development
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", response); // Debug
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      toast.error("Kết nối chậm. Vui lòng thử lại!");
      return Promise.reject(error);
    }

    // Handle network errors
    if (error.message === "Network Error") {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra mạng!");
      return Promise.reject(error);
    }

    // Handle 401 errors (authentication)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return fetcher(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await fetcher.post("/auth/refresh-token");
        isRefreshing = false;
        processQueue(null);
        return fetcher(originalRequest);
      } catch (refreshError) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        isRefreshing = false;
        processQueue(refreshError);
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message || "Lỗi API";

      if (status === 500) {
        toast.error("Lỗi máy chủ!");
      } else if (status === 403) {
        toast.error("Không có quyền!");
      }
    }

    return Promise.reject(error);
  }
);

export default fetcher;
