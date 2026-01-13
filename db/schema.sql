-- BiomeQuest SQLite Database Schema
-- Plant diversity tracking for gut health

PRAGMA foreign_keys = ON;

-- ============================================
-- USERS TABLE
-- Stores user accounts and profile information
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_seed TEXT NOT NULL,              -- Seed for DiceBear avatar generation
    weekly_goal INTEGER DEFAULT 30,         -- Weekly points goal
    monthly_goal INTEGER DEFAULT 120,       -- Monthly points goal
    current_streak INTEGER DEFAULT 0,       -- Current consecutive days logged
    longest_streak INTEGER DEFAULT 0,       -- Best streak achieved
    last_log_date DATE,                     -- Last date user logged a plant
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PLANTS TABLE
-- Master list of all available plants
-- ============================================
CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    points INTEGER DEFAULT 5,               -- Points for first-time logging
    repeat_points INTEGER DEFAULT 1,        -- Points for repeat logging
    first_time_message TEXT DEFAULT 'Congrats! You just helped your biome with a new plant!',
    repeat_message TEXT DEFAULT 'Plants are good, but diversity is KING!',
    is_active BOOLEAN DEFAULT 1,            -- Soft delete flag
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PLANT_LOGS TABLE
-- Records each plant intake entry by users
-- ============================================
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

-- Index for efficient querying by user and date
CREATE INDEX IF NOT EXISTS idx_plant_logs_user_date ON plant_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_plant_logs_plant ON plant_logs(plant_id);

-- ============================================
-- USER_PLANTS TABLE
-- Tracks which plants each user has tried (for first-time detection)
-- ============================================
CREATE TABLE IF NOT EXISTS user_plants (
    user_id INTEGER NOT NULL,
    plant_id INTEGER NOT NULL,
    first_eaten_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    times_eaten INTEGER DEFAULT 1,          -- Total times this plant was logged
    PRIMARY KEY (user_id, plant_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

-- ============================================
-- BADGES TABLE
-- Configurable achievement definitions
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,       -- Points threshold to unlock
    sort_order INTEGER DEFAULT 0,           -- Display order
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER_BADGES TABLE
-- Tracks which badges each user has unlocked
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- ============================================
-- PLANT_REQUESTS TABLE
-- User-submitted requests for new plants
-- ============================================
CREATE TABLE IF NOT EXISTS plant_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plant_name TEXT NOT NULL,
    suggested_emoji TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_plant_requests_status ON plant_requests(status);
CREATE INDEX IF NOT EXISTS idx_plant_requests_user ON plant_requests(user_id);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User total points
CREATE VIEW IF NOT EXISTS user_total_points AS
SELECT
    user_id,
    SUM(points_earned) as total_points
FROM plant_logs
GROUP BY user_id;

-- User weekly points (last 7 days)
CREATE VIEW IF NOT EXISTS user_weekly_points AS
SELECT
    user_id,
    SUM(points_earned) as weekly_points
FROM plant_logs
WHERE logged_at >= date('now', '-7 days')
GROUP BY user_id;

-- User monthly points (last 30 days)
CREATE VIEW IF NOT EXISTS user_monthly_points AS
SELECT
    user_id,
    SUM(points_earned) as monthly_points
FROM plant_logs
WHERE logged_at >= date('now', '-30 days')
GROUP BY user_id;

-- User unique plants count
CREATE VIEW IF NOT EXISTS user_unique_plants AS
SELECT
    user_id,
    COUNT(DISTINCT plant_id) as unique_plants
FROM user_plants
GROUP BY user_id;

-- Daily plant logs summary
CREATE VIEW IF NOT EXISTS daily_logs_summary AS
SELECT
    user_id,
    DATE(logged_at) as log_date,
    COUNT(*) as plants_logged,
    SUM(points_earned) as points_earned
FROM plant_logs
GROUP BY user_id, DATE(logged_at);

-- Most eaten plants per user
CREATE VIEW IF NOT EXISTS user_top_plants AS
SELECT
    up.user_id,
    up.plant_id,
    p.name as plant_name,
    p.emoji,
    up.times_eaten,
    (up.times_eaten * p.repeat_points + p.points - p.repeat_points) as total_points_from_plant
FROM user_plants up
JOIN plants p ON up.plant_id = p.id
ORDER BY up.user_id, up.times_eaten DESC;
