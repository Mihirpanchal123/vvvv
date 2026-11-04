import type { Recipe } from "@/lib/domain/types";
import { BREAKFASTS } from "./breakfast";
import { DINNERS } from "./dinner";
import { LUNCHES } from "./lunch";
import { SNACKS } from "./snack";

export const RECIPES: Recipe[] = [...BREAKFASTS, ...LUNCHES, ...DINNERS, ...SNACKS];

export const RECIPE_MAP: ReadonlyMap<string, Recipe> = new Map(RECIPES.map((r) => [r.id, r]));

export function getRecipe(id: string): Recipe {
  const r = RECIPE_MAP.get(id);
  if (!r) throw new Error(`Unknown recipe: ${id}`);
  return r;
}
