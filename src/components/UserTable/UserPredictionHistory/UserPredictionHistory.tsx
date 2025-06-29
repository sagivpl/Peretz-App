import { useState, useEffect } from 'react';
import { User, Match, Prediction } from '../../../types';
import { apiService } from '../../../services/api';
import { format } from 'date-fns';
import './UserPredictionHistory.scss';

interface UserPredictionHistoryProps {
  selectedUser: User | null;
}

export const UserPredictionHistory = ({ selectedUser }: UserPredictionHistoryProps) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predictionsData, matchesData] = await Promise.all([
          apiService.getPredictions(),
          apiService.getMatches()
        ]);
        setPredictions(predictionsData);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (!selectedUser) {
    return (
      <div className="user-prediction-history user-prediction-history--empty">
        Select a user to view their prediction history
      </div>
    );
  }

  const userPredictions = predictions
    .filter(prediction => prediction.userId === selectedUser.id)
    .map(prediction => {
      const match = matches.find(m => m.id === prediction.matchId);
      return { prediction, match };
    })
    .filter((item): item is { prediction: Prediction; match: Match } => item.match !== undefined)
    .sort((a, b) => new Date(b.match.kickoffTime).getTime() - new Date(a.match.kickoffTime).getTime());

  return (
    <div className="user-prediction-history">
      <h3 className="user-prediction-history__title">
        {selectedUser.name}'s Prediction History
      </h3>
      {userPredictions.length === 0 ? (
        <div className="user-prediction-history__empty">
          No predictions found for this user
        </div>
      ) : (
        <div className="user-prediction-history__table-wrapper">
          <table className="user-prediction-history__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Match</th>
                <th>Prediction</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {userPredictions.map(({ prediction, match }) => {
                const matchDate = new Date(match.kickoffTime);
                const isCompleted = match.status === 'completed';

                return (
                  <tr key={prediction.id}>
                    <td>{format(matchDate, 'MMM d, HH:mm')}</td>
                    <td>
                      <div className="user-prediction-history__match">
                        <span>{match.homeTeam}</span>
                        <span className="user-prediction-history__vs">vs</span>
                        <span>{match.awayTeam}</span>
                        {isCompleted && (
                          <div className="user-prediction-history__match-result">
                            {match.actualHomeScore} - {match.actualAwayScore}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="user-prediction-history__prediction">
                        <div className="user-prediction-history__score">
                          {prediction.homeScore} - {prediction.awayScore}
                        </div>
                        {!isCompleted && (
                          <div className="user-prediction-history__status-container">
                            <span className={`user-prediction-history__status user-prediction-history__status--${match.status}`}>
                              {match.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {isCompleted && (
                        <span className={`user-prediction-history__points user-prediction-history__points--${prediction.points}`}>
                          {prediction.points}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 