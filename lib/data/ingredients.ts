import { n } from "@/lib/domain/nutrients";
import type { Ingredient } from "@/lib/domain/types";

/**
 * Curated ingredient table.
 *
 * Nutrient values are per 100 g, approximated from USDA FoodData Central (SR Legacy / Foundation).
 * FODMAP thresholds are the largest per-serving amount (g) considered low for each group, approximated
 * from published literature. Monash University data is proprietary; this table MUST be reviewed by a
 * registered dietitian (or replaced with licensed data) before public launch.
 * A threshold of 0 means "treat as high at any practical amount" (conservative).
 */

const USDA = "USDA FDC SR Legacy (approx.)";
const FODMAP_SRC = "; FODMAP thresholds approx. from literature — needs dietitian review";
const CONSERVATIVE = "; FODMAP treated as high (conservative)";

const CKD_MEAT_NOTE = {
  diet: "ckd" as const,
  text: "Avoid 'enhanced', brined or pre-seasoned packs — check the label for sodium phosphate.",
};
const CKD_CANNED_NOTE = {
  diet: "ckd" as const,
  text: "Buy 'no salt added'; drain and rinse before use.",
};
const CKD_BREAD_NOTE = {
  diet: "ckd" as const,
  text: "Check the label for phosphate leavening (e.g. 'sodium acid pyrophosphate').",
};

