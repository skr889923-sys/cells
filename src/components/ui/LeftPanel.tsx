import React from 'react';
import type { CellData } from '../../data/cellsData';


interface LeftPanelProps {
  activeCell: CellData;
  onOpenMicroscope: () => void;
  onOpenCompare: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ activeCell, onOpenMicroscope, onOpenCompare }) => {
  return (
    <div className="floating-panel left-panel">
      <div style={{ maxWidth: '400px' }}>
        <h1 className="hero-title">{activeCell.title}</h1>
        <div className="hero-subtitle">{activeCell.category}</div>
        <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--color-primary)', marginBottom: '1.5rem', borderRadius: '2px' }}></div>
        <p className="hero-desc">{activeCell.description}</p>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          فكرة وتطوير : أ. هيثم الزهراني
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '350px' }}>
        {activeCell.microscopeViews && activeCell.microscopeViews.length > 0 && (
          <button className="btn btn-outline glass-panel" onClick={onOpenMicroscope} style={{ padding: '0.8rem 1rem', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', justifyContent: 'flex-start', background: 'rgba(255, 255, 255, 0.5)' }}>
            <span style={{ fontSize: '1.4rem' }}>🔬</span> المشاهدة المجهرية
          </button>
        )}
        <button className="btn btn-outline glass-panel" onClick={onOpenCompare} style={{ padding: '0.8rem 1rem', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', justifyContent: 'flex-start', background: 'rgba(255, 255, 255, 0.5)' }}>
          <span style={{ fontSize: '1.4rem' }}>⚖️</span> مقارنة الخلايا
        </button>
      </div>
    </div>
  );
};
