/**
 * Plant Requests API
 * Model Layer - user plant request operations
 */

import { fetchAPI } from './fetchApi';

export const requestsAPI = {
  /**
   * Submit a new plant request
   * @param {string} plantName
   * @param {string} suggestedEmoji
   * @param {string} description
   */
  submit: (plantName, suggestedEmoji, description) =>
    fetchAPI('/requests', {
      method: 'POST',
      body: JSON.stringify({ plantName, suggestedEmoji, description }),
    }),

  /**
   * Get current user's submitted requests
   */
  getMyRequests: () => fetchAPI('/requests/my-requests'),
};
