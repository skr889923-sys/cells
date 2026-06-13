import React, { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Float, Bounds, useBounds, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CellData, Organelle } from '../data/cellsData';

type OrbitControlsLike = {
  target: THREE.Vector3;
  update: () => void;
  addEventListener: (type: 'start', listener: () => void) => void;
  removeEventListener: (type: 'start', listener: () => void) => void;
};

type ModelPointerEvent = {
  stopPropagation: () => void;
  point: THREE.Vector3;
};

class ViewerErrorBoundary extends React.Component<
  { resetKey: string; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="model-state model-state-error">
          <strong>تعذر تحميل النموذج ثلاثي الأبعاد</strong>
          <span>تحقق من مسار ملف النموذج أو أعد فتح الخلية لاحقاً.</span>
        </div>
      );
    }

    return this.props.children;
  }
}

function ModelLoadingState() {
  return (
    <Html center>
      <div className="model-state">
        <span className="model-loader" />
        <span>يتم تجهيز النموذج ثلاثي الأبعاد...</span>
      </div>
    </Html>
  );
}

// Combined model + hotspots
function CellModel({ 
  url, 
  cellData, 
  selectedOrganelleId, 
  onSelectOrganelle,
  setLastClickedPoint
}: { 
  url: string, 
  cellData: CellData, 
  selectedOrganelleId: string | null, 
  onSelectOrganelle: (id: string | null) => void,
  setLastClickedPoint: (pt: [number, number, number]) => void
}) {
  const { scene: sourceScene } = useGLTF(url);
  const scene = useMemo(() => sourceScene.clone(true), [sourceScene]);
  const groupRef = useRef<THREE.Group>(null);
  const modelCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return box.getCenter(new THREE.Vector3()).multiplyScalar(-1);
  }, [scene]);
  const modelRotation = cellData.initialRotation ?? [0, Math.PI, 0] as [number, number, number];

  return (
    <group ref={groupRef} position={modelCenter} rotation={modelRotation}>
      <primitive 
        object={scene} 
        onPointerDown={(e: ModelPointerEvent) => {
          e.stopPropagation();
          const localPoint = groupRef.current?.worldToLocal(e.point.clone());
          if (!localPoint) return;
          const pt: [number, number, number] = [
            Number(localPoint.x.toFixed(3)), 
            Number(localPoint.y.toFixed(3)), 
            Number(localPoint.z.toFixed(3))
          ];
          setLastClickedPoint(pt);
        }} 
      />
      {cellData.organelles.map((org) => {
        if (!org.position) return null;
        const isSelected = selectedOrganelleId === org.id;
        const dimmed = !!selectedOrganelleId && !isSelected;
        return (
          <HotspotDot
            key={org.id}
            position={org.position}
            color={org.color}
            isSelected={isSelected}
            dimmed={dimmed}
            onClick={() => onSelectOrganelle(isSelected ? null : org.id)}
          />
        );
      })}
    </group>
  );
}

// Camera controller
function CameraController({ 
  cellData, 
  selectedOrganelleId,
  devMode
}: { 
  cellData: CellData, 
  selectedOrganelleId: string | null,
  devMode: boolean
}) {
  const { controls } = useThree();
  const orbitControls = controls as unknown as OrbitControlsLike | undefined;
  const bounds = useBounds();
  
  const targetPosition = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  // Stop animation if the user tries to move the camera manually
  useEffect(() => {
    if (orbitControls) {
      const stopAnim = () => { isAnimating.current = false; };
      orbitControls.addEventListener('start', stopAnim);
      return () => orbitControls.removeEventListener('start', stopAnim);
    }
  }, [orbitControls]);

  useEffect(() => {
    if (devMode) {
      isAnimating.current = false;
      return;
    }
    if (selectedOrganelleId) {
      const organelle = cellData.organelles.find(o => o.id === selectedOrganelleId);
      if (organelle && organelle.position) {
        
        // If the organelle has specific camera targets, use them
        if (organelle.cameraTarget && organelle.cameraPosition) {
          targetLookAt.current.set(...organelle.cameraTarget);
          targetPosition.current.set(...organelle.cameraPosition);
        } else {
          // Fallback to auto-calculation
          const pos = organelle.position;
          targetLookAt.current.set(pos[0], pos[1], pos[2]);
          targetPosition.current.set(pos[0] + 0.5, pos[1] + 0.3, pos[2] + 1.5);
        }
        isAnimating.current = true;
      }
    } else {
      if (cellData.cameraTarget && cellData.cameraPosition) {
        targetLookAt.current.set(...cellData.cameraTarget);
        targetPosition.current.set(...cellData.cameraPosition);
        isAnimating.current = true;
      } else {
        isAnimating.current = false;
        try {
          bounds.refresh().clip().fit();
        } catch {
          isAnimating.current = false;
        }
      }
    }
  }, [selectedOrganelleId, cellData, bounds, devMode]);

  useFrame((state, delta) => {
    if (isAnimating.current) {
      state.camera.position.lerp(targetPosition.current, 3 * delta);
      if (orbitControls) {
        orbitControls.target.lerp(targetLookAt.current, 3 * delta);
        orbitControls.update();
        
        if (
          state.camera.position.distanceTo(targetPosition.current) < 0.01 &&
          orbitControls.target.distanceTo(targetLookAt.current) < 0.01
        ) {
          isAnimating.current = false;
        }
      }
    }
  });

  return null;
}

