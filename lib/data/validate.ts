import { NUTRIENTS, SLOTS } from "@/lib/domain/types";
import { INGREDIENTS, INGREDIENT_MAP } from "./ingredients";
import { RECIPES } from "./recipes";

/** Data-integrity checks for the curated content. Returns a list of problems (empty = OK). */
export function validateContent(): string[] {
  const problems: string[] = [];

  const ingIds = new Set<string>();
  for (const ing of INGREDIENTS) {
    if (ingIds.has(ing.id)) problems.push(`Duplicate ingredient id ${ing.id}`);
    ingIds.add(ing.id);
    for (const nKey of NUTRIENTS) {
      const v = ing.per100g[nKey];
      if (!Number.isFinite(v) || v < 0) problems.push(`Ingredient ${ing.id}: invalid ${nKey} (${v})`);
    }
    const macroKcal = ing.per100g.carb * 4 + ing.per100g.protein * 4 + ing.per100g.fat * 9;
    const diff = Math.abs(macroKcal - ing.per100g.kcal);
    // Allow small absolute gaps: organic acids, alcohols and fibre make low-energy foods imprecise.
    if (ing.per100g.kcal > 0 && diff > 15 && diff / ing.per100g.kcal > 0.35 && !ing.pantryStaple) {
      problems.push(`Ingredient ${ing.id}: kcal ${ing.per100g.kcal} inconsistent with macros (${Math.round(macroKcal)})`);
    }
    if (ing.per100g.fiber > ing.per100g.carb + 1e-9) problems.push(`Ingredient ${ing.id}: fibre exceeds carbohydrate`);
    if (ing.per100g.satFat > ing.per100g.fat + 1e-9) problems.push(`Ingredient ${ing.id}: saturated fat exceeds fat`);
    if (!ing.source) problems.push(`Ingredient ${ing.id}: missing source`);
  }

  const recipeIds = new Set<string>();
  for (const r of RECIPES) {
    if (recipeIds.has(r.id)) problems.push(`Duplicate recipe id ${r.id}`);
    recipeIds.add(r.id);
    if (!r.slots.length) problems.push(`Recipe ${r.id}: no meal slots`);
    if (!r.steps.length) problems.push(`Recipe ${r.id}: no steps`);
    if (r.servings <= 0) problems.push(`Recipe ${r.id}: servings must be positive`);
    for (const line of r.ingredients) {
      if (!INGREDIENT_MAP.has(line.id)) problems.push(`Recipe ${r.id}: unmapped ingredient "${line.id}"`);
      if (!(line.g > 0)) problems.push(`Recipe ${r.id}: ingredient ${line.id} has non-positive grams`);
      if (line.leached && INGREDIENT_MAP.get(line.id)?.leachRetainK === undefined) {
        problems.push(`Recipe ${r.id}: ${line.id} marked leached but has no leaching data`);
      }
    }
    const dupLines = r.ingredients.map((l) => l.id).filter((id, i, a) => a.indexOf(id) !== i);
    if (dupLines.length) problems.push(`Recipe ${r.id}: duplicate ingredient lines ${dupLines.join(", ")}`);
  }

  for (const slot of SLOTS) {
    const count = RECIPES.filter((r) => r.slots.includes(slot)).length;
    if (count < 8) problems.push(`Only ${count} recipes for ${slot} (need ≥ 8)`);
  }
  return problems;
}
