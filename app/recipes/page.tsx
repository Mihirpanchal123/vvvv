"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtAmount } from "@/components/nutrient-meter";
import { Badge, Card, ChoiceChip, Input, PageHeader, Select } from "@/components/ui";
import { cleanProfile } from "@/lib/client/api";
import { SLOTS, type Nutrient, type Slot } from "@/lib/domain/types";
import { buildCandidates } from "@/lib/engine/candidates";
import { recipeLibrary } from "@/lib/engine/recipe-info";
import { resolveRules } from "@/lib/rules/resolve";
import { useAppState } from "@/lib/store/app-state";

const SHOWN: Nutrient[] = ["kcal", "carb", "protein", "sodium", "potassium", "phosphorus"];

export default function RecipesPage() {
  const { state } = useAppState();
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<Slot | "all">("all");
  const [onlyFits, setOnlyFits] = useState(true);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const fit = useMemo(() => {
    if (!state.profile) return null;
    const cands = buildCandidates(resolveRules(cleanProfile(state.profile)));
    return new Map(cands.excluded.map((e) => [e.recipeId, e.reasons]));
  }, [state.profile]);

  const recipes = [...recipeLibrary().values()]
    .filter((r) => slot === "all" || r.recipe.slots.includes(slot))
    .filter((r) => !query || r.recipe.title.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => !onlyFavs || state.favorites.includes(r.recipe.id))
    .filter((r) => !fit || !onlyFits || !fit.has(r.recipe.id))
    .sort((a, b) => a.recipe.title.localeCompare(b.recipe.title));

  return (
    <div>
      <PageHeader
        title="Recipes"
        subtitle={fit ? "Checked against your diet rules. Nutrients are per serving." : "Nutrients are per serving. Create a profile to see which recipes fit your diet."}
      />
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Input type="search" placeholder="Search recipes…" aria-label="Search recipes" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-56 flex-1" />
        <Select aria-label="Meal type" value={slot} onChange={(e) => setSlot(e.target.value as Slot | "all")}>
          <option value="all">All meals</option>
          {SLOTS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </Select>
        {fit && <ChoiceChip label="Only recipes that fit my diet" checked={onlyFits} onChange={setOnlyFits} />}
        <ChoiceChip label="Favourites" checked={onlyFavs} onChange={setOnlyFavs} />
      </div>

      <p className="mb-3 text-sm text-muted" role="status">{recipes.length} recipes</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((info) => {
          const reasons = fit?.get(info.recipe.id);
          return (
            <li key={info.recipe.id}>
              <Card className="relative flex h-full flex-col p-4 transition-colors has-[a:hover]:bg-surface-2">
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {info.recipe.slots.map((s) => <Badge key={s} className="capitalize">{s}</Badge>)}
                  {state.favorites.includes(info.recipe.id) && <Badge tone="brand">★</Badge>}
                  {fit && (reasons ? <Badge tone="danger">not for you</Badge> : <Badge tone="ok">fits your diet</Badge>)}
                </div>
                <Link href={`/recipes/${info.recipe.id}`} className="mt-2 font-medium after:absolute after:inset-0 after:rounded-xl hover:underline">{info.recipe.title}</Link>
                <p className="mt-1 text-xs text-muted tabular-nums">
                  {SHOWN.map((n) => `${fmtAmount(info.perServing[n], n)}${n === "kcal" ? "" : ` ${n === "carb" ? "carbs" : n === "sodium" ? "Na" : n === "potassium" ? "K" : n === "phosphorus" ? "P" : n}`}`).join(" · ")}
                </p>
                {reasons && <p className="mt-2 text-xs text-danger">{reasons.join("; ")}</p>}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
