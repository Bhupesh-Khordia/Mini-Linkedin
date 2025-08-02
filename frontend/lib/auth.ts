import { authAPI } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const auth = {
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  // Register user
  register: async (name: string, email: string, password: string, bio?: string): Promise<AuthResponse> => {
    const response = await authAPI.register({ name, email, password, bio });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Get token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },

  // Update user in localStorage
  updateUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
}; 