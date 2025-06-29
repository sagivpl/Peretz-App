import { User, Match, Prediction } from '../../types';

// HTTP-based API client for frontend to communicate with backend
class HttpApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<User | null> {
    return this.request<User | null>(`/users/${id}`);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Matches API
  async getMatches(): Promise<Match[]> {
    return this.request<Match[]>('/matches');
  }

  async getMatchById(id: string): Promise<Match | null> {
    return this.request<Match | null>(`/matches/${id}`);
  }

  async createMatch(matchData: Omit<Match, 'id'>): Promise<Match> {
    return this.request<Match>('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async updateMatchResult(id: string, actualHomeScore: number, actualAwayScore: number): Promise<Match | null> {
    return this.request<Match | null>(`/matches/${id}/result`, {
      method: 'PUT',
      body: JSON.stringify({ actualHomeScore, actualAwayScore }),
    });
  }

  // Predictions API
  async getPredictions(): Promise<Prediction[]> {
    return this.request<Prediction[]>('/predictions');
  }

  async getPredictionsByUser(userId: string): Promise<Prediction[]> {
    return this.request<Prediction[]>(`/predictions/user/${userId}`);
  }

  async getPredictionsByMatch(matchId: string): Promise<Prediction[]> {
    return this.request<Prediction[]>(`/predictions/match/${matchId}`);
  }

  async createPrediction(predictionData: Omit<Prediction, 'id' | 'createdAt'>): Promise<Prediction> {
    return this.request<Prediction>('/predictions', {
      method: 'POST',
      body: JSON.stringify(predictionData),
    });
  }
}

export const httpApiClient = new HttpApiClient();