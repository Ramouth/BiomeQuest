/**
 * useFood ViewModel
 * Handles food selection, points calculation, and logging
 */

import { useState } from 'react';
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

  /**
   * Handle food selection with optimistic updates and database sync
   * @param {Object} food - The selected food
   * @returns {Promise<Object>} The selected food with display info
   */
  const selectFood = async (food) => {
    const { points, isFirstTime } = calculateFoodPoints(food, eatenFoods);

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
    } catch (err) {
      console.error('Failed to log plant:', err);
      // Could implement rollback here if needed
    } finally {
      setIsLogging(false);
    }

    return foodWithMessage;
  };

  /**
   * Clear selected food
   */
  const clearSelectedFood = () => {
    setSelectedFood(null);
  };

  return {
    // State
    selectedFood,
    foodRegistrations,
    isLogging,
    // Methods
    selectFood,
    clearSelectedFood,
    // Pure functions (for testing)
    calculatePoints: (food) => calculateFoodPoints(food, eatenFoods)
  };
};

export default useFood;
