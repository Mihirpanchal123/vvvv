"use client";

import { useSyncExternalStore } from "react";
import type { FodmapGroup, UserProfile, WeekPlan } from "@/lib/domain/types";

/**
 * Client-side app state. Works fully offline ("guest mode") via localStorage; when the user signs in,
 * lib/supabase/sync.ts mirrors it to Postgres so it follows them across devices.
 */

export interface SymptomEntry {
  id: string;
  challengeId: string;
  /** 1–3: dose day of the challenge. */
  doseDay: number;
  date: string;
  /** 0 = none, 10 = severe. */
  severity: number;
  symptoms: string[];
  note?: string;
}

export interface ChallengeProgress {
  challengeId: string;
  startedOn: string;
  result?: "tolerated" | "trigger";
  /** Groups confirmed as triggers by this challenge. */
  triggers?: FodmapGroup[];
}

export interface AppState {
  version: 1;
  profile: UserProfile | null;
  plan: WeekPlan | null;
  /** planId → checked ingredient ids */
  checks: Record<string, string[]>;
  pantry: string[];
  favorites: string[];
  fodmap: { challenges: ChallengeProgress[]; symptoms: SymptomEntry[] };
  updatedAt: string;
}

const KEY = "medplate:v1";
export const EMPTY_STATE: AppState = {
  version: 1,
  profile: null,
  plan: null,
  checks: {},
  pantry: [],
  favorites: [],
  fodmap: { challenges: [], symptoms: [] },
  updatedAt: new Date(0).toISOString(),
};

let state: AppState | null = null;
const listeners = new Set<() => void>();
const changeHooks = new Set<(s: AppState) => void>();

function load(): AppState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? { ...EMPTY_STATE, ...(JSON.parse(raw) as AppState) } : EMPTY_STATE;
  } catch {
    state = EMPTY_STATE;
  }
  return state;
}

function persist(s: AppState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage full or blocked (private mode): state still works for this session.
  }
}

export function getState(): AppState {
  return typeof window === "undefined" ? EMPTY_STATE : load();
}

/** Replace state from a remote source without re-triggering remote sync. */
export function hydrateState(next: AppState) {
  state = next;
  persist(next);
  listeners.forEach((l) => l());
}

export function setState(update: (s: AppState) => AppState) {
  const next = { ...update(load()), updatedAt: new Date().toISOString() };
  state = next;
  persist(next);
  listeners.forEach((l) => l());
  changeHooks.forEach((h) => h(next));
}

export function onLocalChange(hook: (s: AppState) => void) {
  changeHooks.add(hook);
  return () => void changeHooks.delete(hook);
}

export function clearState() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  hydrateState(EMPTY_STATE);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

type Snapshot = { state: AppState; ready: boolean };
const SERVER: Snapshot = { state: EMPTY_STATE, ready: false };
let clientSnap: Snapshot | null = null;

function getSnapshot() {
  const s = load();
  if (!clientSnap || clientSnap.state !== s) clientSnap = { state: s, ready: true };
  return clientSnap;
}

/** `ready` is false during SSR/hydration, so pages can avoid flashing "no profile" states. */
export function useAppState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
}
