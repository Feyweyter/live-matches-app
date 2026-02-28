import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../services/matchApi';
import type { Match } from '../domain/match';

const POLL_INTERVAL = 5000;

interface MatchWithHighlight extends Match {
  highlightStatus?: 'added' | 'removed' | 'normal';
}

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
          removedMatches.push({ ...m, highlightStatus: 'removed' });
        }
      });
      
      // Find new matches
      const newMatches: MatchWithHighlight[] = data
        .filter(m => !oldIds.has(m.id))
        .map(m => ({ ...m, highlightStatus: 'added' }));
      
      // Find existing matches
      const existingMatches: MatchWithHighlight[] = data
        .filter(m => oldIds.has(m.id))
        .map(m => ({ ...m, highlightStatus: 'normal' }));

        console.log('existingMatches', existingMatches);
        console.log('newMatches', newMatches);
        console.log('removedMatches', removedMatches);
      
      // Combine all matches
      const allMatches = [...removedMatches, ...newMatches, ...existingMatches].sort((a, b) => a.id.localeCompare(b.id));
      setMatches(allMatches);
      
      // Reset highlights after 1 second
     setTimeout(() => {
        setMatches(prev => 
          prev.map(m => {
            if (m.highlightStatus === 'added' || m.highlightStatus === 'removed') {
              // For removed matches, we want them to disappear after highlight
              if (m.highlightStatus === 'removed') {
                return null; // We'll filter these out
              }
              return { ...m, highlightStatus: 'normal' };
            }
            return m;
          }).filter(Boolean) as MatchWithHighlight[]
        );
      }, 3000);
    } else {
      // No changes - just update data
      setMatches(data.map(m => ({ ...m, highlightStatus: 'normal' })));
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