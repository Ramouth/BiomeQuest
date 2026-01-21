/**
 * Authentication API
 * Model Layer - user authentication and profile operations
 */

import { fetchAPI } from './fetchApi';

export const authAPI = {
  /**
   * Register a new user
   * @param {string} username
   * @param {string} email
   * @param {string} password
   */
  register: (username, email, password) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   */
  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * Get current user profile
   */
  getProfile: () => fetchAPI('/auth/me'),

  /**
   * Update user goals
   * @param {number} weeklyGoal
   * @param {number} monthlyGoal
   */
  updateGoals: (weeklyGoal, monthlyGoal) =>
    fetchAPI('/auth/goals', {
      method: 'PATCH',
      body: JSON.stringify({ weeklyGoal, monthlyGoal }),
    }),

  /**
   * Get all users (admin only)
   */
  getAllUsers: () => fetchAPI('/auth/users'),

  /**
   * Delete a user (admin only)
   * @param {number} id - User ID to delete
   */
  deleteUser: (id) =>
    fetchAPI(`/auth/users/${id}`, {
      method: 'DELETE',
    }),
};
