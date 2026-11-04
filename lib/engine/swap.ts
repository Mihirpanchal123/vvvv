import type { DayPlan, PlannedMeal, ResolvedRules, Slot } from "@/lib/domain/types";
import { buildCandidates, type CandidateSet } from "./candidates";
import { evaluateDay } from "./evaluate";

export interface SwapOption {
  recipeId: string;
  title: string;
  portion: number;
  day: DayPlan;
  hardViolations: number;
  softMisses: number;
  energyGap: number;
}

/**
 * Alternatives for one slot that keep the rest of the day as-is, ranked so that options which keep the
 * day within every medical limit come first, then fewest missed targets, then closest to the energy target.
 * Only the best portion of each recipe is returned.
 */
export function swapOptions(
  rules: ResolvedRules,
  day: DayPlan,
  slot: Slot,
  opts: { limit?: number; candidates?: CandidateSet; usedThisWeek?: Set<string> } = {},
): SwapOption[] {
  const cands = opts.candidates ?? buildCandidates(rules);
  const current = day.meals.find((m) => m.slot === slot);
  const others = day.meals.filter((m) => m.slot !== slot);
  const best = new Map<string, SwapOption>();

  for (const o of cands.bySlot[slot] ?? []) {
    if (current && o.recipeId === current.recipeId) continue;
    if (others.some((m) => m.recipeId === o.recipeId)) continue;
    const meal: PlannedMeal = { slot, recipeId: o.recipeId, portion: o.portion };
    const meals = [...others, meal].sort((a, b) => rules.slots.indexOf(a.slot) - rules.slots.indexOf(b.slot));
    const evaluated = evaluateDay(day.day, meals, rules);
    const candidate: SwapOption = {
      recipeId: o.recipeId,
      title: o.info.recipe.title,
      portion: o.portion,
      day: evaluated,
      hardViolations: evaluated.checks.filter((c) => c.limit.hard && !c.ok).length,
      softMisses: evaluated.checks.filter((c) => !c.limit.hard && !c.ok).length,
      energyGap: Math.abs(evaluated.totals.kcal - rules.energyTarget) + Math.abs(o.portion - 1) * 50,
    };
    const prev = best.get(o.recipeId);
    if (!prev || compare(candidate, prev) < 0) best.set(o.recipeId, candidate);
  }

  const used = opts.usedThisWeek ?? new Set<string>();
  return [...best.values()]
    .sort((a, b) => compare(a, b) || Number(used.has(a.recipeId)) - Number(used.has(b.recipeId)))
    .slice(0, opts.limit ?? 8);
}

function compare(a: SwapOption, b: SwapOption) {
  return a.hardViolations - b.hardViolations || a.softMisses - b.softMisses || a.energyGap - b.energyGap;
}
