import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchMatches } from '../services/matchApi';
import { ApiError } from '../domain/api-error';
import { mockMatchesResponse, mockMatches } from '../test/mocks';

describe('matchApi - fetchMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch matches successfully', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatchesResponse,
    });
    globalThis.fetch = mockFetch as any;

    const result = await fetchMatches();

    expect(result).toEqual(mockMatches);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should make fetch call with correct parameters', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatchesResponse,
    });
    globalThis.fetch = mockFetch as any;

    await fetchMatches();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should throw ApiError when response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Not Found',
    });
    globalThis.fetch = mockFetch as any;

    await expect(fetchMatches()).rejects.toThrow(ApiError);
  });

  it('should throw ApiError when JSON parsing fails', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });
    globalThis.fetch = mockFetch as any;

    await expect(fetchMatches()).rejects.toThrow(ApiError);
  });

  it('should throw ApiError on network error', async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    globalThis.fetch = mockFetch as any;

    await expect(fetchMatches()).rejects.toThrow(ApiError);
  });

  it('should throw ApiError on abort (timeout)', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    const mockFetch = vi.fn().mockRejectedValueOnce(abortError);
    globalThis.fetch = mockFetch as any;

    await expect(fetchMatches()).rejects.toThrow(ApiError);
  });

  it('should handle response with empty matches array', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ matches: [] }),
    });
    globalThis.fetch = mockFetch as any;

    const result = await fetchMatches();
    expect(result).toEqual([]);
  });

  it('should handle response with missing matches property', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    globalThis.fetch = mockFetch as any;

    const result = await fetchMatches();
    expect(result).toEqual([]);
  });
});
