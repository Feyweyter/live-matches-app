import { ApiError } from '../domain/api-error';
import type { Match, MatchesResponse } from '../domain/match';

const API_URL = import.meta.env.VITE_API_URL as string;
const API_USERNAME = import.meta.env.VITE_API_USERNAME as string;
const REQUEST_TIMEOUT_MS = 8000;
const ERROR_RESPONSE_SNIPPET_MAX_CHARS = 200;

if (!API_URL) {
  console.warn('VITE_API_URL is not defined in environment variables.');
}

if (!API_USERNAME) {
  console.warn('VITE_API_USERNAME is not defined in environment variables.');
}

export async function fetchMatches(): Promise<Match[]> {
  if (!API_URL) {
    return [];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(API_URL, {
      headers: {
        username: API_USERNAME ?? '',
      },
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out while fetching matches.', { url: API_URL });
    }
    throw new ApiError('Network error while fetching matches.', { url: API_URL });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let details = '';
    try {
      const text = await response.text();
      details = text ? ` — ${text.slice(0, ERROR_RESPONSE_SNIPPET_MAX_CHARS)}` : '';
    } catch {
      // ignore
    }
    throw new ApiError(`Failed to fetch matches: ${response.status} ${response.statusText}${details}`, {
      status: response.status,
      statusText: response.statusText,
      url: API_URL,
    });
  }

  try {
    const data = (await response.json()) as MatchesResponse;
    return data.matches ?? [];
  } catch {
    throw new ApiError('Failed to parse matches response as JSON.', { url: API_URL });
  }
}

