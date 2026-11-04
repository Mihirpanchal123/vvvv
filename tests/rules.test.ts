import { describe, expect, it } from "vitest";
import type { Limit } from "@/lib/domain/types";
import { energyTarget } from "@/lib/rules/energy";
import { limitsFor, mergeLimits, resolveRules } from "@/lib/rules/resolve";
import { profile } from "./fixtures";

const lim = (over: Partial<Limit>): Limit => ({
  scope: "day", nutrient: "sodium", op: "max", value: 2000, hard: true, source: "general", reason: "", ...over,
});

describe("mergeLimits", () => {
  it("keeps the strictest hard limit", () => {
    const out = mergeLimits([lim({ value: 2300 }), lim({ value: 2000, source: "ckd" })]);
    expect(out).toHaveLength(1);
    expect(out[0].value).toBe(2000);
  });

  it("keeps a soft limit only when it is stricter than the hard one", () => {
    expect(mergeLimits([lim({ value: 2000 }), lim({ value: 2300, hard: false })])).toHaveLength(1);
    const out = mergeLimits([lim({ value: 2300 }), lim({ value: 1500, hard: false })]);
    expect(out.map((l) => l.value).sort()).toEqual([1500, 2300]);
  });

  it("uses the higher minimum", () => {
    const out = mergeLimits([lim({ op: "min", nutrient: "fiber", value: 20 }), lim({ op: "min", nutrient: "fiber", value: 25 })]);
    expect(out[0].value).toBe(25);
  });
});

describe("resolveRules", () => {
  it("applies a 30–60 g carbohydrate band at each main meal for diabetes", () => {
    const rules = resolveRules(profile({ diets: ["diabetic"] }));
    for (const slot of ["breakfast", "lunch", "dinner"] as const) {
      const { min, max } = limitsFor(rules, slot, "carb");
      expect(min).toMatchObject({ value: 30, hard: true });
      expect(max).toMatchObject({ value: 60, hard: true });
    }
    expect(rules.preferLowGlycemic).toBe(true);
  });

  it("sets stage-4 CKD limits and does not apply the general protein floor", () => {
    const rules = resolveRules(profile({ diets: ["ckd"], ckdStage: "4" }));
    expect(limitsFor(rules, "day", "potassium").max?.value).toBe(2500);
    expect(limitsFor(rules, "day", "phosphorus").max?.value).toBe(900);
    expect(limitsFor(rules, "day", "sodium").max).toMatchObject({ value: 2300, hard: true });
    const protein = limitsFor(rules, "day", "protein");
    expect(protein.max).toMatchObject({ value: Math.round(0.8 * 72), hard: true });
    expect(protein.min?.source).toBe("ckd");
    expect(protein.min!.value).toBeLessThan(protein.max!.value);
    expect(rules.avoidPhosphateAdditives).toBe(true);
  });

  it("raises the protein floor and adds a fluid budget on hemodialysis", () => {
    const rules = resolveRules(profile({ diets: ["ckd"], ckdStage: "hemodialysis" }));
    expect(limitsFor(rules, "day", "protein").min).toMatchObject({ value: 72, hard: true });
    expect(limitsFor(rules, "day", "fluid").max?.value).toBe(1000);
  });

  it("tightens potassium and phosphorus from high lab values", () => {
    const rules = resolveRules(profile({ diets: ["ckd"], ckdStage: "3b", labs: { potassium: 5.6, phosphorus: 5.1 } }));
    expect(limitsFor(rules, "day", "potassium").max).toMatchObject({ value: 2000, source: "labs" });
    expect(limitsFor(rules, "day", "phosphorus").max).toMatchObject({ value: 800, source: "labs" });
  });

  it("notes when eGFR doesn't match the selected stage", () => {
    const rules = resolveRules(profile({ diets: ["ckd"], ckdStage: "3a", labs: { egfr: 22 } }));
    expect(rules.notes.join(" ")).toMatch(/eGFR of 22/);
  });

  it("lets a clinician override replace the default", () => {
    const rules = resolveRules(
      profile({ diets: ["ckd"], ckdStage: "4", overrides: [{ scope: "day", nutrient: "sodium", op: "max", value: 1500, source: "clinician" }] }),
    );
    const sodium = rules.limits.filter((l) => l.nutrient === "sodium" && l.scope === "day");
    expect(sodium).toHaveLength(1);
    expect(sodium[0]).toMatchObject({ value: 1500, source: "clinician", hard: true });
  });

  it("drops a minimum that contradicts a safety maximum and reports the conflict", () => {
    const rules = resolveRules(
      profile({ diets: ["ckd"], ckdStage: "4", overrides: [{ scope: "day", nutrient: "protein", op: "min", value: 90, source: "user" }] }),
    );
    expect(limitsFor(rules, "day", "protein").min).toBeUndefined();
    expect(rules.conflicts.join(" ")).toMatch(/protein minimum 90/);
  });

  it("restricts all FODMAP groups in elimination and only triggers in personalisation", () => {
    expect(resolveRules(profile({ diets: ["fodmap"], fodmapPhase: "elimination" })).fodmapRestricted).toHaveLength(6);
    expect(
      resolveRules(profile({ diets: ["fodmap"], fodmapPhase: "personalization", fodmapTriggers: ["lactose"] })).fodmapRestricted,
    ).toEqual(["lactose"]);
  });

  it("drops limits for meal slots the user doesn't plan", () => {
    const rules = resolveRules(profile({ diets: ["diabetic"], slots: ["breakfast", "lunch", "dinner"] }));
    expect(rules.limits.some((l) => l.scope === "snack")).toBe(false);
  });
});

describe("energyTarget", () => {
  it("clamps CKD energy to 25–35 kcal/kg", () => {
    const tiny = profile({ diets: ["ckd"], ckdStage: "4", weightKg: 90, heightCm: 150, age: 80, activity: "sedentary" });
    expect(energyTarget(tiny)).toBeGreaterThanOrEqual(25 * 90 - 25);
  });
});