// Glowing dot on the cell surface
function HotspotDot({
  position,
  color,
  isSelected,
  dimmed,
  onClick
}: {
  position: [number, number, number],
  color: string,
  isSelected: boolean,
  dimmed: boolean,
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);
  
  useFrame(() => {
    if (meshRef.current) {
      const t = Date.now() * 0.003;
      const s = isSelected ? 1.8 + Math.sin(t) * 0.5 : 1 + Math.sin(t) * 0.2;
      meshRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const t = Date.now() * 0.002;
      const s = isSelected ? 4 + Math.sin(t) * 1.5 : 2.5 + Math.sin(t) * 0.5;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={isSelected ? 5 : 2}
          transparent
          opacity={dimmed ? 0.15 : 1}
          depthTest={false}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={isSelected ? 2 : 0.5}
          transparent
          opacity={dimmed ? 0.03 : isSelected ? 0.3 : 0.12}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}

// Component to extract camera info for developer
function DevCameraTracker({ setCamInfo }: { setCamInfo: (pos: [number,number,number], tgt: [number,number,number]) => void }) {
  const { camera, controls } = useThree();
  const orbitControls = controls as unknown as OrbitControlsLike | undefined;
  useFrame(() => {
    if (orbitControls) {
      const cPos = camera.position;
      const tPos = orbitControls.target;
      setCamInfo(
        [Number(cPos.x.toFixed(3)), Number(cPos.y.toFixed(3)), Number(cPos.z.toFixed(3))],
        [Number(tPos.x.toFixed(3)), Number(tPos.y.toFixed(3)), Number(tPos.z.toFixed(3))]
      );
    }
  });
  return null;
}

interface GLBViewerProps {
  modelUrl: string;
  autoRotate: boolean;
  lightingIntensity: number;
  cellData: CellData;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
}

export const GLBViewer: React.FC<GLBViewerProps> = ({ 
  modelUrl, 
  autoRotate, 
  lightingIntensity,
  cellData,
  selectedOrganelleId,
  onSelectOrganelle
}) => {
  const canUseDevTools = import.meta.env.DEV && new URLSearchParams(window.location.search).get('dev') === '1';
  const [devMode, setDevMode] = useState(false);
  const [devPanelExpanded, setDevPanelExpanded] = useState(true);
  const [camPos, setCamPos] = useState<[number,number,number]>([0,0,0]);
  const [camTgt, setCamTgt] = useState<[number,number,number]>([0,0,0]);
  const [lastClickedPoint, setLastClickedPoint] = useState<[number,number,number]>([0,0,0]);
  
  const [devOverrides, setDevOverrides] = useState<Record<string, Partial<CellData>>>({});
  const devCellData = useMemo(() => {
    const override = devOverrides[cellData.id];
    return override ? { ...cellData, ...override } : cellData;
  }, [cellData, devOverrides]);

  useEffect(() => {
    useGLTF.preload(modelUrl);
  }, [modelUrl]);

  const handleUpdateOrganelle = (orgId: string, updates: Partial<Organelle>) => {
    setDevOverrides(prev => ({
      ...prev,
      [cellData.id]: {
        ...prev[cellData.id],
        organelles: devCellData.organelles.map(o => o.id === orgId ? { ...o, ...updates } : o)
      }
    }));
  };

  const handleUpdateInitialRotation = (rot: [number,number,number]) => {
    setDevOverrides(prev => ({
      ...prev,
      [cellData.id]: {
        ...prev[cellData.id],
        initialRotation: rot
      }
    }));
  };

  const currentCamInfoStr = `[${camPos.join(', ')}]`;
  const currentTargetStr = `[${camTgt.join(', ')}]`;

  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 2 }}
      onClick={() => onSelectOrganelle(null)}
    >
      {canUseDevTools && createPortal(
        <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 999999, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setDevMode(!devMode); }}
              style={{ background: devMode ? '#ef4444' : '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              {devMode ? 'إغلاق وضع المطور 🛠️' : 'وضع المطور 🛠️'}
            </button>
            {devMode && (
              <button 
                onClick={(e) => { e.stopPropagation(); setDevPanelExpanded(!devPanelExpanded); }}
                style={{ background: '#475569', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              >
                {devPanelExpanded ? 'إخفاء اللوحة ➖' : 'إظهار اللوحة ➕'}
              </button>
            )}
          </div>
          {devMode && devPanelExpanded && (
            <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', color: '#e2e8f0', padding: '15px', borderRadius: '8px', fontSize: '12px', width: '380px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ marginBottom: '15px' }}>
                <strong>موقع الكاميرا الحالي:</strong> {currentCamInfoStr}<br/>
                <strong>نقطة تركيز الكاميرا:</strong> {currentTargetStr}<br/>
                <strong>آخر نقطة نُقرت في النموذج:</strong> [{lastClickedPoint.join(', ')}]
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>اتجاه واجهة الخلية (Initial Rotation):</strong>
                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                  <input type="number" step="0.1" value={devCellData.initialRotation?.[0] || 0} onChange={e => handleUpdateInitialRotation([parseFloat(e.target.value), devCellData.initialRotation?.[1]||0, devCellData.initialRotation?.[2]||0])} style={{width:'50px'}} />
                  <input type="number" step="0.1" value={devCellData.initialRotation?.[1] || Math.PI} onChange={e => handleUpdateInitialRotation([devCellData.initialRotation?.[0]||0, parseFloat(e.target.value), devCellData.initialRotation?.[2]||0])} style={{width:'50px'}} />
                  <input type="number" step="0.1" value={devCellData.initialRotation?.[2] || 0} onChange={e => handleUpdateInitialRotation([devCellData.initialRotation?.[0]||0, devCellData.initialRotation?.[1]||Math.PI, parseFloat(e.target.value)])} style={{width:'50px'}} />
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'right' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #475569' }}>
                    <th style={{ padding: '4px' }}>العضية</th>
                    <th style={{ padding: '4px' }}>الموقع (النقطة)</th>
                    <th style={{ padding: '4px' }}>موقع الكاميرا</th>
                  </tr>
                </thead>
                <tbody>
                  {devCellData.organelles.map(org => (
                    <tr key={org.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '6px 4px', fontWeight: 'bold' }}>{org.name}</td>
                      <td style={{ padding: '6px 4px' }}>
                        <button 
                          onClick={() => handleUpdateOrganelle(org.id, { position: lastClickedPoint })}
                          style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', fontSize: '10px' }}
                        >
                          تعيين من النقر
                        </button>
                      </td>
                      <td style={{ padding: '6px 4px' }}>
                        <button 
                          onClick={() => handleUpdateOrganelle(org.id, { cameraPosition: camPos, cameraTarget: camTgt })}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', fontSize: '10px' }}
                        >
                          حفظ الكاميرا
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px', background: '#0f172a', padding: '10px', borderRadius: '4px' }}>
                <div style={{ marginBottom: '5px', color: '#94a3b8' }}>
                  انسخ النص التالي وأرسله لي (الذكاء الاصطناعي) لأحفظه في الكود:
                </div>
                <textarea 
                  readOnly 
                  value={JSON.stringify({ 
                    id: devCellData.id, 
                    initialRotation: devCellData.initialRotation,
                    organelles: devCellData.organelles.map(o => ({
                      id: o.id, name: o.name, position: o.position, cameraPosition: o.cameraPosition, cameraTarget: o.cameraTarget
                    }))
                  }, null, 2)}
                  style={{ width: '100%', height: '100px', background: '#1e293b', color: '#a7f3d0', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      <ViewerErrorBoundary resetKey={modelUrl}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.3, 4], fov: 50 }}>
          <Suspense fallback={<ModelLoadingState />}>
            <CameraController cellData={devCellData} selectedOrganelleId={selectedOrganelleId} devMode={devMode} />
            {devMode && <DevCameraTracker setCamInfo={(p, t) => { setCamPos(p); setCamTgt(t); }} />}
            
            <Stage environment="city" intensity={lightingIntensity * 0.5} adjustCamera={false}>
              <Float speed={devMode ? 0 : 1.5} rotationIntensity={devMode ? 0 : 0.15} floatIntensity={devMode ? 0 : 0.15}>
                <Bounds fit clip observe margin={1.05}>
                  <CellModel 
                    url={modelUrl}
                    cellData={devCellData}
                    selectedOrganelleId={selectedOrganelleId}
                    onSelectOrganelle={onSelectOrganelle}
                    setLastClickedPoint={setLastClickedPoint}
                  />
                </Bounds>
              </Float>
            </Stage>
            
            <OrbitControls 
              makeDefault
              autoRotate={autoRotate && !selectedOrganelleId && !devMode} 
              autoRotateSpeed={0.5} 
              enablePan={true}
              enableZoom={true}
              enableDamping={true}
              minDistance={0.1} 
              maxDistance={50}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </ViewerErrorBoundary>
    </div>
  );
};
