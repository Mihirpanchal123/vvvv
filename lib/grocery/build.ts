import { INGREDIENT_MAP } from "@/lib/data/ingredients";
import { RECIPE_MAP } from "@/lib/data/recipes";
import { AISLES, AISLE_LABELS, type Aisle, type DietId, type Ingredient, type PlannedMeal } from "@/lib/domain/types";

export interface GroceryItem {
  ingredientId: string;
  name: string;
  aisle: Aisle;
  grams: number;
  /** Human-readable purchase amount, e.g. "2 × can (400 g)". */
  buy: string;
  notes: string[];
  pantryStaple: boolean;
  inPantry: boolean;
  usedIn: string[];
}

export interface GrocerySection {
  aisle: Aisle;
  label: string;
  items: GroceryItem[];
}

export interface GroceryList {
  sections: GrocerySection[];
  /** Staples most kitchens already have (oil, spices, soy sauce…) — listed separately to check. */
  pantryCheck: GroceryItem[];
  itemCount: number;
}

export interface GroceryInput {
  meals: PlannedMeal[];
  householdSize: number;
  diets: DietId[];
  /** Ingredient ids the user already has. */
  pantry?: string[];
}

function pluralize(unit: string) {
  if (unit.endsWith("s")) return unit;
  if (unit.endsWith("o")) return `${unit}es`; // tomato → tomatoes, potato → potatoes
  if (unit.endsWith("ch")) return `${unit}es`; // bunch → bunches
  return `${unit}s`;
}

export function purchaseAmount(ing: Ingredient, grams: number): string {
  const p = ing.purchase;
  if (p.kind === "weight") {
    const rounded = grams < 100 ? Math.ceil(grams / 10) * 10 : Math.ceil(grams / 50) * 50;
    return rounded >= 1000 ? `${(rounded / 1000).toFixed(rounded % 1000 ? 2 : 0)} kg` : `${rounded} g`;
  }
  if (p.kind === "count") {
    const count = Math.max(1, Math.ceil(grams / p.gramsEach - 0.15));
    return `${count} ${count > 1 ? pluralize(p.unit) : p.unit}`;
  }
  const count = Math.max(1, Math.ceil(grams / p.grams));
  return count === 1 ? `1 ${p.unit}` : `${count} × ${p.unit}`;
}

export function buildGroceryList({ meals, householdSize, diets, pantry = [] }: GroceryInput): GroceryList {
  const totals = new Map<string, { grams: number; usedIn: Set<string> }>();

  for (const meal of meals) {
    const recipe = RECIPE_MAP.get(meal.recipeId);
    if (!recipe) continue;
    for (const line of recipe.ingredients) {
      const grams = (line.g / recipe.servings) * meal.portion * householdSize;
      const cur = totals.get(line.id) ?? { grams: 0, usedIn: new Set<string>() };
      cur.grams += grams;
      cur.usedIn.add(recipe.title);
      totals.set(line.id, cur);
    }
  }

  const pantrySet = new Set(pantry);
  const items: GroceryItem[] = [...totals].map(([id, { grams, usedIn }]) => {
    const ing = INGREDIENT_MAP.get(id)!;
    return {
      ingredientId: id,
      name: ing.name,
      aisle: ing.aisle,
      grams: Math.round(grams),
      buy: purchaseAmount(ing, grams),
      notes: (ing.shoppingNotes ?? []).filter((n) => diets.includes(n.diet)).map((n) => n.text),
      pantryStaple: !!ing.pantryStaple,
      inPantry: pantrySet.has(id),
      usedIn: [...usedIn].sort(),
    };
  });

  const toBuy = items.filter((i) => !i.pantryStaple && !i.inPantry);
  const sections: GrocerySection[] = AISLES.map((aisle) => ({
    aisle,
    label: AISLE_LABELS[aisle],
    items: toBuy.filter((i) => i.aisle === aisle).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((s) => s.items.length > 0);

  const pantryCheck = items
    .filter((i) => i.pantryStaple || i.inPantry)
    .sort((a, b) => a.name.localeCompare(b.name));

  return { sections, pantryCheck, itemCount: toBuy.length };
}

/** Plain-text version for copy/share. */
export function groceryListToText(list: GroceryList): string {
  const lines: string[] = [];
  for (const s of list.sections) {
    lines.push(s.label.toUpperCase());
    for (const i of s.items) lines.push(`☐ ${i.name} — ${i.buy}${i.notes.length ? ` (${i.notes.join(" ")})` : ""}`);
    lines.push("");
  }
  if (list.pantryCheck.length) {
    lines.push("CHECK YOUR PANTRY");
    for (const i of list.pantryCheck) lines.push(`☐ ${i.name} — ${i.buy}`);
  }
  return lines.join("\n").trim();
}
