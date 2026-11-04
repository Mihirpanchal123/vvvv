import { describe, expect, it } from "vitest";
import { getRecipe } from "@/lib/data/recipes";
import { FODMAP_GROUPS, type Ingredient, type Recipe } from "@/lib/domain/types";
import { n } from "@/lib/domain/nutrients";
import { buildCandidates, fodmapAllowedPortions } from "@/lib/engine/candidates";
import { explainMeal } from "@/lib/engine/explain";
import { analyzeRecipe, getRecipeInfo } from "@/lib/engine/recipe-info";
import { generateWeekPlan } from "@/lib/engine/solve";
import { swapOptions } from "@/lib/engine/swap";
import { resolveRules } from "@/lib/rules/resolve";
import { DIET_CASES, profile } from "./fixtures";

describe("generateWeekPlan", () => {
  // Several seeds: a single seed once hid a bug where the solver traded tiny hard-limit overshoots for energy.
  const SEEDS = [7, 7920, 15839];
  it.each(DIET_CASES)("%s: 7 full days, no hard-limit violations across seeds", (_name, over) => {
    const p = profile(over);
    const rules = resolveRules(p);
    for (const seed of SEEDS) {
    const plan = generateWeekPlan(rules, { seed });
    expect(plan.days).toHaveLength(7);
    for (const day of plan.days) {
      expect(day.meals.map((m) => m.slot)).toEqual(p.slots);
      const broken = day.checks.filter((c) => c.limit.hard && !c.ok);
      expect(broken, JSON.stringify(broken.map((b) => [b.limit.scope, b.limit.nutrient, b.limit.value, b.actual]))).toEqual([]);
      expect(day.hasHardViolation).toBe(false);
      // No recipe twice in one day.
      expect(new Set(day.meals.map((m) => m.recipeId)).size).toBe(day.meals.length);
    }
    }
  });

  it("keeps every meal under all low-FODMAP thresholds in elimination", () => {
    const rules = resolveRules(profile({ diets: ["fodmap"], fodmapPhase: "elimination" }));
    const plan = generateWeekPlan(rules, { seed: 3 });
    for (const meal of plan.days.flatMap((d) => d.meals)) {
      const load = getRecipeInfo(meal.recipeId).fodmapLoad;
      for (const g of FODMAP_GROUPS) expect(load[g] * meal.portion).toBeLessThanOrEqual(1 + 1e-9);
    }
  });

  it("never uses an allergen or disliked ingredient", () => {
    const rules = resolveRules(profile({ allergies: ["egg", "dairy"], dislikedIngredients: ["salmon"] }));
    const plan = generateWeekPlan(rules, { seed: 11 });
    for (const meal of plan.days.flatMap((d) => d.meals)) {
      const info = getRecipeInfo(meal.recipeId);
      expect(info.allergens).not.toContain("egg");
      expect(info.allergens).not.toContain("dairy");
      expect(info.recipe.ingredients.map((i) => i.id)).not.toContain("salmon");
    }
  });

  it("is deterministic for a seed and varies across seeds", () => {
    const rules = resolveRules(profile({ diets: ["diabetic"] }));
    const ids = (seed: number) => generateWeekPlan(rules, { seed }).days.flatMap((d) => d.meals.map((m) => `${m.recipeId}@${m.portion}`));
    expect(ids(5)).toEqual(ids(5));
    expect(ids(5)).not.toEqual(ids(6));
  });

  it("keeps locked meals and plans around them", () => {
    const rules = resolveRules(profile({ diets: ["diabetic"] }));
    const plan = generateWeekPlan(rules, { seed: 1, locked: [{ day: 2, slot: "dinner", recipeId: "spaghetti-bolognese", portion: 1 }] });
    const dinner = plan.days[2].meals.find((m) => m.slot === "dinner")!;
    expect(dinner).toMatchObject({ recipeId: "spaghetti-bolognese", portion: 1, locked: true });
  });

  it("varies recipes across the week", () => {
    const rules = resolveRules(profile({ diets: ["diabetic"] }));
    const plan = generateWeekPlan(rules, { seed: 2 });
    const dinners = plan.days.map((d) => d.meals.find((m) => m.slot === "dinner")!.recipeId);
    expect(new Set(dinners).size).toBeGreaterThanOrEqual(5);
  });

  it("reports the binding constraint when limits are impossible", () => {
    const rules = resolveRules(
      profile({ diets: ["ckd"], ckdStage: "4", overrides: [{ scope: "day", nutrient: "potassium", op: "max", value: 300, source: "user" }] }),
    );
    const plan = generateWeekPlan(rules, { seed: 1, days: 2 });
    expect(plan.days.every((d) => d.hasHardViolation)).toBe(true);
    expect(plan.warnings.join(" ")).toMatch(/potassium \d+ mg vs max 300/);
  });

  it("solves a week quickly", () => {
    const rules = resolveRules(profile({ diets: ["diabetic", "ckd", "fodmap"], ckdStage: "4", fodmapPhase: "elimination" }));
    const t = performance.now();
    generateWeekPlan(rules, { seed: 9 });
    expect(performance.now() - t).toBeLessThan(10_000);
  });
});

