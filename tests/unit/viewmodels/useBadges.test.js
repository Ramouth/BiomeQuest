/**
 * useBadges ViewModel Unit Tests
 */

import { getUnlockedBadges, getNextBadge, isBadgeUnlocked, getMotivationMessage, getProgressToNextBadge, BADGE_THRESHOLDS } from '../../../src/viewmodels/useBadges';

describe('useBadges ViewModel', () => {
  describe('BADGE_THRESHOLDS', () => {
    it('should have 5 badge levels', () => {
      expect(BADGE_THRESHOLDS).toHaveLength(5);
    });

    it('should have increasing point requirements', () => {
      for (let i = 1; i < BADGE_THRESHOLDS.length; i++) {
        expect(BADGE_THRESHOLDS[i].points).toBeGreaterThan(BADGE_THRESHOLDS[i-1].points);
      }
    });

    it('should have required fields', () => {
      BADGE_THRESHOLDS.forEach(badge => {
        expect(badge).toHaveProperty('level');
        expect(badge).toHaveProperty('points');
        expect(badge).toHaveProperty('name');
        expect(badge).toHaveProperty('emoji');
      });
    });
  });

  describe('getUnlockedBadges', () => {
    it('should return empty array for 0 points', () => {
      expect(getUnlockedBadges(0)).toEqual([]);
    });

    it('should return first badge at 10 points', () => {
      const badges = getUnlockedBadges(10);
      expect(badges).toHaveLength(1);
      expect(badges[0].level).toBe(1);
    });

    it('should return multiple badges at 100 points', () => {
      const badges = getUnlockedBadges(100);
      expect(badges.length).toBeGreaterThanOrEqual(4);
    });

    it('should return all badges at 150+ points', () => {
      expect(getUnlockedBadges(150)).toHaveLength(5);
      expect(getUnlockedBadges(200)).toHaveLength(5);
    });
  });

  describe('getNextBadge', () => {
    it('should return first badge for 0 points', () => {
      const next = getNextBadge(0);
      expect(next.level).toBe(1);
      expect(next.points).toBe(10);
    });

    it('should return second badge for 15 points', () => {
      const next = getNextBadge(15);
      expect(next.level).toBe(2);
      expect(next.points).toBe(25);
    });

    it('should return null when all badges unlocked', () => {
      expect(getNextBadge(150)).toBeNull();
      expect(getNextBadge(200)).toBeNull();
    });
  });

  describe('isBadgeUnlocked', () => {
    it('should return false for level 1 with 0 points', () => {
      expect(isBadgeUnlocked(1, 0)).toBe(false);
    });

    it('should return true for level 1 with 10 points', () => {
      expect(isBadgeUnlocked(1, 10)).toBe(true);
    });

    it('should return true for level 1 with 50 points', () => {
      expect(isBadgeUnlocked(1, 50)).toBe(true);
    });

    it('should return false for level 5 with 100 points', () => {
      expect(isBadgeUnlocked(5, 100)).toBe(false);
    });

    it('should return true for level 5 with 150 points', () => {
      expect(isBadgeUnlocked(5, 150)).toBe(true);
    });
  });

  describe('getMotivationMessage', () => {
    it('should return achievement message at 100%', () => {
      const msg = getMotivationMessage(30, 30);
      expect(msg.message).toContain('Weekly goal');
      expect(msg.emoji).toBeDefined();
    });

    it('should return progress message between 0-100%', () => {
      const msg = getMotivationMessage(15, 30);
      expect(msg.message).toBeTruthy();
    });

    it('should return encouraging message at 0%', () => {
      const msg = getMotivationMessage(0, 30);
      expect(msg.message).toBeTruthy();
    });

    it('should have color and bgColor properties', () => {
      const msg = getMotivationMessage(20, 30);
      expect(msg).toHaveProperty('color');
      expect(msg).toHaveProperty('bgColor');
    });
  });

  describe('getProgressToNextBadge', () => {
    it('should return 0% at 0 points for 10-point badge', () => {
      const next = getNextBadge(0);
      expect(getProgressToNextBadge(0, next)).toBe(0);
    });

    it('should return 50% at 5 points for 10-point badge', () => {
      const next = getNextBadge(0);
      expect(getProgressToNextBadge(5, next)).toBe(50);
    });

    it('should return 100% at 10 points for 10-point badge', () => {
      const next = getNextBadge(0);
      expect(getProgressToNextBadge(10, next)).toBe(100);
    });

    it('should return 100% when nextBadge is null', () => {
      expect(getProgressToNextBadge(200, null)).toBe(100);
    });

    it('should cap at 100%', () => {
      const next = getNextBadge(0);
      expect(getProgressToNextBadge(20, next)).toBe(100);
    });
  });
});
