/**
 * useFood ViewModel
 * Handles food selection, points calculation, and logging
 */

import { useState, useCallback } from 'react';
import { logsAPI } from '../models/api';

/**
 * Calculate points for a food based on whether it's first time or repeat
 * @param {Object} food - The food item
 * @param {Set} eatenFoods - Set of eaten food IDs
 * @returns {Object} Points and whether it's first time
 */
export const calculateFoodPoints = (food, eatenFoods) => {
  const isFirstTime = !eatenFoods.has(food.id);
  const points = isFirstTime ? food.points : food.repeatPoints;
  return { points, isFirstTime };
};

/**
 * Create a food registration entry
 * @param {Object} food - The food item
 * @param {number} points - Points earned
 * @param {boolean} isFirstTime - Whether first time eating
 * @returns {Object} Food registration entry
 */
export const createFoodRegistration = (food, points, isFirstTime) => ({
  foodId: food.id,
  foodName: food.name,
  points,
  isFirstTime,
  timestamp: new Date()
});

/**
 * Get user-friendly error message from error object
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (error) => {
  // Use userMessage from ApiError if available
  if (error.userMessage) {
    return error.userMessage;
  }

  // Handle specific error codes
  if (error.code === 'AUTH_USER_NOT_FOUND') {
    return 'Account not found. Please log out and register again';
  }

  if (error.code === 'NETWORK_ERROR') {
    return 'Unable to connect. Please check your internet connection';
  }

  // Default message
  return error.message || 'Failed to log plant. Please try again';
};

/**
 * ViewModel hook for food selection and logging
 * @param {Object} params - Parameters
 * @param {Set} params.eatenFoods - Set of eaten food IDs
 * @param {Function} params.markFoodEaten - Function to mark food as eaten
 * @param {Function} params.addPoints - Function to add points to score
 * @param {Function} params.setScore - Function to set score directly
 * @returns {Object} Food selection state and methods
 */
export const useFood = ({ eatenFoods, markFoodEaten, addPoints, setScore }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodRegistrations, setFoodRegistrations] = useState([]);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle food selection with optimistic updates and database sync
   * @param {Object} food - The selected food
   * @returns {Promise<Object>} The selected food with display info
   */
  const selectFood = async (food) => {
    // Clear any previous errors
    setError(null);

    const { points, isFirstTime } = calculateFoodPoints(food, eatenFoods);

    // Store original values for potential rollback
    const originalPoints = points;
    const originalFoodId = food.id;

    // Optimistic update - immediate UI feedback
    addPoints(points);
    markFoodEaten(food.id);

    // Create registration entry
    const registration = createFoodRegistration(food, points, isFirstTime);
    setFoodRegistrations(prev => [...prev, registration]);

    // Set selected food with display message
    const foodWithMessage = {
      ...food,
      displayMessage: isFirstTime ? food.firstTimeMessage : food.repeatMessage,
      isFirstTime
    };
    setSelectedFood(foodWithMessage);

    // Persist to database
    setIsLogging(true);
    try {
      const response = await logsAPI.logPlant(food.id);
      // Update score with actual total from database
      if (response.totalPoints !== undefined) {
        setScore(response.totalPoints);
      }
      return foodWithMessage;
    } catch (err) {
      console.error('Failed to log plant:', err);

      // Get user-friendly error message
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      // Rollback optimistic update on error
      addPoints(-originalPoints);
      // Note: We can't easily "unmark" food as eaten without more state management
      // The UI will refresh on next data fetch

      // Remove the failed registration
      setFoodRegistrations(prev =>
        prev.filter(reg => reg.foodId !== originalFoodId || reg.timestamp !== registration.timestamp)
      );

      // Update selected food to show error state
      setSelectedFood({
        ...foodWithMessage,
        error: errorMessage
      });

      // Check if error requires re-authentication
      if (err.requiresAuth) {
        // The AuthContext will handle this via the error code
        throw err;
      }

      return { ...foodWithMessage, error: errorMessage };
    } finally {
      setIsLogging(false);
    }
  };

  /**
   * Clear selected food and any errors
   */
  const clearSelectedFood = useCallback(() => {
    setSelectedFood(null);
    setError(null);
  }, []);

  /**
   * Clear error only
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    selectedFood,
    foodRegistrations,
    isLogging,
    error,
    // Methods
    selectFood,
    clearSelectedFood,
    clearError,
    // Pure functions (for testing)
    calculatePoints: (food) => calculateFoodPoints(food, eatenFoods)
  };
};

export default useFood;
