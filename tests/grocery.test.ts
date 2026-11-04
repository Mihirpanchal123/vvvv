import { describe, expect, it } from "vitest";
import { getIngredient } from "@/lib/data/ingredients";
import type { PlannedMeal } from "@/lib/domain/types";
import { buildGroceryList, groceryListToText, purchaseAmount } from "@/lib/grocery/build";

const meals: PlannedMeal[] = [
  { slot: "lunch", recipeId: "chicken-rice-bowl", portion: 1 },
  { slot: "dinner", recipeId: "chicken-rice-bowl", portion: 0.5 },
  { slot: "dinner", recipeId: "lemon-salmon-rice-beans", portion: 1 },
];

describe("buildGroceryList", () => {
  it("aggregates quantities across meals, portions and household size", () => {
    const list = buildGroceryList({ meals, householdSize: 2, diets: [] });
    const items = list.sections.flatMap((s) => s.items);
    const chicken = items.find((i) => i.ingredientId === "chicken_breast")!;
    expect(chicken.grams).toBe(100 * 1.5 * 2);
    const rice = items.find((i) => i.ingredientId === "white_rice")!;
    expect(rice.grams).toBe(60 * 1.5 * 2 + 55 * 2);
    expect(rice.usedIn).toEqual(["Ginger chicken & rice bowl", "Lemon-herb salmon with rice & green beans"]);
  });

  it("groups by aisle in store order and separates pantry staples", () => {
    const list = buildGroceryList({ meals, householdSize: 1, diets: [] });
    const aisles = list.sections.map((s) => s.aisle);
    expect(aisles.indexOf("produce")).toBeLessThan(aisles.indexOf("meat-seafood"));
    expect(list.pantryCheck.map((i) => i.ingredientId)).toEqual(expect.arrayContaining(["olive_oil", "garlic_oil", "soy_sauce_low_na"]));
    expect(list.sections.flatMap((s) => s.items).some((i) => i.pantryStaple)).toBe(false);
  });

  it("moves items the user already has into the pantry check", () => {
    const list = buildGroceryList({ meals, householdSize: 1, diets: [], pantry: ["white_rice"] });
    expect(list.sections.flatMap((s) => s.items).some((i) => i.ingredientId === "white_rice")).toBe(false);
    expect(list.pantryCheck.find((i) => i.ingredientId === "white_rice")?.inPantry).toBe(true);
  });

  it("adds shopping notes only for the user's diets", () => {
    const ckd = buildGroceryList({ meals, householdSize: 1, diets: ["ckd"] });
    const none = buildGroceryList({ meals, householdSize: 1, diets: [] });
    const chickenNotes = (l: typeof ckd) => l.sections.flatMap((s) => s.items).find((i) => i.ingredientId === "chicken_breast")!.notes;
    expect(chickenNotes(ckd).join(" ")).toMatch(/phosphate/);
    expect(chickenNotes(none)).toEqual([]);
  });

  it("renders a plain-text list", () => {
    const text = groceryListToText(buildGroceryList({ meals, householdSize: 1, diets: [] }));
    expect(text).toMatch(/^PRODUCE/);
    expect(text).toMatch(/CHECK YOUR PANTRY/);
  });
});

describe("purchaseAmount", () => {
  it("rounds packages up", () => {
    expect(purchaseAmount(getIngredient("chicken_breast"), 520)).toBe("2 × pack (500 g)");
    expect(purchaseAmount(getIngredient("chicken_breast"), 300)).toBe("1 pack (500 g)");
  });
  it("counts produce", () => {
    expect(purchaseAmount(getIngredient("carrot"), 150)).toBe("3 medium carrots");
    expect(purchaseAmount(getIngredient("lemon_juice"), 20)).toBe("1 lemon");
    expect(purchaseAmount(getIngredient("tomato"), 200)).toBe("2 medium tomatoes");
    expect(purchaseAmount(getIngredient("parsley"), 100)).toBe("2 bunches");
  });
  it("rounds loose weight", () => {
    expect(purchaseAmount(getIngredient("salmon"), 240)).toBe("250 g");
    expect(purchaseAmount(getIngredient("green_beans"), 1210)).toBe("1.25 kg");
  });
});
