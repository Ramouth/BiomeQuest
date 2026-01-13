# BiomeQuest

Plant diversity tracking app for gut health. Log your plant intake, earn points, and boost your microbiome diversity.

## Prerequisites

- Node.js 18+
- npm

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Environment

**Option A: Start both servers (recommended)**

Open two terminal windows:

Terminal 1 - Backend API:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Option B: Start both with one command**
```bash
npm run dev:all
```

### 3. Access the App

| Service | URL |
|---------|-----|
| Frontend (App) | http://localhost:3000 |
| Backend (API) | http://localhost:3001 |

## Default Test Account

After starting the server, you can register a new account or use:
- **Email:** test@example.com
- **Password:** password123

(Create this account first via the registration form or API)

## Project Structure

```
BiomeQuest/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── api.js              # API client
│   ├── AuthContext.jsx     # Authentication context
│   └── App.jsx             # Main app component
├── server/                 # Backend Express server
│   ├── index.js            # Server entry point
│   ├── db.js               # Database initialization
│   └── routes/             # API routes
│       ├── auth.js         # Authentication
│       ├── plants.js       # Plant management
│       ├── logs.js         # Plant logging
│       ├── badges.js       # Achievements
│       └── requests.js     # Plant requests
├── db/                     # Database files
│   ├── schema.sql          # Database schema
│   ├── seed.sql            # Initial data
│   └── biomequest.db       # SQLite database (created on first run)
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user profile

### Plants
- `GET /api/plants` - List all plants
- `GET /api/plants/user/status` - Plants with user's eaten status

### Logging
- `POST /api/logs` - Log a plant intake
- `GET /api/logs/daily/:date` - Get daily logs
- `GET /api/logs/weekly` - Get weekly summary
- `GET /api/logs/monthly` - Get monthly summary

### Badges
- `GET /api/badges` - List all badges
- `GET /api/badges/user` - User's badges with progress

### Plant Requests
- `POST /api/requests` - Submit plant request
- `GET /api/requests/my-requests` - Get user's requests

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3001
JWT_SECRET=your-secret-key
```

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Express.js, sql.js (SQLite)
- **Auth:** JWT, bcryptjs
