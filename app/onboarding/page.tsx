"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BodySection,
  DEFAULT_PROFILE,
  DietSection,
  FoodSection,
  LabsSection,
  LimitsSummary,
  profileProblems,
} from "@/components/profile-form";
import { Button, Card, Notice, Spinner } from "@/components/ui";
import { cleanProfile, requestPlan } from "@/lib/client/api";
import type { UserProfile } from "@/lib/domain/types";
import { resolveRules } from "@/lib/rules/resolve";
import { setState, useAppState } from "@/lib/store/app-state";

const STEPS = [
  { title: "Your diet", intro: "We'll build every meal around these rules." },
  { title: "About you", intro: "Used to estimate your energy needs and protein targets." },
  { title: "Food preferences", intro: "Recipes containing these are never planned." },
  { title: "Review your limits", intro: "These are the limits your plan will respect. You can change any of them later in Settings." },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { state, ready } = useAppState();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const seeded = useRef(false);

  // Resume from an existing profile (e.g. "edit diet" from the plan page).
  useEffect(() => {
    if (ready && state.profile && !seeded.current) {
      seeded.current = true;
      setProfile(state.profile);
    }
  }, [ready, state.profile]);

  useEffect(() => headingRef.current?.focus(), [step]);

  const patch = (p: Partial<UserProfile>) => setProfile((cur) => ({ ...cur, ...p }));
  const problems = step === 1 || step === 2 ? profileProblems(profile) : [];
  const rules = useMemo(() => (step === 3 ? resolveRules(cleanProfile(profile)) : null), [step, profile]);

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      const clean = cleanProfile(profile);
      const plan = await requestPlan(clean, { favorites: state.favorites });
      setState((s) => ({ ...s, profile: clean, plan }));
      router.push("/plan");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating your plan.");
      setBusy(false);
    }
  }

  const current = STEPS[step];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-muted">
          <span id="step-label">
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{current.title}</span>
        </div>
        <progress className="steps" max={STEPS.length} value={step + 1} aria-labelledby="step-label" />
      </div>

      <Card className="p-6">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none">
          {current.title}
        </h1>
        <p className="mt-1 mb-6 text-muted">{current.intro}</p>

        {step === 0 && (
          <>
            <DietSection profile={profile} onChange={patch} />
            {profile.diets.length === 0 && (
              <p className="mt-4 text-sm text-muted">No medical diet? You'll still get a balanced plan with general sodium and sugar targets.</p>
            )}
          </>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-8">
            <BodySection profile={profile} onChange={patch} />
            <LabsSection profile={profile} onChange={patch} />
          </div>
        )}
        {step === 2 && <FoodSection profile={profile} onChange={patch} />}
        {step === 3 && rules && <LimitsSummary rules={rules} />}

        {problems.length > 0 && (
          <div className="mt-6">
            <Notice tone="danger">{problems.join(" ")}</Notice>
          </div>
        )}
        {error && (
          <div className="mt-6">
            <Notice tone="danger" title="Couldn't create your plan">{error}</Notice>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || busy}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={problems.length > 0}>
              Continue
            </Button>
          ) : busy ? (
            <Spinner label="Building your week…" />
          ) : (
            <Button size="lg" onClick={finish}>
              Create my meal plan
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
