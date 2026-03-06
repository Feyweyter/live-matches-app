import { type Match, HighlightStatus } from '../domain/match';

export const mockMatches: Match[] = [
  {
    id: '1',
    sport: 'Football',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    matchTime: '45+2',
    league: 'Premier League',
    venue: 'Old Trafford',
    source: 'ESPN',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    sport: 'Football',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    matchTime: '67',
    league: 'Premier League',
    venue: 'Emirates Stadium',
    source: 'ESPN',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    sport: 'Football',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    matchTime: '18:30',
    league: 'Bundesliga',
    venue: 'Allianz Arena',
    source: 'ESPN',
    lastUpdated: new Date().toISOString(),
  },
];

export const mockMatchesResponse = {
  matches: mockMatches,
};

export const mockMatchWithHighlight = {
  ...mockMatches[0],
  highlightStatus: HighlightStatus.NORMAL,
};
