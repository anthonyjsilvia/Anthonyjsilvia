"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  runCommand,
  buildBanner,
  type CommandResult,
  type TerminalContext,
} from "@/lib/terminal-commands";

/**
 * TerminalMode - the ⌘K easter egg. A keyboard-only, text-only command
 * prompt. Supports:
 *   • `overlay`   - fullscreen takeover (default, ⌘K outside AnthonyOS)
 *   • `embedded`  - fills a parent window (AnthonyOS Terminal.app)
 */

type LogLine =
  | { kind: "input"; text: string; prompt: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string };

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
  /** Fullscreen overlay vs in-window shell. */
  variant?: "overlay" | "embedded";
  /** Override navigation (e.g. leave AnthonyOS before routing). */
  onNavigate?: (href: string) => void;
};

export default function TerminalMode({
  open,
  onClose,
  variant = "overlay",
  onNavigate,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const embedded = variant === "embedded";

  const [lines, setLines] = useState<LogLine[]>(() => bannerLines());
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [cwd, setCwd] = useState("/");
  const [autofillLocked, setAutofillLocked] = useState(true);

  useEffect(() => {
    if (!open) return;
    setAutofillLocked(true);
    const id = requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.value = "";
      setInput("");
      el.setAttribute("autocomplete", "off");
      el.setAttribute("autocorrect", "off");
      el.setAttribute("autocapitalize", "none");
      el.setAttribute("spellcheck", "false");
      el.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open || embedded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, embedded]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (open) {
      setLines(bannerLines());
      setInput("");
      setHistory([]);
      setHistoryIdx(null);
      setCwd("/");
      setAutofillLocked(true);
    }
  }, [open]);

  const promptFor = (path: string) => `guest@anthonysilvia:${path}$`;

  const runLine = (raw: string) => {
    const prompt = promptFor(cwd);
    const inputEntry: LogLine = { kind: "input", text: raw, prompt };

    if (raw.trim()) {
      setHistory((h) => (h[h.length - 1] === raw.trim() ? h : [...h, raw.trim()]));
    }
    setHistoryIdx(null);

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
        if (onNavigate) {
          onNavigate(href);
          return;
        }
        onClose();
        requestAnimationFrame(() => router.push(href));
      },
      exit: onClose,
    };

    const result: CommandResult = raw.trim() ? runCommand(raw, ctx) : {};

    setLines((prev) => {
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

  const tryComplete = () => {
    const partial = input.trim();
    if (!partial || partial.includes(" ")) return;
    import("@/lib/terminal-commands").then(({ COMMAND_NAMES }) => {
      const matches = COMMAND_NAMES.filter((n) => n.startsWith(partial.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
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

    if (e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      setInput("");
      setHistoryIdx(null);
      return;
    }

    if (e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "w") {
      e.preventDefault();
      setInput((prev) => prev.replace(/\s*\S+\s*$/, ""));
      setHistoryIdx(null);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

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

  const shell = (
    <>
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
        onClick={() => inputRef.current?.focus()}
        className="relative h-full w-full overflow-y-auto px-4 py-5 text-[13px] leading-[1.55] sm:px-6 sm:py-6 sm:text-[14px]"
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

        <form
          className="relative flex items-baseline gap-2"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onSubmit={(e) => e.preventDefault()}
        >
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
              onFocus={(e) => {
                setAutofillLocked(false);
                const el = e.currentTarget;
                el.setAttribute("autocomplete", "off");
                el.setAttribute("autocorrect", "off");
                el.setAttribute("autocapitalize", "none");
                if (el.value && el.value !== input) {
                  el.value = input;
                }
              }}
              type="text"
              name="as_shell_prompt"
              id={embedded ? "as-shell-prompt-os" : "as-shell-prompt"}
              inputMode="text"
              enterKeyHint="send"
              role="textbox"
              readOnly={autofillLocked}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
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
        </form>
      </div>
    </>
  );

  if (embedded) {
    if (!open) return null;
    return (
      <div
        className="terminal-mode relative h-full w-full bg-black font-mono text-[#33ff66] selection:bg-[#33ff66] selection:text-black"
        role="region"
        aria-label="Terminal"
      >
        {shell}
      </div>
    );
  }

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
          {shell}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
