"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { searchSite, type SearchEntry } from "@/lib/search-index";

/**
 * Site search — combo trigger pill + ⌘K command palette.
 *
 *  • The trigger looks like a real search input (search icon + "Search…" label
 *    + a `⌘K` hint chip) so the affordance is obvious at a glance, but
 *    behaves as a single button that opens the modal palette. This is the
 *    same pattern used by Algolia DocSearch, Vercel, Linear, Notion, etc.
 *  • The modal renders the input and a result list filtered by `searchSite`.
 *    Arrow keys move the highlight, Enter navigates, Esc closes.
 *  • The component also listens globally for ⌘K / Ctrl+K, so the palette can
 *    be opened from anywhere on the site — including pages that don't render
 *    this component themselves (it lives in the persistent nav).
 *
 * Server-side rendering note: the search _index_ is statically resolved at
 * build time (see `lib/search-index.ts`). This component is `"use client"`
 * only because it owns interactive state — the underlying data and the
 * server-rendered shell are static.
 */
export default function SiteSearch() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const results = useMemo(() => searchSite(query, 12), [query]);

  // Keyboard shortcuts:
  //   "/"   — open the search palette (GitHub convention). Skipped when the
  //           user is already typing into another input so we don't hijack
  //           the keystroke from real text fields.
  //   Esc   — close the palette when it's open.
  //
  // Note: ⌘K / Ctrl+K is intentionally NOT bound here anymore — that
  // shortcut is now owned by the global terminal-mode toggle in SiteChrome.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "/" && !open) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        const editable =
          tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;
        if (editable) return; // don't steal "/" from a real text field
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus on open, reset on close.
  useEffect(() => {
    if (open) {
      // Defer one tick so the input is mounted before we focus it.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
    setActiveIdx(0);
  }, [open]);

  // Reset selection when the result set changes.
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Keep the active row scrolled into view as the user arrow-keys through.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const row = list.querySelector<HTMLElement>(`[data-row-idx="${activeIdx}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  // Lock page scroll while the palette is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSelect = (entry: SearchEntry) => {
    setOpen(false);
    router.push(entry.href);
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[activeIdx];
      if (entry) handleSelect(entry);
    }
  };

  return (
    <>
      {/* Trigger — compact icon-only button. `title` surfaces the keyboard
          shortcut for desktop users; pressing "/" anywhere on the page also
          opens the palette (GitHub-style). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        aria-haspopup="dialog"
        title="Search (press /)"
        className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
          >
            {/* Backdrop. Sits below the panel, accepts clicks to dismiss. */}
            <button
              type="button"
              aria-label="Close search"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm focus:outline-none"
            />

            {/* Palette panel. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: shouldReduceMotion ? 0 : -10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--background)]"
            >
              <h2 id="site-search-title" className="sr-only">
                Search the site
              </h2>

              <div className="flex items-center gap-3 border-b border-[var(--border-light)] px-4">
                <Search
                  className="h-5 w-5 flex-shrink-0 text-[var(--text-secondary)]"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKey}
                  placeholder="Search pages, portfolio, recommendations…"
                  className="flex-1 bg-transparent py-4 text-base text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
                  aria-label="Search the site"
                  aria-controls="site-search-results"
                  aria-activedescendant={
                    results[activeIdx] ? `site-search-row-${activeIdx}` : undefined
                  }
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <ul
                ref={listRef}
                id="site-search-results"
                role="listbox"
                aria-label="Search results"
                className="max-h-[60vh] overflow-y-auto p-2"
              >
                {results.length === 0 ? (
                  <li className="px-3 py-10 text-center text-sm text-[var(--text-secondary)]">
                    No results for{" "}
                    <span className="font-medium text-[var(--text-primary)]">
                      &ldquo;{query}&rdquo;
                    </span>
                    .
                  </li>
                ) : (
                  results.map((entry, idx) => {
                    const isActive = idx === activeIdx;
                    return (
                      <li key={entry.href}>
                        <button
                          type="button"
                          role="option"
                          id={`site-search-row-${idx}`}
                          data-row-idx={idx}
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => handleSelect(entry)}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none ${
                            isActive
                              ? "bg-[var(--primary)] text-white"
                              : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium leading-tight">
                              {entry.title}
                            </div>
                            {entry.description && (
                              <div
                                className={`mt-0.5 truncate text-sm leading-snug ${
                                  isActive
                                    ? "text-white/85"
                                    : "text-[var(--text-secondary)]"
                                }`}
                              >
                                {entry.description}
                              </div>
                            )}
                          </div>
                          <span
                            className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider ${
                              isActive ? "text-white/80" : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {entry.section}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>

              <div className="flex items-center justify-between gap-3 border-t border-[var(--border-light)] px-4 py-2.5 text-xs text-[var(--text-secondary)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center rounded border border-[var(--border-light)] bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10px] font-medium leading-none">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center rounded border border-[var(--border-light)] bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10px] font-medium leading-none">
                      ↵
                    </kbd>
                    open
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center rounded border border-[var(--border-light)] bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10px] font-medium leading-none">
                      esc
                    </kbd>
                    close
                  </span>
                </div>
                <span>
                  {results.length} result{results.length === 1 ? "" : "s"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
