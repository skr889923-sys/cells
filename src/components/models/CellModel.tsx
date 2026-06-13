import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshTransmissionMaterial, Html, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import type { CellData } from '../../data/cellsData';

interface CellModelProps {
  cellData: CellData;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
  viewMode: string;
  clippingPlanes: THREE.Plane[];
  showLabels: boolean;
}

type StopEvent = {
  stopPropagation: () => void;
};

const seededValue = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const CellModel: React.FC<CellModelProps> = ({ 
  cellData, selectedOrganelleId, onSelectOrganelle, viewMode, clippingPlanes, showLabels
}) => {
  const group = useRef<THREE.Group>(null);
  const granulePositions = useMemo(
    () => Array.from({ length: 30 }, (_, index) => [
      (seededValue(index, 1) - 0.5) * 4,
      (seededValue(index, 2) - 0.5) * 4,
      (seededValue(index, 3) - 0.5) * 4
    ] as [number, number, number]),
    []
  );
  const hemoglobinParticles = useMemo(
    () => Array.from({ length: 100 }, (_, index) => {
      const r = seededValue(index, 4) * 2;
      const theta = seededValue(index, 5) * 2 * Math.PI;
      const y = (seededValue(index, 6) - 0.5) * (r < 1.2 ? 0.4 : 1.2);
      return [r * Math.cos(theta), y, r * Math.sin(theta)] as [number, number, number];
    }),
    []
  );
  
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (viewMode === '3d' && !selectedOrganelleId) {
         // Gentle rotation
         group.current.rotation.y = state.clock.elapsedTime * 0.1;
      }
    }
  });

  const getOrganelleColor = (id: string) => {
    return cellData.organelles.find(o => o.id === id)?.color || '#cccccc';
  };

  const isSelected = (id: string) => selectedOrganelleId === id;
  const isIsolated = viewMode === 'isolated' && selectedOrganelleId;

  const handleClick = (e: StopEvent, id: string) => {
    e.stopPropagation();
    onSelectOrganelle(isSelected(id) ? null : id);
  };

  const renderTooltip = (id: string, isRightSide = true) => {
    if (!showLabels) return null;
    const organelle = cellData.organelles.find(o => o.id === id);
    if (!organelle) return null;
    return (
      <Html distanceFactor={10} zIndexRange={[100, 0]}>
        <div className="organelle-label" style={{ transform: `translate3d(${isRightSide ? '50px' : '-200px'}, -50%, 0)` }}>
          <div className="label-line" style={{ 
            width: '50px', 
            left: isRightSide ? '-50px' : '100%', 
            transform: isRightSide ? 'none' : 'scaleX(-1)' 
          }}></div>
          <div className="organelle-label-title">
            <span className="color-dot" style={{ backgroundColor: organelle.color }}></span>
            {organelle.name}
          </div>
          <div className="organelle-label-desc">{organelle.function.substring(0, 60)}...</div>
        </div>
      </Html>
    );
  };

  if (cellData.id === 'muscle-cell') {
    return (
      <group ref={group} rotation={[0, 0, Math.PI / 2]}>
        {(!isIsolated || isSelected('sarcolemma')) && (
          <mesh onClick={(e) => handleClick(e, 'sarcolemma')}>
            <cylinderGeometry args={[2.2, 2.2, 8, 64]} />
            <MeshTransmissionMaterial 
              color={getOrganelleColor('sarcolemma')} 
              transmission={0.9} 
              opacity={1} 
              transparent 
              roughness={0.2}
              thickness={1.5}
              clippingPlanes={clippingPlanes}
              side={THREE.DoubleSide}
              emissive={isSelected('sarcolemma') ? getOrganelleColor('sarcolemma') : '#000'}
              emissiveIntensity={isSelected('sarcolemma') ? 0.3 : 0}
            />
            {isSelected('sarcolemma') && renderTooltip('sarcolemma', true)}
          </mesh>
        )}

        {(!isIsolated || isSelected('myofibrils')) && (
          <group onClick={(e) => handleClick(e, 'myofibrils')}>
            {[-1.2, -0.4, 0.4, 1.2].map((x, i) => 
              [-1.2, -0.4, 0.4, 1.2].map((z, j) => {
                if (x*x + z*z > 2.5) return null;
                return (
                  <mesh key={`myo-${i}-${j}`} position={[x, 0, z]}>
                    <cylinderGeometry args={[0.35, 0.35, 7.8, 16]} />
                    <meshPhysicalMaterial 
                      color={getOrganelleColor('myofibrils')}
                      roughness={0.6}
                      clearcoat={0.3}
                      clippingPlanes={clippingPlanes}
                      emissive={isSelected('myofibrils') ? getOrganelleColor('myofibrils') : '#000'}
                      emissiveIntensity={isSelected('myofibrils') ? 0.4 : 0}
                    />
                  </mesh>
                )
              })
            )}
            {isSelected('myofibrils') && renderTooltip('myofibrils', false)}
          </group>
        )}

        {(!isIsolated || isSelected('peripheral-nuclei')) && (
          <group onClick={(e) => handleClick(e, 'peripheral-nuclei')}>
            <RoundedBox args={[0.6, 1.2, 0.4]} position={[1.8, 2, 0.8]} radius={0.2} smoothness={4} rotation={[0.2, 0, 0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('peripheral-nuclei')} roughness={0.3} clearcoat={0.8} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.6, 1.2, 0.4]} position={[-1.7, -1.5, -1]} radius={0.2} smoothness={4} rotation={[0, 0.4, -0.3]}>
               <meshPhysicalMaterial color={getOrganelleColor('peripheral-nuclei')} roughness={0.3} clearcoat={0.8} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.6, 1.2, 0.4]} position={[0, 0, 1.9]} radius={0.2} smoothness={4} rotation={[1.5, 0, 0]}>
               <meshPhysicalMaterial color={getOrganelleColor('peripheral-nuclei')} roughness={0.3} clearcoat={0.8} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            {isSelected('peripheral-nuclei') && renderTooltip('peripheral-nuclei', true)}
          </group>
        )}

        {(!isIsolated || isSelected('mitochondria')) && (
          <group onClick={(e) => handleClick(e, 'mitochondria')}>
            <RoundedBox args={[0.4, 0.8, 0.4]} position={[0.8, 1.5, 1.2]} radius={0.2} smoothness={4} rotation={[0.5, 0, 0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('mitochondria')} roughness={0.4} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.4, 0.8, 0.4]} position={[-1, -2, 0.8]} radius={0.2} smoothness={4} rotation={[0.1, 0.8, 0.2]}>
               <meshPhysicalMaterial color={getOrganelleColor('mitochondria')} roughness={0.4} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.4, 0.8, 0.4]} position={[1.2, -1, -1.2]} radius={0.2} smoothness={4} rotation={[-0.3, 0.2, 0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('mitochondria')} roughness={0.4} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            {isSelected('mitochondria') && renderTooltip('mitochondria', false)}
          </group>
        )}
      </group>
    );
  }

  if (cellData.id === 'plant-cell') {
    return (
      <group ref={group}>
        {(!isIsolated || isSelected('cell-wall')) && (
          <RoundedBox args={[4.5, 5.5, 4.5]} radius={0.5} smoothness={4} onClick={(e) => handleClick(e, 'cell-wall')}>
            <MeshTransmissionMaterial color={getOrganelleColor('cell-wall')} transmission={0.9} opacity={1} transparent roughness={0.3} thickness={2} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} emissive={isSelected('cell-wall') ? getOrganelleColor('cell-wall') : '#000'} emissiveIntensity={isSelected('cell-wall') ? 0.3 : 0} />
            {isSelected('cell-wall') && renderTooltip('cell-wall', true)}
          </RoundedBox>
        )}
        {(!isIsolated || isSelected('central-vacuole')) && (
          <RoundedBox args={[2.5, 3.5, 2.5]} position={[0, -0.2, -0.2]} radius={0.4} smoothness={4} onClick={(e) => handleClick(e, 'central-vacuole')}>
            <MeshTransmissionMaterial color={getOrganelleColor('central-vacuole')} transmission={0.95} roughness={0.1} thickness={1} clippingPlanes={clippingPlanes} />
            {isSelected('central-vacuole') && renderTooltip('central-vacuole', false)}
          </RoundedBox>
        )}
        {(!isIsolated || isSelected('nucleus')) && (
          <Sphere args={[0.7, 32, 32]} position={[0, 1.8, 1]} onClick={(e) => handleClick(e, 'nucleus')}>
            <meshPhysicalMaterial color={getOrganelleColor('nucleus')} roughness={0.4} clearcoat={0.8} clippingPlanes={clippingPlanes} />
            {isSelected('nucleus') && renderTooltip('nucleus', true)}
          </Sphere>
        )}
        {(!isIsolated || isSelected('chloroplast')) && (
          <group onClick={(e) => handleClick(e, 'chloroplast')}>
            <RoundedBox args={[0.7, 1.2, 0.7]} position={[1.2, 0.5, 1]} radius={0.3} smoothness={4} rotation={[0.2, 0.5, 0]}>
              <meshPhysicalMaterial color={getOrganelleColor('chloroplast')} roughness={0.2} clearcoat={1} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.7, 1.2, 0.7]} position={[-1.4, -0.5, 1.2]} radius={0.3} smoothness={4} rotation={[-0.2, 0.1, 0.4]}>
              <meshPhysicalMaterial color={getOrganelleColor('chloroplast')} roughness={0.2} clearcoat={1} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.7, 1.2, 0.7]} position={[1.5, -1.2, 0]} radius={0.3} smoothness={4} rotation={[0.4, -0.2, 0.1]}>
              <meshPhysicalMaterial color={getOrganelleColor('chloroplast')} roughness={0.2} clearcoat={1} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            {isSelected('chloroplast') && renderTooltip('chloroplast', true)}
          </group>
        )}
      </group>
    );
  }

  if (cellData.id === 'animal-cell') {
    return (
      <group ref={group}>
        {(!isIsolated || isSelected('cell-membrane')) && (
          <Sphere args={[3, 64, 64]} onClick={(e) => handleClick(e, 'cell-membrane')}>
            <MeshTransmissionMaterial color={getOrganelleColor('cell-membrane')} transmission={0.9} opacity={1} transparent roughness={0.2} thickness={1.5} ior={1.3} clearcoat={1} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} emissive={isSelected('cell-membrane') ? getOrganelleColor('cell-membrane') : '#000'} emissiveIntensity={isSelected('cell-membrane') ? 0.3 : 0} />
            {isSelected('cell-membrane') && renderTooltip('cell-membrane', true)}
          </Sphere>
        )}
        
        {(!isIsolated || isSelected('nucleus')) && (
          <Sphere args={[0.8, 64, 64]} position={[-0.2, 0.2, -0.2]} onClick={(e) => handleClick(e, 'nucleus')}>
            <meshPhysicalMaterial color={getOrganelleColor('nucleus')} roughness={0.4} clearcoat={0.8} clippingPlanes={clippingPlanes} />
            <Sphere args={[0.3, 32, 32]} position={[0.2, 0.2, 0.2]}>
              <meshStandardMaterial color="#805AD5" roughness={0.2} clippingPlanes={clippingPlanes} />
            </Sphere>
            {isSelected('nucleus') && renderTooltip('nucleus', false)}
          </Sphere>
        )}
        
        {(!isIsolated || isSelected('mitochondria')) && (
          <group onClick={(e) => handleClick(e, 'mitochondria')}>
            <RoundedBox args={[0.6, 1.2, 0.6]} radius={0.3} smoothness={4} position={[1.5, 0.8, 0.5]} rotation={[0.5, 0, 0.5]}>
              <meshPhysicalMaterial color={getOrganelleColor('mitochondria')} roughness={0.3} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            <RoundedBox args={[0.5, 1.0, 0.5]} radius={0.25} smoothness={4} position={[-1.2, -1.5, 0.8]} rotation={[-0.5, 1, 0.2]}>
              <meshPhysicalMaterial color={getOrganelleColor('mitochondria')} roughness={0.3} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </RoundedBox>
            {isSelected('mitochondria') && renderTooltip('mitochondria', true)}
          </group>
        )}
        
        {(!isIsolated || isSelected('golgi')) && (
          <group onClick={(e) => handleClick(e, 'golgi')} position={[0.5, -1, -1]}>
            {[0, 0.2, 0.4, 0.6].map((y, i) => (
               <RoundedBox key={i} args={[1.5 - i*0.2, 0.15, 0.8]} position={[0, y, 0]} radius={0.07} smoothness={4}>
                  <meshPhysicalMaterial color={getOrganelleColor('golgi')} roughness={0.4} clearcoat={0.3} clippingPlanes={clippingPlanes} />
               </RoundedBox>
            ))}
            {isSelected('golgi') && renderTooltip('golgi', false)}
          </group>
        )}
      </group>
    );
  }

  if (cellData.id === 'white-blood-cell') {
    return (
      <group ref={group}>
        {(!isIsolated || isSelected('membrane')) && (
          <mesh onClick={(e) => handleClick(e, 'membrane')}>
            <icosahedronGeometry args={[3, 4]} />
            <MeshTransmissionMaterial color={getOrganelleColor('membrane')} transmission={0.9} roughness={0.3} thickness={2} distortion={0.5} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} />
            {isSelected('membrane') && renderTooltip('membrane', true)}
          </mesh>
        )}
        {(!isIsolated || isSelected('segmented-nucleus')) && (
          <group onClick={(e) => handleClick(e, 'segmented-nucleus')}>
            <Sphere args={[0.7, 32, 32]} position={[0.8, 0, 0]}>
              <meshPhysicalMaterial color={getOrganelleColor('segmented-nucleus')} roughness={0.4} clearcoat={0.6} clippingPlanes={clippingPlanes} />
            </Sphere>
            <Sphere args={[0.7, 32, 32]} position={[-0.6, 0.5, 0]}>
              <meshPhysicalMaterial color={getOrganelleColor('segmented-nucleus')} roughness={0.4} clearcoat={0.6} clippingPlanes={clippingPlanes} />
            </Sphere>
            <Sphere args={[0.7, 32, 32]} position={[-0.4, -0.6, 0]}>
              <meshPhysicalMaterial color={getOrganelleColor('segmented-nucleus')} roughness={0.4} clearcoat={0.6} clippingPlanes={clippingPlanes} />
            </Sphere>
            <Cylinder args={[0.15, 0.15, 1.5]} position={[0.1, 0.25, 0]} rotation={[0, 0, 1.2]}>
               <meshPhysicalMaterial color={getOrganelleColor('segmented-nucleus')} roughness={0.4} clearcoat={0.6} clippingPlanes={clippingPlanes} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 1.2]} position={[-0.5, -0.05, 0]} rotation={[0, 0, 0.2]}>
               <meshPhysicalMaterial color={getOrganelleColor('segmented-nucleus')} roughness={0.4} clearcoat={0.6} clippingPlanes={clippingPlanes} />
            </Cylinder>
            {isSelected('segmented-nucleus') && renderTooltip('segmented-nucleus', false)}
          </group>
        )}
        {(!isIsolated || isSelected('granules')) && (
          <group onClick={(e) => handleClick(e, 'granules')}>
            {granulePositions.map((position, i) => (
              <Sphere key={i} args={[0.15, 16, 16]} position={position}>
                <meshPhysicalMaterial color={getOrganelleColor('granules')} roughness={0.2} clearcoat={0.8} clippingPlanes={clippingPlanes} />
              </Sphere>
            ))}
            {isSelected('granules') && renderTooltip('granules', true)}
          </group>
        )}
      </group>
    );
  }

  if (cellData.id === 'red-blood-cell') {
    return (
      <group ref={group}>
        {(!isIsolated || isSelected('membrane')) && (
          <mesh onClick={(e) => handleClick(e, 'membrane')} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[1.5, 0.8, 32, 100]} />
            <MeshTransmissionMaterial color={getOrganelleColor('membrane')} transmission={0.6} roughness={0.2} thickness={3} ior={1.5} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} />
            {/* Center filling to make it a biconcave disc rather than a donut */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1.6, 1.6, 0.6, 64]} />
              <MeshTransmissionMaterial color={getOrganelleColor('membrane')} transmission={0.6} roughness={0.2} thickness={2} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} />
            </mesh>
            {isSelected('membrane') && renderTooltip('membrane', true)}
          </mesh>
        )}
        {(!isIsolated || isSelected('hemoglobin')) && (
          <group onClick={(e) => handleClick(e, 'hemoglobin')} rotation={[Math.PI/2, 0, 0]}>
            {/* Inner particles to represent hemoglobin */}
            {hemoglobinParticles.map((position, i) => (
                <Sphere key={i} args={[0.08, 8, 8]} position={position}>
                  <meshBasicMaterial color={getOrganelleColor('hemoglobin')} />
                </Sphere>
            ))}
            {isSelected('hemoglobin') && renderTooltip('hemoglobin', false)}
          </group>
        )}
      </group>
    );
  }

  if (cellData.id === 'bacteria') {
    return (
      <group ref={group} rotation={[0, 0, Math.PI / 4]}>
        {(!isIsolated || isSelected('capsule')) && (
          <mesh onClick={(e) => handleClick(e, 'capsule')}>
            <capsuleGeometry args={[1.5, 4, 32, 64]} />
            <MeshTransmissionMaterial color={getOrganelleColor('capsule')} transmission={0.95} roughness={0.2} thickness={1} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} />
            {isSelected('capsule') && renderTooltip('capsule', true)}
          </mesh>
        )}
        {(!isIsolated || isSelected('nucleoid')) && (
          <mesh onClick={(e) => handleClick(e, 'nucleoid')} position={[0, 0, 0]}>
            <torusKnotGeometry args={[0.6, 0.1, 100, 16, 3, 7]} />
            <meshPhysicalMaterial color={getOrganelleColor('nucleoid')} roughness={0.5} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            {isSelected('nucleoid') && renderTooltip('nucleoid', false)}
          </mesh>
        )}
        {(!isIsolated || isSelected('plasmids')) && (
          <group onClick={(e) => handleClick(e, 'plasmids')}>
            <mesh position={[0, 1.5, 0.5]} rotation={[0.5, 0, 0]}>
               <torusGeometry args={[0.3, 0.05, 16, 32]} />
               <meshPhysicalMaterial color={getOrganelleColor('plasmids')} roughness={0.3} clippingPlanes={clippingPlanes} />
            </mesh>
            <mesh position={[0.5, -1.5, -0.3]} rotation={[1, 0.5, 0]}>
               <torusGeometry args={[0.25, 0.05, 16, 32]} />
               <meshPhysicalMaterial color={getOrganelleColor('plasmids')} roughness={0.3} clippingPlanes={clippingPlanes} />
            </mesh>
            {isSelected('plasmids') && renderTooltip('plasmids', true)}
          </group>
        )}
        {(!isIsolated || isSelected('flagellum')) && (
          <mesh onClick={(e) => handleClick(e, 'flagellum')} position={[0, -3.5, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0.5, -1, 0.5),
                new THREE.Vector3(-0.5, -2, -0.5),
                new THREE.Vector3(0.5, -3, 0.5),
                new THREE.Vector3(0, -4, 0),
              ]), 64, 0.05, 8, false
            ]} />
            <meshPhysicalMaterial color={getOrganelleColor('flagellum')} roughness={0.3} clippingPlanes={clippingPlanes} />
            {isSelected('flagellum') && renderTooltip('flagellum', false)}
          </mesh>
        )}
      </group>
    );
  }

  if (cellData.id === 'neuron') {
    return (
      <group ref={group} rotation={[0, 0, -Math.PI / 4]} position={[0, 2, 0]}>
        {(!isIsolated || isSelected('soma')) && (
          <mesh onClick={(e) => handleClick(e, 'soma')} position={[0, 2, 0]}>
            <icosahedronGeometry args={[1.5, 4]} />
            <MeshTransmissionMaterial color={getOrganelleColor('soma')} transmission={0.9} roughness={0.3} thickness={1.5} clippingPlanes={clippingPlanes} side={THREE.DoubleSide} emissive={isSelected('soma') ? getOrganelleColor('soma') : '#000'} emissiveIntensity={isSelected('soma') ? 0.3 : 0} />
            {isSelected('soma') && renderTooltip('soma', true)}
          </mesh>
        )}
        
        {(!isIsolated || isSelected('nucleus')) && (
          <group onClick={(e) => handleClick(e, 'nucleus')} position={[0, 2, 0]}>
            <Sphere args={[0.6, 32, 32]}>
              <meshPhysicalMaterial color={getOrganelleColor('nucleus')} roughness={0.4} clearcoat={0.8} clippingPlanes={clippingPlanes} />
            </Sphere>
            <Sphere args={[0.2, 16, 16]} position={[0.1, 0.1, 0.2]}>
              <meshStandardMaterial color="#ffffff" roughness={0.2} clippingPlanes={clippingPlanes} />
            </Sphere>
            {isSelected('nucleus') && renderTooltip('nucleus', false)}
          </group>
        )}
        
        {(!isIsolated || isSelected('dendrites')) && (
          <group onClick={(e) => handleClick(e, 'dendrites')} position={[0, 2, 0]}>
            {/* Top dendrite */}
            <Cylinder args={[0.1, 0.2, 1.5]} position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
               <meshPhysicalMaterial color={getOrganelleColor('dendrites')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>
            <Cylinder args={[0.05, 0.1, 1]} position={[0.3, 2.3, 0]} rotation={[0, 0, -0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('dendrites')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>
            <Cylinder args={[0.05, 0.1, 1]} position={[-0.3, 2.3, 0]} rotation={[0, 0, 0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('dendrites')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>
            
            {/* Side dendrite */}
            <Cylinder args={[0.1, 0.2, 1.5]} position={[1.2, 0.5, 0]} rotation={[0, 0, -1.2]}>
               <meshPhysicalMaterial color={getOrganelleColor('dendrites')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>
            
            {/* Side dendrite 2 */}
            <Cylinder args={[0.1, 0.2, 1.5]} position={[-1.2, 0.5, 0]} rotation={[0, 0, 1.2]}>
               <meshPhysicalMaterial color={getOrganelleColor('dendrites')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>

            {isSelected('dendrites') && renderTooltip('dendrites', true)}
          </group>
        )}
        
        {(!isIsolated || isSelected('axon')) && (
          <mesh onClick={(e) => handleClick(e, 'axon')} position={[0, -2.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 7, 32]} />
            <meshPhysicalMaterial color={getOrganelleColor('axon')} roughness={0.4} clearcoat={0.3} clippingPlanes={clippingPlanes} emissive={isSelected('axon') ? getOrganelleColor('axon') : '#000'} emissiveIntensity={isSelected('axon') ? 0.3 : 0} />
            {isSelected('axon') && renderTooltip('axon', false)}
          </mesh>
        )}
        
        {(!isIsolated || isSelected('myelin-sheath')) && (
          <group onClick={(e) => handleClick(e, 'myelin-sheath')} position={[0, -1.5, 0]}>
            {[0, -1.5, -3, -4.5].map((y, i) => (
              <RoundedBox key={i} args={[0.6, 1.2, 0.6]} position={[0, y, 0]} radius={0.2} smoothness={4}>
                <meshPhysicalMaterial color={getOrganelleColor('myelin-sheath')} roughness={0.2} clearcoat={0.8} clippingPlanes={clippingPlanes} />
              </RoundedBox>
            ))}
            {isSelected('myelin-sheath') && renderTooltip('myelin-sheath', true)}
          </group>
        )}

        {(!isIsolated || isSelected('synaptic-boutons')) && (
          <group onClick={(e) => handleClick(e, 'synaptic-boutons')} position={[0, -6, 0]}>
            <Cylinder args={[0.05, 0.15, 1.5]} position={[0.4, -0.6, 0]} rotation={[0, 0, -0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('synaptic-boutons')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>
            <Sphere args={[0.15, 16, 16]} position={[0.8, -1.3, 0]}>
              <meshPhysicalMaterial color={getOrganelleColor('synaptic-boutons')} roughness={0.3} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </Sphere>

            <Cylinder args={[0.05, 0.15, 1.5]} position={[-0.4, -0.6, 0]} rotation={[0, 0, 0.5]}>
               <meshPhysicalMaterial color={getOrganelleColor('synaptic-boutons')} roughness={0.5} clippingPlanes={clippingPlanes} />
            </Cylinder>
            <Sphere args={[0.15, 16, 16]} position={[-0.8, -1.3, 0]}>
              <meshPhysicalMaterial color={getOrganelleColor('synaptic-boutons')} roughness={0.3} clearcoat={0.5} clippingPlanes={clippingPlanes} />
            </Sphere>
            
            {isSelected('synaptic-boutons') && renderTooltip('synaptic-boutons', false)}
          </group>
        )}
      </group>
    );
  }

  return (
    <Sphere args={[2, 32, 32]}>
      <meshStandardMaterial color="gray" clippingPlanes={clippingPlanes} />
    </Sphere>
  );
};
