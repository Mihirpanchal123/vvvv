"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MealDetail } from "@/components/meal-detail";
import { fmtAmount, NutrientMeter } from "@/components/nutrient-meter";
import { Badge, Button, ButtonLink, Card, Modal, Notice, PageHeader, Spinner, type ModalHandle } from "@/components/ui";
import { dayLabel, dayStatus } from "@/lib/client/plan-utils";
import { cleanProfile, requestPlan, requestSwaps, type SwapChoice } from "@/lib/client/api";
import type { Nutrient, PlannedMeal, ResolvedRules, Slot, WeekPlan } from "@/lib/domain/types";
import { mealNutrients } from "@/lib/engine/evaluate";
import { keyNutrients } from "@/lib/engine/explain";
import { getRecipeInfo } from "@/lib/engine/recipe-info";
import { limitsFor, resolveRules } from "@/lib/rules/resolve";
import { setState, useAppState } from "@/lib/store/app-state";

const DIET_NAMES = { diabetic: "Diabetes", ckd: "Kidney (CKD)", fodmap: "Low-FODMAP" } as const;

function cardNutrients(rules: ResolvedRules): Nutrient[] {
  const list: Nutrient[] = ["kcal"];
  if (rules.diets.includes("diabetic")) list.push("carb");
  else list.push("protein");
  list.push("sodium");
  if (rules.diets.includes("ckd")) list.push("potassium", "phosphorus");
  return list;
}

const SHORT: Partial<Record<Nutrient, string>> = { kcal: "", carb: "carbs", protein: "protein", sodium: "Na", potassium: "K", phosphorus: "P" };

