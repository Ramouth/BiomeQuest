import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// AUTH SERVICES
export const authService = {
  register: async (username, email, password, passwordConfirm) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      passwordConfirm
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// CONSUMPTION SERVICES
export const consumptionService = {
  logConsumption: async (plantId) => {
    const response = await api.post('/consumptions/log', { plantId });
    return response.data;
  },

  getHistory: async (limit = 20, skip = 0) => {
    const response = await api.get(`/consumptions/history?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  getConsumedPlants: async () => {
    const response = await api.get('/consumptions/plants');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/consumptions/stats');
    return response.data;
  }
};

export default api;
