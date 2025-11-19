export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  studentId?: string;
  phone?: string;
  address?: string;
  role: 'user' | 'seller' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  firebaseToken?: string; // Optional Firebase token for Google/Social login
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  studentId?: string;
  phone?: string;
  address?: string;
  firebaseToken?: string; // Optional Firebase token for Google/Social registration
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}
