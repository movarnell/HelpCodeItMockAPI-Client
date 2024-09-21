// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend.michaelvarnell.com:5100', // Ensure this matches your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token if needed
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;