export default function PlanPage() {
  const { state, ready } = useAppState();
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ day: number; slot: Slot } | null>(null);
  const [swap, setSwap] = useState<{ day: number; slot: Slot; options?: SwapChoice[]; error?: string } | null>(null);
  const detailRef = useRef<ModalHandle>(null);
  const swapRef = useRef<ModalHandle>(null);

  const { profile, plan } = state;
  const currentRules = useMemo(() => (profile ? resolveRules(cleanProfile(profile)) : null), [profile]);
  const rules = plan?.rulesSnapshot;
  const stale =
    !!rules && !!currentRules &&
    JSON.stringify([rules.limits, rules.fodmapRestricted, rules.excludeAllergens, rules.excludeIngredients, rules.slots]) !==
      JSON.stringify([currentRules.limits, currentRules.fodmapRestricted, currentRules.excludeAllergens, currentRules.excludeIngredients, currentRules.slots]);

  if (!ready) return <Spinner />;
  if (!profile) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-xl font-semibold">No plan yet</h1>
        <p className="mt-2 text-muted">Tell us about your diet and we'll build your first week.</p>
        <ButtonLink href="/onboarding" className="mt-6">Get started</ButtonLink>
      </Card>
    );
  }

  const updatePlan = (fn: (p: WeekPlan) => WeekPlan) => setState((s) => (s.plan ? { ...s, plan: fn(s.plan) } : s));

  async function regenerate() {
    if (!profile) return;
    setBusy(true);
    setError(null);
    try {
      const locked = (plan?.days ?? []).flatMap((d) =>
        d.meals.filter((m) => m.locked).map((m) => ({ day: d.day, slot: m.slot, recipeId: m.recipeId, portion: m.portion })),
      );
      const next = await requestPlan(profile, { seed: Math.floor(Math.random() * 2 ** 31), locked, favorites: state.favorites });
      setState((s) => ({ ...s, plan: next }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't regenerate the plan.");
    } finally {
      setBusy(false);
    }
  }

  if (!plan || !rules) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-xl font-semibold">Ready when you are</h1>
        <p className="mt-2 text-muted">Your profile is saved. Generate a week of meals that fits your limits.</p>
        <div className="mt-6">{busy ? <Spinner label="Building your week…" /> : <Button onClick={regenerate}>Generate my plan</Button>}</div>
        {error && <div className="mt-4"><Notice tone="danger">{error}</Notice></div>}
      </Card>
    );
  }

  const day = plan.days[Math.min(selected, plan.days.length - 1)];

  function toggleLock(dayIdx: number, slot: Slot) {
    updatePlan((p) => ({
      ...p,
      days: p.days.map((d) =>
        d.day !== dayIdx ? d : { ...d, meals: d.meals.map((m) => (m.slot === slot ? { ...m, locked: !m.locked || undefined } : m)) },
      ),
    }));
  }

  async function openSwap(dayIdx: number, slot: Slot) {
    setSwap({ day: dayIdx, slot });
    swapRef.current?.open();
    try {
      const d = plan!.days[dayIdx];
      const used = plan!.days.flatMap((x) => x.meals.map((m) => m.recipeId));
      const options = await requestSwaps(profile!, dayIdx, d.meals, slot, used);
      setSwap({ day: dayIdx, slot, options });
    } catch (e) {
      setSwap({ day: dayIdx, slot, error: e instanceof Error ? e.message : "Couldn't load alternatives." });
    }
  }

  function applySwap(choice: SwapChoice) {
    if (!swap) return;
    updatePlan((p) => ({
      ...p,
      days: p.days.map((d) => {
        if (d.day !== swap.day) return d;
        const meals = choice.day.meals.map((m) => ({
          ...m,
          locked: m.slot !== swap.slot ? d.meals.find((o) => o.slot === m.slot)?.locked : undefined,
        }));
        return { ...choice.day, meals };
      }),
    }));
    swapRef.current?.close();
  }

  const detailMeal = detail ? plan.days[detail.day]?.meals.find((m) => m.slot === detail.slot) : undefined;
  const isFavorite = detailMeal ? state.favorites.includes(detailMeal.recipeId) : false;

  return (
    <div>
      <PageHeader
        title="Your week"
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            {profile.diets.length ? profile.diets.map((d) => <Badge key={d} tone="brand">{DIET_NAMES[d]}</Badge>) : <Badge>General healthy eating</Badge>}
            <span className="text-sm"><span aria-hidden className="max-sm:hidden">· </span>{rules.energyTarget.toLocaleString("en-US")} kcal/day target</span>
          </span>
        }
        actions={
          <>
            <Button variant="secondary" onClick={regenerate} disabled={busy} title="Locked meals are kept">
              {busy ? "Regenerating…" : "Regenerate week"}
            </Button>
            <ButtonLink href="/grocery">Grocery list</ButtonLink>
          </>
        }
      />

      <div className="mb-6 flex flex-col gap-3">
        {stale && (
          <Notice tone="brand" title="Your settings changed">
            This plan was made with your previous limits.{" "}
            <button className="font-medium text-brand underline" onClick={regenerate} disabled={busy}>
              Regenerate with the new settings
            </button>
          </Notice>
        )}
        {error && <Notice tone="danger">{error}</Notice>}
        {plan.warnings.map((w) => (
          <Notice key={w} tone={w.includes("exceeds") ? "danger" : "warn"}>{w}</Notice>
        ))}
      </div>

      <div role="tablist" aria-label="Days" className="mb-6 grid grid-cols-7 gap-1.5">
        {plan.days.map((d) => {
          const status = dayStatus(d);
          const active = d.day === day.day;
          return (
            <button
              key={d.day}
              role="tab"
              aria-selected={active}
              aria-controls="day-panel"
              onClick={() => setSelected(d.day)}
              className={`rounded-lg border px-1 py-2 text-center text-sm ${active ? "border-brand bg-brand-soft font-semibold text-brand" : "border-line bg-surface hover:bg-surface-2"}`}
            >
              <span className="block">{dayLabel(plan, d.day)}</span>
              <span
                aria-label={status === "ok" ? "all limits met" : status === "warn" ? "some targets missed" : "a limit is exceeded"}
                className={`mx-auto mt-1 block size-1.5 rounded-full ${status === "ok" ? "bg-ok" : status === "warn" ? "bg-warn" : "bg-danger"}`}
              />
            </button>
          );
        })}
      </div>

      <div id="day-panel" role="tabpanel" className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{dayLabel(plan, day.day, "long")}</h2>
          {day.meals.map((meal) => (
            <MealCard
              key={meal.slot}
              meal={meal}
              rules={rules}
              onOpen={() => {
                setDetail({ day: day.day, slot: meal.slot });
                detailRef.current?.open();
              }}
              onSwap={() => openSwap(day.day, meal.slot)}
              onLock={() => toggleLock(day.day, meal.slot)}
            />
          ))}
        </div>

        <aside aria-label="Daily totals">
          <Card className="p-5 lg:sticky lg:top-20">
            <h2 className="mb-4 font-semibold">Day totals</h2>
            <div className="flex flex-col gap-4">
              {keyNutrients(rules).map((n) => {
                if (n === "kcal") return <NutrientMeter key={n} nutrient="kcal" value={day.totals.kcal} target={rules.energyTarget} />;
                const { min, max } = limitsFor(rules, "day", n);
                return <NutrientMeter key={n} nutrient={n} value={day.totals[n]} min={min?.value} max={max?.value} hardMax={max?.hard ?? true} />;
              })}
            </div>
            <p className="mt-4 text-xs text-muted">
              Ticks mark your limits. Amber means a target (not a medical limit) was missed.{" "}
              <Link href="/settings" className="underline">Edit limits</Link>
            </p>
          </Card>
        </aside>
      </div>

      <Modal ref={detailRef} title={detailMeal ? getRecipeInfo(detailMeal.recipeId).recipe.title : "Meal"} wide onClose={() => setDetail(null)}>
        {detail && detailMeal && (
          <>
            <MealDetail rules={rules} day={plan.days[detail.day]} meal={detailMeal} />
            <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
              <Button
                variant="secondary"
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    favorites: isFavorite ? s.favorites.filter((f) => f !== detailMeal.recipeId) : [...s.favorites, detailMeal.recipeId],
                  }))
                }
                aria-pressed={isFavorite}
              >
                {isFavorite ? "★ Favourite" : "☆ Add to favourites"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  detailRef.current?.close();
                  openSwap(detail.day, detail.slot);
                }}
              >
                Swap this meal
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal ref={swapRef} title={swap ? `Swap ${swap.slot} · ${dayLabel(plan, swap.day, "long")}` : "Swap"} onClose={() => setSwap(null)}>
        {swap && !swap.options && !swap.error && <Spinner label="Finding meals that fit…" />}
        {swap?.error && <Notice tone="danger">{swap.error}</Notice>}
        {swap?.options && swap.options.length === 0 && <p className="text-muted">No other recipes fit this slot with your current rules.</p>}
        {swap?.options && swap.options.length > 0 && (
          <ul className="flex flex-col gap-2">
            {swap.options.map((o) => (
              <li key={o.recipeId}>
                <button
                  onClick={() => applySwap(o)}
                  className="w-full rounded-lg border border-line p-3 text-left hover:border-brand hover:bg-brand-soft"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{o.title}</span>
                    <span className="flex gap-1">
                      {o.hardViolations > 0 ? <Badge tone="danger">exceeds a limit</Badge> : <Badge tone="ok">within limits</Badge>}
                      {o.softMisses > 0 && <Badge tone="warn">misses {o.softMisses} target{o.softMisses > 1 ? "s" : ""}</Badge>}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {o.portion !== 1 && `${o.portion}× portion · `}
                    Day after swap: {cardNutrients(rules).map((n) => `${SHORT[n] ? SHORT[n] + " " : ""}${fmtAmount(o.day.totals[n], n)}`).join(" · ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

function MealCard({
  meal, rules, onOpen, onSwap, onLock,
}: {
  meal: PlannedMeal; rules: ResolvedRules; onOpen: () => void; onSwap: () => void; onLock: () => void;
}) {
  const info = getRecipeInfo(meal.recipeId);
  const v = mealNutrients(meal);
  const slotIssues = rules.limits.filter(
    (l) => l.scope === meal.slot && (l.op === "max" ? v[l.nutrient] > l.value + 1e-6 : v[l.nutrient] < l.value - 1e-6),
  );
  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
          {meal.slot}
          {meal.locked && <Badge tone="brand">locked</Badge>}
          {meal.portion !== 1 && <Badge tone="warn">{meal.portion}× portion</Badge>}
          {slotIssues.length > 0 && <Badge tone={slotIssues.some((l) => l.hard) ? "danger" : "warn"}>check {slotIssues.map((l) => l.nutrient).join(", ")}</Badge>}
        </span>
        <span className="mt-0.5 block font-medium hover:underline">{info.recipe.title}</span>
        <span className="mt-1 block text-xs text-muted tabular-nums">
          {cardNutrients(rules).map((n) => `${fmtAmount(v[n], n)}${SHORT[n] ? ` ${SHORT[n]}` : ""}`).join(" · ")}
          {` · ${info.recipe.prepMin} min`}
        </span>
      </button>
      <div className="flex shrink-0 gap-1.5">
        <Button variant="secondary" size="sm" onClick={onSwap}>Swap</Button>
        <Button variant={meal.locked ? "primary" : "ghost"} size="sm" onClick={onLock} aria-pressed={!!meal.locked} title="Keep this meal when regenerating">
          {meal.locked ? "Locked" : "Lock"}
        </Button>
      </div>
    </Card>
  );
}
