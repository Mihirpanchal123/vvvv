import solver, { type Model, type SolveResult } from "javascript-lp-solver";
import { NUTRIENT_META, type DayPlan, type PlannedMeal, type ResolvedRules, type Slot, type WeekPlan } from "@/lib/domain/types";
import { buildCandidates, makeOption, type CandidateOption, type CandidateSet } from "./candidates";
import { evaluateDay } from "./evaluate";
import { getRecipeInfo } from "./recipe-info";

export interface LockedMeal {
  day: number;
  slot: Slot;
  recipeId: string;
  portion: number;
}

export interface PlanOptions {
  days?: number;
  seed?: number;
  locked?: LockedMeal[];
  favorites?: string[];
  /** Per-day solver timeout. */
  timeoutMs?: number;
}

/** Objective weights. Costs are in arbitrary "penalty points"; lower is better. */
export const WEIGHTS = {
  /** Penalty for missing the energy target by 10%. */
  energyPer10Pct: 25,
  /** Penalty per 100% violation of a hard (medical) limit — effectively forbidden. */
  hardLimit: 10_000,
  /** Penalty per 100% violation of a soft target. */
  softLimit: 25,
  portionDeviation: 4,
  repeatInWeek: 12,
  sharedIngredientBonus: 1,
  maxSharedBonus: 3,
  favoriteBonus: 4,
  glycemicLoadPerUnit: 0.3,
  noise: 3,
};

/** Warn when the plan averages below this share of the energy target. */
export const ENERGY_SHORTFALL_WARN = 0.85;

interface WeekContext {
  usage: Map<string, number>;
  groceries: Set<string>;
  favorites: Set<string>;
  rng: () => number;
}

/** Small deterministic PRNG so "regenerate" gives a different but reproducible plan. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function optionCost(opt: CandidateOption, rules: ResolvedRules, ctx: WeekContext): number {
  let cost = WEIGHTS.portionDeviation * Math.abs(opt.portion - 1);
  cost += WEIGHTS.repeatInWeek * (ctx.usage.get(opt.recipeId) ?? 0);
  const shared = opt.info.keyIngredients.filter((id) => ctx.groceries.has(id)).length;
  cost -= WEIGHTS.sharedIngredientBonus * Math.min(shared, WEIGHTS.maxSharedBonus);
  if (ctx.favorites.has(opt.recipeId)) cost -= WEIGHTS.favoriteBonus;
  if (rules.preferLowGlycemic) cost += WEIGHTS.glycemicLoadPerUnit * opt.info.glycemicLoad * opt.portion;
  cost += WEIGHTS.noise * ctx.rng();
  return cost;
}

function limitApplies(scope: string, slot: Slot) {
  return scope === "day" || scope === slot;
}

/** First (fast) solve attempt: the cheapest recipes per slot plus the most energy-efficient ones. */
export const SHORTLIST_BY_COST = 10;
const COST_OFFSET = 50;
export const SHORTLIST_BY_ENERGY = 6;

/**
 * kcal per unit of the tightest hard daily budget the recipe uses (e.g. per % of the phosphorus allowance).
 * On renal diets these recipes are what let a day reach its energy target, so they must survive pruning.
 */
function energyEfficiency(o: CandidateOption, rules: ResolvedRules): number {
  let worst = 0;
  for (const l of rules.limits) {
    if (l.hard && l.op === "max" && l.scope === "day" && l.nutrient !== "kcal") worst = Math.max(worst, o.nutrients[l.nutrient] / l.value);
  }
  return o.nutrients.kcal / Math.max(worst, 1e-3);
}

/** Indices of the shortlisted options (all portions of each shortlisted recipe are kept). */
function shortlist(options: CandidateOption[], costs: number[], slots: Slot[], rules: ResolvedRules): number[] {
  const keep: number[] = [];
  for (const slot of slots) {
    const cost = new Map<string, number>();
    const eff = new Map<string, number>();
    options.forEach((o, i) => {
      if (o.slot !== slot) return;
      cost.set(o.recipeId, Math.min(cost.get(o.recipeId) ?? Infinity, costs[i]));
      eff.set(o.recipeId, Math.max(eff.get(o.recipeId) ?? 0, energyEfficiency(o, rules)));
    });
    const byCost = [...cost].sort((a, b) => a[1] - b[1]).slice(0, SHORTLIST_BY_COST).map(([id]) => id);
    const rest = [...eff].filter(([id]) => !byCost.includes(id)).sort((a, b) => b[1] - a[1]).slice(0, SHORTLIST_BY_ENERGY);
    const top = new Set([...byCost, ...rest.map(([id]) => id)]);
    options.forEach((o, i) => {
      if (o.slot === slot && top.has(o.recipeId)) keep.push(i);
    });
  }
  return keep;
}

