import { User } from '../../types';
import { getUsers } from '../../services/mockData';
import { useEffect, useState } from 'react';
import './UserSelector.scss';

interface UserSelectorProps {
  onUserSelect: (user: User) => void;
}

export const UserSelector = ({ onUserSelect }: UserSelectorProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      if (fetchedUsers.length > 0) {
        setSelectedUserId(fetchedUsers[0].id);
        onUserSelect(fetchedUsers[0]);
      }
    };

    fetchUsers();
  }, [onUserSelect]);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      onUserSelect(selectedUser);
    }
  };

  return (
    <div className="user-selector">
      <label htmlFor="user-select" className="user-selector__label">
        Select User
      </label>
      <select
        id="user-select"
        value={selectedUserId}
        onChange={(e) => handleUserChange(e.target.value)}
        className="user-selector__select"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}; 