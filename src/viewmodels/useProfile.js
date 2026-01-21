/**
 * useProfile ViewModel
 * Handles profile data fetching and aggregation
 */

import { useState, useEffect, useCallback } from 'react';
import { logsAPI, badgesAPI } from '../models/api';

/**
 * Get user-friendly error message
 */
const getErrorMessage = (error) => {
  if (error.userMessage) return error.userMessage;
  if (error.code === 'AUTH_USER_NOT_FOUND') return 'Account not found. Please log out and register again';
  if (error.code === 'NETWORK_ERROR') return 'Unable to connect. Please check your internet connection';
  return error.message || 'Failed to load profile. Please try again';
};

/**
 * ViewModel hook for profile data management
 * @returns {Object} Profile data state and methods
 */
export const useProfile = () => {
  const [topPlants, setTopPlants] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all profile data in parallel
   */
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [topPlantsData, weeklyDataRes, badgesData] = await Promise.all([
        logsAPI.getTopPlants(50), // Fetch more plants for "View All" feature
        logsAPI.getWeekly(),
        badgesAPI.getUserBadges().catch(() => ({ badges: [] }))
      ]);

      setTopPlants(topPlantsData || []);
      setWeeklyData(weeklyDataRes);
      setUserBadges(badgesData.badges || []);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      // If auth error, let it bubble up
      if (err.requiresAuth) {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Computed values from weekly data
  const totalPoints = weeklyData?.summary?.allTimePoints || 0;
  const weeklyPoints = weeklyData?.summary?.weeklyPoints || 0;
  const weeklyGoal = weeklyData?.summary?.weeklyGoal || 150;
  const uniquePlantsThisWeek = weeklyData?.summary?.uniquePlants || 0;

  return {
    // State
    topPlants,
    weeklyData,
    userBadges,
    loading,
    error,
    // Computed
    totalPoints,
    weeklyPoints,
    weeklyGoal,
    uniquePlantsThisWeek,
    // Methods
    refreshProfile: fetchProfileData
  };
};

export default useProfile;
