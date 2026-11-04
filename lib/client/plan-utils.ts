import type { DayPlan, WeekPlan } from "@/lib/domain/types";

export function dayLabel(plan: Pick<WeekPlan, "createdAt">, day: number, style: "short" | "long" = "short") {
  const d = new Date(plan.createdAt);
  d.setDate(d.getDate() + day);
  return d.toLocaleDateString("en-US", { weekday: style, ...(style === "long" ? { month: "short", day: "numeric" } : {}) });
}

export function dayStatus(day: DayPlan): "ok" | "warn" | "danger" {
  if (day.hasHardViolation) return "danger";
  return day.checks.some((c) => !c.ok) ? "warn" : "ok";
}
