import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

fetcher.interceptors.request.use(
  (config) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser?.token) {
      config.headers.Authorization = `Bearer ${currentUser.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
