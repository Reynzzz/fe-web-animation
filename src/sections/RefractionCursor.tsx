import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function RefractionCursor() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Mengikuti pergerakan mouse dengan interpolasi mulus (Lerp)
      // Koordinat mouse state.pointer berada di rentang -1 hingga 1
      const targetX = (state.pointer.x * state.viewport.width) / 2;
      const targetY = (state.pointer.y * state.viewport.height) / 2;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 1]}>
      {/* Bentuk kursor bulat */}
      <circleGeometry args={[0.5, 64]} />
      <MeshTransmissionMaterial 
        background={new THREE.Color('#000000')}
        transmission={1} 
        thickness={0.5} // Ketebalan kaca untuk distorsi
        roughness={0} 
        chromaticAberration={0.05} // Efek pelangi di pinggiran lensa
        ior={1.5} // Index of Refraction
      />
    </mesh>
  );
}