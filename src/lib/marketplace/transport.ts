/**
 * Estimated transport cost (LKR) from distance and quantity.
 * rate = TRANSPORT_RATE_PER_KM_KG (default 0.5 LKR per km per kg)
 */
export function estimateTransportCost(
  distanceKm: number,
  quantityKg: number,
): number {
  const rate = Number(process.env.TRANSPORT_RATE_PER_KM_KG ?? "0.5");
  return Math.round(distanceKm * quantityKg * rate);
}

/** Convert listing quantity to kg for transport calculations. */
export function quantityToKg(quantity: number, unit: string): number {
  switch (unit) {
    case "g":
      return quantity / 1000;
    case "metric_ton":
      return quantity * 1000;
    case "kg":
    default:
      return quantity;
  }
}

/** Floor price for a category based on listing unit. */
export function floorPriceForUnit(
  minPriceKg: number,
  minPriceG: number,
  unit: string,
): number {
  if (unit === "g") return minPriceG;
  if (unit === "metric_ton") return minPriceKg * 1000;
  return minPriceKg;
}

export function getBidIncrement(): number {
  return Number(process.env.BID_INCREMENT ?? "50");
}
