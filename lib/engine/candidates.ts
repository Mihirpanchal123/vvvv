import { INGREDIENT_MAP } from "@/lib/data/ingredients";
import { scaleNutrients } from "@/lib/domain/nutrients";
import {
  FODMAP_LABELS,
  type NutrientVector,
  type RecipeInfo,
  type ResolvedRules,
  type Slot,
} from "@/lib/domain/types";
import { recipeLibrary } from "./recipe-info";

export const PORTIONS = [0.5, 0.75, 1, 1.25, 1.5] as const;
const EPS = 1e-9;

export interface CandidateOption {
  key: string;
  recipeId: string;
  slot: Slot;
  portion: number;
  nutrients: NutrientVector;
  info: RecipeInfo;
}

export interface ExcludedRecipe {
  recipeId: string;
  title: string;
  reasons: string[];
}

export interface CandidateSet {
  bySlot: Record<Slot, CandidateOption[]>;
  excluded: ExcludedRecipe[];
}

/** Reasons a recipe can never appear for this user, independent of portion size. */
export function recipeExclusions(info: RecipeInfo, rules: ResolvedRules): string[] {
  const reasons: string[] = [];
  const allergens = info.allergens.filter((a) => rules.excludeAllergens.includes(a));
  if (allergens.length) reasons.push(`Contains ${allergens.join(", ")}`);

  const disliked = info.recipe.ingredients
    .map((l) => l.id)
    .filter((id) => rules.excludeIngredients.includes(id))
    .map((id) => INGREDIENT_MAP.get(id)?.name ?? id);
  if (disliked.length) reasons.push(`Contains ${disliked.join(", ")} (disliked)`);

  if (rules.avoidPhosphateAdditives && info.phosphateAdditive) reasons.push("Contains phosphate additives");

  if (!info.recipe.slots.some((s) => rules.slots.includes(s))) reasons.push("Not a meal type in your plan");

  if (rules.fodmapRestricted.length && fodmapAllowedPortions(info, rules).length === 0) {
    const over = rules.fodmapRestricted.filter((g) => info.fodmapLoad[g] * PORTIONS[0] > 1 + EPS);
    reasons.push(`High FODMAP even at a half portion (${over.map((g) => FODMAP_LABELS[g]).join(", ")})`);
  }
  return reasons;
}

/** Portions at which every restricted FODMAP group stays under its low threshold. */
export function fodmapAllowedPortions(info: RecipeInfo, rules: ResolvedRules): number[] {
  return PORTIONS.filter((p) => rules.fodmapRestricted.every((g) => info.fodmapLoad[g] * p <= 1 + EPS));
}

/** True if this option alone already breaks a hard upper limit (for its slot or the whole day). */
function breaksHardMaxAlone(nutrients: NutrientVector, slot: Slot, rules: ResolvedRules): boolean {
  return rules.limits.some(
    (l) => l.hard && l.op === "max" && (l.scope === "day" || l.scope === slot) && nutrients[l.nutrient] > l.value + EPS,
  );
}

export function makeOption(info: RecipeInfo, slot: Slot, portion: number): CandidateOption {
  return {
    key: `${slot}:${info.recipe.id}:${portion}`,
    recipeId: info.recipe.id,
    slot,
    portion,
    nutrients: scaleNutrients(info.perServing, portion),
    info,
  };
}

export function buildCandidates(rules: ResolvedRules, library: Map<string, RecipeInfo> = recipeLibrary()): CandidateSet {
  const bySlot = Object.fromEntries(rules.slots.map((s) => [s, [] as CandidateOption[]])) as Record<Slot, CandidateOption[]>;
  const excluded: ExcludedRecipe[] = [];

  for (const info of library.values()) {
    const reasons = recipeExclusions(info, rules);
    if (reasons.length) {
      excluded.push({ recipeId: info.recipe.id, title: info.recipe.title, reasons });
      continue;
    }
    const portions = fodmapAllowedPortions(info, rules);
    let usable = false;
    for (const slot of info.recipe.slots) {
      if (!rules.slots.includes(slot)) continue;
      for (const p of portions) {
        const opt = makeOption(info, slot, p);
        if (breaksHardMaxAlone(opt.nutrients, slot, rules)) continue;
        bySlot[slot].push(opt);
        usable = true;
      }
    }
    if (!usable) excluded.push({ recipeId: info.recipe.id, title: info.recipe.title, reasons: ["Exceeds a per-meal limit at every portion size"] });
  }
  return { bySlot, excluded };
}
