import { INGREDIENT_MAP } from "@/lib/data/ingredients";
import { RECIPES } from "@/lib/data/recipes";
import { addNutrients, zeroNutrients } from "@/lib/domain/nutrients";
import {
  FODMAP_GROUPS,
  type Allergen,
  type FodmapGroup,
  type Ingredient,
  type NutrientVector,
  type Recipe,
  type RecipeInfo,
} from "@/lib/domain/types";

/** Nutrients contributed by `grams` of an ingredient, accounting for leaching. */
export function ingredientNutrients(ing: Ingredient, grams: number, leached = false): NutrientVector {
  const out = addNutrients(zeroNutrients(), ing.per100g, grams / 100);
  if (leached && ing.leachRetainK !== undefined) out.potassium *= ing.leachRetainK;
  return out;
}

/** Fraction of the low-FODMAP threshold used, per group, for `grams` of an ingredient. */
export function ingredientFodmapLoad(ing: Ingredient, grams: number): Record<FodmapGroup, number> {
  const load = Object.fromEntries(FODMAP_GROUPS.map((g) => [g, 0])) as Record<FodmapGroup, number>;
  if (!ing.fodmap || grams <= 0) return load;
  for (const group of FODMAP_GROUPS) {
    const threshold = ing.fodmap[group];
    if (threshold === undefined) continue;
    load[group] = threshold <= 0 ? Number.POSITIVE_INFINITY : grams / threshold;
  }
  return load;
}

export function analyzeRecipe(recipe: Recipe, ingredients: ReadonlyMap<string, Ingredient> = INGREDIENT_MAP): RecipeInfo {
  let total = zeroNutrients();
  const fodmapLoad = Object.fromEntries(FODMAP_GROUPS.map((g) => [g, 0])) as Record<FodmapGroup, number>;
  const allergens = new Set<Allergen>();
  let glycemicLoad = 0;
  let phosphateAdditive = false;
  let leached = false;
  const keyIngredients: string[] = [];

  for (const line of recipe.ingredients) {
    const ing = ingredients.get(line.id);
    if (!ing) throw new Error(`Recipe ${recipe.id} references unknown ingredient ${line.id}`);
    const perServingG = line.g / recipe.servings;
    total = addNutrients(total, ingredientNutrients(ing, perServingG, line.leached));

    // FODMAP: loads stack additively across ingredients in the same meal (conservative approximation).
    const load = ingredientFodmapLoad(ing, perServingG);
    for (const g of FODMAP_GROUPS) fodmapLoad[g] += load[g];

    ing.allergens?.forEach((a) => allergens.add(a));
    if (ing.gi !== undefined) {
      const availableCarb = Math.max(0, ing.per100g.carb - ing.per100g.fiber) * (perServingG / 100);
      glycemicLoad += (ing.gi * availableCarb) / 100;
    }
    if (ing.phosphateAdditive) phosphateAdditive = true;
    if (line.leached) leached = true;
    if (!ing.pantryStaple) keyIngredients.push(ing.id);
  }

  return {
    recipe,
    perServing: total,
    fodmapLoad,
    glycemicLoad,
    allergens: [...allergens],
    phosphateAdditive,
    leached,
    keyIngredients,
  };
}

let cache: Map<string, RecipeInfo> | null = null;

/** Analysis of every recipe in the library (memoized). */
export function recipeLibrary(): Map<string, RecipeInfo> {
  if (!cache) cache = new Map(RECIPES.map((r) => [r.id, analyzeRecipe(r)]));
  return cache;
}

export function getRecipeInfo(id: string): RecipeInfo {
  const info = recipeLibrary().get(id);
  if (!info) throw new Error(`Unknown recipe: ${id}`);
  return info;
}
