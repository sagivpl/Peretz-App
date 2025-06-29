import { User, Match, Prediction } from '../types';

// Mock users
export const mockUsers: User[] = [
  { id: '1', name: 'Sagiv' },
  { id: '2', name: 'Guy' },
  { id: '3', name: 'Eldad' },
  { id: '4', name: 'Eyal' },
  { id: '5', name: 'Omer' },
];

// Mock matches (mix of past and upcoming matches)
export const mockMatches: Match[] = [
  // Past matches
  {
    id: '1',
    homeTeam: 'Arsenal',
    awayTeam: 'PSG',
    kickoffTime: '2024-04-15T19:00:00Z',
    isLocked: true,
    orderOfChoice: ['3', '1', '4', '2', '5'],
    actualHomeScore: 2,
    actualAwayScore: 2,
    status: 'completed',
  },
  {
    id: '2',
    homeTeam: 'Barcelona',
    awayTeam: 'Inter',
    kickoffTime: '2024-04-16T19:00:00Z',
    isLocked: true,
    orderOfChoice: ['2', '4', '1', '5', '3'],
    actualHomeScore: 3,
    actualAwayScore: 1,
    status: 'completed',
  },
  {
    id: '3',
    homeTeam: 'Manchester City',
    awayTeam: 'Real Madrid',
    kickoffTime: '2024-04-17T19:45:00Z',
    isLocked: true,
    orderOfChoice: ['1', '3', '5', '2', '4'],
    actualHomeScore: 1,
    actualAwayScore: 1,
    status: 'completed',
  },
  // Current matches
  {
    id: '4',
    homeTeam: 'Liverpool',
    awayTeam: 'Bayern',
    kickoffTime: '2024-04-23T20:00:00Z',
    isLocked: false,
    orderOfChoice: ['4', '2', '1', '3', '5'],
    status: 'in_progress',
  },
  {
    id: '5',
    homeTeam: 'Milan',
    awayTeam: 'Napoli',
    kickoffTime: '2024-04-24T20:00:00Z',
    isLocked: false,
    orderOfChoice: ['5', '1', '2', '4', '3'],
    status: 'in_progress',
  },
  // Upcoming matches
  {
    id: '6',
    homeTeam: 'Juventus',
    awayTeam: 'Ajax',
    kickoffTime: '2024-04-30T19:00:00Z',
    isLocked: false,
    orderOfChoice: ['3', '5', '1', '2', '4'],
    status: 'upcoming',
  },
  {
    id: '7',
    homeTeam: 'Porto',
    awayTeam: 'Benfica',
    kickoffTime: '2024-05-01T20:00:00Z',
    isLocked: false,
    orderOfChoice: ['2', '1', '4', '3', '5'],
    status: 'upcoming',
  },
];

// Helper function to calculate prediction points
const calculatePoints = (prediction: Prediction, match: Match): number => {
  if (!match.actualHomeScore || !match.actualAwayScore) return 0;
  
  // Exact score prediction
  if (prediction.homeScore === match.actualHomeScore && 
      prediction.awayScore === match.actualAwayScore) {
    return 3;
  }
  
  // Correct result type (win/draw/loss) and goal difference
  const predGoalDiff = prediction.homeScore - prediction.awayScore;
  const actualGoalDiff = match.actualHomeScore - match.actualAwayScore;
  if (Math.sign(predGoalDiff) === Math.sign(actualGoalDiff) && 
      predGoalDiff === actualGoalDiff) {
    return 2;
  }
  
  // Correct result type only (win/draw/loss)
  if (Math.sign(predGoalDiff) === Math.sign(actualGoalDiff)) {
    return 1;
  }
  
  return 0;
};

// Mock predictions with history
export const mockPredictions: Prediction[] = [
  // Past predictions for Match 1 (Actual: 2-2)
  {
    id: 'p1',
    userId: '1',
    matchId: '1',
    homeScore: 2,
    awayScore: 1,
    createdAt: '2024-04-14T10:00:00Z',
    points: 1, // Correct win prediction
  },
  {
    id: 'p2',
    userId: '2',
    matchId: '1',
    homeScore: 1,
    awayScore: 3,
    createdAt: '2024-04-14T11:00:00Z',
    points: 0, // Wrong prediction
  },
  {
    id: 'p3',
    userId: '3',
    matchId: '1',
    homeScore: 2,
    awayScore: 2,
    createdAt: '2024-04-14T09:00:00Z',
    points: 3, // Exact score
  },
  // Past predictions for Match 2 (Actual: 3-1)
  {
    id: 'p4',
    userId: '1',
    matchId: '2',
    homeScore: 3,
    awayScore: 0,
    createdAt: '2024-04-15T15:00:00Z',
    points: 2, // Correct goal difference
  },
  {
    id: 'p5',
    userId: '2',
    matchId: '2',
    homeScore: 2,
    awayScore: 1,
    createdAt: '2024-04-15T14:00:00Z',
    points: 1, // Correct win prediction
  },
  // Past predictions for Match 3 (Actual: 1-1)
  {
    id: 'p6',
    userId: '1',
    matchId: '3',
    homeScore: 1,
    awayScore: 1,
    createdAt: '2024-04-16T12:00:00Z',
    points: 3, // Exact score
  },
  {
    id: 'p7',
    userId: '3',
    matchId: '3',
    homeScore: 2,
    awayScore: 3,
    createdAt: '2024-04-16T13:00:00Z',
    points: 0, // Wrong prediction
  },
  {
    id: 'p8',
    userId: '4',
    matchId: '3',
    homeScore: 0,
    awayScore: 2,
    createdAt: '2024-04-16T14:00:00Z',
    points: 0, // Wrong prediction
  },
  // Current match predictions
  {
    id: 'p9',
    userId: '1',
    matchId: '4',
    homeScore: 2,
    awayScore: 1,
    createdAt: '2024-04-22T09:00:00Z',
  },
  {
    id: 'p10',
    userId: '2',
    matchId: '4',
    homeScore: 3,
    awayScore: 2,
    createdAt: '2024-04-22T10:00:00Z',
  },
  {
    id: 'p11',
    userId: '1',
    matchId: '5',
    homeScore: 1,
    awayScore: 0,
    createdAt: '2024-04-23T11:00:00Z',
  },
];

// Mock API functions
export const getUsers = async (): Promise<User[]> => {
  return mockUsers;
};

export const getMatches = async (): Promise<Match[]> => {
  return mockMatches;
};

export const getPredictions = async (): Promise<Prediction[]> => {
  return mockPredictions;
};

export const createPrediction = async (
  userId: string,
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<Prediction> => {
  const newPrediction: Prediction = {
    id: `p${mockPredictions.length + 1}`,
    userId,
    matchId,
    homeScore,
    awayScore,
    createdAt: new Date().toISOString(),
  };
  
  mockPredictions.push(newPrediction);
  return newPrediction;
}; 