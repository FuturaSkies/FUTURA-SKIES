import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface PolyhedronProps {
  intensity: number;
  frequency: number;
}

export const Polyhedron: React.FC<PolyhedronProps> = ({ intensity, frequency }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Map frequency to color
  const color = useMemo(() => {
    if (frequency < 4) return '#4c1d95'; // Delta - Deep Purple
    if (frequency < 8) return '#1e40af'; // Theta - Blue
    if (frequency < 13) return '#065f46'; // Alpha - Green
    if (frequency < 32) return '#ff2fb8'; // Beta - Magenta
    return '#f5d878'; // Gamma - Gold
  }, [frequency]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    
    // Pulse based on intensity
    const scale = 1 + Math.sin(time * 2) * 0.05 * intensity;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          speed={intensity * 2}
          distort={0.4 * intensity}
          radius={1}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
      
      {/* Inner glow sphere */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Sphere>
    </Float>
  );
};
