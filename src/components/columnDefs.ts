import type { ColDef } from 'ag-grid-community';
import type { Match } from '../domain/match';

export const columnDefs: ColDef<Match>[] = [
  {
    field: 'sport',
    headerName: 'Sport',
    flex: 1,
    minWidth: 100,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'league',
    headerName: 'League',
    flex: 1.5,
    minWidth: 140,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'homeTeam',
    headerName: 'Home',
    flex: 1.5,
    minWidth: 140,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'awayTeam',
    headerName: 'Away',
    flex: 1.5,
    minWidth: 140,
    sortable: true,
    sort: 'asc',
  },
  {
    headerName: 'Score',
    valueGetter: params => `${params.data?.homeScore ?? 0} - ${params.data?.awayScore ?? 0}`,
    flex: 1,
    minWidth: 110,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    minWidth: 120,
    sortable: true,
    sort: 'asc',
  },
  { field: 'matchTime', headerName: 'Time', flex: 1, minWidth: 110 },
  { field: 'venue', headerName: 'Venue', flex: 1.5, minWidth: 140 },
  { field: 'source', headerName: 'Source', flex: 1, minWidth: 110 },
];
