import { NUTRIENTS, type NutrientVector } from "./types";

export function zeroNutrients(): NutrientVector {
  return Object.fromEntries(NUTRIENTS.map((n) => [n, 0])) as NutrientVector;
}

export function addNutrients(a: NutrientVector, b: NutrientVector, factor = 1): NutrientVector {
  const out = zeroNutrients();
  for (const n of NUTRIENTS) out[n] = a[n] + b[n] * factor;
  return out;
}

export function scaleNutrients(a: NutrientVector, factor: number): NutrientVector {
  const out = zeroNutrients();
  for (const n of NUTRIENTS) out[n] = a[n] * factor;
  return out;
}

export function sumNutrients(items: { v: NutrientVector; factor: number }[]): NutrientVector {
  return items.reduce((acc, { v, factor }) => addNutrients(acc, v, factor), zeroNutrients());
}

/** Shorthand for writing ingredient data; omitted nutrients are 0. */
export function n(partial: Partial<NutrientVector>): NutrientVector {
  return { ...zeroNutrients(), ...partial };
}

export function round(value: number, digits = 0): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
