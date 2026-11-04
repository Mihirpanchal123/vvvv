import Link from "next/link";
import { RECIPES } from "@/lib/data/recipes";
import type { PlannedMeal } from "@/lib/domain/types";
import { evaluateDay, mealNutrients } from "@/lib/engine/evaluate";
import { getRecipeInfo } from "@/lib/engine/recipe-info";
import { limitsFor, resolveRules } from "@/lib/rules/resolve";

const EXAMPLE_MEALS: PlannedMeal[] = [
  { slot: "breakfast", recipeId: "french-toast-berries", portion: 1 },
  { slot: "lunch", recipeId: "chicken-rice-bowl", portion: 1 },
  { slot: "dinner", recipeId: "pasta-aglio-olio-zucchini", portion: 1 },
  { slot: "snack", recipeId: "rice-cakes-cream-cheese-strawberry", portion: 1 },
];

/** Computed from the real recipe data, so the example can never drift from what the planner shows. */
function exampleDay() {
  const rules = resolveRules({
    sex: "female", age: 60, heightCm: 165, weightKg: 72, activity: "light", diets: ["diabetic", "ckd"], ckdStage: "4",
    allergies: [], dislikedIngredients: [], householdSize: 1, slots: ["breakfast", "lunch", "dinner", "snack"],
  });
  const day = evaluateDay(0, EXAMPLE_MEALS, rules);
  const meals = EXAMPLE_MEALS.map((m) => ({ slot: m.slot, title: getRecipeInfo(m.recipeId).recipe.title, carbs: Math.round(mealNutrients(m).carb) }));
  const meters = (["sodium", "potassium", "phosphorus"] as const).map((n) => {
    const max = limitsFor(rules, "day", n).max!.value;
    return { n, label: n[0].toUpperCase() + n.slice(1), value: Math.round(day.totals[n]), max, ok: day.totals[n] <= max };
  });
  return { meals, meters };
}

const DIETS = [
  {
    title: "Diabetes",
    body: "Consistent 30–60 g carbohydrate at every meal, a fibre target, added-sugar cap and a preference for lower glycaemic load.",
  },
  {
    title: "Chronic kidney disease",
    body: "Sodium, potassium, phosphorus and protein budgets set by CKD stage or dialysis, tightened by your lab results. Phosphate additives are filtered out and potatoes are leached.",
  },
  {
    title: "Low-FODMAP",
    body: "Portion-aware thresholds that add up across every ingredient in a meal, plus guided reintroduction and a personalised phase.",
  },
];

const STEPS = [
  ["Tell us your diet", "Pick one or more diets, your CKD stage or FODMAP phase, allergies and dislikes. Add lab values or limits from your dietitian if you have them."],
  ["Get a week that fits", "An optimiser picks meals and portion sizes that keep every day inside your medical limits, explaining how each meal fits."],
  ["Shop once", "A grocery list sorted by aisle, with diet-specific label tips like “no salt added” or “avoid phos- additives.”"],
];

export default function Home() {
  const example = exampleDay();
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-8 pt-6 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <p className="mb-3 text-sm font-medium text-brand">Meal planning for medical diets</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            A week of meals that respects your limits — not just your calories.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted text-pretty">
            MedPlate builds weekly plans for diabetic, kidney-disease and low-FODMAP diets — including combinations like diabetes
            with CKD — and turns them into a grocery list.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-lg bg-brand px-5 py-3 font-medium text-brand-ink hover:bg-brand-hover">
              Build my plan
            </Link>
            <Link href="/recipes" className="rounded-lg border border-line bg-surface px-5 py-3 font-medium hover:bg-surface-2">
              Browse {RECIPES.length} recipes
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted">Free, no account needed. Sign in later to sync across devices.</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm" aria-label="Example day">
          <p className="text-sm font-medium text-muted">Example · Diabetes + CKD stage 4</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {example.meals.map(({ slot, title, carbs }) => (
              <li key={slot} className="flex items-baseline justify-between gap-3 py-2.5">
                <span>
                  <span className="block text-xs uppercase tracking-wide text-muted">{slot}</span>
                  {title}
                </span>
                <span className="shrink-0 text-xs text-muted">{carbs} g carbs</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            {example.meters.map((m) => (
              <div key={m.n} className={`rounded-lg px-2 py-2 ${m.ok ? "bg-ok-soft" : "bg-danger-soft"}`}>
                <span className={`block font-medium ${m.ok ? "text-ok" : "text-danger"}`}>{m.label}</span>
                <span className="text-muted">
                  {m.value.toLocaleString("en-US")} / {m.max.toLocaleString("en-US")} mg
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="diets-h">
        <h2 id="diets-h" className="text-2xl font-semibold tracking-tight">
          Built for the diet you were actually given
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {DIETS.map((d) => (
            <div key={d.title} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{d.title}</h3>
              <p className="mt-2 text-sm text-muted">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h" className="text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="rounded-xl border border-line bg-surface p-5">
              <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{i + 1}</span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-warn/30 bg-warn-soft p-5 text-sm">
        <h2 className="font-semibold text-warn">Please read</h2>
        <p className="mt-1">
          MedPlate does not diagnose, treat or replace your care team, and it gives no medication or insulin guidance. Default
          limits come from published guidelines (ADA, KDOQI 2020, the Monash low-FODMAP protocol), but your needs may differ —
          use the “set by my dietitian” option to enter the limits you were given.
        </p>
      </section>
    </div>
  );
}