/**
 * Pick one option per slot for a single day using a 0/1 integer program. Attempts, in order:
 *  1. shortlist of the most promising recipes, hard limits as true constraints (fast);
 *  2. every candidate, hard limits as true constraints;
 *  3. every candidate, "elastic" limits — violations allowed but heavily penalised — so a genuinely
 *     infeasible day still gets the closest plan and the evaluator can say exactly which limit didn't fit.
 * Pruning and timeouts therefore never cause a hard-limit violation that a feasible day could avoid.
 */
export function solveDay(
  rules: ResolvedRules,
  optionsBySlot: Partial<Record<Slot, CandidateOption[]>>,
  ctx: WeekContext,
  timeoutMs = 1500,
): CandidateOption[] {
  const slots = rules.slots.filter((s) => optionsBySlot[s]?.length);
  const options = slots.flatMap((s) => optionsBySlot[s]!);
  if (!options.length) return [];
  // Costs consume the seeded RNG, so compute them once and share them between all attempts.
  const costs = options.map((o) => optionCost(o, rules, ctx));
  const all = options.map((_, i) => i);
  const short = shortlist(options, costs, slots, rules);

  const attempts: [number[], boolean][] = [
    ...(short.length < all.length ? [[short, true] as [number[], boolean]] : []),
    [all, true],
    [all, false],
  ];
  for (const [idx, strict] of attempts) {
    const chosen = solveModel(rules, slots, idx.map((i) => options[i]), idx.map((i) => costs[i]), strict, timeoutMs);
    if (chosen) return chosen;
  }
  return greedyDay(rules, slots, optionsBySlot, ctx);
}

function solveModel(
  rules: ResolvedRules,
  slots: Slot[],
  options: CandidateOption[],
  costs: number[],
  strict: boolean,
  timeoutMs: number,
): CandidateOption[] | null {
  const model: Model = {
    optimize: "cost",
    opType: "min",
    constraints: {},
    variables: {},
    binaries: {},
    options: { timeout: timeoutMs, tolerance: 0.03 },
  };

  for (const s of slots) model.constraints[`slot_${s}`] = { equal: 1 };

  // A recipe should appear at most once per day even if it fits several slots.
  const recipeSlots = new Map<string, Set<Slot>>();
  options.forEach((o) => recipeSlots.set(o.recipeId, (recipeSlots.get(o.recipeId) ?? new Set()).add(o.slot)));
  const multiSlot = [...recipeSlots].filter(([, s]) => s.size > 1).map(([id]) => id);
  multiSlot.forEach((id, i) => (model.constraints[`once_${i}`] = { max: 1 }));

  model.constraints.kcal = { equal: rules.energyTarget };
  const energyWeight = (WEIGHTS.energyPer10Pct * 10) / rules.energyTarget;
  model.variables.e_under = { kcal: 1, cost: energyWeight };
  model.variables.e_over = { kcal: -1, cost: energyWeight };

  const activeLimits = rules.limits.filter((l) => slots.some((s) => limitApplies(l.scope, s)));
  activeLimits.forEach((l, j) => {
    const name = `L${j}`;
    model.constraints[name] = l.op === "max" ? { max: l.value } : { min: l.value };
    if (strict && l.hard) return; // no slack: the limit cannot be broken
    const weight = (l.hard ? WEIGHTS.hardLimit : WEIGHTS.softLimit) / Math.max(l.value, 1);
    model.variables[`s${j}`] = { [name]: l.op === "max" ? -1 : 1, cost: weight };
  });

  options.forEach((o, i) => {
    const v: Record<string, number> = {
      [`slot_${o.slot}`]: 1,
      kcal: o.nutrients.kcal,
      // Constant offset keeps the objective positive so the relative-gap tolerance is meaningful;
      // every slot picks exactly one option, so it never changes which plan is optimal.
      cost: costs[i] + COST_OFFSET,
    };
    const once = multiSlot.indexOf(o.recipeId);
    if (once >= 0) v[`once_${once}`] = 1;
    activeLimits.forEach((l, j) => {
      if (limitApplies(l.scope, o.slot)) v[`L${j}`] = o.nutrients[l.nutrient];
    });
    model.variables[`x${i}`] = v;
    model.binaries![`x${i}`] = 1;
  });

  const result = solver.Solve(model) as SolveResult;
  const chosen = options.filter((_, i) => ((result[`x${i}`] as number | undefined) ?? 0) > 0.5);
  const complete = result.feasible && slots.every((s) => chosen.filter((c) => c.slot === s).length === 1);
  return complete ? chosen : null;
}

