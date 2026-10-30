import axios from 'axios';

let rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Trim whitespace and remove trailing slashes
rawBase = rawBase.trim().replace(/\/+$/, '');

// Ensure /api is appended if omitted by user in deployment environment variables
if (!rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

const api = axios.create({
  baseURL: rawBase,
});

// Interceptor to attach Bearer token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillgap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
