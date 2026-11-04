export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Accounts are optional: without these env vars the app runs in local guest mode. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
