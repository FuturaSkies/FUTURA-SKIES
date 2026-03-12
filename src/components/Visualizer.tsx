import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Polyhedron } from './Polyhedron';

interface VisualizerProps {
  intensity: number;
  frequency: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ intensity, frequency }) => {
  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-black/20 border border-white/5">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={['#050513']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff2fb8" intensity={0.5} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Polyhedron intensity={intensity} frequency={frequency} />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
          Harmonic Resonance Field
        </div>
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
          Active
        </div>
      </div>
    </div>
  );
};
