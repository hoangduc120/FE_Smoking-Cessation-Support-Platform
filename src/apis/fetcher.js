import axios from 'axios';
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const fetcher = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
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
    if (process.env.NODE_ENV === 'development') {
    }

    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
    if (process.env.NODE_ENV === 'development') {
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle timeout errors đơn giản
    if (error.code === 'ECONNABORTED') {
      toast.error('Kết nối chậm. Vui lòng thử lại!');
      return Promise.reject(error);
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Lỗi kết nối. Vui lòng kiểm tra mạng!');
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
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await fetcher.post('/auth/refresh-token');
        isRefreshing = false;
        processQueue(null);
        return fetcher(originalRequest);
      } catch (refreshError) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        isRefreshing = false;
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors đơn giản
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message || 'Lỗi API';

      // Chỉ show toast cho một số lỗi quan trọng
      if (status === 500) {
        toast.error('Lỗi máy chủ!');
      } else if (status === 403) {
        toast.error('Không có quyền!');
      }
      // Các lỗi khác sẽ được handle ở component level
    }

    return Promise.reject(error);
  }
);

export default fetcher;