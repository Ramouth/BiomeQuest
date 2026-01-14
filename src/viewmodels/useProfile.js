/**
 * useProfile ViewModel
 * Handles profile data fetching and aggregation
 */

import { useState, useEffect } from 'react';
import { logsAPI, badgesAPI } from '../models/api';

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

  // Fetch all profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  /**
   * Fetch all profile data in parallel
   */
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [topPlantsData, weeklyDataRes, badgesData] = await Promise.all([
        logsAPI.getTopPlants(5),
        logsAPI.getWeekly(),
        badgesAPI.getUserBadges().catch(() => ({ badges: [] }))
      ]);

      setTopPlants(topPlantsData || []);
      setWeeklyData(weeklyDataRes);
      setUserBadges(badgesData.badges || []);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Computed values from weekly data
  const totalPoints = weeklyData?.summary?.allTimePoints || 0;
  const weeklyPoints = weeklyData?.summary?.weeklyPoints || 0;
  const weeklyGoal = weeklyData?.summary?.weeklyGoal || 30;
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
