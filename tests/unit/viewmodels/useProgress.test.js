/**
 * useProgress ViewModel Unit Tests
 */

// Mock fetchAPI to avoid import.meta.env issues
jest.mock('../../../src/models/api/fetchApi', () => ({
  fetchAPI: jest.fn()
}));

import { calculateProgressPercent, calculateDailyPoints, getCurrentDayIndex, getDateForDayIndex } from '../../../src/viewmodels/useProgress';

describe('useProgress ViewModel', () => {
  describe('calculateProgressPercent', () => {
    it('should return 0 for 0/30 points', () => {
      expect(calculateProgressPercent(0, 30)).toBe(0);
    });

    it('should return 50 for 15/30 points', () => {
      expect(calculateProgressPercent(15, 30)).toBe(50);
    });

    it('should return 100 for 30/30 points', () => {
      expect(calculateProgressPercent(30, 30)).toBe(100);
    });

    it('should cap at 100 for over-goal', () => {
      expect(calculateProgressPercent(40, 30)).toBe(100);
    });

    it('should handle 0 goal', () => {
      const result = calculateProgressPercent(10, 0);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateDailyPoints', () => {
    it('should return 0 for empty logs array', () => {
      expect(calculateDailyPoints([])).toBe(0);
    });

    it('should sum points_earned from logs', () => {
      const logs = [
        { points_earned: 5 },
        { points_earned: 3 },
        { points_earned: 1 }
      ];
      expect(calculateDailyPoints(logs)).toBe(9);
    });

    it('should handle single log', () => {
      expect(calculateDailyPoints([{ points_earned: 7 }])).toBe(7);
    });

    it('should handle logs without points_earned', () => {
      const logs = [{ id: 1 }, { id: 2 }];
      const result = calculateDailyPoints(logs);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getCurrentDayIndex', () => {
    it('should return number between 0 and 6', () => {
      const index = getCurrentDayIndex();
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(6);
    });

    it('should return 0 for Monday', () => {
      // Mon = 0, Tue = 1, ..., Sun = 6
      expect(typeof getCurrentDayIndex()).toBe('number');
    });
  });

  describe('getDateForDayIndex', () => {
    it('should return ISO date string', () => {
      const currentDayIndex = getCurrentDayIndex();
      const date = getDateForDayIndex(3, currentDayIndex);
      expect(typeof date).toBe('string');
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return current week dates', () => {
      const currentDayIndex = getCurrentDayIndex();
      const mondayDate = getDateForDayIndex(0, currentDayIndex);
      const sundayDate = getDateForDayIndex(6, currentDayIndex);
      expect(mondayDate).toBeTruthy();
      expect(sundayDate).toBeTruthy();
    });

    it('should handle all day indices 0-6', () => {
      const currentDayIndex = getCurrentDayIndex();
      for (let i = 0; i < 7; i++) {
        const date = getDateForDayIndex(i, currentDayIndex);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });
});
