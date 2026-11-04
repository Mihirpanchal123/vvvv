"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile, WeekPlan } from "@/lib/domain/types";
import { EMPTY_STATE, type AppState } from "@/lib/store/app-state";

/** Load the signed-in user's state from Postgres. Returns null if they have nothing saved yet. */
export async function pullRemote(sb: SupabaseClient, userId: string): Promise<AppState | null> {
  const [profile, plan, pantry, favorites, challenges, symptoms] = await Promise.all([
    sb.from("profiles").select("data, updated_at").eq("user_id", userId).maybeSingle(),
    sb.from("meal_plans").select("id, plan").eq("user_id", userId).eq("is_current", true).maybeSingle(),
    sb.from("pantry_items").select("ingredient_id").eq("user_id", userId),
    sb.from("favorites").select("recipe_id").eq("user_id", userId),
    sb.from("fodmap_challenges").select("*").eq("user_id", userId),
    sb.from("symptom_logs").select("*").eq("user_id", userId),
  ]);
  const err = [profile, plan, pantry, favorites, challenges, symptoms].find((r) => r.error)?.error;
  if (err) throw err;
  if (!profile.data) return null;

  const checks: Record<string, string[]> = {};
  if (plan.data) {
    const { data, error } = await sb.from("grocery_checks").select("ingredient_id").eq("plan_id", plan.data.id);
    if (error) throw error;
    checks[plan.data.id] = data.map((r) => r.ingredient_id as string);
  }

  return {
    ...EMPTY_STATE,
    profile: profile.data.data as UserProfile,
    plan: (plan.data?.plan as WeekPlan | undefined) ?? null,
    checks,
    pantry: (pantry.data ?? []).map((r) => r.ingredient_id as string),
    favorites: (favorites.data ?? []).map((r) => r.recipe_id as string),
    fodmap: {
      challenges: (challenges.data ?? []).map((c) => ({
        challengeId: c.challenge_id,
        startedOn: c.started_on,
        result: c.result ?? undefined,
        triggers: c.triggers ?? [],
      })),
      symptoms: (symptoms.data ?? []).map((s) => ({
        id: s.id,
        challengeId: s.challenge_id,
        doseDay: s.dose_day,
        date: s.logged_on,
        severity: s.severity,
        symptoms: s.symptoms ?? [],
        note: s.note ?? undefined,
      })),
    },
    updatedAt: profile.data.updated_at,
  };
}

async function replaceRows(sb: SupabaseClient, table: string, userId: string, rows: Record<string, unknown>[]) {
  const del = await sb.from(table).delete().eq("user_id", userId);
  if (del.error) throw del.error;
  if (rows.length) {
    const ins = await sb.from(table).insert(rows);
    if (ins.error) throw ins.error;
  }
}

/** Mirror local state to Postgres. Last write wins at the whole-state level (single user, few devices). */
export async function pushRemote(sb: SupabaseClient, userId: string, s: AppState): Promise<void> {
  if (!s.profile) return;
  const up = await sb.from("profiles").upsert({ user_id: userId, data: s.profile, updated_at: s.updatedAt });
  if (up.error) throw up.error;

  if (s.plan) {
    const clear = await sb.from("meal_plans").update({ is_current: false }).eq("user_id", userId).neq("id", s.plan.id);
    if (clear.error) throw clear.error;
    const plan = await sb.from("meal_plans").upsert({ id: s.plan.id, user_id: userId, plan: s.plan, is_current: true });
    if (plan.error) throw plan.error;
    const del = await sb.from("grocery_checks").delete().eq("plan_id", s.plan.id);
    if (del.error) throw del.error;
    const checked = s.checks[s.plan.id] ?? [];
    if (checked.length) {
      const ins = await sb.from("grocery_checks").insert(checked.map((id) => ({ plan_id: s.plan!.id, user_id: userId, ingredient_id: id })));
      if (ins.error) throw ins.error;
    }
  }

  await replaceRows(sb, "pantry_items", userId, s.pantry.map((id) => ({ user_id: userId, ingredient_id: id })));
  await replaceRows(sb, "favorites", userId, s.favorites.map((id) => ({ user_id: userId, recipe_id: id })));
  await replaceRows(
    sb, "fodmap_challenges", userId,
    s.fodmap.challenges.map((c) => ({
      user_id: userId, challenge_id: c.challengeId, started_on: c.startedOn, result: c.result ?? null, triggers: c.triggers ?? [],
    })),
  );
  await replaceRows(
    sb, "symptom_logs", userId,
    s.fodmap.symptoms.map((e) => ({
      id: e.id, user_id: userId, challenge_id: e.challengeId, dose_day: e.doseDay, logged_on: e.date,
      severity: e.severity, symptoms: e.symptoms, note: e.note ?? null,
    })),
  );
}

/** Remove every row this user owns (the auth account itself is deleted from the Supabase dashboard/admin API). */
export async function deleteRemote(sb: SupabaseClient, userId: string) {
  for (const t of ["symptom_logs", "fodmap_challenges", "favorites", "pantry_items", "grocery_checks", "meal_plans", "profiles"]) {
    const { error } = await sb.from(t).delete().eq("user_id", userId);
    if (error) throw error;
  }
}
