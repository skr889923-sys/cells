import React, { Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { CellData } from '../../data/cellsData';

interface MicroscopeSceneProps {
  cellData: CellData;
  zoomLevel: number; // 1, 2.5, 5
  focus: number; // 0 to 100, 50 is perfect focus
  lighting: number; // 0 to 100, 50 is default
  condenser: number;
  stageOffset: { x: number; y: number };
  sampleRotation: { x: number; y: number; z: number };
}

function CellModel({
  url,
  cellData,
  stageOffset,
  sampleScale,
  focusBias,
  sampleRotation
}: {
  url: string;
  cellData: CellData;
  stageOffset: { x: number; y: number };
  sampleScale: number;
  focusBias: number;
  sampleRotation: { x: number; y: number; z: number };
}) {
  const { scene: sourceScene } = useGLTF(url);
  const scene = useMemo(() => sourceScene.clone(true), [sourceScene]);
  const modelCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return box.getCenter(new THREE.Vector3()).multiplyScalar(-1);
  }, [scene]);
  const microscopeAnchor = cellData.organelles[0]?.position ?? [0, 0, 0];
  const modelRotation = (cellData.initialRotation ?? [0, Math.PI, 0]) as [number, number, number];
  const rotationOffset = [
    THREE.MathUtils.degToRad(sampleRotation.x),
    THREE.MathUtils.degToRad(sampleRotation.y),
    THREE.MathUtils.degToRad(sampleRotation.z)
  ] as [number, number, number];

  return (
    <group
      position={[
        modelCenter.x + stageOffset.x - microscopeAnchor[0] * sampleScale * focusBias,
        modelCenter.y + stageOffset.y - microscopeAnchor[1] * sampleScale * focusBias,
        modelCenter.z
      ]}
      rotation={[
        modelRotation[0] + rotationOffset[0],
        modelRotation[1] + rotationOffset[1],
        modelRotation[2] + rotationOffset[2]
      ]}
      scale={sampleScale}
    >
      <primitive object={scene} />
    </group>
  );
}

// Custom camera controller to handle zoom smoothly
function MicroscopeCamera({ zoomLevel }: { zoomLevel: number }) {
  useFrame((state) => {
    // We map zoomLevel (1, 2.5, 5) to camera distance.
    // 1x = z: 2.45, 2.5x = z: 1.25, 5x = z: 0.62
    const targetZ = zoomLevel === 1 ? 2.45 : zoomLevel === 2.5 ? 1.25 : 0.62;
    state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.05);
  });
  return null;
}

export const MicroscopeScene: React.FC<MicroscopeSceneProps> = ({ 
  cellData, 
  zoomLevel, 
  focus, 
  lighting,
  condenser,
  stageOffset,
  sampleRotation
}) => {
  // Convert 0-100 lighting to Three.js intensity
  const lightIntensity = (lighting / 50) * 1.5;
  const condenserFactor = Math.max(condenser / 100, 0.12);
  const sampleScale = zoomLevel === 1 ? 1.8 : zoomLevel === 2.5 ? 2.2 : 2.75;
  const focusBias = zoomLevel === 1 ? 0.22 : zoomLevel === 2.5 ? 0.82 : 1.08;
  
  // Perfect focus is at 50.
  const isOutOfFocus = Math.abs(focus - 50) > 5;
  const blurStrength = Math.min(Math.abs(focus - 50) * 0.03, 1.2);

  return (
    <Canvas 
      camera={{ position: [0, 0, 3], fov: 45 }} 
      gl={{ antialias: false }} // Postprocessing works better without default MSAA if using effects
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#05080a']} />
      
      {/* Lighting */}
      <ambientLight intensity={lightIntensity * (0.24 + condenserFactor * 0.32)} />
      <directionalLight position={[5, 5, 5]} intensity={lightIntensity * 0.62} />
      <pointLight position={[-5, -5, -5]} intensity={lightIntensity * 0.28} color="#8ab7ff" />
      <spotLight
        position={[0, 0, 3.8]}
        angle={0.26 + condenserFactor * 0.42}
        penumbra={0.85}
        intensity={lightIntensity * 1.8}
        color="#f7fbff"
      />

      <Suspense fallback={null}>
        {/* The Microscopic Environment */}
        <Float 
          speed={2} 
          rotationIntensity={0.2} 
          floatIntensity={0.5} 
          floatingRange={[-0.1, 0.1]}
        >
          {cellData.modelUrl && (
            <CellModel
              url={cellData.modelUrl}
              cellData={cellData}
              stageOffset={stageOffset}
              sampleScale={sampleScale}
              focusBias={focusBias}
              sampleRotation={sampleRotation}
            />
          )}
        </Float>

        {/* Ambient Particles representing cellular fluid/dust */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <Sparkles
            count={zoomLevel === 5 ? 180 : 300}
            scale={5}
            size={zoomLevel === 5 ? 1.2 : 2}
            speed={0.4}
            opacity={0.08 + condenserFactor * 0.14}
            color="#88ccff"
          />
        </Float>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
          <Sparkles
            count={zoomLevel === 1 ? 150 : 90}
            scale={4}
            size={2.4}
            speed={0.6}
            opacity={0.05 + condenserFactor * 0.1}
            color="#b6ffbf"
          />
        </Float>

        <MicroscopeCamera zoomLevel={zoomLevel} />
        
        {/* Allow user to pan slightly */}
        <OrbitControls 
          enableRotate={false} 
          enableZoom={false} 
          enablePan={false}
        />

        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[8, 8]} />
          <meshBasicMaterial
            color="#05080a"
            transparent
            opacity={isOutOfFocus ? blurStrength * 0.15 : 0.02}
          />
        </mesh>
      </Suspense>
    </Canvas>
  );
};
