"use client";

import { useMemo, useState } from "react";
import { Badge, Button, ButtonLink, Card, Notice, PageHeader, Select, Spinner } from "@/components/ui";
import { dayLabel } from "@/lib/client/plan-utils";
import { buildGroceryList, groceryListToText, type GroceryItem } from "@/lib/grocery/build";
import { setState, useAppState } from "@/lib/store/app-state";

const RANGES = {
  week: { label: "Whole week", days: [0, 1, 2, 3, 4, 5, 6] },
  first: { label: "Days 1–3", days: [0, 1, 2] },
  second: { label: "Days 4–7", days: [3, 4, 5, 6] },
} as const;

export default function GroceryPage() {
  const { state, ready } = useAppState();
  const [range, setRange] = useState<keyof typeof RANGES>("week");
  const [copied, setCopied] = useState(false);
  const { plan, profile } = state;

  const list = useMemo(() => {
    if (!plan || !profile) return null;
    const meals = plan.days.filter((d) => (RANGES[range].days as readonly number[]).includes(d.day)).flatMap((d) => d.meals);
    return buildGroceryList({ meals, householdSize: profile.householdSize, diets: profile.diets, pantry: state.pantry });
  }, [plan, profile, range, state.pantry]);

  if (!ready) return <Spinner />;
  if (!plan || !profile || !list) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-xl font-semibold">No grocery list yet</h1>
        <p className="mt-2 text-muted">Create a meal plan and your shopping list appears here.</p>
        <ButtonLink href={profile ? "/plan" : "/onboarding"} className="mt-6">
          {profile ? "Go to plan" : "Get started"}
        </ButtonLink>
      </Card>
    );
  }

  const checked = new Set(state.checks[plan.id] ?? []);
  const allItems = list.sections.flatMap((s) => s.items);
  const done = allItems.filter((i) => checked.has(i.ingredientId)).length;

  const toggle = (id: string) =>
    setState((s) => {
      const cur = new Set(s.checks[plan.id] ?? []);
      if (cur.has(id)) cur.delete(id);
      else cur.add(id);
      return { ...s, checks: { ...s.checks, [plan.id]: [...cur] } };
    });

  const togglePantry = (id: string) =>
    setState((s) => ({ ...s, pantry: s.pantry.includes(id) ? s.pantry.filter((p) => p !== id) : [...s.pantry, id] }));

  async function copy() {
    const text = `Grocery list — ${RANGES[range].label} (${dayLabel(plan!, 0, "long")})\n\n${groceryListToText(list!)}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: "Grocery list", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled the share sheet or clipboard was blocked.
    }
  }

  return (
    <div>
      <PageHeader
        title="Grocery list"
        subtitle={`${list.itemCount} items · for ${profile.householdSize} ${profile.householdSize === 1 ? "person" : "people"} · sorted by aisle`}
        actions={
          <>
            <Button variant="secondary" onClick={copy}>{copied ? "Copied!" : "Copy / share"}</Button>
            <Button variant="secondary" onClick={() => window.print()}>Print</Button>
          </>
        }
      />

      <div className="no-print mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Shop for
          <Select value={range} onChange={(e) => setRange(e.target.value as keyof typeof RANGES)} className="h-9">
            {Object.entries(RANGES).map(([k, r]) => (
              <option key={k} value={k}>{r.label}</option>
            ))}
          </Select>
        </label>
        <div className="flex min-w-48 flex-1 items-center gap-3 text-sm">
          <progress className="steps max-w-64" max={Math.max(allItems.length, 1)} value={done} aria-label="Items checked off" />
          <span className="whitespace-nowrap text-muted tabular-nums">{done} / {allItems.length} in cart</span>
        </div>
        {done > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setState((s) => ({ ...s, checks: { ...s.checks, [plan.id]: [] } }))}>
            Uncheck all
          </Button>
        )}
      </div>

      {profile.diets.length > 0 && (
        <div className="no-print mb-6">
          <Notice tone="brand" title="Label tips for your diet">
            Notes under items flag what to look for on the label. When two products look the same, compare the sodium
            {profile.diets.includes("ckd") ? ", potassium and phosphorus" : ""} on the nutrition panel.
          </Notice>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {list.sections.map((section) => (
          <Card key={section.aisle} className="print-break p-5">
            <h2 className="mb-3 font-semibold">{section.label}</h2>
            <ul className="flex flex-col divide-y divide-line">
              {section.items.map((item) => (
                <GroceryRow
                  key={item.ingredientId}
                  item={item}
                  checked={checked.has(item.ingredientId)}
                  onToggle={() => toggle(item.ingredientId)}
                  onHaveIt={() => togglePantry(item.ingredientId)}
                />
              ))}
            </ul>
          </Card>
        ))}

        {list.pantryCheck.length > 0 && (
          <Card className="print-break p-5 md:col-span-2">
            <h2 className="font-semibold">Check your pantry</h2>
            <p className="mb-3 text-sm text-muted">Staples most kitchens have, and items you marked as already at home.</p>
            <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {list.pantryCheck.map((i) => (
                <li key={i.ingredientId} className="flex items-center justify-between gap-3 py-1">
                  <span>
                    {i.name} <span className="text-muted">· {i.buy}</span>
                    {i.notes.map((n) => <span key={n} className="block text-xs text-warn">{n}</span>)}
                  </span>
                  {i.inPantry && (
                    <button className="no-print shrink-0 text-xs text-brand underline" onClick={() => togglePantry(i.ingredientId)}>
                      Add back to list
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

function GroceryRow({ item, checked, onToggle, onHaveIt }: { item: GroceryItem; checked: boolean; onToggle: () => void; onHaveIt: () => void }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <input
        id={`g-${item.ingredientId}`}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 size-5 shrink-0 accent-[var(--brand)]"
      />
      <label htmlFor={`g-${item.ingredientId}`} className="min-w-0 flex-1 cursor-pointer">
        <span className={`flex flex-wrap items-baseline justify-between gap-x-3 ${checked ? "text-muted line-through" : ""}`}>
          <span className="font-medium">{item.name}</span>
          <span className="text-sm tabular-nums">{item.buy}</span>
        </span>
        <span className="mt-0.5 block text-xs text-muted">
          {item.grams.toLocaleString("en-US")} g needed · {item.usedIn.length === 1 ? item.usedIn[0] : `${item.usedIn.length} recipes`}
        </span>
        {item.notes.map((n) => (
          <span key={n} className="mt-1 block text-xs text-warn">
            <Badge tone="warn" className="mr-1">label</Badge>
            {n}
          </span>
        ))}
      </label>
      <button onClick={onHaveIt} className="no-print shrink-0 text-xs text-muted underline hover:text-fg" title="Move to pantry for future lists">
        Have it
      </button>
    </li>
  );
}
