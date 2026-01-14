/**
 * usePlantData ViewModel
 * Handles plant data fetching and transformation
 */

import { useState, useEffect } from 'react';
import { plantsAPI } from '../models/api';

/**
 * Transform raw plant data from API to UI format
 * @param {Object} plant - Raw plant from API
 * @returns {Object} Transformed plant for UI
 */
export const transformPlant = (plant) => ({
  id: plant.id,
  name: plant.name,
  emoji: plant.emoji,
  points: plant.points || 5,
  repeatPoints: plant.repeat_points || 1,
  firstTimeMessage: plant.first_time_message || 'Congrats! You just helped your biome with a new plant!',
  repeatMessage: plant.repeat_message || 'Plants are good, but diversity is KING!',
  hasEaten: plant.has_eaten,
  timesEaten: plant.times_eaten || 0
});

/**
 * ViewModel hook for plant data management
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {Object} Plant data state and methods
 */
export const usePlantData = (isAuthenticated) => {
  const [foods, setFoods] = useState([]);
  const [eatenFoods, setEatenFoods] = useState(new Set());
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plants from database on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchPlants = async () => {
      try {
        setLoading(true);
        const data = await plantsAPI.getWithStatus();

        // Transform plants for UI
        const plantsWithMessages = data.plants.map(transformPlant);
        setFoods(plantsWithMessages);

        // Set eaten foods from database
        const eaten = new Set(
          plantsWithMessages.filter(p => p.hasEaten).map(p => p.id)
        );
        setEatenFoods(eaten);

        // Set score from database
        if (data.totalPoints) {
          setScore(data.totalPoints);
        }
      } catch (err) {
        console.error('Failed to fetch plants:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [isAuthenticated]);

  /**
   * Mark a food as eaten (optimistic update)
   * @param {number} foodId - ID of the food eaten
   */
  const markFoodEaten = (foodId) => {
    setEatenFoods(prev => new Set([...prev, foodId]));
  };

  /**
   * Update score
   * @param {number} newScore - New score value
   */
  const updateScore = (newScore) => {
    setScore(newScore);
  };

  /**
   * Add points to score
   * @param {number} points - Points to add
   */
  const addPoints = (points) => {
    setScore(prev => prev + points);
  };

  return {
    // State
    foods,
    eatenFoods,
    score,
    loading,
    error,
    // Methods
    markFoodEaten,
    updateScore,
    addPoints,
    setScore
  };
};

export default usePlantData;
