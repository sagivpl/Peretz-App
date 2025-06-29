import React, { useState } from 'react'
import './styles/App.scss'
import { Match } from './types'
import { User } from './types'
import { MatchList } from './components/MatchList/MatchList'
import { PredictionsTable } from './components/PredictionsTable/PredictionsTable'
import { UserTable } from './components/UserTable/UserTable'

function App() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000)
  }

  return (
    <div className="app">
      <h1>Football Predictions</h1>
      {error && (
        <div className="app__error">
          {error}
          <button onClick={() => setError(null)} className="app__error-close">×</button>
        </div>
      )}
      <div className="app__content">
        <div className="app__center-column">
          <UserTable 
            selectedUser={selectedUser}
            onUserSelect={setSelectedUser}
          />
        </div>
        <div className="app__right-column">
          <MatchList 
            onMatchSelect={setSelectedMatch}
            selectedMatch={selectedMatch}
            selectedUser={selectedUser}
          />
          {!selectedMatch && (
            <div className="app__no-match-selected">
              <p>Select a match to view predictions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
