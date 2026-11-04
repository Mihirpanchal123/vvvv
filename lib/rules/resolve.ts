import {
  NUTRIENT_META,
  type FodmapGroup,
  type Limit,
  type LimitScope,
  type Nutrient,
  type ResolvedRules,
  type UserProfile,
} from "@/lib/domain/types";
import { energyTarget } from "./energy";
import { ckdRules, diabeticRules, fodmapRules, generalRules, type DietRuleOutput } from "./profiles";

const key = (l: Pick<Limit, "scope" | "nutrient" | "op">) => `${l.scope}|${l.nutrient}|${l.op}`;
const stricter = (op: "min" | "max", a: number, b: number) => (op === "max" ? a < b : a > b);

/**
 * Merge limits so that, for each (scope, nutrient, direction):
 *  - the strictest hard limit wins;
 *  - a soft limit is kept only if it is stricter than the hard one (it then acts as a target).
 */
export function mergeLimits(all: Limit[]): Limit[] {
  const hard = new Map<string, Limit>();
  const soft = new Map<string, Limit>();
  for (const l of all) {
    const bucket = l.hard ? hard : soft;
    const cur = bucket.get(key(l));
    if (!cur || stricter(l.op, l.value, cur.value)) bucket.set(key(l), l);
  }
  const out = [...hard.values()];
  for (const [k, s] of soft) {
    const h = hard.get(k);
    if (!h || stricter(s.op, s.value, h.value)) out.push(s);
  }
  return out;
}

function scopeLabel(scope: LimitScope) {
  return scope === "day" ? "per day" : `at ${scope}`;
}

/** Detect min > max contradictions. Upper limits are safety limits, so the lower bound is dropped. */
function settleContradictions(limits: Limit[], conflicts: string[]): Limit[] {
  const byPair = new Map<string, Limit[]>();
  for (const l of limits) {
    const k = `${l.scope}|${l.nutrient}`;
    byPair.set(k, [...(byPair.get(k) ?? []), l]);
  }
  const drop = new Set<Limit>();
  for (const group of byPair.values()) {
    const maxes = group.filter((l) => l.op === "max");
    for (const min of group.filter((l) => l.op === "min")) {
      for (const max of maxes) {
        if (max.value >= min.value || drop.has(max) || drop.has(min)) continue;
        const unit = NUTRIENT_META[min.nutrient].unit;
        const label = NUTRIENT_META[min.nutrient].label.toLowerCase();
        if (min.hard && !max.hard) {
          // A soft ceiling below a medical floor: the floor wins.
          drop.add(max);
          conflicts.push(`Target adjusted: ${label} target of ≤ ${max.value} ${unit} (${max.source}) is below the required minimum of ${min.value} ${unit} ${scopeLabel(min.scope)}; the minimum is kept.`);
        } else {
          drop.add(min);
          conflicts.push(`${min.hard ? "Conflict" : "Target adjusted"}: ${label} minimum ${min.value} ${unit} (${min.source}) is above the ${max.value} ${unit} maximum (${max.source}) ${scopeLabel(min.scope)}. The maximum is kept for safety.`);
        }
      }
    }
  }
  return limits.filter((l) => !drop.has(l));
}

export function resolveRules(profile: UserProfile): ResolvedRules {
  const kcal = energyTarget(profile);
  const outputs: DietRuleOutput[] = [generalRules(profile, kcal)];
  if (profile.diets.includes("diabetic")) outputs.push(diabeticRules(profile, kcal));
  if (profile.diets.includes("ckd")) outputs.push(ckdRules(profile));
  if (profile.diets.includes("fodmap")) outputs.push(fodmapRules(profile));

  const conflicts: string[] = [];
  const notes = outputs.flatMap((o) => o.notes);
  let limits = mergeLimits(outputs.flatMap((o) => o.limits));

  // User / clinician overrides replace every default for that (scope, nutrient, direction).
  for (const o of profile.overrides ?? []) {
    limits = limits.filter((l) => key(l) !== key(o));
    limits.push({
      scope: o.scope, nutrient: o.nutrient, op: o.op, value: o.value, hard: true, source: o.source,
      reason: o.source === "clinician" ? "Set by your care team" : "Set by you",
    });
  }

  limits = settleContradictions(limits, conflicts);
  // Limits for slots the user doesn't plan are irrelevant.
  limits = limits.filter((l) => l.scope === "day" || profile.slots.includes(l.scope));

  const fodmapRestricted = new Set<FodmapGroup>();
  outputs.forEach((o) => o.fodmapRestricted?.forEach((g) => fodmapRestricted.add(g)));

  if (profile.diets.includes("diabetic") && profile.diets.includes("ckd")) {
    notes.push(
      "Diabetes + CKD: many high-fibre staples (beans, whole grains, nuts) are also high in potassium and phosphorus, so the plan leans on lower-potassium carbs and may fall short of the fibre target.",
    );
  }
  if (profile.diets.includes("diabetic") && profile.diets.includes("fodmap")) {
    notes.push("Diabetes + low-FODMAP: fibre comes mainly from oats, chia, quinoa, berries and low-FODMAP vegetables.");
  }

  return {
    energyTarget: kcal,
    limits: sortLimits(limits),
    slots: profile.slots,
    fodmapRestricted: [...fodmapRestricted],
    excludeAllergens: profile.allergies,
    excludeIngredients: profile.dislikedIngredients,
    avoidPhosphateAdditives: outputs.some((o) => o.avoidPhosphateAdditives),
    preferLowGlycemic: outputs.some((o) => o.preferLowGlycemic),
    diets: profile.diets,
    conflicts,
    notes,
  };
}

const SCOPE_ORDER: LimitScope[] = ["day", "breakfast", "lunch", "dinner", "snack"];
const NUTRIENT_ORDER: Nutrient[] = ["kcal", "carb", "protein", "sodium", "potassium", "phosphorus", "fluid", "fiber", "addedSugar", "satFat", "fat"];

function sortLimits(limits: Limit[]): Limit[] {
  return [...limits].sort(
    (a, b) =>
      SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope) ||
      NUTRIENT_ORDER.indexOf(a.nutrient) - NUTRIENT_ORDER.indexOf(b.nutrient) ||
      (a.op === "min" ? -1 : 1),
  );
}

export function limitsFor(rules: ResolvedRules, scope: LimitScope, nutrient: Nutrient) {
  const ls = rules.limits.filter((l) => l.scope === scope && l.nutrient === nutrient);
  return { min: ls.find((l) => l.op === "min"), max: ls.find((l) => l.op === "max") };
}
