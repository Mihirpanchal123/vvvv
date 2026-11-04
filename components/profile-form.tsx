"use client";

import { useId, useMemo, useState } from "react";
import { INGREDIENTS } from "@/lib/data/ingredients";
import {
  ALLERGENS,
  AISLES,
  AISLE_LABELS,
  CKD_STAGES,
  FODMAP_GROUPS,
  FODMAP_LABELS,
  NUTRIENT_META,
  SLOTS,
  type Allergen,
  type DietId,
  type FodmapPhase,
  type Limit,
  type ResolvedRules,
  type UserProfile,
} from "@/lib/domain/types";
import { CKD_STAGE_LABELS } from "@/lib/rules/profiles";
import { Badge, ChoiceChip, Field, Input, Notice, Select } from "./ui";

export const DEFAULT_PROFILE: UserProfile = {
  sex: "female",
  age: 50,
  heightCm: 165,
  weightKg: 70,
  activity: "light",
  diets: [],
  allergies: [],
  dislikedIngredients: [],
  householdSize: 1,
  slots: ["breakfast", "lunch", "dinner", "snack"],
};

type Patch = (p: Partial<UserProfile>) => void;

const DIET_INFO: Record<DietId, { label: string; description: string }> = {
  diabetic: { label: "Diabetes (type 1, type 2 or prediabetes)", description: "Consistent carbs per meal, fibre, limited added sugar" },
  ckd: { label: "Chronic kidney disease", description: "Sodium, potassium, phosphorus and protein limits" },
  fodmap: { label: "Low-FODMAP (IBS)", description: "Portion-aware FODMAP thresholds by phase" },
};

const PHASE_INFO: Record<FodmapPhase, { label: string; description: string }> = {
  elimination: { label: "Elimination", description: "2–6 weeks, all FODMAP groups kept low" },
  reintroduction: { label: "Reintroduction", description: "Testing one group at a time" },
  personalization: { label: "Personalisation", description: "Only your trigger groups are limited" },
};

const ALLERGEN_LABELS: Record<Allergen, string> = {
  dairy: "Dairy", egg: "Egg", fish: "Fish", shellfish: "Shellfish", peanut: "Peanut",
  treenut: "Tree nuts", soy: "Soy", wheat: "Wheat / gluten", sesame: "Sesame",
};

