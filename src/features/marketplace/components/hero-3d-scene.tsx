"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type * as THREE from "three";

/* Brand palette — kept in sync with globals.css */
const PALETTE = {
  forest: "#16A34A",
  forestDeep: "#15803D",
  leaf: "#22C55E",
  leafSoft: "#4ADE80",
  mint: "#DCFCE7",
  soil: "#A16207",
  soilDark: "#7C4A0A",
  sun: "#FBBF24",
  water: "#3B82F6",
  cloud: "#FFFFFF",
} as const;

function FarmPlot({
  position,
  size,
  color,
  height = 0.4,
}: {
  position: [number, number, number];
  size: [number, number];
  color: string;
  height?: number;
}) {
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[size[0], height, size[1]]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function PlantCluster({
  position,
  count = 6,
  color = PALETTE.leaf,
  scale = 1,
}: {
  position: [number, number, number];
  count?: number;
  color?: string;
  scale?: number;
}) {
  const positions = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < count; i += 1) {
      const x = (Math.random() - 0.5) * 1.4;
      const z = (Math.random() - 0.5) * 1.4;
      out.push([x, 0, z]);
    }
    return out;
  }, [count]);

  return (
    <group position={position}>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.15 * scale, 0]} castShadow>
            <coneGeometry args={[0.18 * scale, 0.5 * scale, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.45 * scale, 0]} castShadow>
            <sphereGeometry args={[0.16 * scale, 10, 10]} />
            <meshStandardMaterial color={PALETTE.leafSoft} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CornRow({
  position,
  length = 3,
  rotation = 0,
}: {
  position: [number, number, number];
  length?: number;
  rotation?: number;
}) {
  const stalks = useMemo(
    () => Array.from({ length }, (_, i) => i - (length - 1) / 2),
    [length],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {stalks.map((offset) => (
        <group key={offset} position={[offset * 0.45, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.9, 6]} />
            <meshStandardMaterial color={PALETTE.forestDeep} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.95, 0]} castShadow>
            <coneGeometry args={[0.22, 0.5, 8]} />
            <meshStandardMaterial color={PALETTE.leaf} roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
        <meshStandardMaterial color={PALETTE.soilDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.5, 14, 14]} />
        <meshStandardMaterial color={PALETTE.forest} roughness={0.6} />
      </mesh>
      <mesh position={[0.18, 1.2, 0.12]} castShadow>
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshStandardMaterial color={PALETTE.leafSoft} roughness={0.5} />
      </mesh>
    </group>
  );
}

function WindMill({ position }: { position: [number, number, number] }) {
  const bladeRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (bladeRef.current) bladeRef.current.rotation.z += delta * 0.6;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.8, 8]} />
        <meshStandardMaterial color={PALETTE.cloud} roughness={0.5} />
      </mesh>
      <group ref={bladeRef} position={[0, 1.65, 0.08]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI * 2) / 3]}
            castShadow
          >
            <boxGeometry args={[0.05, 0.7, 0.08]} />
            <meshStandardMaterial color={PALETTE.forest} roughness={0.5} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color={PALETTE.forestDeep} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });
  return (
    <group position={[3.2, 3.4, -2.8]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial
          color={PALETTE.sun}
          emissive={PALETTE.sun}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[0.95, 24, 24]} />
        <meshBasicMaterial color={PALETTE.sun} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.6}>
      <group position={position} scale={scale}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={PALETTE.cloud} roughness={0.4} />
        </mesh>
        <mesh position={[0.45, 0.05, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={PALETTE.cloud} roughness={0.4} />
        </mesh>
        <mesh position={[-0.45, 0.02, 0]}>
          <sphereGeometry args={[0.36, 16, 16]} />
          <meshStandardMaterial color={PALETTE.cloud} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function IrrigationChannel() {
  return (
    <mesh position={[0, 0.05, -0.4]} receiveShadow>
      <boxGeometry args={[7.4, 0.06, 0.28]} />
      <meshStandardMaterial
        color={PALETTE.water}
        roughness={0.2}
        metalness={0.15}
      />
    </mesh>
  );
}

function FarmScene() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* Base ground — soft mint disc */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[5.4, 5.4, 0.1, 48]} />
        <meshStandardMaterial color={PALETTE.mint} roughness={0.9} />
      </mesh>

      {/* Soil rim around the disc */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.12, 0]}
      >
        <ringGeometry args={[5.0, 5.6, 48]} />
        <meshStandardMaterial color={PALETTE.soil} roughness={0.9} />
      </mesh>

      {/* Four farm plots arranged like a quilt */}
      <FarmPlot
        position={[-1.85, 0.05, -1.4]}
        size={[2.5, 1.9]}
        color={PALETTE.leaf}
      />
      <FarmPlot
        position={[1.85, 0.05, -1.4]}
        size={[2.5, 1.9]}
        color={PALETTE.forest}
      />
      <FarmPlot
        position={[-1.85, 0.05, 1.4]}
        size={[2.5, 1.9]}
        color={PALETTE.leafSoft}
      />
      <FarmPlot
        position={[1.85, 0.05, 1.4]}
        size={[2.5, 1.9]}
        color={PALETTE.soil}
        height={0.32}
      />

      {/* Plants on plots */}
      <PlantCluster position={[-1.85, 0.25, -1.4]} count={9} color={PALETTE.forestDeep} />
      <CornRow position={[1.85, 0.25, -2.0]} length={5} />
      <CornRow position={[1.85, 0.25, -1.4]} length={5} />
      <CornRow position={[1.85, 0.25, -0.8]} length={5} />

      <PlantCluster position={[-1.85, 0.25, 1.4]} count={10} color={PALETTE.leaf} scale={0.9} />

      {/* Tilled soil rows on plot 4 */}
      {[-0.6, -0.2, 0.2, 0.6].map((z) => (
        <mesh
          key={z}
          position={[1.85, 0.27, 1.4 + z]}
          castShadow
        >
          <boxGeometry args={[2.2, 0.06, 0.16]} />
          <meshStandardMaterial color={PALETTE.soilDark} roughness={0.95} />
        </mesh>
      ))}

      <IrrigationChannel />

      {/* Trees + windmill accents */}
      <Tree position={[-3.4, 0.05, 2.6]} />
      <Tree position={[3.6, 0.05, 2.4]} />
      <WindMill position={[3.4, 0.05, -3.0]} />

      {/* Sun + clouds */}
      <Sun />
      <Cloud position={[-3.4, 2.6, -1.2]} scale={0.9} />
      <Cloud position={[2.5, 2.9, 1.2]} scale={0.7} />
      <Cloud position={[-1.5, 3.2, 1.8]} scale={0.6} />
    </group>
  );
}

export function Hero3DScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [4.8, 4.5, 6.4], fov: 38 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#DCFCE7" />
        <FarmScene />
        <Environment preset="park" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.35}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3.2}
        />
      </Suspense>
    </Canvas>
  );
}
