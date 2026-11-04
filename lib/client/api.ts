"use client";

import type { DayPlan, PlannedMeal, Slot, UserProfile, WeekPlan } from "@/lib/domain/types";
import type { LockedMeal } from "@/lib/engine/solve";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

/** Normalize a profile so it always passes server validation (strip undefined lab values etc.). */
export function cleanProfile(p: UserProfile): UserProfile {
  const labs = Object.fromEntries(Object.entries(p.labs ?? {}).filter(([, v]) => typeof v === "number" && !Number.isNaN(v)));
  return {
    ...p,
    ckdStage: p.diets.includes("ckd") ? (p.ckdStage ?? "3b") : undefined,
    fodmapPhase: p.diets.includes("fodmap") ? (p.fodmapPhase ?? "elimination") : undefined,
    labs: Object.keys(labs).length ? labs : undefined,
  };
}

export function requestPlan(profile: UserProfile, opts: { seed?: number; locked?: LockedMeal[]; favorites?: string[] } = {}) {
  return post<{ plan: WeekPlan }>("/api/plan", { profile: cleanProfile(profile), ...opts }).then((r) => r.plan);
}

export interface SwapChoice {
  recipeId: string;
  title: string;
  portion: number;
  day: DayPlan;
  hardViolations: number;
  softMisses: number;
}

export function requestSwaps(profile: UserProfile, day: number, meals: PlannedMeal[], slot: Slot, usedThisWeek: string[]) {
  return post<{ options: SwapChoice[] }>("/api/swap", {
    profile: cleanProfile(profile),
    day,
    meals: meals.map(({ slot, recipeId, portion }) => ({ slot, recipeId, portion })),
    slot,
    usedThisWeek,
  }).then((r) => r.options);
}
