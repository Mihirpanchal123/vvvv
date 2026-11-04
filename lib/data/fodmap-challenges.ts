import type { FodmapGroup } from "@/lib/domain/types";

/**
 * Reintroduction challenges: one FODMAP subgroup at a time, increasing dose over 3 days, then a washout.
 * Doses follow the structure commonly used in the Monash protocol; a dietitian should adjust them.
 */
export interface FodmapChallenge {
  id: string;
  group: FodmapGroup;
  title: string;
  food: string;
  doses: [string, string, string];
}

export const WASHOUT_DAYS = 3;

export const FODMAP_CHALLENGES: FodmapChallenge[] = [
  { id: "lactose", group: "lactose", title: "Lactose", food: "Cow's milk", doses: ["½ cup (125 ml)", "¾ cup (190 ml)", "1 cup (250 ml)"] },
  { id: "fructose", group: "fructose", title: "Excess fructose", food: "Honey", doses: ["1 tsp", "2 tsp", "1 tbsp"] },
  { id: "sorbitol", group: "sorbitol", title: "Sorbitol", food: "Avocado", doses: ["¼ avocado", "⅓ avocado", "½ avocado"] },
  { id: "mannitol", group: "mannitol", title: "Mannitol", food: "Button mushrooms", doses: ["½ cup", "1 cup", "1½ cups"] },
  { id: "fructan-wheat", group: "fructan", title: "Fructans (wheat)", food: "Regular wheat bread", doses: ["½ slice", "1 slice", "2 slices"] },
  { id: "fructan-garlic", group: "fructan", title: "Fructans (garlic)", food: "Garlic", doses: ["¼ clove", "½ clove", "1 clove"] },
  { id: "fructan-onion", group: "fructan", title: "Fructans (onion)", food: "Onion", doses: ["1 tbsp", "¼ medium onion", "½ medium onion"] },
  { id: "gos", group: "gos", title: "GOS", food: "Canned lentils", doses: ["¼ cup", "½ cup", "1 cup"] },
];

export const SYMPTOMS = ["Bloating", "Abdominal pain", "Wind", "Diarrhoea", "Constipation", "Nausea"] as const;

export function daysBetween(fromIso: string, to: Date = new Date()): number {
  const a = new Date(`${fromIso.slice(0, 10)}T00:00:00`);
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function todayIso(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
