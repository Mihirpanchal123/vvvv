import {
  FODMAP_GROUPS,
  type CkdStage,
  type FodmapGroup,
  type Limit,
  type Slot,
  type UserProfile,
} from "@/lib/domain/types";

/**
 * Diet rule profiles. Each returns the limits that diet implies for a given user.
 * Defaults are drawn from widely published guidance (ADA Standards of Care, KDOQI 2020 nutrition guideline,
 * Monash low-FODMAP protocol) and are intentionally editable — the user's care team has the final say.
 */

const MAIN_MEALS: Slot[] = ["breakfast", "lunch", "dinner"];

export interface DietRuleOutput {
  limits: Limit[];
  notes: string[];
  fodmapRestricted?: FodmapGroup[];
  avoidPhosphateAdditives?: boolean;
  preferLowGlycemic?: boolean;
}

export function generalRules(p: UserProfile, kcal: number): DietRuleOutput {
  const limits: Limit[] = [
    { scope: "day", nutrient: "sodium", op: "max", value: 2300, hard: false, source: "general", reason: "Dietary Guidelines: < 2,300 mg sodium/day" },
    { scope: "day", nutrient: "satFat", op: "max", value: Math.round((kcal * 0.1) / 9), hard: false, source: "general", reason: "Saturated fat < 10% of energy" },
    { scope: "day", nutrient: "addedSugar", op: "max", value: Math.round((kcal * 0.1) / 4), hard: false, source: "general", reason: "Added sugar < 10% of energy" },
  ];
  // CKD sets its own protein range; the general RDA floor would contradict a protein-restricted diet.
  if (!p.diets.includes("ckd")) {
    limits.push({ scope: "day", nutrient: "protein", op: "min", value: Math.round(0.8 * p.weightKg), hard: false, source: "general", reason: "RDA 0.8 g protein per kg" });
  }
  return { limits, notes: [] };
}

export function diabeticRules(p: UserProfile, kcal: number): DietRuleOutput {
  const limits: Limit[] = [];
  for (const slot of MAIN_MEALS) {
    limits.push(
      { scope: slot, nutrient: "carb", op: "min", value: 30, hard: true, source: "diabetic", reason: "Consistent carbohydrate: 30–60 g per meal" },
      { scope: slot, nutrient: "carb", op: "max", value: 60, hard: true, source: "diabetic", reason: "Consistent carbohydrate: 30–60 g per meal" },
    );
  }
  limits.push(
    { scope: "snack", nutrient: "carb", op: "min", value: 10, hard: false, source: "diabetic", reason: "Snacks 10–30 g carbohydrate" },
    { scope: "snack", nutrient: "carb", op: "max", value: 30, hard: true, source: "diabetic", reason: "Snacks 10–30 g carbohydrate" },
    { scope: "day", nutrient: "fiber", op: "min", value: 25, hard: false, source: "diabetic", reason: "Fibre ≥ 25 g/day improves glycaemic control" },
    { scope: "day", nutrient: "addedSugar", op: "max", value: 25, hard: true, source: "diabetic", reason: "Limit added sugar to ≤ 25 g/day" },
    { scope: "day", nutrient: "satFat", op: "max", value: Math.round((kcal * 0.1) / 9), hard: false, source: "diabetic", reason: "Saturated fat < 10% of energy for heart health" },
  );
  return {
    limits,
    notes: ["Carbohydrate is kept within the same 30–60 g band at each meal to make blood glucose more predictable."],
    preferLowGlycemic: true,
  };
}

interface CkdDefaults {
  potassiumMax: number;
  phosphorusMax: number;
  dialysis: boolean;
  fluidMax?: number;
}

const CKD_DEFAULTS: Record<CkdStage, CkdDefaults> = {
  "3a": { potassiumMax: 3500, phosphorusMax: 1000, dialysis: false },
  "3b": { potassiumMax: 3000, phosphorusMax: 1000, dialysis: false },
  "4": { potassiumMax: 2500, phosphorusMax: 900, dialysis: false },
  "5": { potassiumMax: 2500, phosphorusMax: 900, dialysis: false },
  hemodialysis: { potassiumMax: 2500, phosphorusMax: 900, dialysis: true, fluidMax: 1000 },
  peritoneal: { potassiumMax: 3500, phosphorusMax: 900, dialysis: true, fluidMax: 1500 },
};

export const CKD_STAGE_LABELS: Record<CkdStage, string> = {
  "3a": "Stage 3a (eGFR 45–59)",
  "3b": "Stage 3b (eGFR 30–44)",
  "4": "Stage 4 (eGFR 15–29)",
  "5": "Stage 5, not on dialysis (eGFR < 15)",
  hemodialysis: "On hemodialysis",
  peritoneal: "On peritoneal dialysis",
};

