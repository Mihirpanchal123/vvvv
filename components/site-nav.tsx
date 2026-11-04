"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/store/app-state";
import { supabaseConfigured } from "@/lib/supabase/config";
import { useSync } from "./sync-provider";

export function SiteNav() {
  const path = usePathname();
  const { state, ready } = useAppState();
  const { session, status } = useSync();
  const hasProfile = ready && !!state.profile;

  const links = [
    { href: "/plan", label: "Plan" },
    { href: "/grocery", label: "Grocery list" },
    { href: "/recipes", label: "Recipes" },
    ...(state.profile?.diets.includes("fodmap") ? [{ href: "/fodmap", label: "FODMAP tests" }] : []),
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="no-print sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-brand text-sm text-brand-ink">
            M
          </span>
          MedPlate
        </Link>
        {hasProfile && (
          <nav aria-label="Main" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {links.map((l) => {
              const active = path === l.href || path.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${active ? "bg-brand-soft font-medium text-brand" : "text-muted hover:text-fg"}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-3 text-sm">
          {supabaseConfigured &&
            (session ? (
              <span className="text-muted" title={session.user.email ?? undefined}>
                {status === "syncing" ? "Saving…" : status === "error" ? "Sync error" : "Synced"}
              </span>
            ) : (
              <Link href="/login" className="text-muted hover:text-fg">
                Sign in
              </Link>
            ))}
          {ready && !hasProfile && path !== "/onboarding" && (
            <Link href="/onboarding" className="rounded-lg bg-brand px-3 py-1.5 font-medium text-brand-ink hover:bg-brand-hover">
              Get started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
