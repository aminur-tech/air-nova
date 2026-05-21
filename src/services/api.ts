import axios from 'axios';

// Create a configured instance of axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach JWT token if it exists in storage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('_auth_tk');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global intercept for security (e.g., 401 unauthenticated tracking)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear tokens if the backend flags the request session as expired
        localStorage.removeItem('_auth_tk');
        localStorage.removeItem('_auth_usr');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;