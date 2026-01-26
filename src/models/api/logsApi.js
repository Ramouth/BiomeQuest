/**
 * Logs API
 * Model Layer - plant intake logging operations
 */

import { fetchAPI } from './fetchApi';

export const logsAPI = {
  /**
   * Log a plant intake
   * @param {number} plantId
   */
  logPlant: (plantId) =>
    fetchAPI('/logs', {
      method: 'POST',
      body: JSON.stringify({ plantId }),
    }),

  /**
   * Get daily logs for a specific date
   * @param {string} date - ISO date string (YYYY-MM-DD)
   */
  getDaily: (date) => fetchAPI(`/logs/daily/${date}`),

  /**
   * Get weekly summary
   */
  getWeekly: () => fetchAPI('/logs/weekly'),

  /**
   * Get monthly summary
   */
  getMonthly: () => fetchAPI('/logs/monthly'),

  /**
   * Get weekly summary for popup (compares with personal bests)
   */
  getWeeklySummary: () => fetchAPI('/logs/weekly-summary'),

  /**
   * Get top plants by consumption
   * @param {number} limit - Number of plants to return
   */
  getTopPlants: (limit = 5) => fetchAPI(`/logs/top-plants?limit=${limit}`),

  /**
   * Get paginated logs
   * @param {number} page
   * @param {number} limit
   */
  getAll: (page = 1, limit = 20) => fetchAPI(`/logs?page=${page}&limit=${limit}`),
};