function stageFromEgfr(egfr: number): CkdStage | null {
  if (egfr >= 60) return null;
  if (egfr >= 45) return "3a";
  if (egfr >= 30) return "3b";
  if (egfr >= 15) return "4";
  return "5";
}

export function ckdRules(p: UserProfile): DietRuleOutput {
  const stage = p.ckdStage ?? "3b";
  const d = CKD_DEFAULTS[stage];
  const w = p.weightKg;
  const diabetic = p.diets.includes("diabetic");
  const notes: string[] = [];
  const limits: Limit[] = [
    { scope: "day", nutrient: "sodium", op: "max", value: 2300, hard: true, source: "ckd", reason: "KDOQI 2020: sodium < 2.3 g/day" },
    { scope: "day", nutrient: "potassium", op: "max", value: d.potassiumMax, hard: true, source: "ckd", reason: `Default potassium budget for ${CKD_STAGE_LABELS[stage]}` },
    { scope: "day", nutrient: "phosphorus", op: "max", value: d.phosphorusMax, hard: true, source: "ckd", reason: `Default phosphorus budget for ${CKD_STAGE_LABELS[stage]}` },
  ];

  if (d.dialysis) {
    limits.push(
      { scope: "day", nutrient: "protein", op: "min", value: Math.round(1.0 * w), hard: true, source: "ckd", reason: "Dialysis: 1.0–1.2 g protein/kg to replace losses" },
      { scope: "day", nutrient: "protein", op: "max", value: Math.round(1.2 * w), hard: false, source: "ckd", reason: "Dialysis: 1.0–1.2 g protein/kg" },
      { scope: "day", nutrient: "fluid", op: "max", value: d.fluidMax!, hard: true, source: "ckd", reason: "Fluid budget for food (soups, milk, sauces); drinks count separately" },
    );
    notes.push("Fluid shown is only what's in the food. Count drinks separately against your total fluid allowance.");
  } else {
    const minPerKg = diabetic ? 0.6 : 0.55;
    limits.push(
      { scope: "day", nutrient: "protein", op: "min", value: Math.round(minPerKg * w), hard: false, source: "ckd", reason: `KDOQI 2020: ${minPerKg}–0.8 g protein/kg (not on dialysis)` },
      { scope: "day", nutrient: "protein", op: "max", value: Math.round(0.8 * w), hard: true, source: "ckd", reason: "Protein ≤ 0.8 g/kg to slow CKD progression" },
    );
  }

  const labs = p.labs ?? {};
  if (labs.potassium !== undefined && labs.potassium > 5.0) {
    limits.push({ scope: "day", nutrient: "potassium", op: "max", value: 2000, hard: true, source: "labs", reason: `Serum potassium ${labs.potassium} mmol/L is above 5.0` });
    notes.push("Your potassium lab is high — the plan uses a 2,000 mg/day potassium budget. Confirm with your care team.");
  } else if (labs.potassium !== undefined && labs.potassium < 3.5) {
    notes.push("Your potassium lab is low — ask your care team whether the potassium limit can be relaxed.");
  }
  if (labs.phosphorus !== undefined && labs.phosphorus > 4.5) {
    limits.push({ scope: "day", nutrient: "phosphorus", op: "max", value: 800, hard: true, source: "labs", reason: `Serum phosphorus ${labs.phosphorus} mg/dL is above 4.5` });
  }
  if (labs.egfr !== undefined && !d.dialysis) {
    const implied = stageFromEgfr(labs.egfr);
    if (implied && implied !== stage) {
      notes.push(`Your eGFR of ${labs.egfr} usually corresponds to ${CKD_STAGE_LABELS[implied]}, but you selected ${CKD_STAGE_LABELS[stage]}. Check with your care team.`);
    }
  }

  notes.push("Recipes with processed foods containing phosphate additives are excluded; check labels for 'phos' ingredients.");
  return { limits, notes, avoidPhosphateAdditives: true };
}

export function fodmapRules(p: UserProfile): DietRuleOutput {
  const phase = p.fodmapPhase ?? "elimination";
  if (phase === "personalization") {
    const triggers = p.fodmapTriggers ?? [];
    return {
      limits: [],
      fodmapRestricted: triggers,
      notes: [
        triggers.length
          ? `Personalisation phase: only your trigger groups are restricted.`
          : "Personalisation phase with no trigger groups recorded — no FODMAP restrictions applied.",
      ],
    };
  }
  return {
    limits: [],
    fodmapRestricted: [...FODMAP_GROUPS],
    notes: [
      phase === "elimination"
        ? "Elimination phase: every meal stays under low-FODMAP thresholds, with FODMAPs from all ingredients added together."
        : "Reintroduction phase: your everyday meals stay low-FODMAP while you test one group at a time.",
    ],
  };
}
