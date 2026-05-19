export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
  } catch {
    // legacy single url
    if (images) return [images];
  }
  return [];
}

export function serializeImages(urls: string[]): string {
  return JSON.stringify(urls);
}

export function anonymizeBidder(name: string, index: number): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? "Bidder";
  return `${first.charAt(0)}***${String(index + 1).padStart(2, "0")}`;
}
