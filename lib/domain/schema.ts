import { z } from "zod";
import { ALLERGENS, CKD_STAGES, DIETS, FODMAP_GROUPS, FODMAP_PHASES, NUTRIENTS, SLOTS } from "./types";

export const limitOverrideSchema = z.object({
  scope: z.enum(["day", ...SLOTS]),
  nutrient: z.enum(NUTRIENTS),
  op: z.enum(["min", "max"]),
  value: z.number().nonnegative().max(100_000),
  source: z.enum(["user", "clinician"]),
});

export const profileSchema = z.object({
  sex: z.enum(["female", "male"]),
  age: z.number().int().min(18).max(110),
  heightCm: z.number().min(120).max(230),
  weightKg: z.number().min(30).max(300),
  activity: z.enum(["sedentary", "light", "moderate", "active"]),
  diets: z.array(z.enum(DIETS)).max(3),
  ckdStage: z.enum(CKD_STAGES).optional(),
  fodmapPhase: z.enum(FODMAP_PHASES).optional(),
  fodmapTriggers: z.array(z.enum(FODMAP_GROUPS)).optional(),
  allergies: z.array(z.enum(ALLERGENS)),
  dislikedIngredients: z.array(z.string().max(64)).max(200),
  householdSize: z.number().int().min(1).max(12),
  slots: z.array(z.enum(SLOTS)).min(1),
  labs: z
    .object({
      potassium: z.number().min(1).max(10).optional(),
      phosphorus: z.number().min(0.5).max(15).optional(),
      egfr: z.number().min(1).max(150).optional(),
      a1c: z.number().min(3).max(20).optional(),
    })
    .optional(),
  overrides: z.array(limitOverrideSchema).max(50).optional(),
});

export const lockedMealSchema = z.object({
  day: z.number().int().min(0).max(6),
  slot: z.enum(SLOTS),
  recipeId: z.string().max(100),
  portion: z.number().min(0.25).max(3),
});

export const plannedMealSchema = z.object({
  slot: z.enum(SLOTS),
  recipeId: z.string().max(100),
  portion: z.number().min(0.25).max(3),
  locked: z.boolean().optional(),
});

export const generateRequestSchema = z.object({
  profile: profileSchema,
  seed: z.number().int().nonnegative().optional(),
  locked: z.array(lockedMealSchema).max(28).optional(),
  favorites: z.array(z.string().max(100)).max(500).optional(),
});

export const swapRequestSchema = z.object({
  profile: profileSchema,
  day: z.number().int().min(0).max(6),
  meals: z.array(plannedMealSchema).max(4),
  slot: z.enum(SLOTS),
  usedThisWeek: z.array(z.string().max(100)).max(100).optional(),
});
