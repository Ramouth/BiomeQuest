/**
 * Plants API
 * Model Layer - plant data operations
 */

import { fetchAPI } from './fetchApi';

export const plantsAPI = {
  /**
   * Get all plants
   */
  getAll: () => fetchAPI('/plants'),

  /**
   * Get plants with user status (eaten/not eaten)
   */
  getWithStatus: () => fetchAPI('/plants/user/status'),

  /**
   * Search plants by query
   * @param {string} query
   */
  search: (query) => fetchAPI(`/plants/search/${encodeURIComponent(query)}`),
};
