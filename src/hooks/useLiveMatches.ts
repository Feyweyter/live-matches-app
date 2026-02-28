import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../services/matchApi';
import { HighlightStatus, type MatchWithHighlight } from '../domain/match';
import resetMatchesHighlights from '../utils/resetMatchesHighlights';
import { HTTP_STATUS_CLIENT_ERROR_MAX_EXCLUSIVE, HTTP_STATUS_CLIENT_ERROR_MIN, HTTP_STATUS_TOO_MANY_REQUESTS, MAX_RETRIES, POLL_INTERVAL, RETRY_429_MIN_DELAY_MS, RETRY_BACKOFF_FACTOR, RETRY_BASE_DELAY_MS, RETRY_DELAY_CAP_MS, RETRY_JITTER_MAX_MS, TIMEOUT_INTERVAL } from '../constants';
import { ApiError } from '../domain/api-error';

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError || err instanceof Error) return err.message;
  return 'Unknown error';
}


export function useLiveMatches() {
  const [matches, setMatches] = useState<MatchWithHighlight[]>([]);
  const prevDataHashRef = useRef('');
  const matchesRef = useRef(matches);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isPending, isFetching, error, dataUpdatedAt, failureCount, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    refetchInterval: POLL_INTERVAL,
    retry: (count, err) => {
      if (count >= MAX_RETRIES) return false;
      if (err instanceof ApiError) {
        const s = err.status;
        if (s && s >= HTTP_STATUS_CLIENT_ERROR_MIN && s < HTTP_STATUS_CLIENT_ERROR_MAX_EXCLUSIVE && s !== HTTP_STATUS_TOO_MANY_REQUESTS) {
          return false;
        }
      }
      return true;
    },
    retryDelay: (count, err) => {
      const base = RETRY_BASE_DELAY_MS * RETRY_BACKOFF_FACTOR ** Math.max(0, count - 1);
      const jitter = Math.floor(Math.random() * RETRY_JITTER_MAX_MS);
      const capped = Math.min(base + jitter, RETRY_DELAY_CAP_MS);
      if (err instanceof ApiError && err.status === HTTP_STATUS_TOO_MANY_REQUESTS) return Math.max(capped, RETRY_429_MIN_DELAY_MS);
      return capped;
    },
  });

  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!data) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Create a simple hash of the current data to detect changes
    const currentHash = JSON.stringify(data.map(m => m.id).sort());

    // Check if this is the first load or if data changed
    if (prevDataHashRef.current === '') {
      // First load - no highlights
      setMatches(data.map(m => ({ ...m, highlightStatus: HighlightStatus.NORMAL })));
    } else if (currentHash !== prevDataHashRef.current) {
      // Data changed - find what changed
      const oldIds = new Set(JSON.parse(prevDataHashRef.current));
      const newIds = new Set(data.map(m => m.id));

      // Find removed matches (use ref to avoid matches in effect deps → infinite loop)
      const removedMatches: MatchWithHighlight[] = [];
      matchesRef.current.forEach(m => {
        if (!newIds.has(m.id)) {
          removedMatches.push({ ...m, highlightStatus: HighlightStatus.REMOVED });
        }
      });

      // Find new matches
      const newMatches: MatchWithHighlight[] = data
        .filter(m => !oldIds.has(m.id))
        .map(m => ({ ...m, highlightStatus: HighlightStatus.ADDED }));

      // Find existing matches
      const existingMatches: MatchWithHighlight[] = data
        .filter(m => oldIds.has(m.id))
        .map(m => ({ ...m, highlightStatus: HighlightStatus.NORMAL }));

      // Combine all matches
      const allMatches = [...removedMatches, ...newMatches, ...existingMatches].sort((a, b) => a.id.localeCompare(b.id));
      setMatches(allMatches);

      // Reset highlights after 1 second
      timeoutRef.current = setTimeout(() => {
        setMatches(resetMatchesHighlights);
      }, TIMEOUT_INTERVAL);
    } else {
      // No changes - just update data
      setMatches(data.map(m => ({ ...m, highlightStatus: HighlightStatus.NORMAL })));
    }

    prevDataHashRef.current = currentHash;

    // cleanup at the end of the effect:
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    matches,
    isInitialLoading: isPending && !data,
    isUpdating: isFetching && !!data,
    error: error ? getErrorMessage(error) : null,
    retryAttempt: failureCount,
    maxRetries: MAX_RETRIES,
    retryNow: () => refetch(),
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
  };
}