/**
 * API Models Unit Tests
 */

// Mock fetchAPI to avoid import.meta.env issues
jest.mock('../../../src/models/api/fetchApi', () => ({
  fetchAPI: jest.fn(),
  API_URL: 'http://localhost:3001/api'
}));

import { authAPI } from '../../../src/models/api/authApi';
import { plantsAPI } from '../../../src/models/api/plantsApi';
import { logsAPI } from '../../../src/models/api/logsApi';
import { badgesAPI } from '../../../src/models/api/badgesApi';
import { requestsAPI } from '../../../src/models/api/requestsApi';

describe('API Models', () => {
  describe('authAPI', () => {
    it('should have register method', () => {
      expect(typeof authAPI.register).toBe('function');
    });

    it('should have login method', () => {
      expect(typeof authAPI.login).toBe('function');
    });

    it('should have getProfile method', () => {
      expect(typeof authAPI.getProfile).toBe('function');
    });

    it('should have updateGoals method', () => {
      expect(typeof authAPI.updateGoals).toBe('function');
    });
  });

  describe('plantsAPI', () => {
    it('should have getAll method', () => {
      expect(typeof plantsAPI.getAll).toBe('function');
    });

    it('should have getWithStatus method', () => {
      expect(typeof plantsAPI.getWithStatus).toBe('function');
    });

    it('should have search method', () => {
      expect(typeof plantsAPI.search).toBe('function');
    });
  });

  describe('logsAPI', () => {
    it('should have logPlant method', () => {
      expect(typeof logsAPI.logPlant).toBe('function');
    });

    it('should have getDaily method', () => {
      expect(typeof logsAPI.getDaily).toBe('function');
    });

    it('should have getWeekly method', () => {
      expect(typeof logsAPI.getWeekly).toBe('function');
    });

    it('should have getMonthly method', () => {
      expect(typeof logsAPI.getMonthly).toBe('function');
    });

    it('should have getTopPlants method', () => {
      expect(typeof logsAPI.getTopPlants).toBe('function');
    });

    it('should have getAll method with pagination', () => {
      expect(typeof logsAPI.getAll).toBe('function');
    });
  });

  describe('badgesAPI', () => {
    it('should have getAll method', () => {
      expect(typeof badgesAPI.getAll).toBe('function');
    });

    it('should have getUserBadges method', () => {
      expect(typeof badgesAPI.getUserBadges).toBe('function');
    });
  });

  describe('requestsAPI', () => {
    it('should have submit method', () => {
      expect(typeof requestsAPI.submit).toBe('function');
    });

    it('should have getMyRequests method', () => {
      expect(typeof requestsAPI.getMyRequests).toBe('function');
    });
  });
});
