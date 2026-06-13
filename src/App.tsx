import { useState } from 'react';
import { X } from 'lucide-react';
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
    <div className="app-shell" style={{ backgroundColor: themeColor }}>
      <div className="scene-backdrop" aria-hidden="true" />
      <div className="scene-layer">
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
        <div className="modal-backdrop">
          <div className="glass-panel compare-modal">
            <button
              aria-label="إغلاق المقارنة"
              onClick={() => setShowCompareModal(false)}
              className="modal-close"
            >
              <X size={20} strokeWidth={2} />
            </button>
            <div className="modal-scroll hide-scrollbar">
              <CompareCellsPanel activeCell={activeCell} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
