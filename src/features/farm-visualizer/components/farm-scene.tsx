"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import type { FarmLayout, LayoutElement } from "@/types/pipeline.types";
import { getMvpFarmZones } from "@/features/farm-visualizer/utils/layout-generator";

function num(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ObstacleMesh({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
      <meshStandardMaterial color="#6f7983" />
    </mesh>
  );
}

function PlantMesh({
  type,
  position,
}: {
  type: string;
  position: [number, number, number];
}) {
  if (type === "plant_corn") {
    return (
      <mesh position={position}>
        <coneGeometry args={[0.14, 0.42, 10]} />
        <meshStandardMaterial color="#5e8c2f" />
      </mesh>
    );
  }

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color="#e46d2f" />
    </mesh>
  );
}

function LayoutElementMesh({ element }: { element: LayoutElement }) {
  const type = String(element.type ?? "");

  if (
    (type === "plant_carrot" ||
      type === "plant_corn" ||
      type === "obstacle") &&
    element.coordinates
  ) {
    const { x, y, z } = element.coordinates;
    const yOffset = type === "plant_corn" ? 0.21 : type === "obstacle" ? 0.175 : 0.12;
    const position: [number, number, number] = [x, y + yOffset, z];

    if (type === "obstacle") {
      return <ObstacleMesh position={position} />;
    }
    return <PlantMesh type={type} position={position} />;
  }

  if (!element.start_point || !element.end_point) {
    return null;
  }

  const s = element.start_point;
  const e = element.end_point;

  if (type === "raised_bed") {
    const centerX = (s.x + e.x) / 2;
    const centerZ = (s.z + e.z) / 2;
    const bedW = Math.max(Math.abs(e.x - s.x), 0.2);
    const bedL = Math.max(Math.abs(e.z - s.z), 0.2);
    return (
      <mesh position={[centerX, (s.y + e.y) / 2 + 0.12, centerZ]}>
        <boxGeometry args={[bedW, 0.24, bedL]} />
        <meshStandardMaterial color="#8f6b4f" />
      </mesh>
    );
  }

  const color = type === "irrigation_line" ? "#2d80d3" : "#7a6347";
  return (
    <Line
      points={[
        [s.x, s.y, s.z],
        [e.x, e.y, e.z],
      ]}
      color={color}
      lineWidth={2}
    />
  );
}

function PipelineLayoutScene({ layout }: { layout: FarmLayout }) {
  const width = Math.max(num(layout.dimensions.width, 9), 1);
  const length = Math.max(num(layout.dimensions.length, 9), 1);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 6, 4]} intensity={1.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#97b785" />
      </mesh>
      {layout.elements.map((element, index) => (
        <LayoutElementMesh key={`${element.type}-${index}`} element={element} />
      ))}
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0, 0]}
      />
    </>
  );
}

function MvpZonesScene() {
  const zones = getMvpFarmZones();

  return (
    <>
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
    </>
  );
}

export function FarmScene({ layout }: { layout?: FarmLayout | null }) {
  const hasPipelineLayout = Boolean(
    layout?.dimensions && Array.isArray(layout.elements) && layout.elements.length > 0,
  );

  const cameraPosition = useMemo((): [number, number, number] => {
    if (hasPipelineLayout && layout) {
      const w = Math.max(num(layout.dimensions.width, 9), 1);
      const l = Math.max(num(layout.dimensions.length, 9), 1);
      const d = Math.max(w, l, 8) * 0.95;
      return [d, d * 0.9, d];
    }
    return [0, 6, 7];
  }, [hasPipelineLayout, layout]);

  return (
    <Canvas camera={{ position: cameraPosition, fov: 45 }}>
      {hasPipelineLayout && layout ? (
        <PipelineLayoutScene layout={layout} />
      ) : (
        <MvpZonesScene />
      )}
    </Canvas>
  );
}
