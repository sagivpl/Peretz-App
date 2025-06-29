# Peretz Backend API

A Node.js/Express backend API that connects to MongoDB and serves data for the Peretz prediction app.

## Quick Start

```bash
# Start the backend server
node server.js

# Or for development with auto-reload
npm run dev
```

The server runs on **http://localhost:3001**

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `GET /api/matches/status/:status` - Get matches by status
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id/result` - Update match result

### Predictions
- `GET /api/predictions` - Get all predictions
- `GET /api/predictions/user/:userId` - Get predictions by user
- `GET /api/predictions/match/:matchId` - Get predictions by match
- `POST /api/predictions` - Create new prediction
- `PUT /api/predictions/calculate-points/:matchId` - Calculate points for match

## Database

- **MongoDB**: localhost:27017
- **Database**: myLocalDB
- **Collections**: users, matches, predictions

## Frontend Integration

The frontend at http://localhost:5173 automatically connects to this backend API.