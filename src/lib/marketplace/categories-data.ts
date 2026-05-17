/** Product types and sub-categories for cascading dropdowns. */
export const PRODUCT_TYPES = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Legumes",
  "Herbs",
  "Other",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export const CATEGORIES_BY_TYPE: Record<ProductType, string[]> = {
  Vegetables: [
    "Leafy Vegetables",
    "Root Vegetables",
    "Gourds",
    "Cruciferous",
    "Nightshades",
    "Other Vegetables",
  ],
  Fruits: [
    "Tropical Fruits",
    "Citrus",
    "Berries",
    "Stone Fruits",
    "Coconut",
    "Other Fruits",
  ],
  Grains: ["Rice", "Maize", "Wheat", "Millet", "Other Grains"],
  Legumes: ["Beans", "Lentils", "Peas", "Other Legumes"],
  Herbs: ["Culinary Herbs", "Medicinal Herbs", "Other Herbs"],
  Other: ["Miscellaneous"],
};

/**
 * Seed floor prices — authority-set minimums.
 *  - `minPriceKg`: per kilogram (always set)
 *  - `minPriceCount`: per piece for items sold by count (e.g. coconut). When
 *    omitted, the category cannot be listed with unit="count".
 */
export const FLOOR_PRICE_SEED: {
  type: ProductType;
  name: string;
  minPriceKg: number;
  minPriceCount?: number;
}[] = [
  { type: "Vegetables", name: "Leafy Vegetables", minPriceKg: 180 },
  { type: "Vegetables", name: "Root Vegetables", minPriceKg: 120 },
  { type: "Vegetables", name: "Gourds", minPriceKg: 90 },
  { type: "Vegetables", name: "Cruciferous", minPriceKg: 200 },
  { type: "Vegetables", name: "Nightshades", minPriceKg: 250 },
  { type: "Vegetables", name: "Other Vegetables", minPriceKg: 150 },
  { type: "Fruits", name: "Tropical Fruits", minPriceKg: 220 },
  { type: "Fruits", name: "Citrus", minPriceKg: 180 },
  { type: "Fruits", name: "Berries", minPriceKg: 400 },
  { type: "Fruits", name: "Stone Fruits", minPriceKg: 350 },
  { type: "Fruits", name: "Coconut", minPriceKg: 130, minPriceCount: 190 },
  { type: "Fruits", name: "Other Fruits", minPriceKg: 200 },
  { type: "Grains", name: "Rice", minPriceKg: 95 },
  { type: "Grains", name: "Maize", minPriceKg: 70 },
  { type: "Grains", name: "Wheat", minPriceKg: 85 },
  { type: "Grains", name: "Millet", minPriceKg: 110 },
  { type: "Grains", name: "Other Grains", minPriceKg: 80 },
  { type: "Legumes", name: "Beans", minPriceKg: 160 },
  { type: "Legumes", name: "Lentils", minPriceKg: 280 },
  { type: "Legumes", name: "Peas", minPriceKg: 200 },
  { type: "Legumes", name: "Other Legumes", minPriceKg: 170 },
  { type: "Herbs", name: "Culinary Herbs", minPriceKg: 500 },
  { type: "Herbs", name: "Medicinal Herbs", minPriceKg: 600 },
  { type: "Herbs", name: "Other Herbs", minPriceKg: 450 },
  { type: "Other", name: "Miscellaneous", minPriceKg: 100 },
];
