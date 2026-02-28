import './App.css';
import { MatchGrid } from './components/MatchGrid';
import { useLiveMatches } from './hooks/useLiveMatches';

function App() {
  const { matches, lastUpdated, isLoading, error } = useLiveMatches();

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Live Matches</h1>
        <div className="app-status">
          {isLoading && <span className="status-indicator">Updating…</span>}
          {lastUpdated && (
            <span className="timestamp">
              Last update:{' '}
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </header>
      {error && <div className="app-error">Error: {error}</div>}
      <main>
        <MatchGrid matches={matches} />
      </main>
    </div>
  );
}

export default App;
