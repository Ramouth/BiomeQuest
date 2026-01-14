# BiomeQuest Testing Guide

## Overview
This directory contains all unit tests for the BiomeQuest application, including tests for both the backend (Node.js/Express) and frontend (React) components.

## Directory Structure
```
tests/
├── unit/
│   ├── server/          # Backend API tests
│   │   ├── db.test.js            # Database functions
│   │   ├── auth.test.js          # Authentication routes
│   │   └── plants.test.js        # Plant API routes
│   └── components/      # React component tests
│       ├── PickScreen.test.js    # Food selection screen
│       ├── ProfilePage.test.js   # User profile page
│       └── ProgressPage.test.js  # Progress tracking page
└── utils.js             # Test utilities and mock data
```

## Installation
All testing dependencies are installed automatically:
```bash
npm install --save-dev jest @babel/preset-env @babel/preset-react babel-jest
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- tests/unit/server/db.test.js
```

### Run tests matching a pattern
```bash
npm test -- auth
```

## Configuration Files

### jest.config.js
- Configures Jest to use Node.js test environment
- Sets up code coverage collection
- Configures module mappings and transformations

### .babelrc
- Enables ES6+ and JSX syntax support
- Uses @babel/preset-env for environment-specific transpilation
- Uses @babel/preset-react for React syntax

## Test Structure

Each test file follows this pattern:
```javascript
describe('Component/Function Name', () => {
  describe('Specific Feature', () => {
    it('should do something', () => {
      expect(true).toBe(true);
    });
  });
});
```

## Mock Data
The `tests/utils.js` file provides mock data and helper functions:
- `mockPlants` - Sample plant data
- `mockUser` - Sample user profile
- `mockBadges` - Sample badges
- `mockPlantLogs` - Sample plant logs
- `createMockRequest()` - Mock Express request
- `createMockResponse()` - Mock Express response
- `createMockNext()` - Mock Express next function

## Usage Example

```javascript
import { createMockRequest, createMockResponse, mockPlants } from '../../utils.js';

describe('Plant Routes', () => {
  it('should return plants', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    
    expect(mockPlants.length).toBeGreaterThan(0);
    expect(res.json).toBeDefined();
  });
});
```

## Test Categories

### Server Tests
- **db.test.js** - Database operations (query, queryOne, run)
- **auth.test.js** - User registration, login, authentication
- **plants.test.js** - Plant API endpoints and search

### Component Tests
- **PickScreen.test.js** - Food selection, search, plant expansion
- **ProfilePage.test.js** - User profile, badges, achievements
- **ProgressPage.test.js** - Progress tracking, weekly goals

## Writing Tests

### Test a Promise-based function
```javascript
it('should fetch plants', async () => {
  const result = await query('SELECT * FROM plants');
  expect(Array.isArray(result)).toBe(true);
});
```

### Test with specific values
```javascript
it('should find Apple plant', async () => {
  const result = await queryOne('SELECT * FROM plants WHERE name = ?', ['Apple']);
  expect(result.name).toBe('Apple');
  expect(result.points).toBe(5);
});
```

### Test error handling
```javascript
it('should handle query errors', async () => {
  expect(() => query('INVALID SQL')).rejects.toThrow();
});
```

## Coverage Goals
- Aim for >80% code coverage
- Critical paths should have 100% coverage
- All API routes should have tests
- All React components should have rendering tests

## Continuous Integration
These tests can be integrated into CI/CD pipelines:
```bash
npm test -- --coverage --watchAll=false
```

## Debugging Tests

### Run a single test
```bash
npm test -- --testNamePattern="should return plants"
```

### Run with verbose output
```bash
npm test -- --verbose
```

### Debug in Node
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices
1. **Keep tests focused** - One responsibility per test
2. **Use descriptive names** - Test names should explain what is being tested
3. **Isolate tests** - Use mocks to avoid external dependencies
4. **Clean up** - Use beforeEach/afterEach for setup/teardown
5. **Test behavior, not implementation** - Focus on what the function does, not how

## Troubleshooting

### Tests not finding modules
- Ensure module paths in jest.config.js match your project structure
- Check moduleNameMapper configuration

### Babel syntax errors
- Verify .babelrc presets are installed
- Check that babel-jest is in devDependencies

### Tests timing out
- Increase Jest timeout: `jest.setTimeout(10000);`
- Check for unresolved Promises

## Additional Resources
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
