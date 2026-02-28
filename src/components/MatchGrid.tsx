import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { useMemo } from 'react';
import type { Match } from '../domain/match';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './MatchGrid.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface MatchGridProps {
  matches: Match[];
}

export function MatchGrid({ matches }: MatchGridProps) {
  const columnDefs = useMemo<ColDef<Match>[]>(
    () => [
      { field: 'sport', headerName: 'Sport', flex: 1, minWidth: 100,
        sortable: true,
    sort: 'asc',
       },
      { field: 'league', headerName: 'League', flex: 1.5, minWidth: 140 },
      { field: 'homeTeam', headerName: 'Home', flex: 1.5, minWidth: 140 },
      { field: 'awayTeam', headerName: 'Away', flex: 1.5, minWidth: 140 },
      {
        headerName: 'Score',
        valueGetter: params => `${params.data?.homeScore ?? 0} - ${params.data?.awayScore ?? 0}`,
        flex: 1,
        minWidth: 110,
      },
      { field: 'status', headerName: 'Status', flex: 1, minWidth: 110 },
      { field: 'matchTime', headerName: 'Time', flex: 1, minWidth: 110 },
      { field: 'venue', headerName: 'Venue', flex: 1.5, minWidth: 140 },
      { field: 'source', headerName: 'Source', flex: 1, minWidth: 110 },
    ],
    [],
  );

  return (
    <div className="match-grid-wrapper">
      <div className="ag-theme-quartz match-grid">
        <AgGridReact
          rowData={matches}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          getRowId={params => params.data.id}
          rowClassRules={{
            'match-row-added': (params) => params.data?.highlightStatus === 'added',
            'match-row-removed': (params) => params.data?.highlightStatus === 'removed',
            'match-row-normal': (params) => !params.data?.highlightStatus || params.data?.highlightStatus === 'normal'
          }}
        />
      </div>
    </div>
  );
}

