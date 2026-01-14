/**
 * useGrowth ViewModel
 * Handles plant growth visualization calculations
 */

import { useMemo } from 'react';

/**
 * Growth stage definitions
 */
export const GROWTH_STAGES = [
  { minPoints: 100, emoji: '🌳', name: 'Mighty Tree' },
  { minPoints: 50, emoji: '🌿', name: 'Thriving Plant' },
  { minPoints: 25, emoji: '🌱', name: 'Growing Sprout' },
  { minPoints: 10, emoji: '🌱', name: 'Young Seedling' },
  { minPoints: 0, emoji: '🌱', name: 'Seedling' }
];

/**
 * Maximum points for full growth
 */
export const MAX_GROWTH_POINTS = 150;

/**
 * Size bounds for plant visualization
 */
export const SIZE_BOUNDS = {
  min: 48, // 3rem in pixels
  max: 128 // 8rem in pixels
};

/**
 * Calculate growth percentage
 * @param {number} totalScore - User's total score
 * @returns {number} Growth percentage (0-1)
 */
export const calculateGrowthPercent = (totalScore) => {
  return Math.min(totalScore / MAX_GROWTH_POINTS, 1);
};

/**
 * Calculate plant size based on score
 * @param {number} totalScore - User's total score
 * @returns {number} Plant size in pixels
 */
export const calculatePlantSize = (totalScore) => {
  const growthPercent = calculateGrowthPercent(totalScore);
  return SIZE_BOUNDS.min + (SIZE_BOUNDS.max - SIZE_BOUNDS.min) * growthPercent;
};

/**
 * Get growth stage based on total score
 * @param {number} totalScore - User's total score
 * @returns {Object} Growth stage with emoji and name
 */
export const getGrowthStage = (totalScore) => {
  for (const stage of GROWTH_STAGES) {
    if (totalScore >= stage.minPoints) {
      return stage;
    }
  }
  return GROWTH_STAGES[GROWTH_STAGES.length - 1];
};

/**
 * Calculate drop shadow intensity based on growth
 * @param {number} growthPercent - Growth percentage (0-1)
 * @returns {string} CSS filter string for drop shadow
 */
export const calculateDropShadow = (growthPercent) => {
  const blurBase = 4 + growthPercent * 8;
  const spreadBase = 8 + growthPercent * 12;
  const opacity = 0.2 + growthPercent * 0.2;
  return `drop-shadow(0 ${blurBase}px ${spreadBase}px rgba(34, 197, 94, ${opacity}))`;
};

/**
 * ViewModel hook for growth visualization
 * @param {number} totalScore - User's total score
 * @returns {Object} Growth visualization state
 */
export const useGrowth = (totalScore = 0) => {
  // All computed values memoized
  const growthPercent = useMemo(
    () => calculateGrowthPercent(totalScore),
    [totalScore]
  );

  const plantSize = useMemo(
    () => calculatePlantSize(totalScore),
    [totalScore]
  );

  const stage = useMemo(
    () => getGrowthStage(totalScore),
    [totalScore]
  );

  const dropShadow = useMemo(
    () => calculateDropShadow(growthPercent),
    [growthPercent]
  );

  const scale = useMemo(
    () => 0.8 + growthPercent * 0.2,
    [growthPercent]
  );

  const pointsToMaxGrowth = Math.max(0, MAX_GROWTH_POINTS - totalScore);
  const isMaxGrowth = totalScore >= MAX_GROWTH_POINTS;

  return {
    // Computed values
    growthPercent,
    plantSize,
    plantEmoji: stage.emoji,
    stageName: stage.name,
    dropShadow,
    scale,
    pointsToMaxGrowth,
    isMaxGrowth,
    // Style object for easy application
    plantStyle: {
      fontSize: `${plantSize}px`,
      transform: `scale(${scale})`,
      filter: dropShadow
    },
    // Constants
    MAX_GROWTH_POINTS
  };
};

export default useGrowth;
