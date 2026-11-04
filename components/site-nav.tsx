"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAppState } from "@/lib/store/app-state";
import { supabaseConfigured } from "@/lib/supabase/config";
import { useSync } from "./sync-provider";

/** Icon paths from Lucide (ISC). 24×24 viewBox, stroked. */
const ICONS: Record<string, ReactNode> = {
  plan: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  grocery: (
    <>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </>
  ),
  recipes: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  fodmap: (
    <>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7M7 16h10" />
    </>
  ),
  settings: <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />,
};

export function SiteNav() {
  const path = usePathname();
  const { state, ready } = useAppState();
  const { session, status } = useSync();
  const hasProfile = ready && !!state.profile;

  const links = [
    { href: "/plan", label: "Plan", short: "Plan", icon: "plan" },
    { href: "/grocery", label: "Grocery list", short: "Grocery", icon: "grocery" },
    { href: "/recipes", label: "Recipes", short: "Recipes", icon: "recipes" },
    ...(state.profile?.diets.includes("fodmap")
      ? [{ href: "/fodmap", label: "FODMAP tests", short: "FODMAP", icon: "fodmap" }]
      : []),
    { href: "/settings", label: "Settings", short: "Settings", icon: "settings" },
  ];
  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <>
      <header className="no-print sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-x-6 px-4 py-2 sm:px-6 sm:py-3">
          <Link href="/" className="-my-1 flex items-center gap-2 py-1.5 font-semibold">
            <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-brand text-sm text-brand-ink">
              M
            </span>
            MedPlate
          </Link>
          {hasProfile && (
            <nav aria-label="Main" className="hidden gap-1 sm:flex">
              {links.map((l) => {
                const active = isActive(l.href);
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
                <Link href="/login" className="-my-2 py-2 text-muted hover:text-fg">
                  Sign in
                </Link>
              ))}
            {ready && !hasProfile && path !== "/onboarding" && (
              <Link href="/onboarding" className="rounded-lg bg-brand px-3 py-2 font-medium text-brand-ink hover:bg-brand-hover sm:py-1.5">
                Get started
              </Link>
            )}
          </div>
        </div>
      </header>

      {hasProfile && (
        <nav
          id="mobile-tabbar"
          aria-label="Main"
          className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
        >
          <ul className="flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href} className="min-w-0 flex-1">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    aria-label={l.short === l.label ? undefined : l.label}
                    className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] leading-tight ${active ? "font-semibold text-brand" : "text-muted"}`}
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className={`size-5 ${active ? "stroke-[2.25]" : "stroke-[1.75]"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[l.icon]}
                    </svg>
                    <span className="max-w-full truncate px-1">{l.short}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
