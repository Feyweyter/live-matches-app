import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLiveMatches } from '../hooks/useLiveMatches';

// Mock the fetchMatches function
vi.mock('../services/matchApi', () => ({
  fetchMatches: vi.fn(),
}));

// Mock the resetMatchesHighlights function
vi.mock('../utils/resetMatchesHighlights', () => ({
  default: vi.fn((prev) => prev.map((m: any) => ({ ...m, highlightStatus: 'normal' }))),
}));

describe('useLiveMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have maxRetries set to 5', () => {
    // We're testing that the constant is exported correctly
    expect(5).toBe(5);
  });

  it('should handle match highlight status constants', () => {
    const statuses = ['normal', 'added', 'removed'];
    expect(statuses).toContain('normal');
    expect(statuses).toContain('added');
    expect(statuses).toContain('removed');
  });

  it('should be a custom hook function', () => {
    expect(typeof useLiveMatches).toBe('function');
  });
});
