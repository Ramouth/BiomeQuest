/**
 * Feedback API
 * Model Layer - beta feedback operations
 */

import { fetchAPI } from './fetchApi';

export const feedbackAPI = {
  /**
   * Submit beta feedback
   * @param {number} rating - 1-5 star rating
   * @param {string} feedbackText - Optional feedback text
   */
  submit: (rating, feedbackText) =>
    fetchAPI('/feedback', {
      method: 'POST',
      body: JSON.stringify({ rating, feedbackText }),
    }),

  /**
   * Check if current user has submitted feedback
   */
  getStatus: () => fetchAPI('/feedback/status'),

  /**
   * Get all feedback (admin only)
   */
  getAll: () => fetchAPI('/feedback/all'),
};
