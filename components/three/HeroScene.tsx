"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* Slowly-orbiting golden orb with liquid distortion — the hero centrepiece. */
function GoldOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.08;
    mesh.current.rotation.y = t * 0.12;
    // Gentle mouse parallax
    const { x, y } = state.pointer;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, x * 0.4, 0.02);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, y * 0.3, 0.02);
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={mesh} scale={1.85}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#d4a82f"
          emissive="#3a2c08"
          roughness={0.18}
          metalness={0.95}
          distort={0.32}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

/* Wireframe halo ring orbiting the orb. */
function HaloRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = state.clock.elapsedTime;
    ring.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.2) * 0.18;
    ring.current.rotation.z = t * 0.1;
  });
  return (
    <mesh ref={ring} scale={2.9}>
      <torusGeometry args={[1, 0.012, 12, 140]} />
      <meshStandardMaterial
        color="#f0d489"
        emissive="#d4a82f"
        emissiveIntensity={0.7}
        metalness={1}
        roughness={0.2}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/* Drifting particle starfield. */
function Particles({ count = 900 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi) - 4;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#9fb0c5"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#f6e3a8" />
      <pointLight position={[-6, -3, -2]} intensity={1.1} color="#38d9c3" />
      <GoldOrb />
      <HaloRing />
      <Particles />
    </Canvas>
  );
}
