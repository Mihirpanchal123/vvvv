"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getState, hydrateState, onLocalChange } from "@/lib/store/app-state";
import { getSupabase } from "@/lib/supabase/client";
import { pullRemote, pushRemote } from "@/lib/supabase/sync";

type SyncStatus = "guest" | "syncing" | "synced" | "error";
const SyncContext = createContext<{ session: Session | null; status: SyncStatus }>({ session: null, status: "guest" });

export function useSync() {
  return useContext(SyncContext);
}

/** Keeps local guest state and the signed-in user's Postgres rows in step. */
export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SyncStatus>("guest");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    const reconcile = async (s: Session | null) => {
      setSession(s);
      if (!s) return setStatus("guest");
      setStatus("syncing");
      try {
        const remote = await pullRemote(sb, s.user.id);
        const local = getState();
        if (remote && (!local.profile || remote.updatedAt > local.updatedAt)) hydrateState(remote);
        else if (local.profile) await pushRemote(sb, s.user.id, local);
        setStatus("synced");
      } catch (e) {
        console.error("Sync failed", e);
        setStatus("error");
      }
    };

    sb.auth.getSession().then(({ data }) => reconcile(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") reconcile(s);
    });

    const off = onLocalChange((state) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const { data } = await sb.auth.getSession();
        if (!data.session) return;
        setStatus("syncing");
        try {
          await pushRemote(sb, data.session.user.id, state);
          setStatus("synced");
        } catch (e) {
          console.error("Sync failed", e);
          setStatus("error");
        }
      }, 1200);
    });

    return () => {
      sub.subscription.unsubscribe();
      off();
    };
  }, []);

  return <SyncContext.Provider value={{ session, status }}>{children}</SyncContext.Provider>;
}
