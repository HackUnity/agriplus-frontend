"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { getMvpFarmZones } from "@/features/farm-visualizer/utils/layout-generator";

export function FarmScene() {
  const zones = getMvpFarmZones();

  return (
    <Canvas camera={{ position: [0, 6, 7], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 6, 4]} intensity={1.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[9, 6]} />
        <meshStandardMaterial color="#8a6948" />
      </mesh>
      {zones.map((zone) => (
        <group key={zone.id} position={[zone.x, 0, zone.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[zone.width, zone.depth]} />
            <meshStandardMaterial color={zone.color} />
          </mesh>
          <Text
            position={[0, 0.08, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.22}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {zone.name}
          </Text>
        </group>
      ))}
      <mesh position={[0, 0.02, 2.4]}>
        <boxGeometry args={[8.5, 0.08, 0.35]} />
        <meshStandardMaterial color="#d6c4a7" />
      </mesh>
      <mesh position={[-4.2, 0.12, -2.7]}>
        <cylinderGeometry args={[0.22, 0.22, 0.25, 24]} />
        <meshStandardMaterial color="#4ba3c7" />
      </mesh>
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}
