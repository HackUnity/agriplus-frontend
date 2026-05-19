import { SRI_LANKA_DISTRICTS } from "./districts";

/**
 * Static fallback: approximate road distances (km) between district centers.
 * Symmetric matrix; same district = 0 km.
 * Replace with Google Distance Matrix API when GOOGLE_MAPS_API_KEY is set.
 */
const DISTRICT_INDEX: Record<string, number> = Object.fromEntries(
  SRI_LANKA_DISTRICTS.map((d, i) => [d, i]),
);

// Representative distances from Colombo hub (scaled for inter-district estimates)
const FROM_COLOMBO_KM: number[] = [
  0, 25, 45, 115, 145, 180, 115, 160, 250, 400, 320, 260, 250, 300, 320, 360,
  260, 100, 130, 200, 220, 230, 280, 100, 85,
];

function estimateKm(fromIdx: number, toIdx: number): number {
  if (fromIdx === toIdx) return 0;
  const a = FROM_COLOMBO_KM[fromIdx] ?? 150;
  const b = FROM_COLOMBO_KM[toIdx] ?? 150;
  // Triangle inequality approximation via Colombo as hub
  return Math.round(Math.abs(a - b) + Math.min(a, b) * 0.15);
}

const MATRIX: number[][] = SRI_LANKA_DISTRICTS.map((_, i) =>
  SRI_LANKA_DISTRICTS.map((__, j) => estimateKm(i, j)),
);

export function getStaticDistrictDistanceKm(
  from: string,
  to: string,
): number | null {
  const fi = DISTRICT_INDEX[from];
  const ti = DISTRICT_INDEX[to];
  if (fi === undefined || ti === undefined) return null;
  return MATRIX[fi][ti];
}

/**
 * Fetch distance between districts.
 * Uses Google Distance Matrix when configured; otherwise static matrix.
 */
export async function getDistrictDistanceKm(
  from: string,
  to: string,
): Promise<number> {
  const staticKm = getStaticDistrictDistanceKm(from, to);
  if (staticKm === null) return 0;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return staticKm;

  try {
    const origins = encodeURIComponent(`${from}, Sri Lanka`);
    const destinations = encodeURIComponent(`${to}, Sri Lanka`);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;
    const res = await fetch(url);
    const data = (await res.json()) as {
      rows?: { elements?: { distance?: { value: number }; status: string }[] }[];
    };
    const meters = data.rows?.[0]?.elements?.[0]?.distance?.value;
    if (meters != null) return Math.round(meters / 1000);
  } catch {
    // fall through to static
  }
  return staticKm;
}
