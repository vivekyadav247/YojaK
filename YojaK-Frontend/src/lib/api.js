import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let _getToken = null;

export const setAuthInterceptor = (getToken) => {
  _getToken = getToken;
};

// Single interceptor — always uses the latest _getToken ref
api.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // token fetch failed, send request without auth
    }
  }
  return config;
});

export default api;
