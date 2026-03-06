import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchGrid } from '../components/MatchGrid';
import { HighlightStatus } from '../domain/match';
import { mockMatches } from '../test/mocks';

// Mock AG Grid
vi.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, getRowId, rowClassRules }: any) => (
    <div data-testid="match-grid-table">
      <div data-testid="grid-row-count">{rowData.length}</div>
      {rowData.map((row: any) => (
        <div
          key={getRowId({ data: row })}
          data-testid={`match-row-${getRowId({ data: row })}`}
          className={Object.entries(rowClassRules)
            .filter(([, rule]: [string, any]) => rule({ data: row }))
            .map(([className]) => className)
            .join(' ')}
          data-highlight-status={row.highlightStatus}
        >
          {row.homeTeam} vs {row.awayTeam}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('ag-grid-community', () => ({
  ModuleRegistry: {
    registerModules: vi.fn(),
  },
  AllCommunityModule: {},
}));

describe('MatchGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the grid wrapper', () => {
    render(<MatchGrid matches={[]} />);
    expect(screen.getByTestId('match-grid-table')).toBeInTheDocument();
  });

  it('should render all matches', () => {
    render(<MatchGrid matches={mockMatches} />);
    expect(screen.getByTestId('grid-row-count')).toHaveTextContent('3');
  });

  it('should render empty grid when no matches provided', () => {
    render(<MatchGrid matches={[]} />);
    expect(screen.getByTestId('grid-row-count')).toHaveTextContent('0');
  });

  it('should apply ADDED class to newly added matches', () => {
    const matchesWithHighlight = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.ADDED },
    ];
    render(<MatchGrid matches={matchesWithHighlight} />);

    const row = screen.getByTestId('match-row-1');
    expect(row).toHaveClass('match-row-added');
  });

  it('should apply REMOVED class to removed matches', () => {
    const matchesWithHighlight = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.REMOVED },
    ];
    render(<MatchGrid matches={matchesWithHighlight} />);

    const row = screen.getByTestId('match-row-1');
    expect(row).toHaveClass('match-row-removed');
  });

  it('should apply NORMAL class to normal matches', () => {
    const matchesWithHighlight = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.NORMAL },
    ];
    render(<MatchGrid matches={matchesWithHighlight} />);

    const row = screen.getByTestId('match-row-1');
    expect(row).toHaveClass('match-row-normal');
  });

  it('should apply NORMAL class when highlightStatus is undefined', () => {
    const matchesWithoutHighlight = [
      { ...mockMatches[0] },
    ];
    render(<MatchGrid matches={matchesWithoutHighlight as any} />);

    const row = screen.getByTestId('match-row-1');
    expect(row).toHaveClass('match-row-normal');
  });

  it('should handle mixed highlight statuses', () => {
    const mixedMatches = [
      { ...mockMatches[0], highlightStatus: HighlightStatus.ADDED },
      { ...mockMatches[1], highlightStatus: HighlightStatus.REMOVED },
      { ...mockMatches[2], highlightStatus: HighlightStatus.NORMAL },
    ];
    render(<MatchGrid matches={mixedMatches} />);

    expect(screen.getByTestId('match-row-1')).toHaveClass('match-row-added');
    expect(screen.getByTestId('match-row-2')).toHaveClass('match-row-removed');
    expect(screen.getByTestId('match-row-3')).toHaveClass('match-row-normal');
  });

  it('should render match data correctly', () => {
    render(<MatchGrid matches={[mockMatches[0]]} />);
    expect(screen.getByText('Manchester United vs Liverpool')).toBeInTheDocument();
  });

  it('should update when matches change', () => {
    const { rerender } = render(<MatchGrid matches={mockMatches.slice(0, 1)} />);
    expect(screen.getByTestId('grid-row-count')).toHaveTextContent('1');

    rerender(<MatchGrid matches={mockMatches} />);
    expect(screen.getByTestId('grid-row-count')).toHaveTextContent('3');
  });

  it('should handle large number of matches', () => {
    const manyMatches = Array.from({ length: 100 }, (_, i) => ({
      ...mockMatches[0],
      id: `match-${i}`,
    }));
    render(<MatchGrid matches={manyMatches} />);
    expect(screen.getByTestId('grid-row-count')).toHaveTextContent('100');
  });
});
