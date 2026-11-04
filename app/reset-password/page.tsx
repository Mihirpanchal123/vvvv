"use client";

import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSync } from "@/components/sync-provider";
import { Button, ButtonLink, Card, Field, Input, Notice, Spinner } from "@/components/ui";
import { getSupabase } from "@/lib/supabase/client";

const MIN_PASSWORD = 8;

/** Landing for the "Forgot password?" email: /auth/callback has already signed the user in from the link. */
export default function ResetPasswordPage() {
  const router = useRouter();
  const { session: synced } = useSync();
  // undefined = still reading the stored session; don't claim the link is invalid until we know.
  const [own, setOwn] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return setOwn(null);
    sb.auth.getSession().then(({ data }) => setOwn(data.session));
  }, []);
  const session = synced ?? own;
  const checked = own !== undefined;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    const { error } = await getSupabase()!.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else router.push("/plan");
  }

  return (
    <Card className="mx-auto max-w-md p-5 sm:p-8">
      <h1 className="mb-1 text-2xl font-semibold">Set a new password</h1>
      {session ? (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <p className="text-sm text-muted">For <strong className="text-fg">{session.user.email}</strong></p>
          <Field label="New password" htmlFor="new-password" hint={`At least ${MIN_PASSWORD} characters.`}>
            <Input id="new-password" type="password" required minLength={MIN_PASSWORD} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Confirm new password" htmlFor="confirm-password">
            <Input id="confirm-password" type="password" required minLength={MIN_PASSWORD} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </Field>
          {error && <Notice tone="danger">{error}</Notice>}
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save new password"}</Button>
        </form>
      ) : checked ? (
        <div className="mt-5 flex flex-col gap-4">
          <Notice tone="warn">This reset link has expired or was already used. Request a new one from the sign-in page.</Notice>
          <ButtonLink href="/login" variant="secondary">Go to sign in</ButtonLink>
        </div>
      ) : (
        <div className="mt-5"><Spinner /></div>
      )}
    </Card>
  );
}
