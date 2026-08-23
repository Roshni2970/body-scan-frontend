'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreeViewer() {
  return (
    <Canvas>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} />
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
