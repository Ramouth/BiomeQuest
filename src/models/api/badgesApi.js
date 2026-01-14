/**
 * Badges API
 * Model Layer - badge and achievement operations
 */

import { fetchAPI } from './fetchApi';

export const badgesAPI = {
  /**
   * Get all available badges
   */
  getAll: () => fetchAPI('/badges'),

  /**
   * Get current user's earned badges
   */
  getUserBadges: () => fetchAPI('/badges/user'),
};
