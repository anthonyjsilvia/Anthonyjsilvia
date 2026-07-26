"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchPublicResume,
  ResumePublicError,
  type ResumePublicPayload,
} from "@/lib/resume-public";

type ResumePublicStatus = "idle" | "loading" | "ready" | "error";

type ResumePublicState = {
  status: ResumePublicStatus;
  data: ResumePublicPayload | null;
  error: string | null;
  refresh: () => void;
};

const ResumePublicContext = createContext<ResumePublicState | null>(null);

/**
 * Shared fetch for Experience + Resume pages. One request per mount tree;
 * API Cache-Control is ~60s so refreshes stay light.
 */
export function ResumePublicProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ResumePublicStatus>("loading");
  const [data, setData] = useState<ResumePublicPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    setStatus("loading");
    setError(null);

    fetchPublicResume({ signal: ac.signal })
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof ResumePublicError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load resume";
        setData(null);
        setError(message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [nonce]);

  const value = useMemo(
    () => ({ status, data, error, refresh }),
    [status, data, error, refresh],
  );

  return (
    <ResumePublicContext.Provider value={value}>
      {children}
    </ResumePublicContext.Provider>
  );
}

export function usePublicResume(): ResumePublicState {
  const ctx = useContext(ResumePublicContext);
  if (!ctx) {
    throw new Error("usePublicResume must be used within ResumePublicProvider");
  }
  return ctx;
}
