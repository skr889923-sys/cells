import React from 'react';
import { cellsData } from '../../data/cellsData';

interface TopSelectorProps {
  selectedCellId: string;
  onSelectCell: (id: string) => void;
}

export const TopSelector: React.FC<TopSelectorProps> = ({ selectedCellId, onSelectCell }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      gap: '0.5rem',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(16px)',
      padding: '0.5rem',
      borderRadius: '30px',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      maxWidth: '90vw',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      WebkitOverflowScrolling: 'touch'
    }} className="hide-scrollbar">
      {cellsData.map((cell) => {
        let icon = '🔬';
        if (cell.id === 'plant-cell') icon = '🌿';
        if (cell.id === 'animal-cell') icon = '🦁';
        if (cell.id === 'skeletal-muscle-cell') icon = '💪';
        if (cell.id === 'white-blood-cell') icon = '🛡️';
        if (cell.id === 'red-blood-cell') icon = '🩸';
        if (cell.id === 'bacterial-cell') icon = '🦠';
        if (cell.id === 'neuron-cell') icon = '🧠';
        if (cell.id === 'sperm-cell') icon = '🧬';
        if (cell.id === 'osteocyte-cell') icon = '🦴';
        if (cell.id === 'keratinocyte-cell') icon = '🖐️';
        if (cell.id === 'cardiomyocyte-cell') icon = '❤️';
        if (cell.id === 'adipocyte-cell') icon = '🧀';
        if (cell.id === 'chondrocyte-cell') icon = '👂';
        if (cell.id === 'enterocyte-cell') icon = '🌭';
        if (cell.id === 'pancreatic-beta-cell') icon = '🩸';

        const isActive = cell.id === selectedCellId;
        
        return (
          <button
            key={cell.id}
            onClick={() => onSelectCell(cell.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              border: 'none',
              background: isActive ? 'var(--color-primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--color-text-main)',
              fontWeight: isActive ? 700 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-arabic-ui)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            {cell.title}
          </button>
        );
      })}
    </div>
  );
};
