import type { MatchWithHighlight } from "../domain/match";

function resetMatchesHighlights(prev: MatchWithHighlight[]): MatchWithHighlight[] {
    return prev
      .map(m => {
        if (m.highlightStatus === 'added' || m.highlightStatus === 'removed') {
          if (m.highlightStatus === 'removed') {
            return null;
          }
          return { ...m, highlightStatus: 'normal' };
        }
        return m;
      })
      .filter(Boolean) as MatchWithHighlight[];
  }

  export default resetMatchesHighlights;