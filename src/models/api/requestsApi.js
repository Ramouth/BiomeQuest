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

  /**
   * Get all pending requests (admin only)
   */
  getPending: () => fetchAPI('/requests/pending'),

  /**
   * Approve a plant request (admin only)
   * @param {number} id - Request ID
   * @param {Object} options - { emoji, points, repeatPoints }
   */
  approve: (id, options = {}) =>
    fetchAPI(`/requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(options),
    }),

  /**
   * Reject a plant request (admin only)
   * @param {number} id - Request ID
   * @param {string} adminNotes - Optional rejection reason
   */
  reject: (id, adminNotes) =>
    fetchAPI(`/requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    }),
};