export const INGREDIENTS: Ingredient[] = [
  // ── Meat, fish, eggs, tofu ──────────────────────────────────────────────
  {
    id: "chicken_breast", name: "Chicken breast, skinless", aisle: "meat-seafood",
    per100g: n({ kcal: 120, protein: 22.5, fat: 2.6, satFat: 0.6, sodium: 45, potassium: 334, phosphorus: 213 }),
    purchase: { kind: "package", unit: "pack (500 g)", grams: 500 }, labelCheck: ["phosphate", "sodium"],
    shoppingNotes: [CKD_MEAT_NOTE], source: USDA,
  },
  {
    id: "ground_turkey", name: "Ground turkey, 93% lean", aisle: "meat-seafood",
    per100g: n({ kcal: 150, protein: 18.7, fat: 8.3, satFat: 2.2, sodium: 69, potassium: 213, phosphorus: 193 }),
    purchase: { kind: "package", unit: "pack (450 g)", grams: 450 }, labelCheck: ["phosphate"],
    shoppingNotes: [CKD_MEAT_NOTE], source: USDA,
  },
  {
    id: "lean_beef", name: "Beef sirloin, lean", aisle: "meat-seafood",
    per100g: n({ kcal: 160, protein: 21.5, fat: 7.7, satFat: 3.0, sodium: 56, potassium: 342, phosphorus: 201 }),
    purchase: { kind: "weight" }, source: USDA,
  },
  {
    id: "pork_tenderloin", name: "Pork tenderloin", aisle: "meat-seafood",
    per100g: n({ kcal: 120, protein: 21, fat: 3.5, satFat: 1.2, sodium: 52, potassium: 399, phosphorus: 247 }),
    purchase: { kind: "package", unit: "tenderloin (~500 g)", grams: 500 }, labelCheck: ["phosphate", "sodium"],
    shoppingNotes: [CKD_MEAT_NOTE], source: USDA,
  },
  {
    id: "salmon", name: "Salmon fillet", aisle: "meat-seafood", allergens: ["fish"],
    per100g: n({ kcal: 208, protein: 20.4, fat: 13.4, satFat: 3.1, sodium: 59, potassium: 363, phosphorus: 240 }),
    purchase: { kind: "weight" }, source: USDA,
  },
  {
    id: "cod", name: "Cod fillet", aisle: "meat-seafood", allergens: ["fish"],
    per100g: n({ kcal: 82, protein: 17.8, fat: 0.7, satFat: 0.1, sodium: 54, potassium: 413, phosphorus: 203 }),
    purchase: { kind: "weight" }, source: USDA,
  },
  {
    id: "shrimp", name: "Shrimp, raw, peeled", aisle: "meat-seafood", allergens: ["shellfish"],
    per100g: n({ kcal: 85, carb: 0.9, protein: 20.1, fat: 0.5, satFat: 0.1, sodium: 119, potassium: 264, phosphorus: 214 }),
    purchase: { kind: "package", unit: "bag (450 g)", grams: 450 }, labelCheck: ["phosphate", "sodium"],
    shoppingNotes: [{ diet: "ckd", text: "Frozen shrimp is often treated with sodium tripolyphosphate (STPP) — choose untreated." }],
    source: USDA,
  },
  {
    id: "tuna_canned", name: "Tuna in water, no salt added", aisle: "canned-jarred", allergens: ["fish"],
    per100g: n({ kcal: 116, protein: 25.5, fat: 0.8, satFat: 0.2, sodium: 50, potassium: 237, phosphorus: 217 }),
    purchase: { kind: "package", unit: "can (140 g drained)", grams: 140 },
    shoppingNotes: [CKD_CANNED_NOTE], source: USDA,
  },
  {
    id: "egg", name: "Eggs", aisle: "dairy-eggs", allergens: ["egg"],
    per100g: n({ kcal: 143, carb: 0.7, protein: 12.6, fat: 9.5, satFat: 3.1, sodium: 142, potassium: 138, phosphorus: 198 }),
    purchase: { kind: "package", unit: "dozen", grams: 600 }, source: USDA,
  },
  {
    id: "egg_white", name: "Liquid egg whites", aisle: "dairy-eggs", allergens: ["egg"],
    per100g: n({ kcal: 52, carb: 0.7, protein: 10.9, fat: 0.2, sodium: 166, potassium: 163, phosphorus: 15 }),
    purchase: { kind: "package", unit: "carton (500 g)", grams: 500 }, source: USDA,
  },
  {
    id: "tofu_firm", name: "Firm tofu", aisle: "dairy-eggs", allergens: ["soy"],
    per100g: n({ kcal: 144, carb: 2.8, fiber: 2.3, protein: 17.3, fat: 8.7, satFat: 1.3, sodium: 14, potassium: 237, phosphorus: 190 }),
    purchase: { kind: "package", unit: "block (400 g)", grams: 400 },
    shoppingNotes: [{ diet: "fodmap", text: "Firm tofu only — silken tofu is high FODMAP." }], source: USDA,
  },

  // ── Dairy ───────────────────────────────────────────────────────────────
  {
    id: "milk", name: "Milk, 1%", aisle: "dairy-eggs", allergens: ["dairy"], gi: 37,
    per100g: n({ kcal: 42, carb: 5, protein: 3.4, fat: 1, satFat: 0.6, sodium: 44, potassium: 150, phosphorus: 95, fluid: 90 }),
    fodmap: { lactose: 20 }, purchase: { kind: "package", unit: "carton (1 L)", grams: 1030 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "lactose_free_milk", name: "Lactose-free milk, 1%", aisle: "dairy-eggs", allergens: ["dairy"], gi: 37,
    per100g: n({ kcal: 42, carb: 5, protein: 3.4, fat: 1, satFat: 0.6, sodium: 44, potassium: 150, phosphorus: 95, fluid: 90 }),
    purchase: { kind: "package", unit: "carton (1 L)", grams: 1030 }, source: USDA,
  },
  {
    id: "almond_milk", name: "Almond milk, unsweetened", aisle: "dairy-eggs", allergens: ["treenut"],
    per100g: n({ kcal: 15, carb: 0.6, fiber: 0.2, protein: 0.6, fat: 1.1, satFat: 0.1, sodium: 70, potassium: 70, phosphorus: 10, fluid: 95 }),
    labelCheck: ["phosphate"],
    shoppingNotes: [{ diet: "ckd", text: "Many brands add tricalcium/dipotassium phosphate — choose one without." }],
    purchase: { kind: "package", unit: "carton (1 L)", grams: 1000 }, source: USDA,
  },
  {
    id: "greek_yogurt", name: "Greek yogurt, plain nonfat", aisle: "dairy-eggs", allergens: ["dairy"], gi: 41,
    per100g: n({ kcal: 59, carb: 3.6, protein: 10.2, fat: 0.4, satFat: 0.1, sodium: 36, potassium: 141, phosphorus: 135 }),
    fodmap: { lactose: 30 }, purchase: { kind: "package", unit: "tub (500 g)", grams: 500 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "lf_greek_yogurt", name: "Lactose-free Greek yogurt, plain", aisle: "dairy-eggs", allergens: ["dairy"], gi: 41,
    per100g: n({ kcal: 59, carb: 3.6, protein: 10.2, fat: 0.4, satFat: 0.1, sodium: 36, potassium: 141, phosphorus: 135 }),
    purchase: { kind: "package", unit: "tub (500 g)", grams: 500 }, source: USDA,
  },
  {
    id: "cheddar", name: "Cheddar cheese", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 403, carb: 1.3, protein: 24.9, fat: 33.1, satFat: 21.1, sodium: 621, potassium: 98, phosphorus: 512 }),
    fodmap: { lactose: 40 }, purchase: { kind: "package", unit: "block (200 g)", grams: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "feta", name: "Feta cheese", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 264, carb: 4.1, protein: 14.2, fat: 21.3, satFat: 15, sodium: 1116, potassium: 62, phosphorus: 337 }),
    fodmap: { lactose: 40 }, purchase: { kind: "package", unit: "block (200 g)", grams: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "parmesan", name: "Parmesan, grated", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 420, carb: 3.2, protein: 38, fat: 28, satFat: 17, sodium: 1529, potassium: 125, phosphorus: 694 }),
    purchase: { kind: "package", unit: "tub (100 g)", grams: 100 }, source: USDA,
  },
  {
    id: "cream_cheese", name: "Cream cheese", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 342, carb: 4.1, protein: 5.9, fat: 34.2, satFat: 19.3, sodium: 321, potassium: 138, phosphorus: 106 }),
    fodmap: { lactose: 40 }, purchase: { kind: "package", unit: "tub (225 g)", grams: 225 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "butter", name: "Butter, unsalted", aisle: "dairy-eggs", allergens: ["dairy"], pantryStaple: true,
    per100g: n({ kcal: 717, carb: 0.1, protein: 0.9, fat: 81, satFat: 51, sodium: 11, potassium: 24, phosphorus: 24 }),
    purchase: { kind: "package", unit: "block (250 g)", grams: 250 }, source: USDA,
  },

  // ── Grains, bread, starch ───────────────────────────────────────────────
  {
    id: "rolled_oats", name: "Rolled oats", aisle: "grains-pasta", gi: 55,
    per100g: n({ kcal: 379, carb: 67.7, fiber: 10.1, protein: 13.2, fat: 6.5, satFat: 1.1, sodium: 6, potassium: 362, phosphorus: 410 }),
    fodmap: { fructan: 52, gos: 52 }, purchase: { kind: "package", unit: "bag (1 kg)", grams: 1000 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "white_rice", name: "White rice, long-grain (dry)", aisle: "grains-pasta", gi: 73,
    per100g: n({ kcal: 365, carb: 80, fiber: 1.3, protein: 7.1, fat: 0.7, satFat: 0.2, sodium: 5, potassium: 115, phosphorus: 115 }),
    purchase: { kind: "package", unit: "bag (1 kg)", grams: 1000 }, source: USDA,
  },
  {
    id: "brown_rice", name: "Brown rice (dry)", aisle: "grains-pasta", gi: 68,
    per100g: n({ kcal: 367, carb: 76.2, fiber: 3.5, protein: 7.9, fat: 2.9, satFat: 0.6, sodium: 4, potassium: 223, phosphorus: 264 }),
    purchase: { kind: "package", unit: "bag (1 kg)", grams: 1000 }, source: USDA,
  },
  {
    id: "quinoa", name: "Quinoa (dry)", aisle: "grains-pasta", gi: 53,
    per100g: n({ kcal: 368, carb: 64.2, fiber: 7, protein: 14.1, fat: 6.1, satFat: 0.7, sodium: 5, potassium: 563, phosphorus: 457 }),
    purchase: { kind: "package", unit: "bag (500 g)", grams: 500 }, source: USDA,
  },
  {
    id: "pasta", name: "Wheat pasta (dry)", aisle: "grains-pasta", allergens: ["wheat"], gi: 49,
    per100g: n({ kcal: 371, carb: 74.7, fiber: 3.2, protein: 13, fat: 1.5, satFat: 0.3, sodium: 6, potassium: 223, phosphorus: 189 }),
    fodmap: { fructan: 0 }, purchase: { kind: "package", unit: "box (500 g)", grams: 500 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "gf_pasta", name: "Gluten-free rice/corn pasta (dry)", aisle: "grains-pasta", gi: 50,
    per100g: n({ kcal: 357, carb: 79, fiber: 2, protein: 7, fat: 1.5, satFat: 0.3, sodium: 4, potassium: 100, phosphorus: 120 }),
    purchase: { kind: "package", unit: "box (340 g)", grams: 340 }, source: USDA,
  },
  {
    id: "rice_noodles", name: "Rice noodles (dry)", aisle: "grains-pasta", gi: 53,
    per100g: n({ kcal: 364, carb: 80, fiber: 1.6, protein: 6, fat: 0.6, satFat: 0.2, sodium: 182, potassium: 30, phosphorus: 153 }),
    purchase: { kind: "package", unit: "pack (400 g)", grams: 400 }, source: USDA,
  },
  {
    id: "whole_wheat_bread", name: "Whole-wheat bread", aisle: "bakery", allergens: ["wheat"], gi: 74,
    per100g: n({ kcal: 252, carb: 43, fiber: 6, addedSugar: 4, protein: 12.5, fat: 3.5, satFat: 0.7, sodium: 450, potassium: 250, phosphorus: 212 }),
    fodmap: { fructan: 0 }, labelCheck: ["phosphate"], shoppingNotes: [CKD_BREAD_NOTE],
    purchase: { kind: "package", unit: "loaf", grams: 600 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "white_bread", name: "White bread", aisle: "bakery", allergens: ["wheat"], gi: 75,
    per100g: n({ kcal: 266, carb: 49, fiber: 2.7, addedSugar: 5, protein: 8.9, fat: 3.3, satFat: 0.7, sodium: 490, potassium: 100, phosphorus: 99 }),
    fodmap: { fructan: 24 }, labelCheck: ["phosphate"], shoppingNotes: [CKD_BREAD_NOTE],
    purchase: { kind: "package", unit: "loaf", grams: 600 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "sourdough", name: "Sourdough bread (white wheat)", aisle: "bakery", allergens: ["wheat"], gi: 54,
    per100g: n({ kcal: 272, carb: 52, fiber: 2.2, protein: 10.8, fat: 2.4, satFat: 0.5, sodium: 600, potassium: 117, phosphorus: 94 }),
    fodmap: { fructan: 100 },
    shoppingNotes: [
      { diet: "fodmap", text: "Choose traditional slow-fermented sourdough (no added yeast or inulin)." },
      CKD_BREAD_NOTE,
    ],
    purchase: { kind: "package", unit: "loaf", grams: 700 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "corn_tortilla", name: "Corn tortillas", aisle: "bakery", gi: 46,
    per100g: n({ kcal: 218, carb: 44.6, fiber: 6.3, protein: 5.7, fat: 2.9, satFat: 0.4, sodium: 45, potassium: 186, phosphorus: 314 }),
    purchase: { kind: "package", unit: "pack (12)", grams: 360 }, source: USDA,
  },
  {
    id: "rice_cakes", name: "Rice cakes, unsalted", aisle: "grains-pasta", gi: 82,
    per100g: n({ kcal: 387, carb: 81.5, fiber: 4.2, protein: 8.2, fat: 2.8, satFat: 0.6, sodium: 29, potassium: 290, phosphorus: 360 }),
    purchase: { kind: "package", unit: "pack (~14 cakes)", grams: 130 }, source: USDA,
  },
  {
    id: "popcorn_kernels", name: "Popcorn kernels (air-popped)", aisle: "grains-pasta", gi: 65,
    per100g: n({ kcal: 387, carb: 77.8, fiber: 14.5, protein: 13, fat: 4.5, satFat: 0.6, sodium: 8, potassium: 329, phosphorus: 358 }),
    purchase: { kind: "package", unit: "jar (850 g)", grams: 850 }, source: USDA,
  },
  {
    id: "cornstarch", name: "Cornstarch", aisle: "spices-baking", pantryStaple: true,
    per100g: n({ kcal: 381, carb: 91.3, fiber: 0.9, protein: 0.3, fat: 0.1, sodium: 9, potassium: 3, phosphorus: 13 }),
    purchase: { kind: "package", unit: "box (450 g)", grams: 450 }, source: USDA,
  },

  // ── Legumes ─────────────────────────────────────────────────────────────
  {
    id: "chickpeas_canned", name: "Chickpeas, canned, no salt added", aisle: "canned-jarred", gi: 28,
    per100g: n({ kcal: 139, carb: 22.6, fiber: 6.4, protein: 7, fat: 2.6, satFat: 0.3, sodium: 24, potassium: 168, phosphorus: 113 }),
    fodmap: { gos: 42 }, shoppingNotes: [CKD_CANNED_NOTE, { diet: "fodmap", text: "Canned & rinsed chickpeas are lower FODMAP than dried." }],
    purchase: { kind: "package", unit: "can (240 g drained)", grams: 240 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "lentils_canned", name: "Lentils, canned, no salt added", aisle: "canned-jarred", gi: 32,
    per100g: n({ kcal: 114, carb: 20, fiber: 7.9, protein: 9, fat: 0.4, satFat: 0.1, sodium: 5, potassium: 369, phosphorus: 180 }),
    fodmap: { gos: 46 }, shoppingNotes: [CKD_CANNED_NOTE],
    purchase: { kind: "package", unit: "can (240 g drained)", grams: 240 }, source: USDA + FODMAP_SRC,
  },

  // ── Vegetables ──────────────────────────────────────────────────────────
  {
    id: "broccoli", name: "Broccoli (heads)", aisle: "produce", gi: 15,
    per100g: n({ kcal: 34, carb: 6.6, fiber: 2.6, protein: 2.8, fat: 0.4, sodium: 33, potassium: 316, phosphorus: 66 }),
    fodmap: { fructose: 75 }, purchase: { kind: "count", unit: "head", gramsEach: 350 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "carrot", name: "Carrots", aisle: "produce", gi: 39,
    per100g: n({ kcal: 41, carb: 9.6, fiber: 2.8, protein: 0.9, fat: 0.2, sodium: 69, potassium: 320, phosphorus: 35 }),
    purchase: { kind: "count", unit: "medium carrot", gramsEach: 60 }, source: USDA,
  },
  {
    id: "red_pepper", name: "Red bell pepper", aisle: "produce",
    per100g: n({ kcal: 31, carb: 6, fiber: 2.1, protein: 1, fat: 0.3, sodium: 4, potassium: 211, phosphorus: 26 }),
    fodmap: { fructose: 43 }, purchase: { kind: "count", unit: "pepper", gramsEach: 160 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "zucchini", name: "Zucchini", aisle: "produce",
    per100g: n({ kcal: 17, carb: 3.1, fiber: 1, protein: 1.2, fat: 0.3, sodium: 8, potassium: 261, phosphorus: 38 }),
    fodmap: { fructan: 65 }, purchase: { kind: "count", unit: "medium zucchini", gramsEach: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "spinach", name: "Baby spinach", aisle: "produce",
    per100g: n({ kcal: 23, carb: 3.6, fiber: 2.2, protein: 2.9, fat: 0.4, sodium: 79, potassium: 558, phosphorus: 49 }),
    purchase: { kind: "package", unit: "bag (140 g)", grams: 140 }, source: USDA,
  },
  {
    id: "romaine", name: "Romaine lettuce", aisle: "produce",
    per100g: n({ kcal: 17, carb: 3.3, fiber: 2.1, protein: 1.2, fat: 0.3, sodium: 8, potassium: 247, phosphorus: 30 }),
    purchase: { kind: "count", unit: "head", gramsEach: 500 }, source: USDA,
  },
  {
    id: "cucumber", name: "Cucumber", aisle: "produce",
    per100g: n({ kcal: 15, carb: 3.6, fiber: 0.5, protein: 0.7, fat: 0.1, sodium: 2, potassium: 147, phosphorus: 24 }),
    purchase: { kind: "count", unit: "cucumber", gramsEach: 300 }, source: USDA,
  },
  {
    id: "tomato", name: "Tomatoes", aisle: "produce",
    per100g: n({ kcal: 18, carb: 3.9, fiber: 1.2, protein: 0.9, fat: 0.2, sodium: 5, potassium: 237, phosphorus: 24 }),
    fodmap: { fructose: 65 }, purchase: { kind: "count", unit: "medium tomato", gramsEach: 120 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "canned_tomatoes", name: "Diced tomatoes, canned, no salt added", aisle: "canned-jarred",
    per100g: n({ kcal: 18, carb: 4, fiber: 1.9, protein: 0.8, fat: 0.1, sodium: 10, potassium: 191, phosphorus: 19 }),
    fodmap: { fructose: 92 }, shoppingNotes: [CKD_CANNED_NOTE],
    purchase: { kind: "package", unit: "can (400 g)", grams: 400 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "green_beans", name: "Green beans", aisle: "produce",
    per100g: n({ kcal: 31, carb: 7, fiber: 2.7, protein: 1.8, fat: 0.2, sodium: 6, potassium: 211, phosphorus: 38 }),
    fodmap: { sorbitol: 75 }, purchase: { kind: "weight" }, source: USDA + FODMAP_SRC,
  },
  {
    id: "cauliflower", name: "Cauliflower", aisle: "produce",
    per100g: n({ kcal: 25, carb: 5, fiber: 2, protein: 1.9, fat: 0.3, sodium: 30, potassium: 299, phosphorus: 44 }),
    fodmap: { mannitol: 0 }, purchase: { kind: "count", unit: "head", gramsEach: 600 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "cabbage", name: "Green cabbage", aisle: "produce",
    per100g: n({ kcal: 25, carb: 5.8, fiber: 2.5, protein: 1.3, fat: 0.1, sodium: 18, potassium: 170, phosphorus: 26 }),
    fodmap: { sorbitol: 75 }, purchase: { kind: "count", unit: "small head", gramsEach: 700 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "bok_choy", name: "Bok choy", aisle: "produce",
    per100g: n({ kcal: 13, carb: 2.2, fiber: 1, protein: 1.5, fat: 0.2, sodium: 65, potassium: 252, phosphorus: 37 }),
    purchase: { kind: "count", unit: "head", gramsEach: 250 }, source: USDA,
  },
  {
    id: "eggplant", name: "Eggplant", aisle: "produce",
    per100g: n({ kcal: 25, carb: 5.9, fiber: 3, protein: 1, fat: 0.2, sodium: 2, potassium: 229, phosphorus: 24 }),
    fodmap: { sorbitol: 75 }, purchase: { kind: "count", unit: "eggplant", gramsEach: 450 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "onion", name: "Onion", aisle: "produce",
    per100g: n({ kcal: 40, carb: 9.3, fiber: 1.7, protein: 1.1, fat: 0.1, sodium: 4, potassium: 146, phosphorus: 29 }),
    fodmap: { fructan: 0 }, purchase: { kind: "count", unit: "medium onion", gramsEach: 150 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "garlic", name: "Garlic", aisle: "produce", pantryStaple: true,
    per100g: n({ kcal: 149, carb: 33, fiber: 2.1, protein: 6.4, fat: 0.5, sodium: 17, potassium: 401, phosphorus: 153 }),
    fodmap: { fructan: 0 }, purchase: { kind: "count", unit: "bulb", gramsEach: 50 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "scallion_greens", name: "Scallions (green tops only)", aisle: "produce",
    per100g: n({ kcal: 32, carb: 7.3, fiber: 2.6, protein: 1.8, fat: 0.2, sodium: 16, potassium: 276, phosphorus: 37 }),
    shoppingNotes: [{ diet: "fodmap", text: "Use only the green tops — the white bulbs are high FODMAP." }],
    purchase: { kind: "count", unit: "bunch", gramsEach: 100 }, source: USDA,
  },
  {
    id: "mushrooms", name: "Button mushrooms", aisle: "produce",
    per100g: n({ kcal: 22, carb: 3.3, fiber: 1, protein: 3.1, fat: 0.3, sodium: 5, potassium: 318, phosphorus: 86 }),
    fodmap: { mannitol: 0 }, purchase: { kind: "package", unit: "pack (250 g)", grams: 250 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "kale", name: "Kale", aisle: "produce",
    per100g: n({ kcal: 35, carb: 4.4, fiber: 4.1, protein: 2.9, fat: 1.5, sodium: 53, potassium: 348, phosphorus: 55 }),
    purchase: { kind: "count", unit: "bunch", gramsEach: 200 }, source: USDA,
  },
  {
    id: "potato", name: "Potatoes", aisle: "produce", gi: 78, leachRetainK: 0.5,
    per100g: n({ kcal: 77, carb: 17.5, fiber: 2.1, protein: 2, fat: 0.1, sodium: 6, potassium: 425, phosphorus: 57 }),
    shoppingNotes: [{ diet: "ckd", text: "Peel, dice and double-boil (leach) to roughly halve the potassium — see recipe." }],
    purchase: { kind: "count", unit: "medium potato", gramsEach: 200 }, source: USDA + "; leaching retention ~50% (literature range 25–75%)",
  },
  {
    id: "sweet_potato", name: "Sweet potato", aisle: "produce", gi: 63,
    per100g: n({ kcal: 86, carb: 20.1, fiber: 3, protein: 1.6, fat: 0.1, sodium: 55, potassium: 337, phosphorus: 47 }),
    fodmap: { mannitol: 75 }, purchase: { kind: "count", unit: "medium sweet potato", gramsEach: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "parsley", name: "Fresh parsley", aisle: "produce",
    per100g: n({ kcal: 36, carb: 6.3, fiber: 3.3, protein: 3, fat: 0.8, sodium: 56, potassium: 554, phosphorus: 58 }),
    purchase: { kind: "count", unit: "bunch", gramsEach: 60 }, source: USDA,
  },
  {
    id: "ginger", name: "Fresh ginger", aisle: "produce", pantryStaple: true,
    per100g: n({ kcal: 80, carb: 17.8, fiber: 2, protein: 1.8, fat: 0.8, sodium: 13, potassium: 415, phosphorus: 34 }),
    purchase: { kind: "count", unit: "knob", gramsEach: 50 }, source: USDA,
  },
  {
    id: "lemon_juice", name: "Lemons (juice)", aisle: "produce",
    per100g: n({ kcal: 22, carb: 6.9, fiber: 0.3, protein: 0.4, fat: 0.2, sodium: 1, potassium: 103, phosphorus: 8 }),
    purchase: { kind: "count", unit: "lemon", gramsEach: 45 }, source: USDA,
  },
  {
    id: "avocado", name: "Avocado", aisle: "produce",
    per100g: n({ kcal: 160, carb: 8.5, fiber: 6.7, protein: 2, fat: 14.7, satFat: 2.1, sodium: 7, potassium: 485, phosphorus: 52 }),
    fodmap: { sorbitol: 30 }, purchase: { kind: "count", unit: "avocado", gramsEach: 150 }, source: USDA + FODMAP_SRC,
  },

  // ── Fruit ───────────────────────────────────────────────────────────────
  {
    id: "blueberries", name: "Blueberries", aisle: "produce", gi: 53,
    per100g: n({ kcal: 57, carb: 14.5, fiber: 2.4, protein: 0.7, fat: 0.3, sodium: 1, potassium: 77, phosphorus: 12 }),
    fodmap: { fructose: 125 }, purchase: { kind: "package", unit: "punnet (170 g)", grams: 170 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "strawberries", name: "Strawberries", aisle: "produce", gi: 41,
    per100g: n({ kcal: 32, carb: 7.7, fiber: 2, protein: 0.7, fat: 0.3, sodium: 1, potassium: 153, phosphorus: 24 }),
    fodmap: { fructose: 65 }, purchase: { kind: "package", unit: "punnet (450 g)", grams: 450 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "raspberries", name: "Raspberries", aisle: "produce", gi: 32,
    per100g: n({ kcal: 52, carb: 11.9, fiber: 6.5, protein: 1.2, fat: 0.7, sodium: 1, potassium: 151, phosphorus: 29 }),
    fodmap: { fructose: 60 }, purchase: { kind: "package", unit: "punnet (170 g)", grams: 170 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "banana", name: "Banana, ripe", aisle: "produce", gi: 51,
    per100g: n({ kcal: 89, carb: 22.8, fiber: 2.6, protein: 1.1, fat: 0.3, sodium: 1, potassium: 358, phosphorus: 22 }),
    fodmap: { fructan: 35 }, purchase: { kind: "count", unit: "banana", gramsEach: 118 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "apple", name: "Apple", aisle: "produce", gi: 36,
    per100g: n({ kcal: 52, carb: 13.8, fiber: 2.4, protein: 0.3, fat: 0.2, sodium: 1, potassium: 107, phosphorus: 11 }),
    fodmap: { fructose: 0, sorbitol: 0 }, purchase: { kind: "count", unit: "apple", gramsEach: 180 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "orange", name: "Orange", aisle: "produce", gi: 43,
    per100g: n({ kcal: 47, carb: 11.8, fiber: 2.4, protein: 0.9, fat: 0.1, sodium: 0, potassium: 181, phosphorus: 14 }),
    fodmap: { fructose: 130 }, purchase: { kind: "count", unit: "orange", gramsEach: 140 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "grapes", name: "Grapes", aisle: "produce", gi: 59,
    per100g: n({ kcal: 69, carb: 18.1, fiber: 0.9, protein: 0.7, fat: 0.2, sodium: 2, potassium: 191, phosphorus: 20 }),
    fodmap: { fructose: 150 }, purchase: { kind: "weight" }, source: USDA + FODMAP_SRC,
  },
  {
    id: "pineapple", name: "Pineapple", aisle: "produce", gi: 59,
    per100g: n({ kcal: 50, carb: 13.1, fiber: 1.4, protein: 0.5, fat: 0.1, sodium: 1, potassium: 109, phosphorus: 8 }),
    fodmap: { fructan: 140 }, purchase: { kind: "count", unit: "pineapple", gramsEach: 900 }, source: USDA + FODMAP_SRC,
  },

  // ── Nuts, seeds, spreads ────────────────────────────────────────────────
  {
    id: "peanut_butter", name: "Peanut butter, natural, unsalted", aisle: "nuts-seeds", allergens: ["peanut"],
    per100g: n({ kcal: 597, carb: 20, fiber: 4.8, protein: 22.5, fat: 51, satFat: 10.5, sodium: 17, potassium: 558, phosphorus: 339 }),
    purchase: { kind: "package", unit: "jar (450 g)", grams: 450 }, source: USDA,
  },
  {
    id: "almonds", name: "Almonds", aisle: "nuts-seeds", allergens: ["treenut"],
    per100g: n({ kcal: 579, carb: 21.6, fiber: 12.5, protein: 21.2, fat: 49.9, satFat: 3.8, sodium: 1, potassium: 733, phosphorus: 481 }),
    fodmap: { gos: 12 }, purchase: { kind: "package", unit: "bag (200 g)", grams: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "walnuts", name: "Walnuts", aisle: "nuts-seeds", allergens: ["treenut"],
    per100g: n({ kcal: 654, carb: 13.7, fiber: 6.7, protein: 15.2, fat: 65.2, satFat: 6.1, sodium: 2, potassium: 441, phosphorus: 346 }),
    fodmap: { fructan: 30 }, purchase: { kind: "package", unit: "bag (200 g)", grams: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "chia_seeds", name: "Chia seeds", aisle: "nuts-seeds",
    per100g: n({ kcal: 486, carb: 42.1, fiber: 34.4, protein: 16.5, fat: 30.7, satFat: 3.3, sodium: 16, potassium: 407, phosphorus: 860 }),
    fodmap: { fructan: 24 }, purchase: { kind: "package", unit: "bag (300 g)", grams: 300 }, source: USDA + FODMAP_SRC,
  },

  // ── Oils, sauces, condiments ────────────────────────────────────────────
  {
    id: "olive_oil", name: "Extra-virgin olive oil", aisle: "oils-condiments", pantryStaple: true,
    per100g: n({ kcal: 884, fat: 100, satFat: 13.8 }), purchase: { kind: "package", unit: "bottle (500 ml)", grams: 460 }, source: USDA,
  },
  {
    id: "garlic_oil", name: "Garlic-infused olive oil", aisle: "oils-condiments", pantryStaple: true,
    per100g: n({ kcal: 884, fat: 100, satFat: 13.8 }),
    shoppingNotes: [{ diet: "fodmap", text: "Garlic-infused oil is low FODMAP — fructans don't dissolve into oil." }],
    purchase: { kind: "package", unit: "bottle (250 ml)", grams: 230 }, source: USDA,
  },
  {
    id: "coconut_milk", name: "Coconut milk, canned", aisle: "canned-jarred",
    per100g: n({ kcal: 197, carb: 2.8, protein: 2, fat: 21, satFat: 18.9, sodium: 13, potassium: 220, phosphorus: 96, fluid: 70 }),
    fodmap: { sorbitol: 60 }, purchase: { kind: "package", unit: "can (400 ml)", grams: 400 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "soy_sauce_low_na", name: "Soy sauce, reduced sodium", aisle: "oils-condiments", allergens: ["soy", "wheat"], pantryStaple: true,
    per100g: n({ kcal: 60, carb: 5.6, protein: 10.3, fat: 0.1, sodium: 3333, potassium: 200, phosphorus: 130 }),
    shoppingNotes: [{ diet: "ckd", text: "Still high in sodium — measure, don't pour." }],
    purchase: { kind: "package", unit: "bottle (250 ml)", grams: 290 }, source: USDA,
  },
  {
    id: "chicken_broth_low_na", name: "Chicken broth, low sodium", aisle: "canned-jarred",
    per100g: n({ kcal: 6, carb: 0.4, protein: 1.1, fat: 0.2, sodium: 58, potassium: 70, phosphorus: 30, fluid: 98 }),
    fodmap: { fructan: 0 }, labelCheck: ["phosphate"],
    shoppingNotes: [{ diet: "ckd", text: "Choose low-sodium and avoid broths listing potassium chloride or phosphates." }],
    purchase: { kind: "package", unit: "carton (1 L)", grams: 1000 }, source: USDA + "; most broths contain onion/garlic" + CONSERVATIVE,
  },
  {
    id: "maple_syrup", name: "Maple syrup", aisle: "oils-condiments", gi: 54,
    per100g: n({ kcal: 260, carb: 67, addedSugar: 60, sodium: 12, potassium: 212, phosphorus: 2 }),
    purchase: { kind: "package", unit: "bottle (250 ml)", grams: 330 }, source: USDA,
  },
  {
    id: "dijon", name: "Dijon mustard", aisle: "oils-condiments", pantryStaple: true,
    per100g: n({ kcal: 66, carb: 5.8, fiber: 4, protein: 4.4, fat: 4, sodium: 1135, potassium: 152, phosphorus: 108 }),
    purchase: { kind: "package", unit: "jar (200 g)", grams: 200 }, source: USDA,
  },
  {
    id: "rice_vinegar", name: "Rice vinegar", aisle: "oils-condiments", pantryStaple: true,
    per100g: n({ kcal: 18, sodium: 1, potassium: 2 }),
    purchase: { kind: "package", unit: "bottle (350 ml)", grams: 350 }, source: USDA,
  },

  // ── Library expansion: proteins ─────────────────────────────────────────
  {
    id: "chicken_thigh", name: "Chicken thigh, boneless skinless", aisle: "meat-seafood",
    per100g: n({ kcal: 121, protein: 19.7, fat: 4.1, satFat: 1.0, sodium: 95, potassium: 242, phosphorus: 186 }),
    purchase: { kind: "package", unit: "pack (500 g)", grams: 500 }, labelCheck: ["phosphate", "sodium"],
    shoppingNotes: [CKD_MEAT_NOTE], source: USDA,
  },
  {
    id: "tilapia", name: "Tilapia fillet", aisle: "meat-seafood", allergens: ["fish"],
    per100g: n({ kcal: 96, protein: 20.1, fat: 1.7, satFat: 0.6, sodium: 52, potassium: 302, phosphorus: 170 }),
    purchase: { kind: "weight" }, labelCheck: ["phosphate"],
    shoppingNotes: [{ diet: "ckd", text: "Frozen fillets are sometimes treated with sodium tripolyphosphate — check the label." }],
    source: USDA,
  },

  // ── Library expansion: dairy & fats ─────────────────────────────────────
  {
    id: "mayonnaise", name: "Mayonnaise", aisle: "oils-condiments", allergens: ["egg"],
    per100g: n({ kcal: 680, carb: 0.6, addedSugar: 0.5, protein: 1, fat: 75, satFat: 11.7, sodium: 635, potassium: 20, phosphorus: 21 }),
    purchase: { kind: "package", unit: "jar (400 g)", grams: 400 }, source: USDA,
  },
  {
    id: "heavy_cream", name: "Heavy cream", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 340, carb: 2.8, protein: 2.8, fat: 36, satFat: 23, sodium: 27, potassium: 95, phosphorus: 58, fluid: 55 }),
    fodmap: { lactose: 40 }, purchase: { kind: "package", unit: "carton (250 ml)", grams: 250 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "sour_cream", name: "Sour cream", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 198, carb: 4.6, protein: 2.4, fat: 19.4, satFat: 10, sodium: 31, potassium: 125, phosphorus: 76 }),
    fodmap: { lactose: 40 }, purchase: { kind: "package", unit: "tub (250 g)", grams: 250 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "brie", name: "Brie cheese", aisle: "dairy-eggs", allergens: ["dairy"],
    per100g: n({ kcal: 334, carb: 0.5, protein: 20.8, fat: 27.7, satFat: 17.4, sodium: 629, potassium: 152, phosphorus: 188 }),
    purchase: { kind: "package", unit: "wheel (200 g)", grams: 200 },
    shoppingNotes: [{ diet: "ckd", text: "Brie and camembert are among the lowest-phosphorus cheeses." }],
    source: USDA + "; lactose negligible in ripened cheese",
  },
  {
    id: "canola_oil", name: "Canola oil", aisle: "oils-condiments", pantryStaple: true,
    per100g: n({ kcal: 884, fat: 100, satFat: 7.4 }),
    purchase: { kind: "package", unit: "bottle (1 L)", grams: 920 }, source: USDA,
  },
  {
    id: "macadamia", name: "Macadamia nuts, unsalted", aisle: "nuts-seeds", allergens: ["treenut"],
    per100g: n({ kcal: 718, carb: 13.8, fiber: 8.6, protein: 7.9, fat: 75.8, satFat: 12, sodium: 5, potassium: 368, phosphorus: 188 }),
    fodmap: { fructan: 40 }, purchase: { kind: "package", unit: "bag (200 g)", grams: 200 },
    shoppingNotes: [{ diet: "ckd", text: "Macadamias are the most energy-dense, lowest-phosphorus nut — buy unsalted." }],
    source: USDA + FODMAP_SRC,
  },
  {
    id: "pecans", name: "Pecans, unsalted", aisle: "nuts-seeds", allergens: ["treenut"],
    per100g: n({ kcal: 691, carb: 13.9, fiber: 9.6, protein: 9.2, fat: 72, satFat: 6.2, sodium: 0, potassium: 410, phosphorus: 277 }),
    fodmap: { fructan: 20 }, purchase: { kind: "package", unit: "bag (200 g)", grams: 200 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "strawberry_jam", name: "Strawberry jam", aisle: "canned-jarred", gi: 51,
    per100g: n({ kcal: 278, carb: 69, fiber: 1.1, addedSugar: 48, protein: 0.4, fat: 0.1, sodium: 32, potassium: 77, phosphorus: 20 }),
    fodmap: { fructose: 40 },
    shoppingNotes: [
      { diet: "diabetic", text: "Jam counts toward added sugar — measure 2 tsp, don't spread freely." },
      { diet: "fodmap", text: "Choose jam made with sugar, not high-fructose corn syrup." },
    ],
    purchase: { kind: "package", unit: "jar (340 g)", grams: 340 }, source: USDA + FODMAP_SRC,
  },

  // ── Library expansion: grains ───────────────────────────────────────────
  {
    id: "cornmeal", name: "Cornmeal / polenta, degermed", aisle: "grains-pasta", gi: 68,
    per100g: n({ kcal: 370, carb: 79.5, fiber: 3.9, protein: 7.1, fat: 1.8, satFat: 0.2, sodium: 7, potassium: 142, phosphorus: 99 }),
    labelCheck: ["phosphate"],
    shoppingNotes: [{ diet: "ckd", text: "Avoid 'self-rising' cornmeal — it contains phosphate leavening." }],
    purchase: { kind: "package", unit: "bag (500 g)", grams: 500 }, source: USDA,
  },
  {
    id: "couscous", name: "Couscous (dry)", aisle: "grains-pasta", allergens: ["wheat"], gi: 65,
    per100g: n({ kcal: 376, carb: 77.4, fiber: 5, protein: 12.8, fat: 0.6, satFat: 0.1, sodium: 10, potassium: 166, phosphorus: 170 }),
    fodmap: { fructan: 0 }, purchase: { kind: "package", unit: "box (500 g)", grams: 500 }, source: USDA + CONSERVATIVE,
  },
  {
    id: "rice_flour", name: "White rice flour", aisle: "spices-baking", gi: 70,
    per100g: n({ kcal: 366, carb: 80.1, fiber: 2.4, protein: 5.9, fat: 1.4, satFat: 0.4, sodium: 0, potassium: 76, phosphorus: 98 }),
    purchase: { kind: "package", unit: "bag (500 g)", grams: 500 }, source: USDA,
  },
  {
    id: "gf_bread", name: "Gluten-free white bread", aisle: "bakery", gi: 70,
    per100g: n({ kcal: 254, carb: 47, fiber: 4, addedSugar: 4, protein: 4, fat: 5, satFat: 0.7, sodium: 470, potassium: 120, phosphorus: 110 }),
    labelCheck: ["phosphate"],
    shoppingNotes: [CKD_BREAD_NOTE, { diet: "fodmap", text: "Check the label for inulin or chicory root (high FODMAP)." }],
    purchase: { kind: "package", unit: "loaf", grams: 450 }, source: "Typical gluten-free white loaf (approx.)",
  },

  // ── Library expansion: produce ──────────────────────────────────────────
  {
    id: "kiwi", name: "Kiwifruit", aisle: "produce", gi: 50,
    per100g: n({ kcal: 61, carb: 14.7, fiber: 3, protein: 1.1, fat: 0.5, sodium: 3, potassium: 312, phosphorus: 34 }),
    fodmap: { fructose: 150 }, purchase: { kind: "count", unit: "kiwi", gramsEach: 75 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "cantaloupe", name: "Cantaloupe", aisle: "produce", gi: 65,
    per100g: n({ kcal: 34, carb: 8.2, fiber: 0.9, protein: 0.8, fat: 0.2, sodium: 16, potassium: 267, phosphorus: 15 }),
    fodmap: { fructan: 120 }, purchase: { kind: "count", unit: "melon", gramsEach: 900 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "mandarin", name: "Mandarin / clementine", aisle: "produce", gi: 47,
    per100g: n({ kcal: 53, carb: 13.3, fiber: 1.8, protein: 0.8, fat: 0.3, sodium: 2, potassium: 166, phosphorus: 20 }),
    fodmap: { fructose: 90 }, purchase: { kind: "count", unit: "mandarin", gramsEach: 75 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "iceberg", name: "Iceberg lettuce", aisle: "produce",
    per100g: n({ kcal: 14, carb: 3, fiber: 1.2, protein: 0.9, fat: 0.1, sodium: 10, potassium: 141, phosphorus: 20 }),
    purchase: { kind: "count", unit: "head", gramsEach: 550 }, source: USDA,
  },
  {
    id: "radish", name: "Radishes", aisle: "produce",
    per100g: n({ kcal: 16, carb: 3.4, fiber: 1.6, protein: 0.7, fat: 0.1, sodium: 39, potassium: 233, phosphorus: 20 }),
    purchase: { kind: "package", unit: "bunch", grams: 200 }, source: USDA,
  },
  {
    id: "turnip", name: "Turnip", aisle: "produce", gi: 62,
    per100g: n({ kcal: 28, carb: 6.4, fiber: 1.8, protein: 0.9, fat: 0.1, sodium: 67, potassium: 191, phosphorus: 27 }),
    fodmap: { fructan: 75 }, purchase: { kind: "count", unit: "turnip", gramsEach: 120 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "spaghetti_squash", name: "Spaghetti squash", aisle: "produce", gi: 40,
    per100g: n({ kcal: 31, carb: 6.9, fiber: 1.5, protein: 0.6, fat: 0.6, satFat: 0.1, sodium: 17, potassium: 108, phosphorus: 12 }),
    fodmap: { fructan: 150 }, purchase: { kind: "count", unit: "squash", gramsEach: 1000 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "bean_sprouts", name: "Mung bean sprouts", aisle: "produce",
    per100g: n({ kcal: 30, carb: 5.9, fiber: 1.8, protein: 3, fat: 0.2, sodium: 6, potassium: 149, phosphorus: 54 }),
    purchase: { kind: "package", unit: "bag (250 g)", grams: 250 }, source: USDA,
  },
  {
    id: "butternut", name: "Butternut squash", aisle: "produce", gi: 51,
    per100g: n({ kcal: 45, carb: 11.7, fiber: 2, protein: 1, fat: 0.1, sodium: 4, potassium: 352, phosphorus: 33 }),
    fodmap: { mannitol: 45 }, purchase: { kind: "count", unit: "squash", gramsEach: 900 }, source: USDA + FODMAP_SRC,
  },
  {
    id: "basil", name: "Fresh basil", aisle: "produce",
    per100g: n({ kcal: 23, carb: 2.7, fiber: 1.6, protein: 3.2, fat: 0.6, sodium: 4, potassium: 295, phosphorus: 56 }),
    purchase: { kind: "package", unit: "bunch", grams: 30 }, source: USDA,
  },
  {
    id: "chives", name: "Fresh chives", aisle: "produce",
    per100g: n({ kcal: 30, carb: 4.4, fiber: 2.5, protein: 3.3, fat: 0.7, sodium: 3, potassium: 296, phosphorus: 58 }),
    shoppingNotes: [{ diet: "fodmap", text: "Chives give onion flavour without the fructans." }],
    purchase: { kind: "package", unit: "bunch", grams: 25 }, source: USDA,
  },
  {
    id: "cilantro", name: "Fresh cilantro", aisle: "produce",
    per100g: n({ kcal: 23, carb: 3.7, fiber: 2.8, protein: 2.1, fat: 0.5, sodium: 46, potassium: 521, phosphorus: 48 }),
    purchase: { kind: "package", unit: "bunch", grams: 30 }, source: USDA,
  },

  // ── Spices (negligible nutrients, pantry staples) ───────────────────────
  ...(
    [
      ["black_pepper", "Black pepper"],
      ["cumin", "Ground cumin"],
      ["paprika", "Smoked paprika"],
      ["oregano", "Dried oregano"],
      ["cinnamon", "Ground cinnamon"],
      ["chili_flakes", "Chili flakes"],
      ["dill", "Dried dill"],
    ] as const
  ).map(([id, name]): Ingredient => ({
    id, name, aisle: "spices-baking", pantryStaple: true,
    per100g: n({ kcal: 300, carb: 60, fiber: 30, protein: 10, fat: 5, sodium: 30, potassium: 1300, phosphorus: 150 }),
    purchase: { kind: "package", unit: "jar", grams: 40 },
    source: "Generic dried spice average (approx.); used in ≤ 2 g amounts",
  })),
];

export const INGREDIENT_MAP: ReadonlyMap<string, Ingredient> = new Map(INGREDIENTS.map((i) => [i.id, i]));

export function getIngredient(id: string): Ingredient {
  const ing = INGREDIENT_MAP.get(id);
  if (!ing) throw new Error(`Unknown ingredient: ${id}`);
  return ing;
}
