import { Match, User, Prediction } from '../../types';
import { apiService } from '../../services/api';
import { useState, useEffect } from 'react';
import './PredictionInput.scss';

interface PredictionInputProps {
  match: Match;
  user: User;
  onPredictionSubmit: () => void;
  existingPrediction?: Prediction;
  inline?: boolean;
}

export const PredictionInput = ({ 
  match, 
  user, 
  onPredictionSubmit,
  existingPrediction,
  inline = false
}: PredictionInputProps) => {
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);

  useEffect(() => {
    if (existingPrediction) {
      setHomeScore(existingPrediction.homeScore);
      setAwayScore(existingPrediction.awayScore);
    }
  }, [existingPrediction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (match.isLocked) return;

    try {
      await apiService.createPrediction({
        userId: user.id,
        matchId: match.id,
        homeScore,
        awayScore
      });
      onPredictionSubmit();
    } catch (error) {
      console.error('Failed to create prediction:', error);
    }
  };

  return (
    <div className={`prediction-input ${inline ? 'prediction-input--inline' : ''}`}>
      <form onSubmit={handleSubmit} className="prediction-input__form">
        <div className="prediction-input__scores">
          <div className="prediction-input__team">
            <input
              type="number"
              min="0"
              value={homeScore}
              onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
              className="prediction-input__team-input"
              disabled={match.isLocked}
              placeholder={match.homeTeam}
            />
          </div>
          <div className="prediction-input__vs">-</div>
          <div className="prediction-input__team">
            <input
              type="number"
              min="0"
              value={awayScore}
              onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
              className="prediction-input__team-input"
              disabled={match.isLocked}
              placeholder={match.awayTeam}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={match.isLocked}
          className="prediction-input__submit"
        >
          {match.isLocked ? 'Locked' : existingPrediction ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
}; 