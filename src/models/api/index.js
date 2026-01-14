/**
 * API Index
 * Model Layer - exports all API modules
 */

import { authAPI } from './authApi';
import { plantsAPI } from './plantsApi';
import { logsAPI } from './logsApi';
import { badgesAPI } from './badgesApi';
import { requestsAPI } from './requestsApi';
import { fetchAPI, API_URL } from './fetchApi';

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
