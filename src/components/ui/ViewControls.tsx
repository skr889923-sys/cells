import React from 'react';
import type { CellData } from '../../data/cellsData';

interface ViewControlsProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  cells: CellData[];
  selectedCellId: string;
  onSelectCell: (id: string) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({ 
  viewMode, setViewMode, cells, selectedCellId, onSelectCell 
}) => {
  return (
    <div className="flex-col">
      <div className="panel-section">
        <h2 className="panel-title">الخلية المحددة</h2>
        <select 
          value={selectedCellId}
          onChange={(e) => onSelectCell(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            background: 'var(--color-surface)'
          }}
        >
          {cells.map(cell => (
            <option key={cell.id} value={cell.id}>{cell.title}</option>
          ))}
        </select>
      </div>

      <div className="panel-section">
        <h2 className="panel-title">وضع العرض</h2>
        <div className="flex-col gap-2">
          <button 
            className={`btn ${viewMode === '3d' ? 'active' : 'btn-outline'}`}
            onClick={() => setViewMode('3d')}
          >
            عرض ثلاثي الأبعاد
          </button>
          <button 
            className={`btn ${viewMode === 'cross-section' ? 'active' : 'btn-outline'}`}
            onClick={() => setViewMode('cross-section')}
          >
            مقطع عرضي
          </button>
          <button 
            className={`btn ${viewMode === 'isolated' ? 'active' : 'btn-outline'}`}
            onClick={() => setViewMode('isolated')}
          >
            عزل العضيات
          </button>
        </div>
      </div>
    </div>
  );
};
