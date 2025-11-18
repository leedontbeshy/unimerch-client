import axios from 'axios';
import type { AxiosError } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.unimerch.space';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenStorage.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
