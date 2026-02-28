export const HighlightStatus = {
  NORMAL: 'normal',
  ADDED: 'added',
  REMOVED: 'removed',
} as const;

export type HighlightStatus = (typeof HighlightStatus)[keyof typeof HighlightStatus];

export interface Match {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  matchTime: string;
  league: string;
  venue: string;
  source: string;
  lastUpdated: string;
  highlightStatus?: HighlightStatus;
}

export interface MatchesResponse {
  matches: Match[];
}

export interface MatchWithHighlight extends Match {
  highlightStatus?: HighlightStatus;
}

