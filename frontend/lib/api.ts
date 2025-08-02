import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; bio?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: { content: string }) => api.post('/posts', data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  like: (id: string) => api.put(`/posts/like/${id}`),
  comment: (id: string, data: { text: string }) => api.post(`/posts/comment/${id}`, data),
  deleteComment: (postId: string, commentId: string) =>
    api.delete(`/posts/comment/${postId}/${commentId}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  getPosts: (id: string) => api.get(`/users/${id}/posts`),
  updateProfile: (data: { name: string; bio?: string; profilePicture?: string }) =>
    api.put('/users/profile', data),
  follow: (id: string) => api.put(`/users/follow/${id}`),
};

export default api; 