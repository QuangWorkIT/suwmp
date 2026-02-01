import type {
  CapacityStatus,
  EnterpriseCapacity,
} from "@/types/enterpriseCapacity";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function safePct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return clamp(n, 0, 100);
}

export function formatKg(n: number) {
  const value = Number.isFinite(n) ? n : 0;
  return value.toLocaleString("en-US");
}

export function formatWasteTypeName(name: string): string {
  if (!name) return "";
  // Replace underscores with spaces, lowercase everything, then capitalize words
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getUtilizationPct(usedKg: number, capacityKg: number) {
  if (!capacityKg || capacityKg <= 0) return 0;
  return safePct((usedKg / capacityKg) * 100);
}

export function getCapacityStatus(
  usedKg: number,
  item: Pick<
    EnterpriseCapacity,
    "dailyCapacityKg" | "warningThreshold"
  >,
): CapacityStatus {
  const utilization = getUtilizationPct(usedKg, item.dailyCapacityKg);
  if (utilization >= safePct(item.warningThreshold)) return "CRITICAL";
  if (utilization >= safePct(item.warningThreshold - 10)) return "WARNING";
  return "NORMAL";
}

/**
 * Generate a consistent (but varied) color for a waste type.
 * - No hard-coded waste type names.
 * - Uses a golden-angle based hue to keep nearby IDs visually distinct.
 */
export function generateColorFromWasteType(
  wasteTypeId: number,
  wasteTypeName: string,
): string {
  const name = (wasteTypeName || "").toLowerCase().trim();

  // lightweight string hash (deterministic)
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  // Golden-angle hue keeps sequential IDs far apart
  const golden = 137.508;
  const baseHue = ((wasteTypeId || 0) * golden) % 360;

  // small, deterministic offset so different names with same ID still vary
  const offset = (h % 61) - 30; // [-30..30]
  const hue = (baseHue + offset + 360) % 360;

  // keep saturation/high contrast for UI bars
  const sat = 78;
  const light = 48;
  return `hsl(${hue.toFixed(1)}, ${sat}%, ${light}%)`;
}
