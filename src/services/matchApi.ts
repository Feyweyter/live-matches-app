import type { Match, MatchesResponse } from '../domain/match';

const API_URL = import.meta.env.VITE_API_URL as string;
const API_USERNAME = import.meta.env.VITE_API_USERNAME as string;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL is not defined in environment variables.');
}

if (!API_USERNAME) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_USERNAME is not defined in environment variables.');
}

export async function fetchMatches(): Promise<Match[]> {
  if (!API_URL) {
    return [];
  }

  const response = await fetch(API_URL, {
    headers: {
      username: API_USERNAME ?? '',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as MatchesResponse;
  return data.matches ?? [];
}

