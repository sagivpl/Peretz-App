import { httpApiClient } from './httpClient';
import { User, Match, Prediction } from '../../types';

export interface CreateUserRequest {
  name: string;
}

export interface CreateMatchRequest {
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  isLocked?: boolean;
  orderOfChoice?: string[];
  status?: Match['status'];
}

export interface CreatePredictionRequest {
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export interface UpdateMatchResultRequest {
  actualHomeScore: number;
  actualAwayScore: number;
}

class APIService {
  private validateString(value: any, fieldName: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`${fieldName} must be a non-empty string`);
    }
    return value.trim();
  }

  private validateNumber(value: any, fieldName: string): number {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      throw new Error(`${fieldName} must be a non-negative number`);
    }
    return value;
  }

  private validateDate(value: any, fieldName: string): string {
    if (typeof value !== 'string' || isNaN(Date.parse(value))) {
      throw new Error(`${fieldName} must be a valid ISO date string`);
    }
    return value;
  }

  async getUsers(): Promise<User[]> {
    try {
      return await httpApiClient.getUsers();
    } catch (error) {
      console.error('API Service - Error fetching users:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const name = this.validateString(data.name, 'name');
      return await httpApiClient.createUser({ name });
    } catch (error) {
      console.error('API Service - Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const userId = this.validateString(id, 'id');
      return await httpApiClient.getUserById(userId);
    } catch (error) {
      console.error('API Service - Error fetching user:', error);
      throw error;
    }
  }

  async getMatches(): Promise<Match[]> {
    try {
      return await httpApiClient.getMatches();
    } catch (error) {
      console.error('API Service - Error fetching matches:', error);
      throw error;
    }
  }

  async createMatch(data: CreateMatchRequest): Promise<Match> {
    try {
      const homeTeam = this.validateString(data.homeTeam, 'homeTeam');
      const awayTeam = this.validateString(data.awayTeam, 'awayTeam');
      const kickoffTime = this.validateDate(data.kickoffTime, 'kickoffTime');

      const matchData: Omit<Match, 'id'> = {
        homeTeam,
        awayTeam,
        kickoffTime,
        isLocked: data.isLocked ?? false,
        orderOfChoice: data.orderOfChoice ?? [],
        status: data.status ?? 'upcoming'
      };

      return await httpApiClient.createMatch(matchData);
    } catch (error) {
      console.error('API Service - Error creating match:', error);
      throw error;
    }
  }

  async getMatchById(id: string): Promise<Match | null> {
    try {
      const matchId = this.validateString(id, 'id');
      return await httpApiClient.getMatchById(matchId);
    } catch (error) {
      console.error('API Service - Error fetching match:', error);
      throw error;
    }
  }

  async getMatchesByStatus(status: Match['status']): Promise<Match[]> {
    try {
      // HTTP client doesn't have this method yet, so we'll filter client-side
      const matches = await httpApiClient.getMatches();
      return matches.filter(match => match.status === status);
    } catch (error) {
      console.error('API Service - Error fetching matches by status:', error);
      throw error;
    }
  }

  async updateMatchResult(id: string, data: UpdateMatchResultRequest): Promise<Match | null> {
    try {
      const matchId = this.validateString(id, 'id');
      const actualHomeScore = this.validateNumber(data.actualHomeScore, 'actualHomeScore');
      const actualAwayScore = this.validateNumber(data.actualAwayScore, 'actualAwayScore');

      const result = await httpApiClient.updateMatchResult(matchId, actualHomeScore, actualAwayScore);
      
      // Note: Point calculation will be handled by the backend
      
      return result;
    } catch (error) {
      console.error('API Service - Error updating match result:', error);
      throw error;
    }
  }

  async getPredictions(): Promise<Prediction[]> {
    try {
      return await httpApiClient.getPredictions();
    } catch (error) {
      console.error('API Service - Error fetching predictions:', error);
      throw error;
    }
  }

  async createPrediction(data: CreatePredictionRequest): Promise<Prediction> {
    try {
      const userId = this.validateString(data.userId, 'userId');
      const matchId = this.validateString(data.matchId, 'matchId');
      const homeScore = this.validateNumber(data.homeScore, 'homeScore');
      const awayScore = this.validateNumber(data.awayScore, 'awayScore');

      return await httpApiClient.createPrediction({
        userId,
        matchId,
        homeScore,
        awayScore
      });
    } catch (error) {
      console.error('API Service - Error creating prediction:', error);
      throw error;
    }
  }

  async getPredictionsByUser(userId: string): Promise<Prediction[]> {
    try {
      const validUserId = this.validateString(userId, 'userId');
      return await httpApiClient.getPredictionsByUser(validUserId);
    } catch (error) {
      console.error('API Service - Error fetching user predictions:', error);
      throw error;
    }
  }

  async getPredictionsByMatch(matchId: string): Promise<Prediction[]> {
    try {
      const validMatchId = this.validateString(matchId, 'matchId');
      return await httpApiClient.getPredictionsByMatch(validMatchId);
    } catch (error) {
      console.error('API Service - Error fetching match predictions:', error);
      throw error;
    }
  }
}

export const apiService = new APIService();