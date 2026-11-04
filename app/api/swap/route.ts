import { NextResponse } from "next/server";
import { RECIPE_MAP } from "@/lib/data/recipes";
import { swapRequestSchema } from "@/lib/domain/schema";
import { evaluateDay } from "@/lib/engine/evaluate";
import { swapOptions } from "@/lib/engine/swap";
import { resolveRules } from "@/lib/rules/resolve";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const parsed = swapRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { profile, day, meals, slot, usedThisWeek } = parsed.data;
  if (meals.some((m) => !RECIPE_MAP.has(m.recipeId))) {
    return NextResponse.json({ error: "Unknown recipe" }, { status: 400 });
  }
  const rules = resolveRules(profile);
  const options = swapOptions(rules, evaluateDay(day, meals, rules), slot, {
    limit: 10,
    usedThisWeek: new Set(usedThisWeek ?? []),
  });
  return NextResponse.json({
    options: options.map((o) => ({
      recipeId: o.recipeId,
      title: o.title,
      portion: o.portion,
      day: o.day,
      hardViolations: o.hardViolations,
      softMisses: o.softMisses,
    })),
  });
}
