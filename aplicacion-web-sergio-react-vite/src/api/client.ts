import axios from 'axios';

// Centralized Axios instance
const api = axios.create({
  baseURL: 'https://localhost:7019/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
