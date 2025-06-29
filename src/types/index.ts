export interface User {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  isLocked: boolean;
  orderOfChoice?: string[]; // Array of user IDs in order of prediction choice
  actualHomeScore?: number; // Actual score for completed matches
  actualAwayScore?: number; // Actual score for completed matches
  status: 'completed' | 'upcoming' | 'in_progress';
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  createdAt: string;
  points?: number; // Points earned for correct prediction
} 