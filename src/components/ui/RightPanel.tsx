import React from 'react';
import type { CellData } from '../../data/cellsData';

interface RightPanelProps {
  activeCell: CellData;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ activeCell, selectedOrganelleId, onSelectOrganelle }) => {
  const selectedOrganelle = selectedOrganelleId 
    ? activeCell.organelles.find(o => o.id === selectedOrganelleId) 
    : null;

  return (
    <div className="floating-panel right-panel">
      <div className="glass-panel" style={{ 
        padding: '1.5rem', borderRadius: '20px', width: '320px', 
        maxHeight: '75vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <h3 style={{ 
          fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.5rem', 
          fontWeight: 700, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', margin: 0 
        }}>
          🧬 التكوين الداخلي (العضيات)
        </h3>

        {/* Selected organelle detail card */}
        {selectedOrganelle && (
          <div style={{
            padding: '1rem',
            background: `linear-gradient(135deg, ${selectedOrganelle.color}18, ${selectedOrganelle.color}08)`,
            borderRadius: '14px',
            border: `1.5px solid ${selectedOrganelle.color}55`,
            boxShadow: `0 0 20px ${selectedOrganelle.color}15`,
            animation: 'fadeSlideIn 0.35s ease-out'
          }}>
            {/* Image */}
            {selectedOrganelle.imageUrl && (
              <div style={{
                width: '100%', height: '120px', borderRadius: '10px',
                overflow: 'hidden', marginBottom: '12px', position: 'relative',
                border: `1px solid ${selectedOrganelle.color}33`
              }}>
                <img 
                  src={selectedOrganelle.imageUrl} 
                  alt={selectedOrganelle.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                  height: '40px'
                }} />
              </div>
            )}

            {/* Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: selectedOrganelle.color,
                boxShadow: `0 0 8px ${selectedOrganelle.color}`,
                flexShrink: 0
              }} />
              <h4 style={{ 
                fontSize: '1.05rem', fontWeight: 700, 
                color: selectedOrganelle.color, margin: 0 
              }}>
                {selectedOrganelle.name}
              </h4>
            </div>

            {/* Function */}
            <div style={{ 
              fontSize: '0.85rem', color: 'var(--color-text-main)', 
              marginBottom: '10px', lineHeight: 1.6 
            }}>
              <strong style={{ color: 'var(--color-text-muted)' }}>الوظيفة: </strong>
              {selectedOrganelle.function}
            </div>

            {/* Medical importance */}
            <div style={{ 
              fontSize: '0.82rem', color: 'var(--color-text-main)', lineHeight: 1.6,
              background: 'rgba(255, 212, 59, 0.08)', padding: '10px 12px', 
              borderRadius: '10px', borderRight: `3px solid ${selectedOrganelle.color}`
            }}>
              <strong style={{ color: selectedOrganelle.color }}>⚕️ الأهمية الطبية: </strong>
              {selectedOrganelle.medicalImportance}
            </div>

            {/* Close button */}
            <button 
              onClick={() => onSelectOrganelle(null)}
              style={{
                marginTop: '10px', width: '100%', padding: '8px',
                border: `1px solid ${selectedOrganelle.color}44`,
                borderRadius: '8px', background: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-main)',
                transition: 'all 0.2s'
              }}
            >
              ← العودة للقائمة
            </button>
          </div>
        )}

        {/* Organelle list */}
        {!selectedOrganelle && activeCell.organelles && activeCell.organelles.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeCell.organelles.map((organelle) => (
              <div 
                key={organelle.id} 
                onClick={() => onSelectOrganelle(organelle.id)}
                style={{ 
                  padding: '10px 12px', 
                  background: 'rgba(255,255,255,0.5)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.7)', 
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(-4px)';
                  e.currentTarget.style.borderColor = organelle.color;
                  e.currentTarget.style.boxShadow = `0 2px 12px ${organelle.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  backgroundColor: organelle.color || 'var(--color-primary)',
                  boxShadow: `0 0 6px ${organelle.color}`,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: '0.9rem', fontWeight: 700, 
                    color: 'var(--color-text-main)', margin: 0 
                  }}>
                    {organelle.name}
                  </h4>
                  <p style={{
                    fontSize: '0.75rem', color: 'var(--color-text-muted)',
                    margin: '2px 0 0 0', lineHeight: 1.3,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'
                  }}>
                    {organelle.function}
                  </p>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>←</span>
              </div>
            ))}
          </div>
        ) : !selectedOrganelle ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            لا تتوفر تفاصيل إضافية لهذه الخلية حالياً.
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
