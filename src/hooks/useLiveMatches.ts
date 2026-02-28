import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../services/matchApi';
import { HighlightStatus, type MatchWithHighlight } from '../domain/match';
import resetMatchesHighlights from '../utils/resetMatchesHighlights';

const POLL_INTERVAL = 5000;
const TIMEOUT_INTERVAL = 1000;


export function useLiveMatches() {
  const [matches, setMatches] = useState<MatchWithHighlight[]>([]);
  const [prevDataHash, setPrevDataHash] = useState('');
  
  const { data, isFetching, error } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    refetchInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (!data) return;

    // Create a simple hash of the current data to detect changes
    const currentHash = JSON.stringify(data.map(m => m.id).sort());
    
    // Check if this is the first load or if data changed
    if (prevDataHash === '') {
      // First load - no highlights
      setMatches(data.map(m => ({ ...m, highlightStatus: 'normal' })));
    } else if (currentHash !== prevDataHash) {
      // Data changed - find what changed
      const oldIds = new Set(JSON.parse(prevDataHash));
      const newIds = new Set(data.map(m => m.id));
      
      // Find removed matches
      const removedMatches: MatchWithHighlight[] = [];
      matches.forEach(m => {
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
      setTimeout(() => {
        setMatches(resetMatchesHighlights);
      }, TIMEOUT_INTERVAL);
    } else {
      // No changes - just update data
      setMatches(data.map(m => ({ ...m, highlightStatus: HighlightStatus.NORMAL })));
    }
    
    setPrevDataHash(currentHash);
  }, [data]);

  return { 
    matches, 
    isLoading: isFetching, 
    error: error?.message || null,
    lastUpdated: new Date()
  };
}