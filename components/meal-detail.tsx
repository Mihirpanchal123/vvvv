"use client";

import { INGREDIENT_MAP } from "@/lib/data/ingredients";
import { NUTRIENT_META, type DayPlan, type PlannedMeal, type ResolvedRules } from "@/lib/domain/types";
import { explainMeal } from "@/lib/engine/explain";
import { getRecipeInfo } from "@/lib/engine/recipe-info";
import { fmtAmount, gramsLabel } from "./nutrient-meter";
import { Badge } from "./ui";

/** Recipe + "why this fits" breakdown for one planned meal. */
export function MealDetail({ rules, day, meal }: { rules: ResolvedRules; day: DayPlan; meal: PlannedMeal }) {
  const info = getRecipeInfo(meal.recipeId);
  const ex = explainMeal(rules, day, meal);
  const r = info.recipe;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge tone="brand" className="capitalize">{meal.slot}</Badge>
        <Badge>{r.prepMin} min</Badge>
        {meal.portion !== 1 && <Badge tone="warn">{meal.portion}× portion</Badge>}
        {r.tags?.map((t) => <Badge key={t}>{t}</Badge>)}
      </div>

      <section aria-labelledby="fit-h">
        <h3 id="fit-h" className="mb-2 font-semibold">How it fits your day</h3>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs text-muted">
              <tr>
                <th className="px-2 py-2 font-medium sm:px-3">Nutrient</th>
                <th className="px-2 py-2 font-medium sm:px-3">This meal</th>
                <th className="px-2 py-2 font-medium sm:px-3">Day total</th>
                <th className="px-2 py-2 font-medium sm:px-3">Daily limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line tabular-nums">
              {ex.rows.map((row) => {
                const over = row.dayMax !== undefined && row.dayTotal > row.dayMax + 1e-6;
                return (
                  <tr key={row.nutrient}>
                    <td className="px-2 py-2 sm:px-3">{NUTRIENT_META[row.nutrient].label}</td>
                    <td className="px-2 py-2 sm:px-3">
                      <span className="whitespace-nowrap">{fmtAmount(row.amount, row.nutrient)}</span>
                      {row.shareOfMax !== undefined && (
                        <span className="block text-xs text-muted sm:inline sm:text-sm"> ({Math.round(row.shareOfMax * 100)}%)</span>
                      )}
                    </td>
                    <td className={`whitespace-nowrap px-2 py-2 sm:px-3 ${over ? "font-semibold text-danger" : ""}`}>{fmtAmount(row.dayTotal, row.nutrient)}</td>
                    <td className="px-2 py-2 text-muted sm:px-3">
                      {row.nutrient === "kcal"
                        ? `target ${rules.energyTarget.toLocaleString("en-US")}`
                        : [row.dayMin !== undefined && `≥ ${row.dayMin}`, row.dayMax !== undefined && `≤ ${row.dayMax.toLocaleString("en-US")}`]
                            .filter(Boolean)
                            .join(", ") || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {ex.slotChecks.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-xs">
            {ex.slotChecks.map((c) => (
              <li key={`${c.limit.nutrient}-${c.limit.op}`}>
                <Badge tone={c.ok ? "ok" : c.limit.hard ? "danger" : "warn"}>
                  {NUTRIENT_META[c.limit.nutrient].label} {fmtAmount(c.actual, c.limit.nutrient)} ({c.limit.op === "max" ? "≤" : "≥"} {c.limit.value} at {meal.slot})
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {ex.fodmap.length > 0 && (
        <section aria-labelledby="fodmap-h">
          <h3 id="fodmap-h" className="mb-2 font-semibold">FODMAP load</h3>
          <p className="mb-2 text-xs text-muted">Share of the low-FODMAP threshold, summed across all ingredients in this meal.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ex.fodmap.map((f) => (
              <div key={f.group} className="rounded-lg bg-surface-2 px-3 py-2 text-xs">
                <span className="block text-muted">{f.label}</span>
                <span className={`font-semibold ${f.percentOfThreshold > 100 ? "text-danger" : f.percentOfThreshold > 75 ? "text-warn" : "text-ok"}`}>
                  {f.percentOfThreshold}%
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {ex.flags.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {ex.flags.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      <section aria-labelledby="ing-h">
        <h3 id="ing-h" className="mb-2 font-semibold">
          Ingredients <span className="font-normal text-muted">(1 person{meal.portion !== 1 ? `, ${meal.portion}× portion` : ""})</span>
        </h3>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {r.ingredients.map((line) => (
            <li key={line.id} className="flex justify-between gap-3 border-b border-line py-1">
              <span>
                {INGREDIENT_MAP.get(line.id)?.name}
                {line.leached && <span className="text-muted"> (leached)</span>}
              </span>
              <span className="tabular-nums text-muted">{gramsLabel((line.g / r.servings) * meal.portion)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="steps-h">
        <h3 id="steps-h" className="mb-2 font-semibold">Method</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          {r.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
