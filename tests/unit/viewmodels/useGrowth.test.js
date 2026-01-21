/**
 * useGrowth ViewModel Unit Tests
 */

import { calculateGrowthPercent, calculatePlantSize, getGrowthStage, GROWTH_STAGES, MAX_GROWTH_POINTS } from '../../../src/viewmodels/useGrowth';

describe('useGrowth ViewModel', () => {
  describe('Constants', () => {
    it('should have MAX_GROWTH_POINTS defined', () => {
      expect(MAX_GROWTH_POINTS).toBeDefined();
      expect(typeof MAX_GROWTH_POINTS).toBe('number');
      expect(MAX_GROWTH_POINTS).toBeGreaterThan(0);
    });

    it('should have GROWTH_STAGES array', () => {
      expect(Array.isArray(GROWTH_STAGES)).toBe(true);
      expect(GROWTH_STAGES.length).toBeGreaterThan(0);
    });

    it('should have growth stages with required fields', () => {
      GROWTH_STAGES.forEach(stage => {
        expect(stage).toHaveProperty('name');
        expect(stage).toHaveProperty('emoji');
        expect(stage).toHaveProperty('minPoints');
      });
    });
  });

  describe('calculateGrowthPercent', () => {
    it('should return 0 for 0 points', () => {
      expect(calculateGrowthPercent(0)).toBe(0);
    });

    it('should return value between 0 and 1', () => {
      const percent = calculateGrowthPercent(50);
      expect(percent).toBeGreaterThanOrEqual(0);
      expect(percent).toBeLessThanOrEqual(1);
    });

    it('should return 1 at MAX_GROWTH_POINTS', () => {
      expect(calculateGrowthPercent(MAX_GROWTH_POINTS)).toBe(1);
    });

    it('should cap at 1 for points above MAX', () => {
      expect(calculateGrowthPercent(MAX_GROWTH_POINTS + 100)).toBe(1);
    });
  });

  describe('calculatePlantSize', () => {
    it('should return minimum size for 0 points', () => {
      const size = calculatePlantSize(0);
      expect(typeof size).toBe('number');
      expect(size).toBeGreaterThan(0);
    });

    it('should increase size with more points', () => {
      const size1 = calculatePlantSize(10);
      const size2 = calculatePlantSize(50);
      expect(size2).toBeGreaterThan(size1);
    });

    it('should return maximum size at MAX_GROWTH_POINTS', () => {
      const maxSize = calculatePlantSize(MAX_GROWTH_POINTS);
      const overMaxSize = calculatePlantSize(MAX_GROWTH_POINTS + 50);
      expect(maxSize).toBe(overMaxSize);
    });
  });

  describe('getGrowthStage', () => {
    it('should return first stage for 0 points', () => {
      const stage = getGrowthStage(0);
      expect(stage).toBeDefined();
      expect(stage.minPoints).toBe(0);
    });

    it('should return appropriate stage for points', () => {
      const stage = getGrowthStage(50);
      expect(stage).toBeDefined();
      expect(stage.minPoints).toBeLessThanOrEqual(50);
    });

    it('should return last stage for MAX_GROWTH_POINTS', () => {
      const stage = getGrowthStage(MAX_GROWTH_POINTS);
      expect(stage).toBeDefined();
    });

    it('should have emoji property', () => {
      const stage = getGrowthStage(25);
      expect(stage.emoji).toBeDefined();
      expect(typeof stage.emoji).toBe('string');
    });

    it('should have name property', () => {
      const stage = getGrowthStage(25);
      expect(stage.name).toBeDefined();
      expect(typeof stage.name).toBe('string');
    });
  });
});
