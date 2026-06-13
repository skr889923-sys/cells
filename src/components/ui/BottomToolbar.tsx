import React from 'react';
import { Palette, Rotate3D, RotateCcw, SunMedium } from 'lucide-react';

interface BottomToolbarProps {
  onReset: () => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  lightingIntensity: number;
  setLightingIntensity: (val: number) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ 
  onReset, autoRotate, setAutoRotate, lightingIntensity, setLightingIntensity, themeColor, setThemeColor 
}) => {
  const colors = ['#FDFBF7', '#1A202C', '#EBF8FF', '#F0FFF4']; // Cream, Dark, Light Blue, Light Green

  return (
    <div className="glass-panel bottom-toolbar" style={{ borderRadius: '30px', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', whiteSpace: 'nowrap' }}>
      <button onClick={onReset} className="btn btn-outline" style={{ flexDirection: 'column', gap: '0.2rem', padding: '0.5rem', border: 'none' }}>
        <RotateCcw size={18} strokeWidth={1.8} />
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-main)', fontWeight: 600 }}>إعادة ضبط</span>
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border)', margin: '0 0.5rem' }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`btn btn-outline ${autoRotate ? 'active' : ''}`}
          style={{ padding: '0.55rem 0.8rem', border: '1px solid var(--color-border)' }}
          aria-pressed={autoRotate}
        >
          <Rotate3D size={18} strokeWidth={1.8} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>الدوران</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SunMedium size={18} strokeWidth={1.8} />
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-main)', fontWeight: 600 }}>الإضاءة</span>
          <input 
            type="range" 
            min="0.5" max="2" step="0.1" 
            value={lightingIntensity} 
            onChange={(e) => setLightingIntensity(parseFloat(e.target.value))}
            style={{ width: '80px', marginLeft: '0.5rem', accentColor: 'var(--color-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
          <Palette size={18} strokeWidth={1.8} />
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-main)', fontWeight: 600 }}>اللون</span>
          <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.5rem' }}>
            {colors.map(color => (
              <button 
                key={color}
                onClick={() => setThemeColor(color)}
                style={{ 
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: color, 
                  border: themeColor === color ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
