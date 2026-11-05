"use client";

import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/lib/i18n/LocaleProvider";

/**
 * Coil is an original grid game: steer a growing line, pick up bits,
 * and don't touch the edge or your own trail.
 */

const COLS = 22;
const ROWS = 16;
const BEST_KEY = "as-coil-best";

type Cell = { x: number; y: number };
type Dir = { x: number; y: number };
type Phase = "ready" | "run" | "paused" | "over";

const START: Cell[] = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];

function same(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}

function opposite(a: Dir, b: Dir) {
  return a.x === -b.x && a.y === -b.y;
}

function placeBit(body: Cell[]): Cell {
  const open: Cell[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!body.some((cell) => cell.x === x && cell.y === y)) open.push({ x, y });
    }
  }
  return open[Math.floor(Math.random() * open.length)] ?? { x: 0, y: 0 };
}

function readBest() {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export default function CoilApp() {
  const t = useMessages().games;
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("ready");
  const bodyRef = useRef<Cell[]>(START.map((cell) => ({ ...cell })));
  const dirRef = useRef<Dir>({ x: 1, y: 0 });
  const queuedRef = useRef<Dir | null>(null);
  const bitRef = useRef<Cell>(placeBit(START));
  const scoreRef = useRef(0);
  const bestRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    bestRef.current = readBest();
    setBest(bestRef.current);
    rootRef.current?.focus();
  }, []);

  useEffect(() => {
    const start = () => {
      bodyRef.current = START.map((cell) => ({ ...cell }));
      dirRef.current = { x: 1, y: 0 };
      queuedRef.current = null;
      bitRef.current = placeBit(bodyRef.current);
      scoreRef.current = 0;
      setScore(0);
      phaseRef.current = "run";
      setPhase("run");
    };

    const turn = (next: Dir) => {
      const starting = phaseRef.current === "ready" || phaseRef.current === "over";
      if (starting) start();
      if (starting) {
        dirRef.current = next;
        queuedRef.current = null;
        return;
      }
      const current = queuedRef.current ?? dirRef.current;
      if (opposite(current, next)) return;
      queuedRef.current = next;
    };

    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const target = e.target;
      const host = root.closest(".os-window");
      const focused = document.querySelector(".os-window.is-focused");
      const inside = target instanceof Node && root.contains(target);
      if (!inside && focused !== host) return;
      const key = e.key.toLowerCase();
      if (key.startsWith("arrow") || key === " ") {
        e.preventDefault();
        e.stopPropagation();
      }
      if (key === "arrowup" || key === "w") turn({ x: 0, y: -1 });
      else if (key === "arrowdown" || key === "s") turn({ x: 0, y: 1 });
      else if (key === "arrowleft" || key === "a") turn({ x: -1, y: 0 });
      else if (key === "arrowright" || key === "d") turn({ x: 1, y: 0 });
      else if (key === " " || key === "spacebar") {
        if (phaseRef.current === "ready" || phaseRef.current === "over") start();
        else if (phaseRef.current === "run") {
          phaseRef.current = "paused";
          setPhase("paused");
        } else if (phaseRef.current === "paused") {
          phaseRef.current = "run";
          setPhase("run");
        }
      }
    };

    window.addEventListener("keydown", onKey, true);
    let raf = 0;
    let last = 0;

    const step = () => {
      const queued = queuedRef.current;
      if (queued && !opposite(dirRef.current, queued)) dirRef.current = queued;
      queuedRef.current = null;
      const dir = dirRef.current;
      const body = bodyRef.current;
      const head = body[0];
      const next = { x: head.x + dir.x, y: head.y + dir.y };
      const growing = same(next, bitRef.current);
      const hitsWall = next.x < 0 || next.y < 0 || next.x >= COLS || next.y >= ROWS;
      const hitsSelf = body.some((cell, index) => {
        if (!growing && index === body.length - 1) return false;
        return same(cell, next);
      });
      if (hitsWall || hitsSelf) {
        phaseRef.current = "over";
        setPhase("over");
        if (scoreRef.current > bestRef.current) {
          bestRef.current = scoreRef.current;
          setBest(scoreRef.current);
          try {
            localStorage.setItem(BEST_KEY, String(scoreRef.current));
          } catch {
            /* private mode */
          }
        }
        return;
      }
      const nextBody = [next, ...body];
      if (!growing) nextBody.pop();
      else {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        bitRef.current = placeBit(nextBody);
      }
      bodyRef.current = nextBody;
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const frame = frameRef.current;
      if (!canvas || !frame) return;
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, w, h);

      const cell = Math.max(4, Math.floor(Math.min(w / COLS, h / ROWS)));
      const ox = Math.floor((w - cell * COLS) / 2);
      const oy = Math.floor((h - cell * ROWS) / 2);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(ox + x * cell + 0.5, oy);
        ctx.lineTo(ox + x * cell + 0.5, oy + ROWS * cell);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(ox, oy + y * cell + 0.5);
        ctx.lineTo(ox + COLS * cell, oy + y * cell + 0.5);
        ctx.stroke();
      }

      const bit = bitRef.current;
      const pad = Math.max(2, Math.floor(cell * 0.22));
      ctx.fillStyle = "#f2c14e";
      ctx.beginPath();
      ctx.arc(ox + bit.x * cell + cell / 2, oy + bit.y * cell + cell / 2, Math.max(2, cell / 2 - pad), 0, Math.PI * 2);
      ctx.fill();

      const body = bodyRef.current;
      body.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#d7ffe8" : "#3ddc97";
        ctx.fillRect(ox + part.x * cell + 1, oy + part.y * cell + 1, cell - 2, cell - 2);
      });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const interval = Math.max(72, 148 - scoreRef.current * 3);
      if (phaseRef.current === "run" && now - last >= interval) {
        last = now;
        step();
      }
      draw();
    };
    raf = requestAnimationFrame(loop);

    const api = { turn, start };
    (rootRef.current as HTMLDivElement & { __coil?: typeof api }).__coil = api;

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);

  const press = (dir: Dir) => {
    rootRef.current?.focus();
    const api = (rootRef.current as HTMLDivElement & { __coil?: { turn: (d: Dir) => void } } | null)?.__coil;
    api?.turn(dir);
  };

  const pressStart = () => {
    rootRef.current?.focus();
    const api = (rootRef.current as HTMLDivElement & { __coil?: { start: () => void } } | null)?.__coil;
    if (phase === "paused") {
      phaseRef.current = "run";
      setPhase("run");
      return;
    }
    api?.start();
  };

  return (
    <div
      ref={rootRef}
      className="os-game absolute inset-0 flex flex-col bg-[#070b14] text-white outline-none"
      tabIndex={0}
      role="application"
      aria-label="Coil"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2 text-[12px] tracking-wide text-white/80">
        <span className="font-medium text-white">Coil</span>
        <span>
          {t.coilScore} {score}
          <span className="mx-2 text-white/30">·</span>
          {t.coilBest} {best}
        </span>
      </div>
      <div ref={frameRef} className="relative min-h-0 flex-1">
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
        {phase !== "run" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#070b14]/55 px-6 text-center">
            <div>
              <p className="text-sm text-white">
                {phase === "over" ? t.coilOver : phase === "paused" ? t.coilPaused : "Coil"}
              </p>
              <button
                type="button"
                className="mt-3 rounded-full border border-white/25 px-4 py-1.5 text-sm text-white hover:bg-white/10"
                onClick={pressStart}
              >
                {phase === "over" ? t.coilAgain : phase === "paused" ? t.coilResume : t.coilStart}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <p className="px-4 pt-2 text-center text-[11px] leading-snug text-white/55">{t.coilHint}</p>
      <div className="grid grid-cols-3 gap-2 px-4 pb-3 pt-2 sm:hidden">
        <span />
        <Pad label={t.coilUp} onPress={() => press({ x: 0, y: -1 })} />
        <span />
        <Pad label={t.coilLeft} onPress={() => press({ x: -1, y: 0 })} />
        <Pad label={t.coilDown} onPress={() => press({ x: 0, y: 1 })} />
        <Pad label={t.coilRight} onPress={() => press({ x: 1, y: 0 })} />
      </div>
      <p className="sr-only" aria-live="polite">
        {phase === "over" ? `${t.coilOver} ${t.coilScore} ${score}` : `${t.coilScore} ${score}`}
      </p>
    </div>
  );
}

function Pad({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="rounded-xl border border-white/20 py-3 text-xs text-white"
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
    >
      {label}
    </button>
  );
}
