/**
 * Test Utilities
 * Helper functions and setup for tests
 */

/**
 * Mock plant data for testing
 */
export const mockPlants = [
  {
    id: 1,
    name: 'Apple',
    emoji: '🍎',
    points: 5,
    repeat_points: 1,
    first_time_message: 'Congrats! You just helped your biome with a new plant!',
    repeat_message: 'Plants are good, but diversity is KING!',
    is_active: 1
  },
  {
    id: 2,
    name: 'Banana',
    emoji: '🍌',
    points: 5,
    repeat_points: 1,
    first_time_message: 'Congrats! You just helped your biome with a new plant!',
    repeat_message: 'Plants are good, but diversity is KING!',
    is_active: 1
  },
  {
    id: 3,
    name: 'Mango',
    emoji: '🥭',
    points: 5,
    repeat_points: 1,
    first_time_message: 'Congrats! You just helped your biome with a new plant!',
    repeat_message: 'Plants are good, but diversity is KING!',
    is_active: 1
  }
];

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  avatar_seed: 'seed123',
  weekly_goal: 30,
  monthly_goal: 120,
  current_streak: 5,
  longest_streak: 10,
  created_at: '2026-01-13T00:00:00Z'
};

/**
 * Mock badge data for testing
 */
export const mockBadges = [
  {
    id: 1,
    name: 'Plant Starter',
    emoji: '🌱',
    description: 'Begin your plant diversity journey',
    points_required: 10,
    sort_order: 1
  },
  {
    id: 2,
    name: 'Green Guardian',
    emoji: '🌿',
    description: 'Growing your gut garden',
    points_required: 25,
    sort_order: 2
  },
  {
    id: 3,
    name: 'Nature Hero',
    emoji: '🌳',
    description: 'A true friend of plants',
    points_required: 50,
    sort_order: 3
  }
];

/**
 * Mock plant log data for testing
 */
export const mockPlantLogs = [
  {
    id: 1,
    user_id: 1,
    plant_id: 1,
    points_earned: 5,
    is_first_time: 1,
    logged_at: '2026-01-13T10:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    plant_id: 2,
    points_earned: 5,
    is_first_time: 1,
    logged_at: '2026-01-13T11:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    plant_id: 1,
    points_earned: 1,
    is_first_time: 0,
    logged_at: '2026-01-13T12:00:00Z'
  }
];

/**
 * Create a mock Express request object
 */
export function createMockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: mockUser,
    ...overrides
  };
}

/**
 * Create a mock Express response object
 */
export function createMockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    statusCode: 200,
    _getStatusCode() {
      return this.statusCode;
    }
  };
  return res;
}

/**
 * Create a mock Express next function
 */
export function createMockNext() {
  return jest.fn();
}
/**
 * Integration test utilities
 */

/**
 * Wait for a condition to be true
 */
export async function waitFor(condition, timeout = 5000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Timeout waiting for condition');
}

/**
 * Create test user with token
 */
export function createTestUser(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Extended mock plants with more fields
 */
export const extendedMockPlants = [
  ...mockPlants,
  {
    id: 4,
    name: 'Orange',
    emoji: '🍊',
    category: 'fruit',
    fiber_content: 2.4,
    base_points: 5,
    points: 5,
    repeat_points: 1,
    is_active: 1
  },
  {
    id: 5,
    name: 'Strawberry',
    emoji: '🍓',
    category: 'fruit',
    fiber_content: 2.0,
    base_points: 5,
    points: 5,
    repeat_points: 1,
    is_active: 1
  },
  {
    id: 6,
    name: 'Carrot',
    emoji: '🥕',
    category: 'vegetable',
    fiber_content: 2.8,
    base_points: 5,
    points: 5,
    repeat_points: 1,
    is_active: 1
  }
];

/**
 * Simulate API call with delay
 */
export async function simulateAPICall(data, delayMs = 100) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delayMs);
  });
}

/**
 * Create mock response with pagination
 */
export function createPaginatedResponse(items, page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit)
    }
  };
}

/**
 * Extended mock badge data with unlock status
 */
export const extendedMockBadges = {
  totalPoints: 100,
  badges: [
    {
      id: 1,
      name: 'Plant Starter',
      emoji: '🌱',
      points_required: 10,
      unlocked: true,
      unlocked_at: '2026-01-10T00:00:00Z'
    },
    {
      id: 2,
      name: 'Green Guardian',
      emoji: '🌿',
      points_required: 25,
      unlocked: true,
      unlocked_at: '2026-01-11T00:00:00Z'
    },
    {
      id: 3,
      name: 'Nature Hero',
      emoji: '🌳',
      points_required: 50,
      unlocked: true,
      unlocked_at: '2026-01-12T00:00:00Z'
    },
    {
      id: 4,
      name: 'Plant Master',
      emoji: '🌲',
      points_required: 100,
      unlocked: false,
      unlocked_at: null
    }
  ]
};

/**
 * Helper to generate plant logs for date range
 */
export function generatePlantLogs(userId, startDate, days = 7, plantsPerDay = 3) {
  const logs = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    for (let j = 0; j < plantsPerDay; j++) {
      logs.push({
        id: logs.length + 1,
        user_id: userId,
        plant_id: (j % mockPlants.length) + 1,
        quantity: 1,
        serving_size: 100,
        timestamp: date.toISOString(),
        points_earned: mockPlants[j % mockPlants.length].points
      });
    }
  }
  return logs;
}

/**
 * Assert API error response
 */
export function assertErrorResponse(response, expectedStatus, expectedMessage = null) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('error');
  if (expectedMessage) {
    expect(response.body.error).toContain(expectedMessage);
  }
}

/**
 * Assert successful API response
 */
export function assertSuccessResponse(response, expectedStatus = 200) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toBeDefined();
  expect(response.error).toBeFalsy();
}