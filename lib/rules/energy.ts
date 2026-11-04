import type { UserProfile } from "@/lib/domain/types";

const ACTIVITY_FACTOR: Record<UserProfile["activity"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

/** Mifflin–St Jeor resting energy × activity factor. */
export function estimateEnergy(p: Pick<UserProfile, "sex" | "age" | "heightCm" | "weightKg" | "activity">): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === "male" ? 5 : -161);
  return base * ACTIVITY_FACTOR[p.activity];
}

/**
 * Daily energy target in kcal (rounded to 50).
 * For CKD, KDOQI 2020 suggests 25–35 kcal/kg/day, so the estimate is clamped to that range.
 */
export function energyTarget(p: UserProfile): number {
  let kcal = estimateEnergy(p);
  if (p.diets.includes("ckd")) kcal = Math.min(Math.max(kcal, 25 * p.weightKg), 35 * p.weightKg);
  return Math.round(kcal / 50) * 50;
}
