import { Match, User } from '../../types';
import { apiService } from '../../services/api';
import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { PredictionsTable } from '../PredictionsTable/PredictionsTable';
import './MatchList.scss';

interface MatchListProps {
  selectedUser: User | null;
  selectedMatch: Match | null;
  onMatchSelect: (match: Match | null) => void;
}

export const MatchList = ({ selectedUser, selectedMatch, onMatchSelect }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const fetchedMatches = await apiService.getMatches();
        setMatches(fetchedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    setExpandedMatchId(selectedMatch?.id || null);
  }, [selectedMatch]);

  const handleMatchClick = (match: Match) => {
    if (expandedMatchId === match.id) {
      setExpandedMatchId(null);
      onMatchSelect(null);
    } else {
      setExpandedMatchId(match.id);
      onMatchSelect(match);
    }
  };

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      // First sort by status (upcoming first, then in_progress, then completed)
      const statusOrder: Record<string, number> = { upcoming: 0, in_progress: 1, completed: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // Then sort by date
      return new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime();
    });
  }, [matches]);

  if (isLoading) {
    return (
      <div className="match-list match-list--loading">
        <h2 className="match-list__title">Loading matches...</h2>
      </div>
    );
  }

  return (
    <div className="match-list">
      <h2 className="match-list__title">Matches</h2>
      {sortedMatches.length === 0 ? (
        <div className="match-list__empty">No matches available</div>
      ) : (
        <div className="match-list__grid">
          {sortedMatches.map((match) => {
            const isExpanded = expandedMatchId === match.id;
            const matchDate = new Date(match.kickoffTime);

            return (
              <div 
                key={match.id} 
                className={`match-list__item match-list__item--${match.status}`}
                style={{ order: 0 }} // Explicitly set order to 0 to prevent reordering
              >
                <div 
                  className={`match-list__header ${
                    isExpanded ? 'match-list__header--expanded' : ''
                  }`}
                  onClick={() => handleMatchClick(match)}
                >
                  <div className="match-list__content">
                    <div className="match-list__teams">
                      <div className="match-list__team">{match.homeTeam}</div>
                      <div className="match-list__vs">vs</div>
                      <div className="match-list__team">{match.awayTeam}</div>
                    </div>
                    <div className="match-list__time">
                      {format(matchDate, 'MMM d, HH:mm')}
                      {match.status !== 'upcoming' && (
                        <span className={`match-list__status match-list__status--${match.status}`}>
                          {match.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className={`match-list__predictions match-list__predictions--expanded`}>
                    <PredictionsTable
                      selectedMatch={match}
                      selectedUser={selectedUser}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 