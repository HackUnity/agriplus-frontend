import type { FarmZone } from "@/features/farm-visualizer/types";

export function getMvpFarmZones(): FarmZone[] {
  return [
    {
      id: "greens",
      name: "Leafy greens",
      x: -2.6,
      z: -0.8,
      width: 2,
      depth: 4,
      color: "#4f8f46",
    },
    {
      id: "okra",
      name: "Okra",
      x: 0,
      z: -0.8,
      width: 2,
      depth: 4,
      color: "#7aa95c",
    },
    {
      id: "beans",
      name: "Beans",
      x: 2.6,
      z: -0.8,
      width: 2,
      depth: 4,
      color: "#8bbf70",
    },
  ];
}
