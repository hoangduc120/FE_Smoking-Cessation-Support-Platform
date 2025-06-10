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
    if (process.env.NODE_ENV === "development") {
    }

    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

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
    if (process.env.NODE_ENV === "development") {
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.code === "ECONNABORTED") {
      toast.error("Kết nối chậm. Vui lòng thử lại!");
      return Promise.reject(error);
    }

    if (error.message === "Network Error") {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra mạng!");
      return Promise.reject(error);
    }

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

        localStorage.removeItem("currentUser");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        isRefreshing = false;
        processQueue(refreshError);

        setTimeout(() => {
          if (!window.location.pathname.includes("/auth/login")) {
            window.location.href = "/auth/login";
          }
        }, 100);

        return Promise.reject(refreshError);
      }
    }

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
