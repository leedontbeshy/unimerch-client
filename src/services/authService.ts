import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/forgot-password', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  }
};