/** Fallback: choose slot by slot, avoiding options that push any hard daily maximum over budget. */
function greedyDay(
  rules: ResolvedRules,
  slots: Slot[],
  optionsBySlot: Partial<Record<Slot, CandidateOption[]>>,
  ctx: WeekContext,
): CandidateOption[] {
  const picked: CandidateOption[] = [];
  const running: Record<string, number> = {};
  const dayMax = rules.limits.filter((l) => l.scope === "day" && l.op === "max" && l.hard);
  const share = 1 / slots.length;
  for (const s of slots) {
    let best: CandidateOption | null = null;
    let bestScore = Infinity;
    for (const o of optionsBySlot[s]!) {
      if (picked.some((p) => p.recipeId === o.recipeId)) continue;
      let score = optionCost(o, rules, ctx) + Math.abs(o.nutrients.kcal - rules.energyTarget * share) / 20;
      for (const l of dayMax) {
        const after = (running[l.nutrient] ?? 0) + o.nutrients[l.nutrient];
        if (after > l.value) score += WEIGHTS.hardLimit * ((after - l.value) / l.value);
      }
      if (score < bestScore) {
        bestScore = score;
        best = o;
      }
    }
    if (best) {
      picked.push(best);
      for (const l of dayMax) running[l.nutrient] = (running[l.nutrient] ?? 0) + best.nutrients[l.nutrient];
    }
  }
  return picked;
}

function describeViolations(day: DayPlan): string {
  return day.checks
    .filter((c) => c.limit.hard && !c.ok)
    .map((c) => {
      const meta = NUTRIENT_META[c.limit.nutrient];
      const where = c.limit.scope === "day" ? "" : ` at ${c.limit.scope}`;
      return `${meta.label.toLowerCase()}${where} ${Math.round(c.actual)} ${meta.unit} vs ${c.limit.op} ${c.limit.value}`;
    })
    .join("; ");
}

export function optionsForDay(
  rules: ResolvedRules,
  cands: CandidateSet,
  locked: LockedMeal[],
): Partial<Record<Slot, CandidateOption[]>> {
  const out: Partial<Record<Slot, CandidateOption[]>> = {};
  for (const slot of rules.slots) {
    const lock = locked.find((l) => l.slot === slot);
    out[slot] = lock ? [makeOption(getRecipeInfo(lock.recipeId), slot, lock.portion)] : cands.bySlot[slot] ?? [];
  }
  return out;
}

export function generateWeekPlan(rules: ResolvedRules, opts: PlanOptions = {}): WeekPlan {
  const days = opts.days ?? 7;
  const seed = opts.seed ?? Math.floor(Math.random() * 2 ** 31);
  const ctx: WeekContext = {
    usage: new Map(),
    groceries: new Set(),
    favorites: new Set(opts.favorites ?? []),
    rng: mulberry32(seed),
  };
  const cands = buildCandidates(rules);
  const warnings: string[] = [];
  for (const slot of rules.slots) {
    if (!cands.bySlot[slot]?.length) warnings.push(`No recipes fit your ${slot} rules — that slot was left empty.`);
  }

  // Count locked meals first so the rest of the week varies around them.
  for (const l of opts.locked ?? []) ctx.usage.set(l.recipeId, (ctx.usage.get(l.recipeId) ?? 0) + 1);

  const plans: DayPlan[] = [];
  for (let d = 0; d < days; d++) {
    const locked = (opts.locked ?? []).filter((l) => l.day === d);
    const chosen = solveDay(rules, optionsForDay(rules, cands, locked), ctx, opts.timeoutMs);
    const meals: PlannedMeal[] = rules.slots
      .map((slot) => chosen.find((c) => c.slot === slot))
      .filter((c): c is CandidateOption => !!c)
      .map((c) => ({
        slot: c.slot,
        recipeId: c.recipeId,
        portion: c.portion,
        locked: locked.some((l) => l.slot === c.slot) || undefined,
      }));
    for (const c of chosen) {
      if (!locked.some((l) => l.slot === c.slot)) ctx.usage.set(c.recipeId, (ctx.usage.get(c.recipeId) ?? 0) + 1);
      c.info.keyIngredients.forEach((id) => ctx.groceries.add(id));
    }
    const plan = evaluateDay(d, meals, rules);
    if (plan.hasHardViolation) warnings.push(`Day ${d + 1}: closest possible plan still exceeds a limit (${describeViolations(plan)}).`);
    plans.push(plan);
  }

  const avgKcal = plans.reduce((s, p) => s + p.totals.kcal, 0) / Math.max(plans.length, 1);
  if (plans.length && avgKcal < rules.energyTarget * ENERGY_SHORTFALL_WARN) {
    warnings.push(
      `This plan averages ${Math.round(avgKcal).toLocaleString("en-US")} kcal/day against a ${rules.energyTarget.toLocaleString("en-US")} kcal target — your limits leave little room for extra food. ` +
        "Ask your dietitian about adding energy from unsalted fats (olive oil, unsalted butter) or a renal-appropriate supplement.",
    );
  }

  return {
    id: globalThis.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    seed,
    days: plans,
    rulesSnapshot: rules,
    warnings,
  };
}
