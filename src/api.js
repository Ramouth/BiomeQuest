const API_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => fetchAPI('/auth/me'),

  updateGoals: (weeklyGoal, monthlyGoal) =>
    fetchAPI('/auth/goals', {
      method: 'PATCH',
      body: JSON.stringify({ weeklyGoal, monthlyGoal }),
    }),
};

// Plants API
export const plantsAPI = {
  getAll: () => fetchAPI('/plants'),
  getWithStatus: () => fetchAPI('/plants/user/status'),
  search: (query) => fetchAPI(`/plants/search/${encodeURIComponent(query)}`),
};

// Logs API
export const logsAPI = {
  logPlant: (plantId) =>
    fetchAPI('/logs', {
      method: 'POST',
      body: JSON.stringify({ plantId }),
    }),

  getDaily: (date) => fetchAPI(`/logs/daily/${date}`),
  getWeekly: () => fetchAPI('/logs/weekly'),
  getMonthly: () => fetchAPI('/logs/monthly'),
  getTopPlants: (limit = 5) => fetchAPI(`/logs/top-plants?limit=${limit}`),
  getAll: (page = 1, limit = 20) => fetchAPI(`/logs?page=${page}&limit=${limit}`),
};

// Badges API
export const badgesAPI = {
  getAll: () => fetchAPI('/badges'),
  getUserBadges: () => fetchAPI('/badges/user'),
};

// Plant Requests API
export const requestsAPI = {
  submit: (plantName, suggestedEmoji, description) =>
    fetchAPI('/requests', {
      method: 'POST',
      body: JSON.stringify({ plantName, suggestedEmoji, description }),
    }),

  getMyRequests: () => fetchAPI('/requests/my-requests'),
};

export default {
  auth: authAPI,
  plants: plantsAPI,
  logs: logsAPI,
  badges: badgesAPI,
  requests: requestsAPI,
};
