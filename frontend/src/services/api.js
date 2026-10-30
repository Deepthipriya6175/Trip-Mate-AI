import axios from 'axios';

// Support both full base URLs (e.g. https://tripmate.onrender.com/api or https://tripmate.onrender.com) and local fallback
let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let cleanBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

// Ensure /api prefix is present
if (!cleanBaseUrl.endsWith('/api')) {
  cleanBaseUrl = `${cleanBaseUrl}/api`;
}

const api = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tripmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on protected routes, can clear token
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('tripmate_token');
        localStorage.removeItem('tripmate_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
