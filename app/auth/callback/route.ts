import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/config";

/**
 * Landing for emailed links (sign-up confirmation, password reset): exchange the one-time PKCE code for a
 * session cookie, then continue to `next` (default /plan). Expired or reused links arrive as `?error=`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/plan";

  if (!supabaseConfigured || !code || url.searchParams.get("error")) {
    return NextResponse.redirect(new URL("/login?error=link", url.origin));
  }

  const store = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => store.set(name, value, options)),
    },
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/login?error=session" : dest, url.origin));
}
