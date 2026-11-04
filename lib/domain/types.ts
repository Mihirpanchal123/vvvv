/**
 * Core domain types shared by the data layer, rules, engine and UI.
 * Everything here is plain data so it can be serialized (API, localStorage, Postgres jsonb).
 */

export const NUTRIENTS = [
  "kcal",
  "carb",
  "fiber",
  "addedSugar",
  "protein",
  "fat",
  "satFat",
  "sodium",
  "potassium",
  "phosphorus",
  "fluid",
] as const;
export type Nutrient = (typeof NUTRIENTS)[number];
export type NutrientVector = Record<Nutrient, number>;

export const NUTRIENT_META: Record<Nutrient, { label: string; unit: string }> = {
  kcal: { label: "Energy", unit: "kcal" },
  carb: { label: "Carbohydrate", unit: "g" },
  fiber: { label: "Fibre", unit: "g" },
  addedSugar: { label: "Added sugar", unit: "g" },
  protein: { label: "Protein", unit: "g" },
  fat: { label: "Fat", unit: "g" },
  satFat: { label: "Saturated fat", unit: "g" },
  sodium: { label: "Sodium", unit: "mg" },
  potassium: { label: "Potassium", unit: "mg" },
  phosphorus: { label: "Phosphorus", unit: "mg" },
  fluid: { label: "Fluid (from food)", unit: "ml" },
};

export const FODMAP_GROUPS = ["fructan", "gos", "lactose", "fructose", "sorbitol", "mannitol"] as const;
export type FodmapGroup = (typeof FODMAP_GROUPS)[number];

export const FODMAP_LABELS: Record<FodmapGroup, string> = {
  fructan: "Fructans",
  gos: "GOS (galacto-oligosaccharides)",
  lactose: "Lactose",
  fructose: "Excess fructose",
  sorbitol: "Sorbitol",
  mannitol: "Mannitol",
};

export const ALLERGENS = ["dairy", "egg", "fish", "shellfish", "peanut", "treenut", "soy", "wheat", "sesame"] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type Slot = (typeof SLOTS)[number];

export const DIETS = ["diabetic", "ckd", "fodmap"] as const;
export type DietId = (typeof DIETS)[number];

export const CKD_STAGES = ["3a", "3b", "4", "5", "hemodialysis", "peritoneal"] as const;
export type CkdStage = (typeof CKD_STAGES)[number];

export const FODMAP_PHASES = ["elimination", "reintroduction", "personalization"] as const;
export type FodmapPhase = (typeof FODMAP_PHASES)[number];

export const AISLES = [
  "produce",
  "meat-seafood",
  "dairy-eggs",
  "bakery",
  "grains-pasta",
  "canned-jarred",
  "nuts-seeds",
  "oils-condiments",
  "spices-baking",
] as const;
export type Aisle = (typeof AISLES)[number];

export const AISLE_LABELS: Record<Aisle, string> = {
  produce: "Produce",
  "meat-seafood": "Meat & seafood",
  "dairy-eggs": "Dairy & eggs",
  bakery: "Bakery",
  "grains-pasta": "Grains, pasta & cereal",
  "canned-jarred": "Canned & jarred",
  "nuts-seeds": "Nuts & seeds",
  "oils-condiments": "Oils, sauces & condiments",
  "spices-baking": "Spices & baking",
};

export type Purchase =
  | { kind: "weight" }
  | { kind: "count"; unit: string; gramsEach: number }
  | { kind: "package"; unit: string; grams: number };

export interface Ingredient {
  id: string;
  name: string;
  aisle: Aisle;
  /** Nutrients per 100 g edible portion. */
  per100g: NutrientVector;
  /** Max grams per serving that is still low for each FODMAP group. 0 = high at any practical amount. */
  fodmap?: Partial<Record<FodmapGroup, number>>;
  allergens?: Allergen[];
  /** Inherently contains phosphate additives (excluded for CKD). */
  phosphateAdditive?: boolean;
  /** Some brands add phosphates/sodium; shown as a shopping note. */
  labelCheck?: ("phosphate" | "sodium")[];
  /** Glycemic index (glucose = 100) of the carbohydrate in this food, when meaningful. */
  gi?: number;
  purchase: Purchase;
  pantryStaple?: boolean;
  shoppingNotes?: { diet: DietId; text: string }[];
  /** Fraction of potassium kept after leaching (double-boiling). */
  leachRetainK?: number;
  source: string;
}

export interface RecipeIngredient {
  id: string;
  /** Grams for the whole recipe (all servings). */
  g: number;
  note?: string;
  /** Ingredient is leached (soaked + double-boiled) to lower potassium. */
  leached?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  slots: Slot[];
  servings: number;
  prepMin: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags?: string[];
}

/** Derived per-serving information about a recipe at portion 1.0. */
export interface RecipeInfo {
  recipe: Recipe;
  perServing: NutrientVector;
  /** Fraction of the low-FODMAP threshold used per group (1 = at the limit). */
  fodmapLoad: Record<FodmapGroup, number>;
  glycemicLoad: number;
  allergens: Allergen[];
  phosphateAdditive: boolean;
  leached: boolean;
  /** Non-staple ingredient ids, used for the shared-groceries reward. */
  keyIngredients: string[];
}

export interface Labs {
  /** Serum potassium, mmol/L */
  potassium?: number;
  /** Serum phosphorus, mg/dL */
  phosphorus?: number;
  /** eGFR, mL/min/1.73m² */
  egfr?: number;
  /** HbA1c, % */
  a1c?: number;
}

export type LimitScope = "day" | Slot;
export type LimitSource = "general" | "diabetic" | "ckd" | "fodmap" | "labs" | "user" | "clinician";

export interface LimitOverride {
  scope: LimitScope;
  nutrient: Nutrient;
  op: "min" | "max";
  value: number;
  source: "user" | "clinician";
}

export interface UserProfile {
  sex: "female" | "male";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: "sedentary" | "light" | "moderate" | "active";
  diets: DietId[];
  ckdStage?: CkdStage;
  fodmapPhase?: FodmapPhase;
  /** Groups the user reacted to during reintroduction (used in personalization). */
  fodmapTriggers?: FodmapGroup[];
  allergies: Allergen[];
  dislikedIngredients: string[];
  householdSize: number;
  slots: Slot[];
  labs?: Labs;
  overrides?: LimitOverride[];
}

export interface Limit {
  scope: LimitScope;
  nutrient: Nutrient;
  op: "min" | "max";
  value: number;
  /** Hard limits are medical constraints; soft limits are targets. */
  hard: boolean;
  source: LimitSource;
  reason: string;
}

export interface ResolvedRules {
  energyTarget: number;
  limits: Limit[];
  slots: Slot[];
  fodmapRestricted: FodmapGroup[];
  excludeAllergens: Allergen[];
  excludeIngredients: string[];
  avoidPhosphateAdditives: boolean;
  preferLowGlycemic: boolean;
  diets: DietId[];
  conflicts: string[];
  notes: string[];
}

export interface PlannedMeal {
  slot: Slot;
  recipeId: string;
  portion: number;
  locked?: boolean;
}

export interface LimitCheck {
  limit: Limit;
  actual: number;
  ok: boolean;
}

export interface DayPlan {
  day: number;
  meals: PlannedMeal[];
  totals: NutrientVector;
  checks: LimitCheck[];
  /** True when a hard (medical) limit could not be met. */
  hasHardViolation: boolean;
}

export interface WeekPlan {
  id: string;
  createdAt: string;
  seed: number;
  days: DayPlan[];
  rulesSnapshot: ResolvedRules;
  warnings: string[];
}
