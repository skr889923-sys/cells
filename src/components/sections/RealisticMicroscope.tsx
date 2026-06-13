import React, { useState } from 'react';
import type { CellData } from '../../data/cellsData';
import { MicroscopeScene } from './MicroscopeScene';

interface RealisticMicroscopeProps {
  activeCell: CellData;
  onClose: () => void;
}

export const RealisticMicroscope: React.FC<RealisticMicroscopeProps> = ({ activeCell, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1, 2.5, 5
  const [focus, setFocus] = useState<number>(50); // 0-100, 50 is perfect
  const [lighting, setLighting] = useState<number>(50); // 0-100, 50 is default

  // Generate objective lenses
  const lenses = [
    { label: '10x', scale: 1 },
    { label: '40x', scale: 2.5 },
    { label: '100x', scale: 5 }
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#050505',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden'
    }}>
      {/* Controls Sidebar */}
      <div className="glass-panel" style={{
        width: '320px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(20,20,20,0.85)',
        color: '#fff',
        zIndex: 10,
        borderRadius: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div>
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1.5rem', justifyContent: 'center' }}
          >
            ✖ إغلاق المجهر
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-primary)' }}>
            مجهر ضوئي محاكي ثلاثي الأبعاد
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem', lineHeight: 1.5 }}>
            قم بضبط عجلات التركيز (Focus) والإضاءة للحصول على رؤية واضحة للشريحة. يمكنك التبديل بين العدسات الشيئية لتكبير التفاصيل، وسحب الشريحة لاستكشافها.
          </p>
        </div>

        {/* Objective Lenses */}
        <div className="control-group">
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#ddd' }}>العدسات الشيئية (Zoom)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {lenses.map((lens) => (
              <button
                key={lens.label}
                onClick={() => setZoomLevel(lens.scale)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: zoomLevel === lens.scale ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                  color: zoomLevel === lens.scale ? '#fff' : '#aaa',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s'
                }}
              >
                {lens.label}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Knob */}
        <div className="control-group">
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 600, color: '#ddd' }}>
            <span>عجلة الضبط (Focus)</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" 
            value={focus} 
            onChange={(e) => setFocus(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
          />
        </div>

        {/* Lighting Knob */}
        <div className="control-group">
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 600, color: '#ddd' }}>
            <span>إضاءة المكثف (Illumination)</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" 
            value={lighting} 
            onChange={(e) => setLighting(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
          />
        </div>

      </div>

      {/* Eyepiece Viewport */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
      }}>
        
        {/* The Eyepiece Circle */}
        <div 
          style={{
            width: '80vmin',
            height: '80vmin',
            maxWidth: '800px',
            maxHeight: '800px',
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#000',
            boxShadow: '0 0 0 2000px rgba(5,5,5,0.98), inset 0 0 80px rgba(0,0,0,0.9)',
            border: '10px solid #111',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* 3D Simulated Microscope Scene */}
          <MicroscopeScene 
            cellData={activeCell} 
            zoomLevel={zoomLevel} 
            focus={focus} 
            lighting={lighting} 
          />

          {/* Reticle / Crosshair Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none',
            background: `
              linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px) 50% 50% / 100% 1px no-repeat,
              linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px) 50% 50% / 1px 100% no-repeat,
              radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.95) 100%)
            `,
            zIndex: 5
          }} />
          
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px', height: '12px',
            border: '1px solid rgba(0,0,0,0.8)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 5
          }} />
        </div>
        
        {/* Caption */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '1rem 2rem',
          borderRadius: '30px',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(5px)',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          عرض مجهري: {activeCell.title}
        </div>
      </div>
    </div>
  );
};

