"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useSync } from "@/components/sync-provider";
import { Button, ButtonLink, Card, Field, Input, Notice } from "@/components/ui";
import { getSupabase } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";

function LoginForm() {
  const params = useSearchParams();
  const { session } = useSync();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(params.get("error") ? "That sign-in link has expired or was already used. Request a new one." : null);
  const [busy, setBusy] = useState(false);

  if (!supabaseConfigured) {
    return (
      <Notice tone="neutral" title="Accounts aren't set up on this server">
        MedPlate is running in guest mode — everything is saved in this browser. To enable accounts, set
        NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see the README).
      </Notice>
    );
  }
  if (session) {
    return (
      <div className="flex flex-col gap-4">
        <p>You're signed in as <strong>{session.user.email}</strong>.</p>
        <ButtonLink href="/plan">Go to my plan</ButtonLink>
      </div>
    );
  }
  if (sent) {
    return (
      <Notice tone="ok" title="Check your email">
        We sent a sign-in link to <strong>{email}</strong>. Open it on this device to finish signing in. Anything you created as a
        guest will be saved to your account.
      </Notice>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getSupabase()!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      {error && <Notice tone="danger">{error}</Notice>}
      <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Email me a sign-in link"}</Button>
      <p className="text-xs text-muted">No password needed. We only use your email to sign you in.</p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-md p-8">
      <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
      <p className="mb-6 text-sm text-muted">Sync your plans and grocery lists across devices.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </Card>
  );
}
