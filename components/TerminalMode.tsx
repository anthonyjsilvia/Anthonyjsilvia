"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  runCommand,
  buildBanner,
  type CommandResult,
  type TerminalContext,
} from "@/lib/terminal-commands";

/**
 * TerminalMode — the ⌘K easter egg. A keyboard-only, text-only command
 * prompt that takes over the entire viewport when activated. Built to feel
 * like a DOS / unix shell:
 *
 *   • Pure text. No images, no buttons. A blinking block cursor instead
 *     of the browser's I-beam caret.
 *   • Monospace, high-contrast, faint scan-line texture.
 *   • Up/Down arrow history, Tab autocomplete on command names.
 *   • Real terminal keystrokes: Ctrl+C interrupts, Ctrl+U clears the line,
 *     Ctrl+W deletes the previous word, Ctrl+L clears the screen.
 *   • Enter executes; output streams into a scrollback above the prompt.
 *   • Errors render in red, regular output in green.
 *   • Exit via `exit` / `quit`, the `Esc` key, or ⌘K / Ctrl+K (the same
 *     shortcut that opens it — see SiteChrome).
 *
 * The component is purely presentational glue; all command logic lives in
 * `lib/terminal-commands.ts` so the language surface can grow independently
 * of this UI layer.
 */

type LogLine =
  | { kind: "input"; text: string; prompt: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string };

/** Convert a `CommandResult` into a flat list of scrollback lines, preserving
 *  the `output` vs `error` distinction so the renderer can colour them. */
function resultToLines(result: CommandResult): LogLine[] {
  const out: LogLine[] = [];
  if (result.output) {
    for (const text of result.output) out.push({ kind: "output", text });
  }
  if (result.error) {
    for (const text of result.error) out.push({ kind: "error", text });
  }
  return out;
}

