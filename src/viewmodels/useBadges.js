/**
 * useBadges ViewModel
 * Handles badge unlock logic and achievement tracking
 */

import { useState, useMemo } from 'react';

/**
 * Badge threshold definitions
 */
export const BADGE_THRESHOLDS = [
  { level: 1, points: 10, name: 'Plant Starter', emoji: '🌱' },
  { level: 2, points: 25, name: 'Green Guardian', emoji: '🌿' },
  { level: 3, points: 50, name: 'Nature Hero', emoji: '🌳' },
  { level: 4, points: 100, name: 'Biome Master', emoji: '🌲' },
  { level: 5, points: 150, name: 'Plant Legend', emoji: '🌴' }
];

/**
 * Get unlocked badges based on total points
 * @param {number} totalPoints - User's total points
 * @returns {Array} List of unlocked badges
 */
export const getUnlockedBadges = (totalPoints) => {
  return BADGE_THRESHOLDS.filter(badge => totalPoints >= badge.points);
};

/**
 * Get next badge to unlock
 * @param {number} totalPoints - User's total points
 * @returns {Object|null} Next badge or null if all unlocked
 */
export const getNextBadge = (totalPoints) => {
  return BADGE_THRESHOLDS.find(badge => totalPoints < badge.points) || null;
};

/**
 * Check if a specific badge is unlocked
 * @param {number} badgeLevel - Badge level (1-5)
 * @param {number} totalPoints - User's total points
 * @returns {boolean} Whether badge is unlocked
 */
export const isBadgeUnlocked = (badgeLevel, totalPoints) => {
  const badge = BADGE_THRESHOLDS[badgeLevel - 1];
  return badge ? totalPoints >= badge.points : false;
};

/**
 * Get motivation message based on weekly progress
 * @param {number} weeklyPoints - Points earned this week
 * @param {number} weeklyGoal - Weekly goal
 * @returns {Object} Motivation message with styling
 */
export const getMotivationMessage = (weeklyPoints, weeklyGoal) => {
  const remaining = weeklyGoal - weeklyPoints;

  if (weeklyPoints >= weeklyGoal) {
    return {
      message: 'Weekly goal achieved! Great work!',
      emoji: '🎉',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    };
  } else if (remaining > 0) {
    return {
      message: `${remaining} more points to unlock this week's badge! You got this!`,
      emoji: '💪',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    };
  }

  return { message: '', emoji: '', color: '', bgColor: '' };
};

/**
 * Calculate progress to next badge
 * @param {number} totalPoints - User's total points
 * @param {Object} nextBadge - Next badge object
 * @returns {number} Progress percentage (0-100)
 */
export const getProgressToNextBadge = (totalPoints, nextBadge) => {
  if (!nextBadge) return 100;
  return Math.min((totalPoints / nextBadge.points) * 100, 100);
};

/**
 * ViewModel hook for badge management
 * @param {number} totalPoints - User's total points
 * @param {number} weeklyPoints - Points earned this week
 * @param {number} weeklyGoal - Weekly goal
 * @returns {Object} Badge state and methods
 */
export const useBadges = (totalPoints = 0, weeklyPoints = 0, weeklyGoal = 30) => {
  const [showBadgePopup, setShowBadgePopup] = useState(null);

  // Computed values using memoization
  const unlockedBadges = useMemo(
    () => getUnlockedBadges(totalPoints),
    [totalPoints]
  );

  const nextBadge = useMemo(
    () => getNextBadge(totalPoints),
    [totalPoints]
  );

  const motivationMessage = useMemo(
    () => getMotivationMessage(weeklyPoints, weeklyGoal),
    [weeklyPoints, weeklyGoal]
  );

  const progressToNext = useMemo(
    () => getProgressToNextBadge(totalPoints, nextBadge),
    [totalPoints, nextBadge]
  );

  const pointsToNextBadge = nextBadge ? nextBadge.points - totalPoints : 0;

  /**
   * Show badge popup
   * @param {Object} badge - Badge to show
   */
  const showBadge = (badge) => {
    setShowBadgePopup(badge);
  };

  /**
   * Hide badge popup
   */
  const hideBadgePopup = () => {
    setShowBadgePopup(null);
  };

  /**
   * Check if a badge is unlocked by level
   * @param {number} level - Badge level
   * @returns {boolean}
   */
  const checkBadgeUnlocked = (level) => {
    return isBadgeUnlocked(level, totalPoints);
  };

  return {
    // Constants
    BADGE_THRESHOLDS,
    // State
    showBadgePopup,
    // Computed
    unlockedBadges,
    nextBadge,
    motivationMessage,
    progressToNext,
    pointsToNextBadge,
    unlockedCount: unlockedBadges.length,
    totalBadges: BADGE_THRESHOLDS.length,
    // Methods
    showBadge,
    hideBadgePopup,
    checkBadgeUnlocked
  };
};

export default useBadges;
