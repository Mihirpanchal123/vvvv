import { addNutrients, scaleNutrients, zeroNutrients } from "@/lib/domain/nutrients";
import type { DayPlan, LimitCheck, NutrientVector, PlannedMeal, ResolvedRules } from "@/lib/domain/types";
import { getRecipeInfo } from "./recipe-info";

const REL_TOL = 1e-6;

export function mealNutrients(meal: Pick<PlannedMeal, "recipeId" | "portion">): NutrientVector {
  return scaleNutrients(getRecipeInfo(meal.recipeId).perServing, meal.portion);
}

export function checkLimits(meals: PlannedMeal[], rules: ResolvedRules): { totals: NutrientVector; checks: LimitCheck[] } {
  let totals = zeroNutrients();
  const perMeal = meals.map((m) => ({ meal: m, v: mealNutrients(m) }));
  for (const { v } of perMeal) totals = addNutrients(totals, v);

  const checks: LimitCheck[] = [];
  for (const limit of rules.limits) {
    let actual: number;
    if (limit.scope === "day") {
      actual = totals[limit.nutrient];
    } else {
      const m = perMeal.find((pm) => pm.meal.slot === limit.scope);
      if (!m) continue;
      actual = m.v[limit.nutrient];
    }
    const tol = Math.max(Math.abs(limit.value) * REL_TOL, 1e-6);
    const ok = limit.op === "max" ? actual <= limit.value + tol : actual >= limit.value - tol;
    checks.push({ limit, actual, ok });
  }
  return { totals, checks };
}

export function evaluateDay(day: number, meals: PlannedMeal[], rules: ResolvedRules): DayPlan {
  const { totals, checks } = checkLimits(meals, rules);
  return { day, meals, totals, checks, hasHardViolation: checks.some((c) => c.limit.hard && !c.ok) };
}
