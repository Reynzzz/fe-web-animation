import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

function GradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        mouse.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        };
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.05 + mouse.current.y * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08 + mouse.current.x * 0.2;
      
      const targetScale = 1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
      meshRef.current.scale.setScalar(targetScale);
    }
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <group>
      <Sphere args={[1.5, isMobile ? 24 : 48, isMobile ? 24 : 48]} ref={meshRef}>
        <MeshDistortMaterial
          color="#111111"
          speed={isMobile ? 1.2 : 1.8}
          distort={0.35}
          radius={1}
        />
      </Sphere>
      
      {/* Ambient Orbs in 3D Space */}
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#775BA4" />
      <pointLight position={[-10, -10, -10]} intensity={3} color="#F15FA5" />
      <ambientLight intensity={0.5} />
    </group>
  );
}

export default function BackgroundAtmosphere() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const location = useLocation();
  const isHome = location.pathname === '/';

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  // Delay Canvas mount so it doesn't compete with initial page render
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHome) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px', threshold: 0 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isHome]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] bg-[#050505]">
      {!isHome && mounted && (
        <div className="absolute inset-0 opacity-60">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            dpr={1}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            frameloop={isVisible ? 'always' : 'never'}
          >
            <color attach="background" args={['#050505']} />

            <GradientMesh />

            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={isMobile ? 0.2 : 0.3}
                radius={0.3}
              />
            </EffectComposer>
          </Canvas>
        </div>
      )}
      
      {/* Overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
      <div className="noise-bg opacity-[0.05]" />
      
      {/* Persistent CSS glow for extra depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ayuta-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ayuta-pink/5 blur-[150px] rounded-full" />
    </div>
  );
}
