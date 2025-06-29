import { Prediction, User, Match } from '../../types';
import { apiService } from '../../services/api';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { PredictionInput } from '../PredictionInput/PredictionInput';
import './PredictionsTable.scss';
import React from 'react';

interface PredictionsTableProps {
  selectedMatch: Match | null;
  selectedUser: User | null;
}

const PredictionsTableComponent = ({ selectedMatch, selectedUser }: PredictionsTableProps) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedPredictionId, setExpandedPredictionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedPredictions, fetchedUsers] = await Promise.all([
        apiService.getPredictions(),
        apiService.getUsers(),
      ]);
      setPredictions(fetchedPredictions);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching predictions data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPredictionForUser = useCallback((userId: string, matchId: string) => {
    return predictions.find(
      (p) => p.userId === userId && p.matchId === matchId
    );
  }, [predictions]);

  const handlePredictionSubmit = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handlePredictionClick = (predictionId: string) => {
    setExpandedPredictionId(expandedPredictionId === predictionId ? null : predictionId);
  };

  // Always define useMemo hooks, regardless of conditional rendering
  const sortedUsers = useMemo(() => {
    if (!selectedMatch) return [];
    
    return [...users].sort((a, b) => {
      const orderA = selectedMatch.orderOfChoice?.indexOf(a.id) ?? -1;
      const orderB = selectedMatch.orderOfChoice?.indexOf(b.id) ?? -1;
      
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      
      return orderA - orderB;
    });
  }, [users, selectedMatch]);

  if (!selectedMatch) {
    return (
      <div className="predictions-table">
        <div className="predictions-table__empty">
          Select a match to view predictions
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="predictions-table predictions-table--loading">
        Loading predictions...
      </div>
    );
  }

  return (
    <div className="predictions-table">
      <table className="predictions-table__table">
        <thead className="predictions-table__header">
          <tr>
            <th>User</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => {
            const prediction = getPredictionForUser(user.id, selectedMatch.id);
            const isSelectedUser = selectedUser?.id === user.id;
            const isExpanded = expandedPredictionId === prediction?.id;

            return (
              <tr
                key={user.id}
                className={`predictions-table__row ${
                  isSelectedUser ? 'predictions-table__row--selected' : ''
                } ${isExpanded ? 'predictions-table__row--expanded' : ''}`}
                onClick={() => prediction && handlePredictionClick(prediction.id)}
              >
                <td className="predictions-table__cell predictions-table__cell--name">
                  {user.name}
                  {isSelectedUser && (
                    <span className="predictions-table__user-badge">You</span>
                  )}
                </td>
                <td className="predictions-table__cell predictions-table__cell--prediction">
                  {prediction ? (
                    <span className="predictions-table__score">
                      {prediction.homeScore} - {prediction.awayScore}
                    </span>
                  ) : (
                    <div onClick={(e) => e.stopPropagation()}>
                      <PredictionInput
                        match={selectedMatch}
                        user={user}
                        onPredictionSubmit={handlePredictionSubmit}
                        inline
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {expandedPredictionId && (
        <div className="predictions-table__expanded-content" onClick={(e) => e.stopPropagation()}>
          {(() => {
            const prediction = predictions.find(p => p.id === expandedPredictionId);
            const user = users.find(u => u.id === prediction?.userId);
            if (!user) return null;
            
            return (
              <PredictionInput
                match={selectedMatch}
                user={user}
                onPredictionSubmit={() => {
                  fetchData();
                  setExpandedPredictionId(null);
                }}
                existingPrediction={prediction}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
};

export const PredictionsTable = React.memo(PredictionsTableComponent); 