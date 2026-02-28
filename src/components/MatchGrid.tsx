import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { HighlightStatus, type Match } from '../domain/match';
import { columnDefs } from './columnDefs';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './MatchGrid.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface MatchGridProps {
  matches: Match[];
}

export function MatchGrid({ matches }: MatchGridProps) {
  return (
    <div className="match-grid-wrapper">
      <div className="ag-theme-quartz match-grid">
        <AgGridReact
          theme="legacy"
          rowData={matches}
          columnDefs={columnDefs}
          rowHeight={30}
          getRowId={params => params.data.id}
          rowClassRules={{
            'match-row-added': (params) => params.data?.highlightStatus === HighlightStatus.ADDED,
            'match-row-removed': (params) => params.data?.highlightStatus === HighlightStatus.REMOVED,
            'match-row-normal': (params) => !params.data?.highlightStatus || params.data?.highlightStatus === HighlightStatus.NORMAL
          }}
        />
      </div>
    </div>
  );
}

