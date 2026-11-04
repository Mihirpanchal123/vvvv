"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BodySection, DietSection, FoodSection, LabsSection, LimitsSummary, profileProblems } from "@/components/profile-form";
import { useSync } from "@/components/sync-provider";
import { Button, ButtonLink, Card, Field, Input, Modal, Notice, PageHeader, Select, Spinner, type ModalHandle } from "@/components/ui";
import { cleanProfile } from "@/lib/client/api";
import { NUTRIENTS, NUTRIENT_META, type LimitOverride, type LimitScope, type Nutrient, type UserProfile } from "@/lib/domain/types";
import { resolveRules } from "@/lib/rules/resolve";
import { clearState, getState, setState, useAppState } from "@/lib/store/app-state";
import { getSupabase } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import { deleteRemote } from "@/lib/supabase/sync";

export default function SettingsPage() {
  const { state, ready } = useAppState();
  const { session } = useSync();
  const [draft, setDraft] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const deleteRef = useRef<ModalHandle>(null);

  useEffect(() => {
    if (ready && state.profile && !draft) setDraft(state.profile);
  }, [ready, state.profile, draft]);

  const rules = useMemo(() => (draft ? resolveRules(cleanProfile(draft)) : null), [draft]);

  if (!ready) return <Spinner />;
  if (!state.profile || !draft || !rules) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-xl font-semibold">No profile yet</h1>
        <ButtonLink href="/onboarding" className="mt-6">Get started</ButtonLink>
      </Card>
    );
  }

  const patch = (p: Partial<UserProfile>) => {
    setDraft((d) => (d ? { ...d, ...p } : d));
    setSaved(false);
  };
  const dirty = JSON.stringify(cleanProfile(draft)) !== JSON.stringify(cleanProfile(state.profile));
  const problems = profileProblems(draft);

  function save() {
    setState((s) => ({ ...s, profile: cleanProfile(draft!) }));
    setSaved(true);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `medplate-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function deleteAll() {
    const sb = getSupabase();
    if (sb && session) await deleteRemote(sb, session.user.id);
    clearState();
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Settings"
        actions={<ButtonLink variant="secondary" href="/report">Dietitian report</ButtonLink>}
      />

      <div className="sticky top-16 z-10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/95 p-3 backdrop-blur">
        <p className="text-sm text-muted" role="status">
          {saved ? "Saved. Regenerate your plan to apply the changes." : dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <div className="flex gap-2">
          {saved && <ButtonLink href="/plan" variant="secondary" size="sm">Go to plan</ButtonLink>}
          <Button size="sm" onClick={save} disabled={!dirty || problems.length > 0}>Save changes</Button>
        </div>
      </div>
      {problems.length > 0 && <div className="mb-6"><Notice tone="danger">{problems.join(" ")}</Notice></div>}

      <div className="flex flex-col gap-6">
        <Section title="Diet">
          <DietSection profile={draft} onChange={patch} />
        </Section>
        <Section title="About you">
          <BodySection profile={draft} onChange={patch} />
        </Section>
        {(draft.diets.includes("ckd") || draft.diets.includes("diabetic")) && (
          <Section title="Lab results">
            <LabsSection profile={draft} onChange={patch} />
          </Section>
        )}
        <Section title="Food preferences">
          <FoodSection profile={draft} onChange={patch} />
        </Section>
        <Section title="Your limits" description="What your plan currently respects. Add a limit from your care team to replace a default.">
          <div className="flex flex-col gap-6">
            <LimitsSummary rules={rules} />
            <OverridesEditor overrides={draft.overrides ?? []} slots={draft.slots} onChange={(overrides) => patch({ overrides })} />
          </div>
        </Section>

        <Section title="Your data">
          <div className="flex flex-col gap-4 text-sm">
            {supabaseConfigured ? (
              session ? (
                <p>
                  Signed in as <strong>{session.user.email}</strong>. Your profile, plans and lists sync to your account.{" "}
                  <button className="text-brand underline" onClick={() => getSupabase()?.auth.signOut()}>Sign out</button>
                </p>
              ) : (
                <p>
                  You're using MedPlate as a guest — data is stored only in this browser.{" "}
                  <Link href="/login" className="text-brand underline">Sign in</Link> to keep it in sync across devices.
                </p>
              )
            ) : (
              <p>Your data is stored only in this browser.</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={exportData}>Export my data (JSON)</Button>
              <Button variant="danger" onClick={() => deleteRef.current?.open()}>Delete all my data</Button>
            </div>
          </div>
        </Section>
      </div>

      <Modal ref={deleteRef} title="Delete all your data?">
        <p className="text-sm">
          This removes your profile, meal plans, grocery lists, favourites and FODMAP logs
          {session ? " from this browser and your account" : " from this browser"}. It can't be undone.
        </p>
        <form method="dialog" className="mt-6 flex justify-end gap-2">
          <Button type="submit" variant="danger" onClick={deleteAll}>Delete everything</Button>
          <Button type="submit" variant="secondary" autoFocus>Keep my data</Button>
        </form>
      </Modal>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  );
}

const COMMON_NUTRIENTS: Nutrient[] = ["sodium", "potassium", "phosphorus", "protein", "carb", "fluid", "fiber", "addedSugar"];

function OverridesEditor({
  overrides, slots, onChange,
}: {
  overrides: LimitOverride[]; slots: UserProfile["slots"]; onChange: (o: LimitOverride[]) => void;
}) {
  const [form, setForm] = useState<LimitOverride>({ scope: "day", nutrient: "sodium", op: "max", value: 2000, source: "clinician" });
  const ids = { scope: "ov-scope", nutrient: "ov-nutrient", op: "ov-op", value: "ov-value", source: "ov-source" };
  const same = (a: LimitOverride, b: LimitOverride) => a.scope === b.scope && a.nutrient === b.nutrient && a.op === b.op;

  return (
    <div>
      <h3 className="mb-2 font-medium">Custom limits</h3>
      {overrides.length > 0 ? (
        <ul className="mb-4 divide-y divide-line rounded-lg border border-line text-sm">
          {overrides.map((o) => (
            <li key={`${o.scope}-${o.nutrient}-${o.op}`} className="flex items-center justify-between gap-3 px-3 py-2">
              <span>
                {NUTRIENT_META[o.nutrient].label} {o.op === "max" ? "≤" : "≥"} {o.value.toLocaleString("en-US")} {NUTRIENT_META[o.nutrient].unit}{" "}
                <span className="text-muted">({o.scope === "day" ? "per day" : `at ${o.scope}`} · {o.source === "clinician" ? "from my care team" : "my choice"})</span>
              </span>
              <button className="text-xs text-danger underline" onClick={() => onChange(overrides.filter((x) => !same(x, o)))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-muted">None yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_8rem]">
        <Field label="Nutrient" htmlFor={ids.nutrient}>
          <Select id={ids.nutrient} value={form.nutrient} onChange={(e) => setForm({ ...form, nutrient: e.target.value as Nutrient })}>
            {[...COMMON_NUTRIENTS, ...NUTRIENTS.filter((n) => !COMMON_NUTRIENTS.includes(n))].map((n) => (
              <option key={n} value={n}>{NUTRIENT_META[n].label} ({NUTRIENT_META[n].unit})</option>
            ))}
          </Select>
        </Field>
        <Field label="Applies" htmlFor={ids.scope}>
          <Select id={ids.scope} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as LimitScope })}>
            <option value="day">Per day</option>
            {slots.map((s) => <option key={s} value={s}>At {s}</option>)}
          </Select>
        </Field>
        <Field label="Type" htmlFor={ids.op}>
          <Select id={ids.op} value={form.op} onChange={(e) => setForm({ ...form, op: e.target.value as "min" | "max" })}>
            <option value="max">At most</option>
            <option value="min">At least</option>
          </Select>
        </Field>
        <Field label="Amount" htmlFor={ids.value}>
          <Input id={ids.value} type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <Field label="Who set it?" htmlFor={ids.source}>
          <Select id={ids.source} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LimitOverride["source"] })}>
            <option value="clinician">My doctor / dietitian</option>
            <option value="user">Me</option>
          </Select>
        </Field>
        <Button
          variant="secondary"
          disabled={!(form.value >= 0) || Number.isNaN(form.value)}
          onClick={() => onChange([...overrides.filter((x) => !same(x, form)), form])}
        >
          Add limit
        </Button>
      </div>
    </div>
  );
}
