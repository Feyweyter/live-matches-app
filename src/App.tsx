import './App.css';
import { MatchGrid } from './components/MatchGrid';
import { useLiveMatches } from './hooks/useLiveMatches';

function App() {
  const { matches, lastUpdated, isInitialLoading, isUpdating, error, retryNow, retryAttempt, maxRetries } = useLiveMatches();

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Live Matches</h1>
        <div className="app-status">
          {isInitialLoading && <span className="status-indicator">Loading…</span>}
          {!isInitialLoading && isUpdating && <span className="status-indicator">Updating…</span>}
          {lastUpdated && (
            <span className="timestamp">
              Last update:{' '}
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </header>
      {error && (
        <div className="app-error" role="alert">
          <div className="app-error-row">
            <span>Error: {error}</span>
            <button
              type="button"
              className="retry-button"
              onClick={() => retryNow()}
              disabled={isInitialLoading || isUpdating}
            >
              Retry{retryAttempt ? ` (${retryAttempt}/${maxRetries})` : ''}
            </button>
          </div>
          <div className="app-error-hint">Auto-retry is enabled.</div>
        </div>
      )}
      <main>
        <MatchGrid matches={matches} />
      </main>
    </div>
  );
}

export default App;
