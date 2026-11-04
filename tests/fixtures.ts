import type { UserProfile } from "@/lib/domain/types";

export const baseProfile: UserProfile = {
  sex: "female",
  age: 58,
  heightCm: 165,
  weightKg: 72,
  activity: "light",
  diets: [],
  allergies: [],
  dislikedIngredients: [],
  householdSize: 1,
  slots: ["breakfast", "lunch", "dinner", "snack"],
};

export function profile(over: Partial<UserProfile> = {}): UserProfile {
  return { ...baseProfile, ...over };
}

/** Diet combinations the engine must always handle without breaking a hard limit. */
export const DIET_CASES: [string, Partial<UserProfile>][] = [
  ["no diet", {}],
  ["diabetic", { diets: ["diabetic"] }],
  ["ckd 3a", { diets: ["ckd"], ckdStage: "3a" }],
  ["ckd 3b", { diets: ["ckd"], ckdStage: "3b" }],
  ["ckd 4", { diets: ["ckd"], ckdStage: "4" }],
  ["ckd 5", { diets: ["ckd"], ckdStage: "5" }],
  ["hemodialysis", { diets: ["ckd"], ckdStage: "hemodialysis" }],
  ["peritoneal", { diets: ["ckd"], ckdStage: "peritoneal" }],
  ["fodmap elimination", { diets: ["fodmap"], fodmapPhase: "elimination" }],
  ["fodmap personalization", { diets: ["fodmap"], fodmapPhase: "personalization", fodmapTriggers: ["fructan", "gos"] }],
  ["diabetic + ckd 4", { diets: ["diabetic", "ckd"], ckdStage: "4" }],
  ["diabetic + fodmap", { diets: ["diabetic", "fodmap"], fodmapPhase: "elimination" }],
  ["ckd 4 + fodmap", { diets: ["ckd", "fodmap"], ckdStage: "4", fodmapPhase: "elimination" }],
  ["all three", { diets: ["diabetic", "ckd", "fodmap"], ckdStage: "4", fodmapPhase: "elimination" }],
  ["all three, male, hemodialysis", { sex: "male", weightKg: 85, heightCm: 178, diets: ["diabetic", "ckd", "fodmap"], ckdStage: "hemodialysis", fodmapPhase: "elimination" }],
];
