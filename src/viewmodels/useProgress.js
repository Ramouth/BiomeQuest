/**
 * useProgress ViewModel
 * Handles weekly/daily progress data fetching and calculations
 */

import { useState, useEffect, useCallback } from 'react';
import { logsAPI } from '../models/api';

/**
 * Get user-friendly error message
 */
const getErrorMessage = (error) => {
  if (error.userMessage) return error.userMessage;
  if (error.code === 'AUTH_USER_NOT_FOUND') return 'Account not found. Please log out and register again';
  if (error.code === 'NETWORK_ERROR') return 'Unable to connect. Please check your internet connection';
  return error.message || 'Failed to load data. Please try again';
};

/**
 * Calculate progress percentage
 * @param {number} current - Current points
 * @param {number} goal - Goal points
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgressPercent = (current, goal) => {
  return Math.min((current / goal) * 100, 100);
};

/**
 * Calculate total points from daily logs
 * @param {Array} logs - Array of log entries
 * @returns {number} Total points
 */
export const calculateDailyPoints = (logs) => {
  return logs.reduce((sum, log) => sum + (log.points_earned || 0), 0);
};

/**
 * Get date string for a specific day index
 * @param {number} dayIndex - Day index (0 = Monday, 6 = Sunday)
 * @param {number} currentDayIndex - Current day index
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getDateForDayIndex = (dayIndex, currentDayIndex) => {
  const today = new Date();
  const daysDiff = dayIndex - currentDayIndex;
  const date = new Date(today);
  date.setDate(date.getDate() + daysDiff);
  return date.toISOString().split('T')[0];
};

/**
 * Get current day index (0 = Monday, 6 = Sunday)
 * @returns {number} Day index
 */
export const getCurrentDayIndex = () => {
  const today = new Date();
  return today.getDay() === 0 ? 6 : today.getDay() - 1;
};

/**
 * ViewModel hook for progress tracking
 * @returns {Object} Progress state and methods
 */
export const useProgress = () => {
  const [weeklyGoal, setWeeklyGoal] = useState(30);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDayIndex = getCurrentDayIndex();
  const displayDayIndex = selectedDayIndex !== null ? selectedDayIndex : currentDayIndex;

  // Fetch weekly data on mount
  useEffect(() => {
    fetchWeeklyData();
  }, []);

  // Fetch daily logs when selected day changes
  useEffect(() => {
    fetchDailyLogs(displayDayIndex);
  }, [displayDayIndex]);

  /**
   * Fetch weekly summary data
   */
  const fetchWeeklyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsAPI.getWeekly();
      setWeeklyData(data);
      setWeeklyGoal(data.summary?.weeklyGoal || 30);
    } catch (err) {
      console.error('Failed to fetch weekly data:', err);
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

  /**
   * Fetch logs for a specific day
   * @param {number} dayIndex - Day index to fetch
   */
  const fetchDailyLogs = useCallback(async (dayIndex) => {
    try {
      const dateStr = getDateForDayIndex(dayIndex, currentDayIndex);
      const data = await logsAPI.getDaily(dateStr);
      setDailyLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch daily logs:', err);
      setDailyLogs([]);
      // Don't set error for daily logs - weekly data error is more important
    }
  }, [currentDayIndex]);

  /**
   * Handle day selection
   * @param {number} index - Day index to select
   */
  const handleDaySelect = (index) => {
    // Allow selecting past days and today, but not future days
    if (index <= currentDayIndex) {
      setSelectedDayIndex(index === selectedDayIndex ? null : index);
    }
  };

  /**
   * Save weekly goal
   * @param {number} goal - New goal value
   */
  const saveWeeklyGoal = (goal) => {
    setWeeklyGoal(goal);
    // TODO: Persist goal to database via API
  };

  // Computed values
  const weeklyProgress = weeklyData?.summary?.weeklyPoints || 0;
  const progressPercent = calculateProgressPercent(weeklyProgress, weeklyGoal);
  const dailyPoints = calculateDailyPoints(dailyLogs);
  const totalScore = weeklyData?.summary?.allTimePoints || 0;

  return {
    // State
    weeklyGoal,
    weeklyData,
    dailyLogs,
    loading,
    error,
    selectedDayIndex,
    displayDayIndex,
    currentDayIndex,
    // Computed
    weeklyProgress,
    progressPercent,
    dailyPoints,
    totalScore,
    // Methods
    handleDaySelect,
    saveWeeklyGoal,
    refreshWeeklyData: fetchWeeklyData,
    refreshDailyLogs: () => fetchDailyLogs(displayDayIndex)
  };
};

export default useProgress;
