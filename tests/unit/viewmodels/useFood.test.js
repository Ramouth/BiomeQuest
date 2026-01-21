/**
 * useFood ViewModel Unit Tests
 */

// Mock fetchAPI to avoid import.meta.env issues
jest.mock('../../../src/models/api/fetchApi', () => ({
  fetchAPI: jest.fn()
}));

import { calculateFoodPoints, createFoodRegistration } from '../../../src/viewmodels/useFood';

describe('useFood ViewModel', () => {
  describe('calculateFoodPoints', () => {
    it('should return first-time points when not eaten', () => {
      const food = { id: 1, points: 5, repeatPoints: 1 };
      const eatenFoods = new Set();
      const result = calculateFoodPoints(food, eatenFoods);
      expect(result.points).toBe(5);
      expect(result.isFirstTime).toBe(true);
    });

    it('should return repeat points when already eaten', () => {
      const food = { id: 1, points: 5, repeatPoints: 1 };
      const eatenFoods = new Set([1, 2, 3]);
      const result = calculateFoodPoints(food, eatenFoods);
      expect(result.points).toBe(1);
      expect(result.isFirstTime).toBe(false);
    });

    it('should handle food without repeat_points', () => {
      const food = { id: 1, points: 5 };
      const eatenFoods = new Set();
      const result = calculateFoodPoints(food, eatenFoods);
      expect(result.points).toBe(5);
    });

    it('should return number', () => {
      const result = calculateFoodPoints({ id: 1, points: 5 }, new Set());
      expect(typeof result.points).toBe('number');
    });
  });

  describe('createFoodRegistration', () => {
    it('should create registration object with required fields', () => {
      const food = { id: 1, name: 'Apple' };
      const registration = createFoodRegistration(food, 5, true);
      
      expect(registration).toHaveProperty('foodId');
      expect(registration).toHaveProperty('foodName');
      expect(registration).toHaveProperty('points');
      expect(registration).toHaveProperty('isFirstTime');
      expect(registration).toHaveProperty('timestamp');
    });

    it('should set correct foodId', () => {
      const food = { id: 42, name: 'Banana' };
      const registration = createFoodRegistration(food, 5, false);
      expect(registration.foodId).toBe(42);
    });

    it('should set correct foodName', () => {
      const food = { id: 1, name: 'Orange' };
      const registration = createFoodRegistration(food, 3, true);
      expect(registration.foodName).toBe('Orange');
    });

    it('should set correct points', () => {
      const food = { id: 1, name: 'Apple' };
      const registration = createFoodRegistration(food, 7, false);
      expect(registration.points).toBe(7);
    });

    it('should set correct isFirstTime', () => {
      const food = { id: 1, name: 'Apple' };
      const reg1 = createFoodRegistration(food, 5, true);
      const reg2 = createFoodRegistration(food, 5, false);
      expect(reg1.isFirstTime).toBe(true);
      expect(reg2.isFirstTime).toBe(false);
    });

    it('should set timestamp as Date object', () => {
      const food = { id: 1, name: 'Apple' };
      const registration = createFoodRegistration(food, 5, true);
      expect(registration.timestamp).toBeInstanceOf(Date);
    });
  });
});
