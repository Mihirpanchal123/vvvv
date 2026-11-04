"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useSync } from "@/components/sync-provider";
import { Button, ButtonLink, Card, Field, Input, Notice } from "@/components/ui";
import { getSupabase } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";

type Mode = "signin" | "signup" | "forgot";

const MIN_PASSWORD = 8;

const CALLBACK_ERRORS: Record<string, string> = {
  link: "That link has expired or was already used. Please try again.",
  session: "We couldn't finish signing you in. Open the link in the same browser you used to request it.",
};

/** Supabase's messages are terse; rephrase the ones people actually hit. */
function friendly(message: string): string {
  if (/invalid login credentials/i.test(message)) return "That email and password don't match. Check them and try again.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first. Open the link we sent when you created your account.";
  if (/already registered|already exists/i.test(message)) return "An account with this email already exists. Sign in instead.";
  if (/rate limit|too many/i.test(message)) return "Too many attempts. Wait a minute and try again.";
  return message;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { session } = useSync();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | "confirm" | "reset">(null);
  const errorParam = params.get("error");
  const [error, setError] = useState<string | null>(errorParam ? (CALLBACK_ERRORS[errorParam] ?? CALLBACK_ERRORS.session) : null);

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
  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="ok" title="Check your email">
          {done === "confirm" ? (
            <>We sent a confirmation link to <strong>{email}</strong>. Open it to activate your account; anything you created as a guest will be saved to it.</>
          ) : (
            <>If there's an account for <strong>{email}</strong>, we've sent a link to set a new password.</>
          )}
        </Notice>
        <Button variant="ghost" onClick={() => { setDone(null); setMode("signin"); setPassword(""); }}>
          Back to sign in
        </Button>
      </div>
    );
  }

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase()!;
    setBusy(true);
    setError(null);
    const callback = `${window.location.origin}/auth/callback`;
    try {
      if (mode === "signin") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/plan");
        return;
      }
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: callback } });
        if (error) throw error;
        // With email confirmation on, an existing address returns a user with no identities instead of an error.
        if (data.user && data.user.identities?.length === 0) throw new Error("already registered");
        if (data.session) router.push("/plan");
        else setDone("confirm");
        return;
      }
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${callback}?next=/reset-password` });
      if (error) throw error;
      setDone("reset");
    } catch (err) {
      setError(friendly(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  const submitLabel = {
    signin: busy ? "Signing in…" : "Sign in",
    signup: busy ? "Creating account…" : "Create account",
    forgot: busy ? "Sending…" : "Send reset link",
  }[mode];

  return (
    <div className="flex flex-col gap-5">
      {mode !== "forgot" && (
        <div role="group" aria-label="Account" className="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1 text-sm">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => switchMode(m)}
              className={`h-10 rounded-md font-medium sm:h-9 ${mode === m ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"}`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
      )}
      {mode === "forgot" && (
        <p className="text-sm text-muted">Enter your account email and we'll send you a link to set a new password.</p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        {mode !== "forgot" && (
          <Field label="Password" htmlFor="password" hint={mode === "signup" ? `At least ${MIN_PASSWORD} characters.` : undefined}>
            <Input
              id="password"
              type="password"
              required
              minLength={mode === "signup" ? MIN_PASSWORD : undefined}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        )}
        {error && <Notice tone="danger">{error}</Notice>}
        <Button type="submit" disabled={busy}>{submitLabel}</Button>
      </form>

      {mode === "signin" && (
        <button type="button" onClick={() => switchMode("forgot")} className="-my-2 self-center py-2 text-sm text-brand underline">
          Forgot password?
        </button>
      )}
      {mode === "forgot" && (
        <button type="button" onClick={() => switchMode("signin")} className="-my-2 self-center py-2 text-sm text-brand underline">
          Back to sign in
        </button>
      )}
      {mode === "signup" && (
        <p className="text-xs text-muted">Anything you created as a guest is saved to your new account.</p>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-md p-5 sm:p-8">
      <h1 className="mb-1 text-2xl font-semibold">Your account</h1>
      <p className="mb-6 text-sm text-muted">Sync your plans and grocery lists across devices.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </Card>
  );
}
