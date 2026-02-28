import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../services/matchApi';
import { HighlightStatus, type MatchWithHighlight } from '../domain/match';
import resetMatchesHighlights from '../utils/resetMatchesHighlights';

const POLL_INTERVAL = 5000;
const TIMEOUT_INTERVAL = 1000;


export function useLiveMatches() {
  const [matches, setMatches] = useState<MatchWithHighlight[]>([]);
  const prevDataHashRef = useRef('');
  const matchesRef = useRef(matches);
  matchesRef.current = matches;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isFetching, error, dataUpdatedAt } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    refetchInterval: POLL_INTERVAL,
  });

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

  return {
    matches,
    isLoading: isFetching,
    error: error?.message || null,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
  };
}