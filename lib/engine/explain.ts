import { INGREDIENT_MAP } from "@/lib/data/ingredients";
import {
  FODMAP_LABELS,
  type DayPlan,
  type FodmapGroup,
  type LimitCheck,
  type Nutrient,
  type PlannedMeal,
  type ResolvedRules,
} from "@/lib/domain/types";
import { limitsFor } from "@/lib/rules/resolve";
import { checkLimits, mealNutrients } from "./evaluate";
import { getRecipeInfo } from "./recipe-info";

/** Nutrients worth showing for this user's combination of diets. */
export function keyNutrients(rules: ResolvedRules): Nutrient[] {
  const list: Nutrient[] = ["kcal", "carb", "protein"];
  if (rules.diets.includes("diabetic")) list.push("fiber", "addedSugar");
  list.push("sodium");
  if (rules.diets.includes("ckd")) list.push("potassium", "phosphorus");
  if (rules.limits.some((l) => l.nutrient === "fluid")) list.push("fluid");
  return list;
}

export interface ExplainRow {
  nutrient: Nutrient;
  amount: number;
  dayTotal: number;
  dayMin?: number;
  dayMax?: number;
  /** Share of the daily maximum this meal uses. */
  shareOfMax?: number;
}

export interface MealExplanation {
  rows: ExplainRow[];
  slotChecks: LimitCheck[];
  fodmap: { group: FodmapGroup; label: string; percentOfThreshold: number }[];
  flags: string[];
}

export function explainMeal(rules: ResolvedRules, day: DayPlan, meal: PlannedMeal): MealExplanation {
  const info = getRecipeInfo(meal.recipeId);
  const amounts = mealNutrients(meal);

  const rows: ExplainRow[] = keyNutrients(rules).map((nutrient) => {
    const { min, max } = limitsFor(rules, "day", nutrient);
    return {
      nutrient,
      amount: amounts[nutrient],
      dayTotal: day.totals[nutrient],
      dayMin: min?.value,
      dayMax: max?.value,
      shareOfMax: max ? amounts[nutrient] / max.value : undefined,
    };
  });

  const slotChecks = checkLimits([meal], { ...rules, limits: rules.limits.filter((l) => l.scope === meal.slot) }).checks;

  const fodmap = rules.fodmapRestricted.map((group) => ({
    group,
    label: FODMAP_LABELS[group],
    percentOfThreshold: Math.round(info.fodmapLoad[group] * meal.portion * 100),
  }));

  const flags: string[] = [];
  if (info.leached) flags.push("Potatoes are leached (soaked and double-boiled) to roughly halve their potassium — follow step 1.");
  if (rules.preferLowGlycemic) {
    const gl = info.glycemicLoad * meal.portion;
    flags.push(`Estimated glycaemic load ${Math.round(gl)} (${gl <= 10 ? "low" : gl <= 19 ? "medium" : "high"}).`);
  }
  const labelChecks = info.recipe.ingredients
    .map((l) => INGREDIENT_MAP.get(l.id)!)
    .filter((ing) => rules.diets.includes("ckd") && ing.labelCheck?.includes("phosphate"));
  if (labelChecks.length) {
    flags.push(`Check labels for phosphate additives: ${labelChecks.map((i) => i.name.toLowerCase()).join(", ")}.`);
  }
  if (meal.portion !== 1) flags.push(`Portion adjusted to ${meal.portion}× to fit your daily limits.`);

  return { rows, slotChecks, fodmap, flags };
}
