# BiomeQuest Database & Backend Implementation

## Overview
This document outlines the database schema, API endpoints, and core logic for the BiomeQuest application.

## Database Schema

### 1. User Schema
Stores user account information and statistics.

```javascript
{
  username: String (unique, 3-50 chars),
  email: String (unique, validated),
  password: String (hashed with bcrypt),
  totalPoints: Number (default: 0),
  diversityScore: Number (default: 0), // Count of unique plants consumed
  weeklyGoal: Number (default: 30),
  registeredAt: Date,
  timestamps: { createdAt, updatedAt }
}
```

**Best Practices:**
- Password is hashed using bcrypt with salt rounds of 10
- Password field has `select: false` to prevent accidental exposure
- Email and username are unique to prevent duplicates
- `diversityScore` tracks the number of unique plants consumed (key metric for the app)

### 2. Plant Schema
Stores available plants and their point values.

```javascript
{
  name: String (unique, lowercase),
  commonName: String,
  category: String (enum: fruit, vegetable, grain, legume, herb, nut, seed),
  pointsForNewConsumption: Number (default: 5),
  pointsForRepeatConsumption: Number (default: 1),
  healthBenefits: [String],
  icon: String (emoji),
  isActive: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

**Best Practices:**
- Separate points for first consumption (5) vs repeat (1)
- Supports flexible point system for future adjustments
- `isActive` flag allows archiving plants without deletion
- Stores health benefits for educational purposes

### 3. ConsumptionLog Schema
Records each time a user consumes a plant.

```javascript
{
  userId: ObjectId (ref: User),
  plantId: ObjectId (ref: Plant),
  plantName: String (denormalized for historical accuracy),
  isFirstConsumption: Boolean,
  pointsEarned: Number,
  consumedAt: Date (default: now, indexed),
  notes: String,
  timestamps: { createdAt, updatedAt }
}
```

**Best Practices:**
- `plantName` is denormalized to preserve historical plant names if they change
- `isFirstConsumption` flag enables quick identification of diversity contributions
- Compound index on `(userId, consumedAt)` for efficient date range queries
- `consumedAt` is indexed for fast filtering by date

### 4. Points Schema
Aggregated statistics for user performance and rewards.

```javascript
{
  userId: ObjectId (ref: User, unique),
  totalPoints: Number (default: 0),
  weeklyPoints: [
    {
      weekStart: Date,
      weekEnd: Date,
      points: Number,
      plantCount: Number (unique plants this week)
    }
  ],
  monthlyPoints: [
    {
      month: String (YYYY-MM),
      points: Number,
      plantCount: Number
    }
  ],
  allTimeStats: {
    uniquePlantsConsumed: Number,
    totalConsumptions: Number,
    currentStreak: Number (consecutive days logged),
    longestStreak: Number,
    lastLoggedDate: Date
  },
  timestamps: { createdAt, updatedAt }
}
```

**Best Practices:**
- Separate tracking for weekly, monthly, and all-time stats
- Enables efficient leaderboard and progress queries
- `uniquePlantsConsumed` distinct from `totalConsumptions` for diversity metrics
- Streak tracking motivates consistent engagement

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Body: {
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
}
Response: {
  success: boolean,
  token: string,
  user: { id, username, email, totalPoints, diversityScore }
}
```

#### Login User
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  token: string,
  user: { id, username, email, totalPoints, diversityScore }
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: {
  success: boolean,
  user: { id, username, email, totalPoints, diversityScore, weeklyGoal }
}
```

### Consumption & Points

#### Log Plant Consumption
```
POST /api/consumptions/log
Headers: Authorization: Bearer <token>
Body: { plantId: string }
Response: {
  success: boolean,
  message: string (celebration message),
  consumption: {
    id: string,
    plantName: string,
    pointsEarned: number,
    isFirstConsumption: boolean,
    userStats: { totalPoints, diversityScore }
  }
}
```

**Business Logic:**
- First consumption of a plant: 5 points
- Repeat consumption: 1 point
- Updates user's `totalPoints` and `diversityScore`
- Creates weekly/monthly aggregates

#### Get Consumption History
```
GET /api/consumptions/history?limit=20&skip=0
Headers: Authorization: Bearer <token>
Response: {
  success: boolean,
  total: number,
  consumptions: [{ userId, plantId, plantName, isFirstConsumption, pointsEarned, consumedAt }]
}
```

#### Get Consumed Plants
```
GET /api/consumptions/plants
Headers: Authorization: Bearer <token>
Response: {
  success: boolean,
  plants: [{ _id: plantId, count: number, plantName: string }]
}
```

#### Get User Statistics
```
GET /api/consumptions/stats
Headers: Authorization: Bearer <token>
Response: {
  success: boolean,
  stats: {
    totalPoints: number,
    diversityScore: number,
    weeklyGoal: number,
    weeklyPoints: number,
    weeklyUniquePlants: number,
    allTimeStats: { uniquePlantsConsumed, totalConsumptions, currentStreak, longestStreak, lastLoggedDate }
  }
}
```

## Core Use Cases Supported

### 1. User Registration & Authentication
- Users can create accounts with username and email
- Passwords are securely hashed
- JWT tokens for stateless authentication

### 2. Plant Consumption Tracking
- Log each plant consumption
- System automatically detects if it's a new plant for the user
- Points calculated automatically (5 for new, 1 for repeat)

### 3. Diversity Metric
- `diversityScore` tracks unique plants consumed
- Incentivizes variety in diet
- Used as primary KPI for the app

### 4. Points & Rewards System
- Users accumulate points for each consumption
- New plant discoveries rewarded higher (5 pts)
- Repeat consumption still valued (1 pt)
- Weekly and monthly aggregates for goal tracking

### 5. Progress Visualization
- Weekly progress towards goal
- Historical consumption data
- Diversity statistics
- Streak tracking for engagement

## Scoring System

```
First consumption of any plant: 5 points
Subsequent consumptions of same plant: 1 point per consumption

Weekly Goal: 30 points (configurable per user)
Goal encourages diversity + frequency
```

## Database Indexes

For optimal query performance:

1. **User Collection**
   - `email` (unique)
   - `username` (unique)

2. **ConsumptionLog Collection**
   - `userId` (single)
   - `plantId` (single)
   - `userId` + `consumedAt` (compound, for efficient range queries)
   - `consumedAt` (for date filtering)

3. **Points Collection**
   - `userId` (unique, for direct user lookups)

## Setup Instructions

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create `.env` file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/biomequest
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Run the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install axios:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

## Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns JWT token
3. Frontend stores token in `localStorage`
4. All subsequent requests include `Authorization: Bearer <token>` header
5. Backend validates token before processing requests
6. On token expiration (401 response), user is redirected to login

## Error Handling

All endpoints return responses in the format:
```javascript
{
  success: boolean,
  message: string (if error),
  data: object (if success)
}
```

Common error codes:
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `404`: Resource not found
- `500`: Server error

## Future Enhancements

1. **Social Features**
   - Leaderboards
   - Community challenges
   - Follow friends

2. **Advanced Analytics**
   - Nutrient tracking
   - Plant recommendations based on history
   - Seasonality insights

3. **Gamification**
   - Badges for achievements
   - Special events and bonuses
   - Daily streaks

4. **Integration**
   - Recipe suggestions
   - Plant availability by location
   - Calendar-based tracking

