/**
 * ViewModels Index
 * Exports all ViewModel hooks
 */

export { usePlantData, transformPlant } from './usePlantData';
export { useFood, calculateFoodPoints, createFoodRegistration } from './useFood';
export { useProgress, calculateProgressPercent, calculateDailyPoints, getDateForDayIndex, getCurrentDayIndex } from './useProgress';
export { useBadges, BADGE_THRESHOLDS, getUnlockedBadges, getNextBadge, isBadgeUnlocked, getMotivationMessage, getProgressToNextBadge } from './useBadges';
export { useProfile } from './useProfile';
export { useGrowth, GROWTH_STAGES, MAX_GROWTH_POINTS, calculateGrowthPercent, calculatePlantSize, getGrowthStage } from './useGrowth';