describe("FODMAP stacking", () => {
  const ingredients = new Map<string, Ingredient>([
    ["a", { id: "a", name: "A", aisle: "produce", per100g: n({}), fodmap: { fructose: 100 }, purchase: { kind: "weight" }, source: "test" }],
    ["b", { id: "b", name: "B", aisle: "produce", per100g: n({}), fodmap: { fructose: 100 }, purchase: { kind: "weight" }, source: "test" }],
  ]);
  const recipe: Recipe = {
    id: "stack", title: "Stack", slots: ["lunch"], servings: 1, prepMin: 1, steps: ["x"],
    ingredients: [{ id: "a", g: 60 }, { id: "b", g: 60 }],
  };

  it("adds loads from separately 'safe' ingredients in the same meal", () => {
    const info = analyzeRecipe(recipe, ingredients);
    expect(info.fodmapLoad.fructose).toBeCloseTo(1.2);
    const rules = resolveRules(profile({ diets: ["fodmap"], fodmapPhase: "elimination" }));
    expect(fodmapAllowedPortions(info, rules)).toEqual([0.5, 0.75]);
  });

  it("ignores groups that aren't restricted", () => {
    const info = analyzeRecipe(recipe, ingredients);
    const rules = resolveRules(profile({ diets: ["fodmap"], fodmapPhase: "personalization", fodmapTriggers: ["lactose"] }));
    expect(fodmapAllowedPortions(info, rules)).toHaveLength(5);
  });
});

describe("recipe analysis", () => {
  it("leaching lowers potassium", () => {
    const recipe = getRecipe("pork-leached-potatoes");
    const leached = analyzeRecipe(recipe).perServing.potassium;
    const unleached = analyzeRecipe({ ...recipe, ingredients: recipe.ingredients.map((i) => ({ ...i, leached: false })) }).perServing.potassium;
    expect(unleached - leached).toBeCloseTo(150 * 4.25 * 0.5, 0);
  });

  it("excludes high-FODMAP recipes with a reason", () => {
    const rules = resolveRules(profile({ diets: ["fodmap"], fodmapPhase: "elimination" }));
    const ex = buildCandidates(rules).excluded.find((e) => e.recipeId === "spaghetti-bolognese");
    expect(ex?.reasons.join(" ")).toMatch(/Fructans/);
  });
});

describe("swapOptions & explainMeal", () => {
  const rules = resolveRules(profile({ diets: ["diabetic", "ckd"], ckdStage: "4" }));
  const plan = generateWeekPlan(rules, { seed: 4, days: 1 });
  const day = plan.days[0];

  it("offers alternatives that keep the day within hard limits", () => {
    const current = day.meals.find((m) => m.slot === "lunch")!;
    const opts = swapOptions(rules, day, "lunch");
    expect(opts.length).toBeGreaterThan(0);
    expect(opts.some((o) => o.recipeId === current.recipeId)).toBe(false);
    expect(opts[0].hardViolations).toBe(0);
    expect(opts[0].day.meals.find((m) => m.slot === "lunch")!.recipeId).toBe(opts[0].recipeId);
  });

  it("explains a meal against the daily budget", () => {
    const meal = day.meals[0];
    const ex = explainMeal(rules, day, meal);
    const k = ex.rows.find((r) => r.nutrient === "potassium")!;
    expect(k.dayMax).toBe(2500);
    expect(k.dayTotal).toBeCloseTo(day.totals.potassium);
    expect(ex.slotChecks.every((c) => c.limit.scope === meal.slot)).toBe(true);
  });
});
