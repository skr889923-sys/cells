import React, { useState, useEffect } from 'react';
import type { CellData } from '../data/cellsData';

interface SceneProps {
  cellData: CellData;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
  viewMode: string;
  showLabels: boolean;
  autoRotate: boolean;
  lightingIntensity: number;
}

import { GLBViewer } from './GLBViewer';

export const Scene: React.FC<SceneProps> = ({ 
  cellData, 
  lightingIntensity, 
  autoRotate,
  selectedOrganelleId,
  onSelectOrganelle
}) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(false);
    if (!cellData.modelUrl) {
      const img = new Image();
      img.src = cellData.imageUrl;
      img.onload = () => setLoaded(true);
    }
  }, [cellData.imageUrl, cellData.modelUrl]);

  return (
    <div className="canvas-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
      
      {/* Background ambient gradient matching the image vibe */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vmin', height: '80vmin', background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)', zIndex: 1, pointerEvents: 'none' }} />

      {cellData.modelUrl ? (
        <GLBViewer 
          modelUrl={cellData.modelUrl} 
          autoRotate={autoRotate} 
          lightingIntensity={lightingIntensity}
          cellData={cellData}
          selectedOrganelleId={selectedOrganelleId}
          onSelectOrganelle={onSelectOrganelle}
        />
      ) : (
        <img 
          src={cellData.imageUrl} 
          alt={cellData.title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            zIndex: 2,
            transition: 'opacity 0.8s ease-in-out, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'scale(1)' : 'scale(0.95)',
            animation: 'float 6s ease-in-out infinite',
            filter: `brightness(${lightingIntensity}) drop-shadow(0px 10px 30px rgba(0,0,0,0.1))`
          }}
        />
      )}

      

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};