export function DietSection({ profile, onChange }: { profile: UserProfile; onChange: Patch }) {
  const toggle = (d: DietId, on: boolean) =>
    onChange({ diets: on ? [...profile.diets, d] : profile.diets.filter((x) => x !== d) });
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Which diets do you need to follow? Pick all that apply.</legend>
        {(Object.keys(DIET_INFO) as DietId[]).map((d) => (
          <ChoiceChip key={d} checked={profile.diets.includes(d)} onChange={(on) => toggle(d, on)} {...DIET_INFO[d]} />
        ))}
      </fieldset>

      {profile.diets.includes("ckd") && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">CKD stage</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {CKD_STAGES.map((s) => (
              <ChoiceChip
                key={s}
                type="radio"
                name="ckd-stage"
                checked={(profile.ckdStage ?? "3b") === s}
                onChange={() => onChange({ ckdStage: s })}
                label={CKD_STAGE_LABELS[s]}
              />
            ))}
          </div>
          <p className="text-xs text-muted">Not sure? Your eGFR is on your blood test results; you can enter it in the next steps.</p>
        </fieldset>
      )}

      {profile.diets.includes("fodmap") && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">FODMAP phase</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(PHASE_INFO) as FodmapPhase[]).map((p) => (
              <ChoiceChip
                key={p}
                type="radio"
                name="fodmap-phase"
                checked={(profile.fodmapPhase ?? "elimination") === p}
                onChange={() => onChange({ fodmapPhase: p })}
                {...PHASE_INFO[p]}
              />
            ))}
          </div>
          {profile.fodmapPhase === "personalization" && (
            <div className="mt-2">
              <p className="mb-2 text-sm">Which groups trigger your symptoms?</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {FODMAP_GROUPS.map((g) => (
                  <ChoiceChip
                    key={g}
                    label={FODMAP_LABELS[g]}
                    checked={profile.fodmapTriggers?.includes(g) ?? false}
                    onChange={(on) =>
                      onChange({
                        fodmapTriggers: on
                          ? [...(profile.fodmapTriggers ?? []), g]
                          : (profile.fodmapTriggers ?? []).filter((x) => x !== g),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </fieldset>
      )}
    </div>
  );
}

function NumberField({
  label, value, onChange, min, max, step = 1, unit, hint,
}: {
  label: string; value: number | undefined; onChange: (v: number | undefined) => void;
  min: number; max: number; step?: number; unit?: string; hint?: string;
}) {
  const id = useId();
  return (
    <Field label={unit ? `${label} (${unit})` : label} htmlFor={id} hint={hint}>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </Field>
  );
}

export function BodySection({ profile, onChange }: { profile: UserProfile; onChange: Patch }) {
  const sexId = useId();
  const actId = useId();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Sex (for energy estimate)" htmlFor={sexId}>
        <Select id={sexId} value={profile.sex} onChange={(e) => onChange({ sex: e.target.value as UserProfile["sex"] })}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </Select>
      </Field>
      <NumberField label="Age" min={18} max={110} value={profile.age} onChange={(v) => onChange({ age: v ?? 0 })} />
      <NumberField label="Height" unit="cm" min={120} max={230} value={profile.heightCm} onChange={(v) => onChange({ heightCm: v ?? 0 })} />
      <NumberField
        label="Weight" unit="kg" min={30} max={300} step={0.5} value={profile.weightKg}
        onChange={(v) => onChange({ weightKg: v ?? 0 })}
        hint={profile.diets.includes("ckd") ? "Use your dry weight if you're on dialysis — protein targets are per kg." : undefined}
      />
      <Field label="Activity level" htmlFor={actId}>
        <Select id={actId} value={profile.activity} onChange={(e) => onChange({ activity: e.target.value as UserProfile["activity"] })}>
          <option value="sedentary">Mostly sitting</option>
          <option value="light">Lightly active (walks, light chores)</option>
          <option value="moderate">Moderately active (exercise 3–5×/week)</option>
          <option value="active">Very active</option>
        </Select>
      </Field>
    </div>
  );
}

export function FoodSection({ profile, onChange }: { profile: UserProfile; onChange: Patch }) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INGREDIENTS.filter((i) => !i.pantryStaple || ["garlic", "ginger"].includes(i.id)).filter(
      (i) => !q || i.name.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Allergies or intolerances</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ALLERGENS.map((a) => (
            <ChoiceChip
              key={a}
              label={ALLERGEN_LABELS[a]}
              checked={profile.allergies.includes(a)}
              onChange={(on) => onChange({ allergies: on ? [...profile.allergies, a] : profile.allergies.filter((x) => x !== a) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Meals to plan each day</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SLOTS.map((s) => (
            <ChoiceChip
              key={s}
              label={s[0].toUpperCase() + s.slice(1)}
              checked={profile.slots.includes(s)}
              onChange={(on) =>
                onChange({ slots: SLOTS.filter((x) => (x === s ? on : profile.slots.includes(x))) })
              }
            />
          ))}
        </div>
      </fieldset>

      <NumberField
        label="People you cook for" min={1} max={12} value={profile.householdSize}
        onChange={(v) => onChange({ householdSize: Math.max(1, v ?? 1) })}
        hint="Scales the grocery list. Portions and nutrients stay per person."
      />

      <div>
        <Field label={`Foods you'd rather avoid (${profile.dislikedIngredients.length} selected)`} htmlFor={searchId}>
          <Input id={searchId} type="search" placeholder="Search ingredients…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Field>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-line p-2">
          {AISLES.map((aisle) => {
            const items = filtered.filter((i) => i.aisle === aisle);
            if (!items.length) return null;
            return (
              <div key={aisle} className="mb-2">
                <p className="px-1 py-1 text-xs font-medium uppercase tracking-wide text-muted">{AISLE_LABELS[aisle]}</p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((i) => {
                    const on = profile.dislikedIngredients.includes(i.id);
                    return (
                      <button
                        type="button"
                        key={i.id}
                        aria-pressed={on}
                        onClick={() =>
                          onChange({
                            dislikedIngredients: on
                              ? profile.dislikedIngredients.filter((x) => x !== i.id)
                              : [...profile.dislikedIngredients, i.id],
                          })
                        }
                        className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-danger bg-danger-soft text-danger line-through" : "border-line hover:bg-surface-2"}`}
                      >
                        {i.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function LabsSection({ profile, onChange }: { profile: UserProfile; onChange: Patch }) {
  const labs = profile.labs ?? {};
  const set = (k: keyof NonNullable<UserProfile["labs"]>, v: number | undefined) => onChange({ labs: { ...labs, [k]: v } });
  const ckd = profile.diets.includes("ckd");
  const diabetic = profile.diets.includes("diabetic");
  if (!ckd && !diabetic) return null;
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Optional. Recent lab results let the plan tighten limits when needed.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {ckd && (
          <>
            <NumberField label="Serum potassium" unit="mmol/L" min={1} max={10} step={0.1} value={labs.potassium} onChange={(v) => set("potassium", v)} hint="Above 5.0 lowers your potassium budget." />
            <NumberField label="Serum phosphorus" unit="mg/dL" min={0.5} max={15} step={0.1} value={labs.phosphorus} onChange={(v) => set("phosphorus", v)} hint="Above 4.5 lowers your phosphorus budget." />
            <NumberField label="eGFR" unit="mL/min/1.73m²" min={1} max={150} value={labs.egfr} onChange={(v) => set("egfr", v)} />
          </>
        )}
        {diabetic && <NumberField label="HbA1c" unit="%" min={3} max={20} step={0.1} value={labs.a1c} onChange={(v) => set("a1c", v)} hint="Kept for your records and the dietitian report." />}
      </div>
    </div>
  );
}

const SOURCE_LABEL: Record<Limit["source"], string> = {
  general: "General guidance", diabetic: "Diabetes", ckd: "Kidney", fodmap: "FODMAP", labs: "Your labs", user: "You", clinician: "Your care team",
};

function fmt(value: number, nutrient: Limit["nutrient"]) {
  return `${value.toLocaleString("en-US")} ${NUTRIENT_META[nutrient].unit}`;
}

/** Read-only summary of resolved limits, grouped by scope, with where each came from. */
export function LimitsSummary({ rules }: { rules: ResolvedRules }) {
  const scopes = ["day", ...rules.slots] as const;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Daily energy target: <strong>{rules.energyTarget.toLocaleString("en-US")} kcal</strong>
      </p>
      {rules.conflicts.map((c) => (
        <Notice key={c} tone="warn">{c}</Notice>
      ))}
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Nutrient</th>
              <th className="px-3 py-2 font-medium">Limit</th>
              <th className="px-3 py-2 font-medium">From</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {scopes.flatMap((scope) =>
              rules.limits
                .filter((l) => l.scope === scope)
                .map((l) => (
                  <tr key={`${l.scope}-${l.nutrient}-${l.op}`}>
                    <td className="px-3 py-2 capitalize text-muted">{scope === "day" ? "Per day" : scope}</td>
                    <td className="px-3 py-2">{NUTRIENT_META[l.nutrient].label}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {l.op === "max" ? "≤ " : "≥ "}
                      {fmt(l.value, l.nutrient)}{" "}
                      {!l.hard && <Badge>target</Badge>}
                    </td>
                    <td className="px-3 py-2 text-muted" title={l.reason}>
                      {SOURCE_LABEL[l.source]}
                    </td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
      {rules.fodmapRestricted.length > 0 && (
        <p className="text-sm">
          FODMAP groups kept low: {rules.fodmapRestricted.map((g) => FODMAP_LABELS[g]).join(", ")}.
        </p>
      )}
      {rules.notes.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {rules.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Problems that prevent planning (shown before the user can continue). */
export function profileProblems(p: UserProfile): string[] {
  const out: string[] = [];
  if (!(p.age >= 18 && p.age <= 110)) out.push("Age must be between 18 and 110.");
  if (!(p.heightCm >= 120 && p.heightCm <= 230)) out.push("Height must be between 120 and 230 cm.");
  if (!(p.weightKg >= 30 && p.weightKg <= 300)) out.push("Weight must be between 30 and 300 kg.");
  if (!p.slots.length) out.push("Choose at least one meal to plan.");
  return out;
}
