"use client";

import Link from "next/link";
import { useMemo } from "react";
import { cleanProfile } from "@/lib/client/api";
import { buildCandidates } from "@/lib/engine/candidates";
import { resolveRules } from "@/lib/rules/resolve";
import { setState, useAppState } from "@/lib/store/app-state";
import { Button, Notice } from "./ui";

/** Shows whether a recipe fits the signed-in/guest user's rules, and why not. */
export function RecipeFit({ recipeId }: { recipeId: string }) {
  const { state, ready } = useAppState();
  const result = useMemo(() => {
    if (!state.profile) return null;
    const cands = buildCandidates(resolveRules(cleanProfile(state.profile)));
    const excluded = cands.excluded.find((e) => e.recipeId === recipeId);
    const portions = [...new Set(Object.values(cands.bySlot).flat().filter((o) => o.recipeId === recipeId).map((o) => o.portion))].sort();
    return { excluded, portions };
  }, [state.profile, recipeId]);

  if (!ready) return null;
  if (!result) {
    return (
      <Notice tone="neutral">
        <Link href="/onboarding" className="underline">Create a profile</Link> to check this recipe against your diet.
      </Notice>
    );
  }
  const fav = state.favorites.includes(recipeId);
  return (
    <div className="flex flex-col gap-3">
      {result.excluded ? (
        <Notice tone="danger" title="Not planned for you">{result.excluded.reasons.join(". ")}.</Notice>
      ) : (
        <Notice tone="ok" title="Fits your diet">
          Can be planned at {result.portions.map((p) => `${p}×`).join(", ")} portion{result.portions.length > 1 ? "s" : ""}, depending on the rest of the day.
        </Notice>
      )}
      <div>
        <Button
          variant="secondary"
          size="sm"
          aria-pressed={fav}
          onClick={() => setState((s) => ({ ...s, favorites: fav ? s.favorites.filter((f) => f !== recipeId) : [...s.favorites, recipeId] }))}
        >
          {fav ? "★ Favourite — planned more often" : "☆ Add to favourites"}
        </Button>
      </div>
    </div>
  );
}
