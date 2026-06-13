import { useState } from 'react';
import { Scene } from './components/Scene';
import { cellsData } from './data/cellsData';
import './index.css';

import { LeftPanel } from './components/ui/LeftPanel';
import { RightPanel } from './components/ui/RightPanel';
import { BottomToolbar } from './components/ui/BottomToolbar';
import { RealisticMicroscope } from './components/sections/RealisticMicroscope';
import { CompareCellsPanel } from './components/sections/CompareCellsPanel';
import { TopSelector } from './components/ui/TopSelector';

function App() {
  const [selectedCellId, setSelectedCellId] = useState(cellsData[0].id);
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>('3d');
  
  // New States
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingIntensity, setLightingIntensity] = useState(1);
  const [themeColor, setThemeColor] = useState('var(--color-bg)');
  const [showMicroscopeModal, setShowMicroscopeModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const activeCell = cellsData.find(c => c.id === selectedCellId) || cellsData[0];


  const handleReset = () => {
    setSelectedOrganelleId(null);
    setViewMode('3d');
    setAutoRotate(true);
    setLightingIntensity(1);
    setThemeColor('var(--color-bg)');
    setShowLabels(true);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: themeColor, transition: 'background-color 0.5s ease' }}>
      {/* 3D Scene - Full Screen */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}>
        <Scene 
          cellData={activeCell} 
          selectedOrganelleId={selectedOrganelleId}
          onSelectOrganelle={setSelectedOrganelleId}
          viewMode={viewMode}
          showLabels={showLabels}
          autoRotate={autoRotate}
          lightingIntensity={lightingIntensity}
        />
      </div>

      <TopSelector selectedCellId={selectedCellId} onSelectCell={(id) => {
        setSelectedCellId(id);
        setSelectedOrganelleId(null);
        setViewMode('3d');
      }} />

      <LeftPanel 
        activeCell={activeCell} 
        onOpenMicroscope={() => setShowMicroscopeModal(true)} 
        onOpenCompare={() => setShowCompareModal(true)} 
      />
      
      <RightPanel 
        activeCell={activeCell} 
        selectedOrganelleId={selectedOrganelleId}
        onSelectOrganelle={setSelectedOrganelleId}
      />

      {/* Modal buttons moved to LeftPanel */}
      
      <BottomToolbar 
        onReset={handleReset}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        lightingIntensity={lightingIntensity}
        setLightingIntensity={setLightingIntensity}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />

      {/* Modals */}
      {showMicroscopeModal && (
        <RealisticMicroscope 
          activeCell={activeCell} 
          onClose={() => setShowMicroscopeModal(false)} 
        />
      )}

      {showCompareModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '80%', maxWidth: '900px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} className="glass-panel">
            <button onClick={() => setShowCompareModal(false)} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', cursor: 'pointer', zIndex: 101, boxShadow: 'var(--shadow-sm)', color: 'var(--color-text-main)' }}>✖</button>
            <div style={{ overflowY: 'auto', padding: '2rem' }} className="hide-scrollbar">
              <CompareCellsPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
