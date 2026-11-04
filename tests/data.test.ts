import { describe, expect, it } from "vitest";
import { RECIPES } from "@/lib/data/recipes";
import { validateContent } from "@/lib/data/validate";
import { NUTRIENTS } from "@/lib/domain/types";
import { buildCandidates } from "@/lib/engine/candidates";
import { recipeLibrary } from "@/lib/engine/recipe-info";
import { resolveRules } from "@/lib/rules/resolve";
import { DIET_CASES, profile } from "./fixtures";

describe("content", () => {
  it("passes the content validator", () => {
    expect(validateContent()).toEqual([]);
  });

  it("produces finite nutrition for every recipe", () => {
    for (const info of recipeLibrary().values()) {
      for (const n of NUTRIENTS) expect(Number.isFinite(info.perServing[n]), `${info.recipe.id}.${n}`).toBe(true);
      expect(info.perServing.kcal).toBeGreaterThan(80);
    }
  });

  it.each(DIET_CASES)("%s: at least 5 recipes available for every slot", (_n, over) => {
    const cands = buildCandidates(resolveRules(profile(over)));
    for (const [slot, opts] of Object.entries(cands.bySlot)) {
      expect(new Set(opts.map((o) => o.recipeId)).size, slot).toBeGreaterThanOrEqual(5);
    }
  });

  it("has a library of at least 150 recipes", () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(150);
  });
});
