export type HighlightStatus = 'normal' | 'added' | 'removed';

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

