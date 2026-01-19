/**
 * Database Tests
 * Tests for database connection, initialization, and CRUD operations
 * 
 * These tests use an in-memory database to avoid affecting the production database.
 */

const initSqlJs = require('sql.js');

// Test database instance
let testDb = null;

// Helper functions that mirror db.js but use test database
function query(sql, params = []) {
  const stmt = testDb.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

function run(sql, params = []) {
  testDb.run(sql, params);
  const changes = testDb.getRowsModified();
  const stmt = testDb.prepare("SELECT last_insert_rowid() as id");
  stmt.step();
  const lastInsertRowid = stmt.getAsObject().id;
  stmt.free();
  return { lastInsertRowid, changes };
}

// Schema for testing
const testSchema = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_seed TEXT NOT NULL,
    weekly_goal INTEGER DEFAULT 30,
    monthly_goal INTEGER DEFAULT 120,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_log_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    points INTEGER DEFAULT 5,
    repeat_points INTEGER DEFAULT 1,
    first_time_message TEXT DEFAULT 'Congrats! You just helped your biome with a new plant!',
    repeat_message TEXT DEFAULT 'Plants are good, but diversity is KING!',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS plant_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plant_id INTEGER NOT NULL,
    points_earned INTEGER NOT NULL,
    is_first_time BOOLEAN NOT NULL,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_plants (
    user_id INTEGER NOT NULL,
    plant_id INTEGER NOT NULL,
    first_eaten_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    times_eaten INTEGER DEFAULT 1,
    PRIMARY KEY (user_id, plant_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
  );
`;

describe('Database Functions', () => {
  beforeAll(async () => {
    const SQL = await initSqlJs();
    testDb = new SQL.Database();
    testDb.run(testSchema);
  });

  afterAll(() => {
    if (testDb) {
      testDb.close();
    }
  });

  beforeEach(() => {
    // Clean up tables before each test
    testDb.run('DELETE FROM user_badges');
    testDb.run('DELETE FROM user_plants');
    testDb.run('DELETE FROM plant_logs');
    testDb.run('DELETE FROM badges');
    testDb.run('DELETE FROM plants');
    testDb.run('DELETE FROM users');
  });

  describe('query function', () => {
    it('should return an array of results', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['testuser', 'test@example.com', 'hash123', 'seed123']);
      
      const results = query('SELECT * FROM users');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].username).toBe('testuser');
    });

    it('should handle empty results', () => {
      const results = query('SELECT * FROM users WHERE id = ?', [9999]);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should support parameterized queries', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['user1', 'user1@test.com', 'hash1', 'seed1']);
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['user2', 'user2@test.com', 'hash2', 'seed2']);
      
      const results = query('SELECT * FROM users WHERE username = ?', ['user1']);
      
      expect(results.length).toBe(1);
      expect(results[0].email).toBe('user1@test.com');
    });

    it('should return multiple rows', () => {
      run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['Apple', '🍎']);
      run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['Banana', '🍌']);
      run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['Carrot', '🥕']);
      
      const results = query('SELECT * FROM plants ORDER BY name');
      
      expect(results.length).toBe(3);
      expect(results[0].name).toBe('Apple');
      expect(results[2].name).toBe('Carrot');
    });
  });

  describe('queryOne function', () => {
    it('should return a single row', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['singleuser', 'single@test.com', 'hash', 'seed']);
      
      const result = queryOne('SELECT * FROM users WHERE username = ?', ['singleuser']);
      
      expect(result).not.toBeNull();
      expect(result.username).toBe('singleuser');
      expect(result.email).toBe('single@test.com');
    });

    it('should return null for non-existent rows', () => {
      const result = queryOne('SELECT * FROM users WHERE id = ?', [9999]);
      
      expect(result).toBeNull();
    });

    it('should return only the first row when multiple match', () => {
      run('INSERT INTO plants (name, emoji, points) VALUES (?, ?, ?)', ['Plant1', '🌱', 5]);
      run('INSERT INTO plants (name, emoji, points) VALUES (?, ?, ?)', ['Plant2', '🌿', 5]);
      
      const result = queryOne('SELECT * FROM plants WHERE points = ?', [5]);
      
      expect(result).not.toBeNull();
      expect(result.name).toBe('Plant1');
    });
  });

  describe('run function', () => {
    it('should return an object with lastInsertRowid for INSERT', () => {
      const result = run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['newuser', 'new@test.com', 'hash', 'seed']);
      
      expect(result).toHaveProperty('lastInsertRowid');
      expect(result.lastInsertRowid).toBeGreaterThan(0);
    });

    it('should return changes count for UPDATE', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['updateuser', 'update@test.com', 'hash', 'seed']);
      
      const result = run('UPDATE users SET weekly_goal = ? WHERE username = ?', [50, 'updateuser']);
      
      expect(result).toHaveProperty('changes');
      expect(result.changes).toBe(1);
    });

    it('should return changes count for DELETE', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['deleteuser', 'delete@test.com', 'hash', 'seed']);
      
      const result = run('DELETE FROM users WHERE username = ?', ['deleteuser']);
      
      expect(result.changes).toBe(1);
    });

    it('should return 0 changes when no rows affected', () => {
      const result = run('DELETE FROM users WHERE id = ?', [9999]);
      
      expect(result.changes).toBe(0);
    });
  });

  describe('Users Table', () => {
    it('should create a user with default values', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['defaultuser', 'default@test.com', 'hash', 'seed']);
      
      const user = queryOne('SELECT * FROM users WHERE username = ?', ['defaultuser']);
      
      expect(user.weekly_goal).toBe(30);
      expect(user.monthly_goal).toBe(120);
      expect(user.current_streak).toBe(0);
      expect(user.longest_streak).toBe(0);
      expect(user.last_log_date).toBeNull();
    });

    it('should enforce unique username constraint', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['uniqueuser', 'unique1@test.com', 'hash', 'seed']);
      
      expect(() => {
        run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
          ['uniqueuser', 'unique2@test.com', 'hash', 'seed']);
      }).toThrow();
    });

    it('should enforce unique email constraint', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['emailuser1', 'same@test.com', 'hash', 'seed']);
      
      expect(() => {
        run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
          ['emailuser2', 'same@test.com', 'hash', 'seed']);
      }).toThrow();
    });

    it('should update user streak', () => {
      run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['streakuser', 'streak@test.com', 'hash', 'seed']);
      
      run('UPDATE users SET current_streak = 5, longest_streak = 5 WHERE username = ?', ['streakuser']);
      
      const user = queryOne('SELECT * FROM users WHERE username = ?', ['streakuser']);
      expect(user.current_streak).toBe(5);
      expect(user.longest_streak).toBe(5);
    });
  });

  describe('Plants Table', () => {
    it('should create a plant with default values', () => {
      run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['TestPlant', '🌱']);
      
      const plant = queryOne('SELECT * FROM plants WHERE name = ?', ['TestPlant']);
      
      expect(plant.points).toBe(5);
      expect(plant.repeat_points).toBe(1);
      expect(plant.is_active).toBe(1);
    });

    it('should enforce unique plant name', () => {
      run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['UniquePlant', '🌱']);
      
      expect(() => {
        run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['UniquePlant', '🌿']);
      }).toThrow();
    });

    it('should support custom points', () => {
      run('INSERT INTO plants (name, emoji, points, repeat_points) VALUES (?, ?, ?, ?)', 
        ['CustomPlant', '🌺', 10, 3]);
      
      const plant = queryOne('SELECT * FROM plants WHERE name = ?', ['CustomPlant']);
      
      expect(plant.points).toBe(10);
      expect(plant.repeat_points).toBe(3);
    });
  });

  describe('Plant Logs Table', () => {
    let userId, plantId;

    beforeEach(() => {
      const userResult = run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['loguser', 'log@test.com', 'hash', 'seed']);
      userId = userResult.lastInsertRowid;

      const plantResult = run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['LogPlant', '🌱']);
      plantId = plantResult.lastInsertRowid;
    });

    it('should create a plant log entry', () => {
      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 5, 1]);
      
      const log = queryOne('SELECT * FROM plant_logs WHERE user_id = ?', [userId]);
      
      expect(log.plant_id).toBe(plantId);
      expect(log.points_earned).toBe(5);
      expect(log.is_first_time).toBe(1);
    });

    it('should track multiple logs for same user', () => {
      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 5, 1]);
      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 1, 0]);
      
      const logs = query('SELECT * FROM plant_logs WHERE user_id = ?', [userId]);
      
      expect(logs.length).toBe(2);
    });

    it('should calculate total points for a user', () => {
      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 5, 1]);
      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 1, 0]);
      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 1, 0]);
      
      const result = queryOne('SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?', [userId]);
      
      expect(result.total).toBe(7);
    });
  });

  describe('User Plants Table', () => {
    let userId, plantId;

    beforeEach(() => {
      const userResult = run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['plantuser', 'plant@test.com', 'hash', 'seed']);
      userId = userResult.lastInsertRowid;

      const plantResult = run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['UserPlant', '🌱']);
      plantId = plantResult.lastInsertRowid;
    });

    it('should track user-plant relationship', () => {
      run('INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)', [userId, plantId]);
      
      const userPlant = queryOne('SELECT * FROM user_plants WHERE user_id = ? AND plant_id = ?', [userId, plantId]);
      
      expect(userPlant).not.toBeNull();
      expect(userPlant.times_eaten).toBe(1);
    });

    it('should update times_eaten count', () => {
      run('INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)', [userId, plantId]);
      run('UPDATE user_plants SET times_eaten = times_eaten + 1 WHERE user_id = ? AND plant_id = ?', [userId, plantId]);
      
      const userPlant = queryOne('SELECT * FROM user_plants WHERE user_id = ? AND plant_id = ?', [userId, plantId]);
      
      expect(userPlant.times_eaten).toBe(2);
    });

    it('should enforce unique user-plant combination', () => {
      run('INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)', [userId, plantId]);
      
      expect(() => {
        run('INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)', [userId, plantId]);
      }).toThrow();
    });
  });

  describe('Badges Table', () => {
    it('should create a badge', () => {
      run('INSERT INTO badges (name, emoji, description, points_required) VALUES (?, ?, ?, ?)', 
        ['TestBadge', '🏆', 'Test description', 100]);
      
      const badge = queryOne('SELECT * FROM badges WHERE name = ?', ['TestBadge']);
      
      expect(badge.emoji).toBe('🏆');
      expect(badge.points_required).toBe(100);
      expect(badge.is_active).toBe(1);
    });

    it('should order badges by points_required', () => {
      run('INSERT INTO badges (name, emoji, description, points_required) VALUES (?, ?, ?, ?)', 
        ['Badge3', '🥉', 'Third', 50]);
      run('INSERT INTO badges (name, emoji, description, points_required) VALUES (?, ?, ?, ?)', 
        ['Badge1', '🥇', 'First', 10]);
      run('INSERT INTO badges (name, emoji, description, points_required) VALUES (?, ?, ?, ?)', 
        ['Badge2', '🥈', 'Second', 25]);
      
      const badges = query('SELECT * FROM badges ORDER BY points_required ASC');
      
      expect(badges[0].name).toBe('Badge1');
      expect(badges[1].name).toBe('Badge2');
      expect(badges[2].name).toBe('Badge3');
    });
  });

  describe('User Badges Table', () => {
    let userId, badgeId;

    beforeEach(() => {
      const userResult = run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['badgeuser', 'badge@test.com', 'hash', 'seed']);
      userId = userResult.lastInsertRowid;

      const badgeResult = run('INSERT INTO badges (name, emoji, description, points_required) VALUES (?, ?, ?, ?)', 
        ['UserBadge', '🏅', 'Test badge', 10]);
      badgeId = badgeResult.lastInsertRowid;
    });

    it('should award badge to user', () => {
      run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeId]);
      
      const userBadge = queryOne('SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?', [userId, badgeId]);
      
      expect(userBadge).not.toBeNull();
    });

    it('should count user badges', () => {
      const badge2Result = run('INSERT INTO badges (name, emoji, description, points_required) VALUES (?, ?, ?, ?)', 
        ['Badge2', '🎖️', 'Another badge', 20]);
      
      run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeId]);
      run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badge2Result.lastInsertRowid]);
      
      const result = queryOne('SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?', [userId]);
      
      expect(result.count).toBe(2);
    });

    it('should prevent duplicate badge awards', () => {
      run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeId]);
      
      expect(() => {
        run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeId]);
      }).toThrow();
    });
  });

  describe('Foreign Key Constraints', () => {
    it('should cascade delete user data when user is deleted', () => {
      const userResult = run('INSERT INTO users (username, email, password_hash, avatar_seed) VALUES (?, ?, ?, ?)', 
        ['cascadeuser', 'cascade@test.com', 'hash', 'seed']);
      const userId = userResult.lastInsertRowid;

      const plantResult = run('INSERT INTO plants (name, emoji) VALUES (?, ?)', ['CascadePlant', '🌱']);
      const plantId = plantResult.lastInsertRowid;

      run('INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)', 
        [userId, plantId, 5, 1]);
      run('INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)', [userId, plantId]);

      // Delete user
      run('DELETE FROM users WHERE id = ?', [userId]);

      // Check cascaded deletes
      const logs = query('SELECT * FROM plant_logs WHERE user_id = ?', [userId]);
      const userPlants = query('SELECT * FROM user_plants WHERE user_id = ?', [userId]);

      expect(logs.length).toBe(0);
      expect(userPlants.length).toBe(0);
    });
  });
});
