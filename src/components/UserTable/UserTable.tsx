import { User } from '../../types';
import { apiService } from '../../services/api';
import { useEffect, useState } from 'react';
import { UserPredictionHistory } from './UserPredictionHistory/UserPredictionHistory';
import './UserTable.scss';

interface UserStats {
  userId: string;
  winCount: number;
  balance: number;
}

interface UserTableProps {
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

export const UserTable = ({ selectedUser, onUserSelect }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await apiService.getUsers();
      setUsers(fetchedUsers);
      
      // TODO: Replace with actual stats from backend
      const mockStats = fetchedUsers.map(user => ({
        userId: user.id,
        winCount: Math.floor(Math.random() * 10),
        balance: Math.floor(Math.random() * 1000)
      }));
      setStats(mockStats);
    };

    fetchData();
  }, []);

  const getUserStats = (userId: string) => {
    return stats.find(stat => stat.userId === userId) || {
      userId,
      winCount: 0,
      balance: 0
    };
  };

  return (
    <div className="user-table">
      <div className="user-table__section">
        <h3 className="user-table__title">Users Ranking</h3>
        <div className="user-table__wrapper">
          <table className="user-table__table">
            <thead className="user-table__header">
              <tr>
                <th>User</th>
                <th>W</th>
                <th>EXP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userStats = getUserStats(user.id);
                const isSelected = selectedUser?.id === user.id;
                
                return (
                  <tr 
                    key={user.id} 
                    className={`user-table__row ${isSelected ? 'user-table__row--selected' : ''}`}
                    onClick={() => onUserSelect(user)}
                  >
                    <td className="user-table__cell">
                      {user.name}
                    </td>
                    <td className="user-table__cell user-table__cell--number user-table__cell--winning">
                      {userStats.winCount}
                    </td>
                    <td className="user-table__cell user-table__cell--number user-table__cell--money">
                      {userStats.balance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="user-table__section">
        <UserPredictionHistory selectedUser={selectedUser} />
      </div>
    </div>
  );
}; 