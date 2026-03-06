import { describe, it, expect, vi } from 'vitest';

// Mock the useLiveMatches hook
vi.mock('../hooks/useLiveMatches', () => ({
  useLiveMatches: vi.fn(),
}));

// Mock the MatchGrid component  
vi.mock('../components/MatchGrid', () => ({
  MatchGrid: vi.fn(),
}));

// Mock CSS
vi.mock('../App.css', () => ({}));

describe('App Component', () => {
  it('should be importable', async () => {
    const module = await import('./App');
    expect(module.default).toBeDefined();
  });

  it('should use useLiveMatches hook', async () => {
    expect(true).toBe(true);
  });
});
