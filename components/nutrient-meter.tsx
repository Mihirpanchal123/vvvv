import { NUTRIENT_META, type Nutrient } from "@/lib/domain/types";

export function fmtAmount(value: number, nutrient: Nutrient) {
  const rounded = NUTRIENT_META[nutrient].unit === "g" && value < 10 ? Math.round(value * 10) / 10 : Math.round(value);
  return `${rounded.toLocaleString("en-US")} ${NUTRIENT_META[nutrient].unit}`;
}

export function gramsLabel(g: number) {
  return g >= 10 ? `${Math.round(g)} g` : `${Math.round(g * 10) / 10} g`;
}

export type MeterStatus = "ok" | "under" | "over" | "neutral";

export function meterStatus(value: number, min?: number, max?: number, hardMax = true): MeterStatus {
  if (max !== undefined && value > max + 1e-6) return hardMax ? "over" : "under";
  if (min !== undefined && value < min - 1e-6) return "under";
  return min === undefined && max === undefined ? "neutral" : "ok";
}

const BAR: Record<MeterStatus, string> = { ok: "bg-ok", under: "bg-warn", over: "bg-danger", neutral: "bg-brand" };
const TEXT: Record<MeterStatus, string> = { ok: "text-ok", under: "text-warn", over: "text-danger", neutral: "text-muted" };
const WORD: Record<MeterStatus, string> = { ok: "within limit", under: "below target", over: "over limit", neutral: "" };

/**
 * Horizontal budget bar. The numbers are always printed, so the bar itself is decorative (aria-hidden).
 * A tick marks the minimum when there is one.
 */
export function NutrientMeter({
  nutrient, value, min, max, target, hardMax = true, label,
}: {
  nutrient: Nutrient; value: number; min?: number; max?: number; target?: number; hardMax?: boolean; label?: string;
}) {
  const ceiling = max ?? target ?? (min !== undefined ? min * 1.4 : value || 1);
  const scale = Math.max(ceiling, value) * 1.05 || 1;
  const status = target !== undefined && max === undefined && min === undefined
    ? Math.abs(value - target) / target <= 0.1 ? "ok" : "under"
    : meterStatus(value, min, max, hardMax);
  const goal = max !== undefined ? `max ${fmtAmount(max, nutrient)}` : min !== undefined ? `min ${fmtAmount(min, nutrient)}` : target !== undefined ? `target ${fmtAmount(target, nutrient)}` : "";

  return (
    <div className="text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium">{label ?? NUTRIENT_META[nutrient].label}</span>
        <span className="tabular-nums">
          <span className={status === "over" ? "font-semibold text-danger" : ""}>{fmtAmount(value, nutrient)}</span>
          {goal && <span className="text-muted"> · {goal}</span>}
        </span>
      </div>
      <div aria-hidden className="relative mt-1.5 h-2 rounded-full bg-track">
        <div className={`h-2 rounded-full ${BAR[status]}`} style={{ width: `${Math.min(100, (value / scale) * 100)}%` }} />
        {max !== undefined && <div className="absolute -top-0.5 h-3 w-0.5 bg-fg/50" style={{ left: `${(max / scale) * 100}%` }} />}
        {min !== undefined && <div className="absolute -top-0.5 h-3 w-0.5 bg-fg/30" style={{ left: `${(min / scale) * 100}%` }} />}
      </div>
      {WORD[status] && status !== "ok" && <p className={`mt-0.5 text-xs ${TEXT[status]}`}>{WORD[status]}</p>}
    </div>
  );
}
