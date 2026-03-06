import { describe, it, expect } from 'vitest';
import resetMatchesHighlights from '../utils/resetMatchesHighlights';
import { HighlightStatus } from '../domain/match';
import { mockMatches } from '../test/mocks';

describe('resetMatchesHighlights', () => {
  it('should remove matches with REMOVED highlight status', () => {
    const matches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.REMOVED },
      { ...mockMatches[1], highlightStatus: HighlightStatus.NORMAL },
      { ...mockMatches[2], highlightStatus: HighlightStatus.REMOVED },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should reset ADDED matches to NORMAL status', () => {
    const matches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.ADDED },
      { ...mockMatches[1], highlightStatus: HighlightStatus.NORMAL },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result).toHaveLength(2);
    expect(result[0].highlightStatus).toBe(HighlightStatus.NORMAL);
    expect(result[1].highlightStatus).toBe(HighlightStatus.NORMAL);
  });

  it('should keep NORMAL matches unchanged', () => {
    const matches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.NORMAL },
      { ...mockMatches[1], highlightStatus: HighlightStatus.NORMAL },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result).toHaveLength(2);
    expect(result[0].highlightStatus).toBe(HighlightStatus.NORMAL);
    expect(result[1].highlightStatus).toBe(HighlightStatus.NORMAL);
  });

  it('should handle mixed highlight statuses', () => {
    const matches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.ADDED },
      { ...mockMatches[1], highlightStatus: HighlightStatus.REMOVED },
      { ...mockMatches[2], highlightStatus: HighlightStatus.NORMAL },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[0].highlightStatus).toBe(HighlightStatus.NORMAL);
    expect(result[1].id).toBe('3');
  });

  it('should handle empty array', () => {
    const result = resetMatchesHighlights([]);
    expect(result).toEqual([]);
  });

  it('should handle array with all REMOVED matches', () => {
    const matches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.REMOVED },
      { ...mockMatches[1], highlightStatus: HighlightStatus.REMOVED },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result).toHaveLength(0);
  });

  it('should handle array with all ADDED matches', () => {
    const matches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.ADDED },
      { ...mockMatches[1], highlightStatus: HighlightStatus.ADDED },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result).toHaveLength(2);
    expect(result.every(m => m.highlightStatus === HighlightStatus.NORMAL)).toBe(true);
  });

  it('should preserve match data when resetting highlights', () => {
    const matches = [
      {
        ...mockMatches[0],
        highlightStatus: HighlightStatus.ADDED,
        homeScore: 5,
        awayScore: 3,
      },
    ];

    const result = resetMatchesHighlights(matches);

    expect(result[0].homeScore).toBe(5);
    expect(result[0].awayScore).toBe(3);
    expect(result[0].homeTeam).toBe('Manchester United');
  });

  it('should handle matches without highlightStatus', () => {
    const matches = [
      { ...mockMatches[0] },
      { ...mockMatches[1] },
    ];

    const result = resetMatchesHighlights(matches as any);

    expect(result).toHaveLength(2);
  });
});
