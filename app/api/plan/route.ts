import { NextResponse } from "next/server";
import { RECIPE_MAP } from "@/lib/data/recipes";
import { generateRequestSchema } from "@/lib/domain/schema";
import { generateWeekPlan } from "@/lib/engine/solve";
import { resolveRules } from "@/lib/rules/resolve";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const parsed = generateRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { profile, seed, locked, favorites } = parsed.data;
  const unknown = (locked ?? []).find((l) => !RECIPE_MAP.has(l.recipeId));
  if (unknown) return NextResponse.json({ error: `Unknown recipe ${unknown.recipeId}` }, { status: 400 });

  const rules = resolveRules(profile);
  const plan = generateWeekPlan(rules, { seed, locked, favorites });
  return NextResponse.json({ plan });
}
