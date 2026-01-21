/**
 * usePlantData ViewModel Unit Tests
 */

// Mock fetchAPI to avoid import.meta.env issues
jest.mock('../../../src/models/api/fetchApi', () => ({
  fetchAPI: jest.fn()
}));

import { transformPlant } from '../../../src/viewmodels/usePlantData';

describe('usePlantData ViewModel', () => {
  describe('transformPlant', () => {
    it('should transform plant with all fields', () => {
      const rawPlant = {
        id: 1,
        name: 'Apple',
        emoji: '🍎',
        points: 5,
        repeat_points: 1,
        has_eaten: true,
        times_eaten: 3
      };
      
      const transformed = transformPlant(rawPlant);
      expect(transformed).toHaveProperty('id', 1);
      expect(transformed).toHaveProperty('name', 'Apple');
      expect(transformed).toHaveProperty('emoji', '🍎');
      expect(transformed).toHaveProperty('points', 5);
      expect(transformed).toHaveProperty('repeatPoints', 1);
      expect(transformed).toHaveProperty('hasEaten', true);
      expect(transformed).toHaveProperty('timesEaten', 3);
    });

    it('should convert has_eaten to hasEaten', () => {
      const plant1 = transformPlant({ id: 1, name: 'Apple', has_eaten: true });
      const plant2 = transformPlant({ id: 2, name: 'Banana', has_eaten: false });
      
      expect(plant1.hasEaten).toBe(true);
      expect(plant2.hasEaten).toBe(false);
    });

    it('should handle missing has_eaten field', () => {
      const plant = transformPlant({ id: 1, name: 'Apple' });
      expect(plant.hasEaten).toBeUndefined();
    });

    it('should handle missing emoji', () => {
      const plant = transformPlant({ id: 1, name: 'Apple', emoji: '🍎' });
      expect(plant.emoji).toBeDefined();
    });

    it('should rename repeat_points to repeatPoints', () => {
      const plant = transformPlant({ id: 1, name: 'Apple', repeat_points: 2 });
      expect(plant.repeatPoints).toBe(2);
      expect(plant.repeat_points).toBeUndefined();
    });

    it('should handle null values', () => {
      const plant = transformPlant({
        id: 1,
        name: 'Apple',
        emoji: null,
        points: null,
        repeat_points: null
      });
      expect(plant.id).toBe(1);
      expect(plant.name).toBe('Apple');
    });
  });
});
