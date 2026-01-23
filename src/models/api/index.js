/**
 * API Index
 * Frontend-only version - uses localStorage instead of backend
 */

import { authAPI, plantsAPI, logsAPI, badgesAPI, requestsAPI, fetchAPI, API_URL } from './localStorageApi';

// Named exports
export { authAPI, plantsAPI, logsAPI, badgesAPI, requestsAPI, fetchAPI, API_URL };

// Default export for backwards compatibility
export default {
  auth: authAPI,
  plants: plantsAPI,
  logs: logsAPI,
  badges: badgesAPI,
  requests: requestsAPI,
};
