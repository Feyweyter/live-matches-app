import type { ColDef } from 'ag-grid-community';
import type { Match } from '../domain/match';

const DEFAULT_SCORE = 0;

const FLEX_NORMAL = 1;
const FLEX_WIDE = 1.5;

const MIN_WIDTH_SPORT = 100;
const MIN_WIDTH_DEFAULT = 110;
const MIN_WIDTH_STATUS = 120;
const MIN_WIDTH_WIDE = 140;

export const columnDefs: ColDef<Match>[] = [
  {
    field: 'sport',
    headerName: 'Sport',
    flex: FLEX_NORMAL,
    minWidth: MIN_WIDTH_SPORT,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'league',
    headerName: 'League',
    flex: FLEX_WIDE,
    minWidth: MIN_WIDTH_WIDE,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'homeTeam',
    headerName: 'Home',
    flex: FLEX_WIDE,
    minWidth: MIN_WIDTH_WIDE,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'awayTeam',
    headerName: 'Away',
    flex: FLEX_WIDE,
    minWidth: MIN_WIDTH_WIDE,
    sortable: true,
    sort: 'asc',
  },
  {
    headerName: 'Score',
    valueGetter: params => `${params.data?.homeScore ?? DEFAULT_SCORE} - ${params.data?.awayScore ?? DEFAULT_SCORE}`,
    flex: FLEX_NORMAL,
    minWidth: MIN_WIDTH_DEFAULT,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: FLEX_NORMAL,
    minWidth: MIN_WIDTH_STATUS,
    sortable: true,
    sort: 'asc',
  },
  { field: 'matchTime', headerName: 'Time', flex: FLEX_NORMAL, minWidth: MIN_WIDTH_DEFAULT },
  { field: 'venue', headerName: 'Venue', flex: FLEX_WIDE, minWidth: MIN_WIDTH_WIDE },
  { field: 'source', headerName: 'Source', flex: FLEX_NORMAL, minWidth: MIN_WIDTH_DEFAULT },
];
