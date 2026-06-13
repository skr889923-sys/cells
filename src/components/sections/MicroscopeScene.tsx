import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Sparkles, OrbitControls } from '@react-three/drei';
import { EffectComposer, DepthOfField, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { CellData } from '../../data/cellsData';

interface MicroscopeSceneProps {
  cellData: CellData;
  zoomLevel: number; // 1, 2.5, 5
  focus: number; // 0 to 100, 50 is perfect focus
  lighting: number; // 0 to 100, 50 is default
}

function CellModel({ url, cellData }: { url: string, cellData: CellData }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    // Center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    
    // Apply initial rotation if it exists
    if (cellData.initialRotation) {
      scene.rotation.set(cellData.initialRotation[0], cellData.initialRotation[1], cellData.initialRotation[2]);
    } else {
      scene.rotation.y = Math.PI;
    }
  }, [scene, cellData]);

  return <primitive object={scene} />;
}

// Custom camera controller to handle zoom smoothly
function MicroscopeCamera({ zoomLevel }: { zoomLevel: number }) {
  useFrame((state) => {
    // We map zoomLevel (1, 2.5, 5) to camera distance.
    // 1x = z: 3, 2.5x = z: 1.5, 5x = z: 0.8
    const targetZ = zoomLevel === 1 ? 3 : zoomLevel === 2.5 ? 1.5 : 0.8;
    state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.05);
  });
  return null;
}

export const MicroscopeScene: React.FC<MicroscopeSceneProps> = ({ 
  cellData, 
  zoomLevel, 
  focus, 
  lighting 
}) => {
  // Convert 0-100 lighting to Three.js intensity
  const lightIntensity = (lighting / 50) * 1.5; 
  
  // Convert 0-100 focus to DepthOfField focus distance and blur
  // Perfect focus is at 50. 
  const isOutOfFocus = Math.abs(focus - 50) > 5;
  const blurStrength = Math.abs(focus - 50) * 0.02; // Max blur 1.0

  return (
    <Canvas 
      camera={{ position: [0, 0, 3], fov: 45 }} 
      gl={{ antialias: false }} // Postprocessing works better without default MSAA if using effects
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#05080a']} />
      
      {/* Lighting */}
      <ambientLight intensity={lightIntensity * 0.5} />
      <directionalLight position={[5, 5, 5]} intensity={lightIntensity} />
      <pointLight position={[-5, -5, -5]} intensity={lightIntensity * 0.5} color="#4488ff" />

      <Suspense fallback={null}>
        {/* The Microscopic Environment */}
        <Float 
          speed={2} 
          rotationIntensity={0.2} 
          floatIntensity={0.5} 
          floatingRange={[-0.1, 0.1]}
        >
          {cellData.modelUrl && (
            <CellModel url={cellData.modelUrl} cellData={cellData} />
          )}
        </Float>

        {/* Ambient Particles representing cellular fluid/dust */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <Sparkles count={300} scale={5} size={2} speed={0.4} opacity={0.2} color="#88ccff" />
        </Float>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
          <Sparkles count={150} scale={4} size={3} speed={0.6} opacity={0.15} color="#aaffaa" />
        </Float>

        <MicroscopeCamera zoomLevel={zoomLevel} />
        
        {/* Allow user to pan slightly */}
        <OrbitControls 
          enableRotate={false} 
          enableZoom={false} 
          enablePan={true} 
          panSpeed={0.5}
        />

        {/* Realistic Microscope Lens Effects */}
        <EffectComposer disableNormalPass>
          {/* Depth of Field for Focus Knob */}
          <DepthOfField 
            focusDistance={0} 
            focalLength={0.02} 
            bokehScale={isOutOfFocus ? blurStrength * 10 : 0} 
            height={480} 
          />
          
          {/* Lens Color Fringing */}
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.002, 0.002)} 
          />
          
          {/* Microscope Noise */}
          <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.15} />
          
          {/* Dark edges of the eyepiece */}
          <Vignette eskil={false} offset={0.3} darkness={0.9} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
