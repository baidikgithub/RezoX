"use client";

import dynamic from "next/dynamic";
import type { Group } from "three";

const Scene = dynamic(async () => {
  const React = await import("react");
  const { Canvas, useFrame } = await import("@react-three/fiber");
  const { Float, MeshTransmissionMaterial, Sparkles } = await import("@react-three/drei");
  function Towers() {
    const group = React.useRef<Group>(null);
    useFrame((state) => {
      if (!group.current) return;
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    });

    return (
      <group ref={group}>
        {Array.from({ length: 18 }).map((_, index) => {
          const x = (index % 6) - 2.5;
          const z = Math.floor(index / 6) - 1;
          const height = 0.9 + ((index * 37) % 9) / 7;
          return (
            <Float key={index} speed={1.2 + index * 0.03} floatIntensity={0.12}>
              <mesh position={[x * 0.85, height / 2 - 0.6, z * 0.95]} castShadow receiveShadow>
                <boxGeometry args={[0.44, height, 0.44]} />
                <MeshTransmissionMaterial
                  color={index % 2 ? "#7dd3fc" : "#c4b5fd"}
                  roughness={0.18}
                  transmission={0.45}
                  thickness={0.45}
                />
              </mesh>
            </Float>
          );
        })}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.64, 0]}>
          <circleGeometry args={[4.3, 96]} />
          <meshStandardMaterial color="#101827" metalness={0.25} roughness={0.35} />
        </mesh>
      </group>
    );
  }

  return function HeroCanvas() {
    return (
      <Canvas camera={{ position: [0, 2.3, 5.8], fov: 42 }} dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <color attach="background" args={["#050816"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={2.2} />
        <pointLight position={[-3, 1, 2]} color="#22d3ee" intensity={5} distance={7} />
        <pointLight position={[3, 2, -2]} color="#a78bfa" intensity={4} distance={7} />
        <Sparkles count={70} scale={7} size={2.2} speed={0.25} color="#ffffff" />
        <Towers />
      </Canvas>
    );
  };
}, { ssr: false });

export default function PremiumHeroScene() {
  return <Scene />;
}