function bannerLines(): LogLine[] {
  return buildBanner().map((text) => ({ kind: "output" as const, text }));
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TerminalMode({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<LogLine[]>(() => bannerLines());
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [cwd, setCwd] = useState("/");

  // Focus the prompt whenever the terminal opens. requestAnimationFrame keeps
  // us out of React's commit phase so the input is mounted first.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Lock host scroll while the terminal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Auto-scroll to the bottom as the scrollback grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Reset to the banner each time the terminal opens fresh — feels cleaner
  // than resuming a stale session.
  useEffect(() => {
    if (open) {
      setLines(bannerLines());
      setInput("");
      setHistory([]);
      setHistoryIdx(null);
      setCwd("/");
    }
  }, [open]);

  const promptFor = (path: string) => `guest@anthonysilvia:${path}$`;

  const runLine = (raw: string) => {
    const prompt = promptFor(cwd);
    const inputEntry: LogLine = { kind: "input", text: raw, prompt };

    // Track command history (skip empty / duplicate consecutive entries).
    if (raw.trim()) {
      setHistory((h) => (h[h.length - 1] === raw.trim() ? h : [...h, raw.trim()]));
    }
    setHistoryIdx(null);

    // Special-case `history` here because it needs read access to the
    // accumulated history state that lives in this component, not in the
    // command registry.
    if (raw.trim().toLowerCase() === "history") {
      setLines((prev) => [
        ...prev,
        inputEntry,
        ...history.map((h, i) => ({ kind: "output" as const, text: `  ${i + 1}  ${h}` })),
        { kind: "output", text: "" },
      ]);
      setInput("");
      return;
    }

    const ctx: TerminalContext = {
      cwd,
      setCwd,
      navigate: (href: string) => {
        onClose();
        // defer router push so the close animation can start first
        requestAnimationFrame(() => router.push(href));
      },
      exit: onClose,
    };

    const result: CommandResult = raw.trim() ? runCommand(raw, ctx) : {};

    setLines((prev) => {
      // `reset` clears the scrollback and reprints the welcome banner —
      // matches the behaviour of reset(1) in a real terminal.
      if (result.clear && result.banner) {
        return bannerLines();
      }
      if (result.clear) {
        return [];
      }
      return [
        ...prev,
        inputEntry,
        ...resultToLines(result),
        { kind: "output", text: "" },
      ];
    });

    setInput("");
  };

  // Tab autocomplete — completes the first token if it matches exactly one
  // command name. Conservative on purpose; doesn't autocomplete arguments.
  const tryComplete = () => {
    const partial = input.trim();
    if (!partial || partial.includes(" ")) return;
    // Lazy-import to avoid pulling the full registry on first render.
    import("@/lib/terminal-commands").then(({ COMMAND_NAMES }) => {
      const matches = COMMAND_NAMES.filter((n) => n.startsWith(partial.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        // Append the matches as an output line so the user can pick.
        setLines((prev) => [
          ...prev,
          { kind: "input", text: input, prompt: promptFor(cwd) },
          { kind: "output", text: matches.join("  ") },
          { kind: "output", text: "" },
        ]);
      }
    });
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    // ----- real-terminal control keystrokes -------------------------------
    // Ctrl+C interrupts: echoes `^C` to the scrollback and clears the
    // current input line, matching what bash/zsh do on SIGINT.
    if (e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setLines((prev) => [
        ...prev,
        { kind: "input", text: `${input}^C`, prompt: promptFor(cwd) },
      ]);
      setInput("");
      setHistoryIdx(null);
      return;
    }

    // Ctrl+U clears the line back to the prompt.
    if (e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      setInput("");
      setHistoryIdx(null);
      return;
    }

    // Ctrl+W deletes the previous word (whitespace + non-whitespace run).
    if (e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "w") {
      e.preventDefault();
      setInput((prev) => prev.replace(/\s*\S+\s*$/, ""));
      setHistoryIdx(null);
      return;
    }

    // Ctrl+L (or ⌘L) clears, same as `clear` — a classic terminal shortcut.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

    // Ctrl+D on an empty line exits, matching shell behaviour.
    if (
      e.ctrlKey &&
      !e.metaKey &&
      e.key.toLowerCase() === "d" &&
      input === ""
    ) {
      e.preventDefault();
      onClose();
      return;
    }

    // ----- standard prompt keystrokes ------------------------------------
    if (e.key === "Enter") {
      e.preventDefault();
      runLine(input);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      tryComplete();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(history[next] ?? "");
      }
      return;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="terminal-mode fixed inset-0 z-[100] bg-black font-mono text-[#33ff66] selection:bg-[#33ff66] selection:text-black"
          role="dialog"
          aria-modal="true"
          aria-label="Terminal mode"
        >
          {/* Subtle CRT-ish scan-line texture — keeps the easter-egg vibe
              without the eye strain of a literal flicker. Pointer-events
              disabled so clicks fall through to the focus-the-input handler. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.45) 3px)",
            }}
          />

          <div
            ref={scrollRef}
            // Clicking anywhere focuses the input so the caret never gets lost.
            onClick={() => inputRef.current?.focus()}
            className="relative h-full w-full overflow-y-auto px-4 py-5 text-[13px] leading-[1.55] sm:px-8 sm:py-7 sm:text-[14px] md:text-[15px]"
          >
            {lines.map((line, idx) => {
              if (line.kind === "input") {
                return (
                  <div key={idx} className="whitespace-pre-wrap break-words">
                    <span className="select-none text-[#99ffaa]">{line.prompt}</span>
                    <span className="text-white"> {line.text}</span>
                  </div>
                );
              }
              if (line.kind === "error") {
                return (
                  <div
                    key={idx}
                    className="whitespace-pre-wrap break-words text-[#ff5f5f]"
                  >
                    {line.text || "\u00A0"}
                  </div>
                );
              }
              return (
                <div key={idx} className="whitespace-pre-wrap break-words">
                  {line.text || "\u00A0"}
                </div>
              );
            })}

            {/* Active prompt line. The visible row shows the prompt, the
                typed text, and a blinking block cursor; the real <input>
                is layered on top to capture keystrokes but has its caret
                and text colour hidden — that way the block we draw is the
                only cursor the user ever sees. */}
            <div className="relative flex items-baseline gap-2">
              <span className="flex-shrink-0 select-none text-[#99ffaa]">
                {promptFor(cwd)}
              </span>
              <div className="relative flex-1 min-w-0">
                <div
                  aria-hidden="true"
                  className="pointer-events-none whitespace-pre-wrap break-words"
                >
                  <span className="text-white">{input}</span>
                  <span className="terminal-block-cursor" />
                </div>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  // Defensive cocktail of attributes that tells browsers
                  // and password managers (1Password, LastPass, Bitwarden,
                  // Dashlane, Chrome, Safari) to leave this field alone.
                  // Plain `autoComplete="off"` is widely ignored, hence the
                  // belt + suspenders.
                  type="text"
                  name="terminal-command"
                  id="terminal-command"
                  inputMode="text"
                  enterKeyHint="send"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoSave="off"
                  spellCheck={false}
                  aria-autocomplete="none"
                  aria-label="Terminal input"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  data-dashlane-ignore="true"
                  className="terminal-input absolute inset-0 w-full bg-transparent text-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
