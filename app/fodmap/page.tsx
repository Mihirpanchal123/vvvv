"use client";

import { useState } from "react";
import { Badge, Button, ButtonLink, Card, ChoiceChip, Field, Input, Notice, PageHeader, Spinner } from "@/components/ui";
import { FODMAP_CHALLENGES, SYMPTOMS, WASHOUT_DAYS, daysBetween, todayIso, type FodmapChallenge } from "@/lib/data/fodmap-challenges";
import { FODMAP_LABELS, type FodmapGroup } from "@/lib/domain/types";
import { setState, useAppState, type ChallengeProgress, type SymptomEntry } from "@/lib/store/app-state";

export default function FodmapPage() {
  const { state, ready } = useAppState();
  if (!ready) return <Spinner />;
  const { profile } = state;
  if (!profile?.diets.includes("fodmap")) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-xl font-semibold">FODMAP reintroduction</h1>
        <p className="mt-2 text-muted">Add the low-FODMAP diet in Settings to use the reintroduction tracker.</p>
        <ButtonLink href="/settings" className="mt-6">Open settings</ButtonLink>
      </Card>
    );
  }

  const phase = profile.fodmapPhase ?? "elimination";
  const { challenges, symptoms } = state.fodmap;
  const active = challenges.find((c) => !c.result);
  const lastDone = challenges
    .filter((c) => c.result)
    .map((c) => ({ c, end: lastLogDate(c.challengeId, symptoms) ?? c.startedOn }))
    .sort((a, b) => b.end.localeCompare(a.end))[0];
  const washoutLeft = lastDone ? Math.max(0, WASHOUT_DAYS - daysBetween(lastDone.end)) : 0;
  const triggers = [...new Set(challenges.flatMap((c) => c.triggers ?? []))];
  const allDone = FODMAP_CHALLENGES.every((ch) => challenges.some((c) => c.challengeId === ch.id && c.result));

  const setPhase = (fodmapPhase: typeof phase, fodmapTriggers?: FodmapGroup[]) =>
    setState((s) => ({ ...s, profile: s.profile && { ...s.profile, fodmapPhase, ...(fodmapTriggers ? { fodmapTriggers } : {}) } }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="FODMAP reintroduction"
        subtitle="Test one FODMAP group at a time to learn which ones you react to. Your everyday meals stay low-FODMAP during testing."
      />

      {phase === "elimination" && (
        <div className="mb-6">
          <Notice tone="brand" title="You're in the elimination phase">
            Once your symptoms have settled (usually after 2–6 weeks), start reintroducing groups — ideally with guidance from your dietitian.
            <div className="mt-3">
              <Button size="sm" onClick={() => setPhase("reintroduction")}>Start reintroduction</Button>
            </div>
          </Notice>
        </div>
      )}

      {phase === "personalization" && (
        <div className="mb-6">
          <Notice tone="ok" title="Personalisation phase">
            Your plan only limits: {profile.fodmapTriggers?.length ? profile.fodmapTriggers.map((g) => FODMAP_LABELS[g]).join(", ") : "no FODMAP groups"}.
            You can re-run any test below to re-check a group.
          </Notice>
        </div>
      )}

      {phase !== "elimination" && (
        <>
          {active ? (
            <ActiveChallenge key={`${active.challengeId}-${daysBetween(active.startedOn)}`} progress={active} symptoms={symptoms} />
          ) : washoutLeft > 0 ? (
            <div className="mb-6">
              <Notice tone="neutral" title="Washout">
                Wait {washoutLeft} more day{washoutLeft > 1 ? "s" : ""} (and until any symptoms settle) before the next test.
              </Notice>
            </div>
          ) : null}

          {allDone && phase === "reintroduction" && (
            <div className="mb-6">
              <Notice tone="ok" title="All groups tested">
                {triggers.length
                  ? `Your triggers: ${triggers.map((g) => FODMAP_LABELS[g]).join(", ")}.`
                  : "You tolerated every group tested."}{" "}
                Move to personalisation so your plan only restricts what you react to.
                <div className="mt-3">
                  <Button size="sm" onClick={() => setPhase("personalization", triggers)}>Switch to personalisation</Button>
                </div>
              </Notice>
            </div>
          )}

          <h2 className="mb-3 text-lg font-semibold">Tests</h2>
          <ul className="flex flex-col gap-2">
            {FODMAP_CHALLENGES.map((ch) => {
              const prog = challenges.find((c) => c.challengeId === ch.id);
              return (
                <li key={ch.id}>
                  <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{ch.title}</p>
                      <p className="text-sm text-muted">{ch.food}: {ch.doses.join(" → ")}</p>
                    </div>
                    {prog?.result === "tolerated" && <Badge tone="ok">tolerated</Badge>}
                    {prog?.result === "trigger" && <Badge tone="danger">trigger</Badge>}
                    {prog && !prog.result && <Badge tone="brand">in progress</Badge>}
                    {(!prog || prog.result) && !active && washoutLeft === 0 && (
                      <Button size="sm" variant={prog ? "ghost" : "secondary"} onClick={() => startChallenge(ch)}>
                        {prog ? "Re-test" : "Start test"}
                      </Button>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function lastLogDate(challengeId: string, symptoms: SymptomEntry[]) {
  return symptoms.filter((s) => s.challengeId === challengeId).map((s) => s.date).sort().at(-1);
}

function startChallenge(ch: FodmapChallenge) {
  setState((s) => ({
    ...s,
    fodmap: {
      challenges: [...s.fodmap.challenges.filter((c) => c.challengeId !== ch.id), { challengeId: ch.id, startedOn: todayIso() }],
      symptoms: s.fodmap.symptoms.filter((e) => e.challengeId !== ch.id),
    },
  }));
}

function finishChallenge(ch: FodmapChallenge, result: "tolerated" | "trigger") {
  setState((s) => ({
    ...s,
    fodmap: {
      ...s.fodmap,
      challenges: s.fodmap.challenges.map((c) =>
        c.challengeId === ch.id ? { ...c, result, triggers: result === "trigger" ? [ch.group] : [] } : c,
      ),
    },
  }));
}

function ActiveChallenge({ progress, symptoms }: { progress: ChallengeProgress; symptoms: SymptomEntry[] }) {
  const ch = FODMAP_CHALLENGES.find((c) => c.id === progress.challengeId)!;
  const logs = symptoms.filter((s) => s.challengeId === ch.id).sort((a, b) => a.doseDay - b.doseDay);
  const doseDay = Math.min(3, daysBetween(progress.startedOn) + 1);
  const todayLog = logs.find((l) => l.doseDay === doseDay);
  const [severity, setSeverity] = useState(todayLog?.severity ?? 0);
  const [picked, setPicked] = useState<string[]>(todayLog?.symptoms ?? []);
  const [note, setNote] = useState(todayLog?.note ?? "");
  const strongReaction = logs.some((l) => l.severity >= 5);
  const complete = logs.length >= 3 || strongReaction;

  function log() {
    const entry: SymptomEntry = {
      id: todayLog?.id ?? crypto.randomUUID(),
      challengeId: ch.id,
      doseDay,
      date: todayIso(),
      severity,
      symptoms: picked,
      note: note.trim() || undefined,
    };
    setState((s) => ({
      ...s,
      fodmap: { ...s.fodmap, symptoms: [...s.fodmap.symptoms.filter((e) => e.id !== entry.id), entry] },
    }));
  }

  return (
    <Card className="mb-6 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Testing: {ch.title}</h2>
        <span className="text-sm text-muted">Day {doseDay} of 3</span>
      </div>
      <p className="mt-2">
        Today, add <strong>{ch.doses[doseDay - 1]}</strong> of <strong>{ch.food.toLowerCase()}</strong> to one meal. Keep everything else low-FODMAP.
      </p>

      {logs.length > 0 && (
        <ol className="mt-4 flex flex-wrap gap-2 text-xs">
          {logs.map((l) => (
            <li key={l.id}>
              <Badge tone={l.severity >= 5 ? "danger" : l.severity >= 2 ? "warn" : "ok"}>
                Day {l.doseDay}: {l.severity}/10{l.symptoms.length ? ` · ${l.symptoms.join(", ").toLowerCase()}` : ""}
              </Badge>
            </li>
          ))}
        </ol>
      )}

      {strongReaction && (
        <div className="mt-4">
          <Notice tone="warn">You logged a moderate or strong reaction. Stop this test, let symptoms settle, then record the result below.</Notice>
        </div>
      )}

      {!strongReaction && (
        <div className="mt-6 flex flex-col gap-4">
          <h3 className="font-medium">How did you feel after today's dose?</h3>
          <Field label={`Overall symptoms: ${severity}/10`} htmlFor="sev">
            <input id="sev" type="range" min={0} max={10} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="accent-[var(--brand)]" />
          </Field>
          <fieldset className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <legend className="mb-2 text-sm font-medium">Symptoms</legend>
            {SYMPTOMS.map((sym) => (
              <ChoiceChip key={sym} label={sym} checked={picked.includes(sym)} onChange={(on) => setPicked((p) => (on ? [...p, sym] : p.filter((x) => x !== sym)))} />
            ))}
          </fieldset>
          <Field label="Notes (optional)" htmlFor="note">
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div>
            <Button onClick={log}>{todayLog ? "Update today's log" : "Save today's log"}</Button>
          </div>
        </div>
      )}

      {complete && (
        <div className="mt-6 border-t border-line pt-4">
          <p className="mb-3 font-medium">What's the result?</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => finishChallenge(ch, "tolerated")}>I tolerated it</Button>
            <Button variant="danger" onClick={() => finishChallenge(ch, "trigger")}>It's a trigger for me</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
