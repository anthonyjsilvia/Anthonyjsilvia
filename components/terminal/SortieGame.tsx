"use client";

import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/lib/i18n/LocaleProvider";

/**
 * Sortie is an original formation shooter drawn in the terminal palette.
 * A wing of diamond craft sways, peels off, and dives. It does not use
 * another game's name, sprites, or capture mechanic.
 */

const WORLD_W = 160;
const WORLD_H = 200;
const COLS = 7;
const ROWS = 3;

type Phase = "ready" | "play" | "over";

type Craft = {
  col: number;
  row: number;
  alive: boolean;
  diving: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Shot = { x: number; y: number; vy: number; friendly: boolean };

type Keys = { left: boolean; right: boolean; fire: boolean };

function makeWing(): Craft[] {
  const wing: Craft[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      wing.push({ col, row, alive: true, diving: false, x: 0, y: 0, vx: 0, vy: 0 });
    }
  }
  return wing;
}

function homeOf(craft: Craft, sway: number) {
  const gapX = 16;
  const origin = (WORLD_W - (COLS - 1) * gapX) / 2;
  return {
    x: origin + craft.col * gapX + sway,
    y: 26 + craft.row * 14,
  };
}

export default function SortieGame({ onExit }: { onExit: (score: number) => void }) {
  const t = useMessages().games;
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  const phaseRef = useRef<Phase>("ready");
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const waveRef = useRef(1);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);

  useEffect(() => {
    rootRef.current?.focus();
    const keys: Keys = { left: false, right: false, fire: false };
    const wing = makeWing();
    const shots: Shot[] = [];
    const stars = Array.from({ length: 36 }, () => ({
      x: Math.random() * WORLD_W,
      y: Math.random() * WORLD_H,
      s: Math.random() * 0.7 + 0.3,
    }));
    let playerX = WORLD_W / 2;
    let invuln = 0;
    let fireAt = 0;
    let diveAt = 1.1;
    let enemyFireAt = 0.8;
    let clock = 0;
    let respawn = 0;

    const setPhaseBoth = (next: Phase) => {
      phaseRef.current = next;
      setPhase(next);
    };

    const launch = () => {
      if (phaseRef.current === "over") {
        wing.splice(0, wing.length, ...makeWing());
        shots.splice(0, shots.length);
        scoreRef.current = 0;
        livesRef.current = 3;
        waveRef.current = 1;
        setScore(0);
        setLives(3);
        setWave(1);
        playerX = WORLD_W / 2;
        invuln = 0;
        respawn = 0;
      }
      setPhaseBoth("play");
    };

    const quit = () => onExitRef.current(scoreRef.current);

    const onKeyDown = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const target = e.target;
      const inTerminal = target instanceof Element && Boolean(target.closest(".terminal-mode"));
      const inGame = target instanceof Node && root.contains(target);
      if (!inTerminal && !inGame) return;
      const key = e.key.toLowerCase();
      if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (key === "arrowleft" || key === "a") keys.left = true;
      if (key === "arrowright" || key === "d") keys.right = true;
      if (key === " " || key === "spacebar") {
        keys.fire = true;
        if (phaseRef.current !== "play") launch();
      }
      if (key === "escape" || key === "q") quit();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "a") keys.left = false;
      if (key === "arrowright" || key === "d") keys.right = false;
      if (key === " " || key === "spacebar") keys.fire = false;
    };

    const hold = (which: "left" | "right" | "fire", down: boolean) => {
      keys[which] = down;
      rootRef.current?.focus();
      if (which === "fire" && down && phaseRef.current !== "play") launch();
    };
    (rootRef.current as HTMLDivElement & { __sortie?: typeof hold }).__sortie = hold;

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp);

    let raf = 0;
    let last = performance.now();

    const update = (dt: number) => {
      clock += dt;
      const speed = 62 + (waveRef.current - 1) * 6;
      if (keys.left) playerX -= speed * dt;
      if (keys.right) playerX += speed * dt;
      playerX = Math.max(8, Math.min(WORLD_W - 8, playerX));
      invuln = Math.max(0, invuln - dt);

      const sway = Math.sin(clock * 0.85) * (8 + waveRef.current);
      const living = wing.filter((craft) => craft.alive);

      if (living.length === 0) {
        respawn += dt;
        if (respawn > 0.9) {
          waveRef.current += 1;
          setWave(waveRef.current);
          wing.splice(0, wing.length, ...makeWing());
          respawn = 0;
        }
      } else {
        respawn = 0;
        diveAt -= dt;
        if (diveAt <= 0) {
          const pool = living.filter((craft) => !craft.diving);
          const pick = pool[Math.floor(Math.random() * pool.length)];
          if (pick) {
            const home = homeOf(pick, sway);
            pick.diving = true;
            pick.x = home.x;
            pick.y = home.y;
            pick.vx = playerX > home.x ? 18 : -18;
            pick.vy = 36 + waveRef.current * 4;
          }
          diveAt = Math.max(0.45, 1.35 - waveRef.current * 0.08);
        }
        enemyFireAt -= dt;
        if (enemyFireAt <= 0 && shots.filter((shot) => !shot.friendly).length < 4) {
          const shooter = living[Math.floor(Math.random() * living.length)];
          const pos = shooter.diving ? shooter : homeOf(shooter, sway);
          shots.push({ x: pos.x, y: pos.y + 3, vy: 42 + waveRef.current * 3, friendly: false });
          enemyFireAt = Math.max(0.35, 0.95 - waveRef.current * 0.05);
        }
      }

      for (const craft of wing) {
        if (!craft.alive || !craft.diving) continue;
        craft.vx += Math.sin(clock * 3 + craft.col) * 30 * dt;
        craft.x += craft.vx * dt;
        craft.y += craft.vy * dt;
        if (craft.y > WORLD_H + 8) {
          craft.diving = false;
        }
      }

      if (keys.fire && clock >= fireAt && phaseRef.current === "play") {
        shots.push({ x: playerX, y: 176, vy: -96, friendly: true });
        fireAt = clock + 0.22;
      }

      for (let i = shots.length - 1; i >= 0; i--) {
        const shot = shots[i];
        shot.y += shot.vy * dt;
        if (shot.y < -6 || shot.y > WORLD_H + 6) {
          shots.splice(i, 1);
          continue;
        }
        if (shot.friendly) {
          const hit = wing.find((craft) => {
            if (!craft.alive) return false;
            const pos = craft.diving ? craft : homeOf(craft, sway);
            return Math.hypot(pos.x - shot.x, pos.y - shot.y) < 4.2;
          });
          if (hit) {
            hit.alive = false;
            hit.diving = false;
            scoreRef.current += 100;
            setScore(scoreRef.current);
            shots.splice(i, 1);
          }
        } else if (invuln <= 0 && Math.hypot(shot.x - playerX, shot.y - 184) < 4) {
          shots.splice(i, 1);
          hurt();
        }
      }

      if (invuln <= 0) {
        const ram = wing.find((craft) => {
          if (!craft.alive || !craft.diving) return false;
          return Math.hypot(craft.x - playerX, craft.y - 184) < 5;
        });
        if (ram) {
          ram.alive = false;
          hurt();
        }
      }
    };

    const hurt = () => {
      livesRef.current -= 1;
      setLives(livesRef.current);
      invuln = 1.25;
      if (livesRef.current <= 0) setPhaseBoth("over");
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const frame = frameRef.current;
      if (!canvas || !frame) return;
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      const scale = Math.min(w / WORLD_W, h / WORLD_H);
      const ox = (w - WORLD_W * scale) / 2;
      const oy = (h - WORLD_H * scale) / 2;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(scale, scale);

      ctx.fillStyle = "rgba(51,255,102,0.28)";
      for (const star of stars) ctx.fillRect(star.x, star.y, star.s, star.s);

      const sway = Math.sin(clock * 0.85) * (8 + waveRef.current);
      for (const craft of wing) {
        if (!craft.alive) continue;
        const pos = craft.diving ? craft : homeOf(craft, sway);
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = craft.row === 0 ? "#b8ffd4" : craft.row === 1 ? "#33ff66" : "#7dffb3";
        ctx.fillRect(-3.2, -3.2, 6.4, 6.4);
        ctx.restore();
      }

      for (const shot of shots) {
        ctx.fillStyle = shot.friendly ? "#eafff2" : "#ff5f5f";
        ctx.fillRect(shot.x - 0.6, shot.y - 2.2, 1.2, 4.4);
      }

      if (invuln <= 0 || Math.floor(clock * 12) % 2 === 0) {
        ctx.fillStyle = "#99ffaa";
        ctx.beginPath();
        ctx.moveTo(playerX, 176);
        ctx.lineTo(playerX - 5.5, 188);
        ctx.lineTo(playerX + 5.5, 188);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (phaseRef.current === "play") update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const hold = (which: "left" | "right" | "fire", down: boolean) => {
    const api = (rootRef.current as HTMLDivElement & { __sortie?: (w: typeof which, d: boolean) => void } | null)
      ?.__sortie;
    api?.(which, down);
  };

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-10 flex flex-col bg-black text-[#33ff66] outline-none"
      tabIndex={0}
      role="application"
      aria-label="Sortie"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2 font-mono text-[12px]">
        <span>Sortie</span>
        <span>
          {t.sortieScore} {score}
          <span className="mx-2 text-[#33ff66]/40">·</span>
          {t.sortieWave} {wave}
          <span className="mx-2 text-[#33ff66]/40">·</span>
          {t.sortieLives} {lives}
        </span>
      </div>
      <div ref={frameRef} className="relative min-h-0 flex-1">
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
        {phase !== "play" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 px-6 text-center font-mono">
            <div>
              <p className="text-sm text-[#99ffaa]">{phase === "over" ? t.sortieOver : t.sortieReady}</p>
              {phase === "over" ? (
                <p className="mt-1 text-xs text-[#33ff66]/80">
                  {t.sortieScore} {score}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#33ff66]/40 px-4 py-1.5 text-sm text-[#99ffaa]"
                  onClick={() => {
                    rootRef.current?.focus();
                    hold("fire", true);
                    window.setTimeout(() => hold("fire", false), 30);
                  }}
                >
                  {phase === "over" ? t.sortieAgain : "Sortie"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#33ff66]/25 px-4 py-1.5 text-sm text-[#33ff66]/80"
                  onClick={() => onExit(scoreRef.current)}
                >
                  {t.sortieQuit}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <p className="px-4 py-2 text-center font-mono text-[11px] text-[#33ff66]/70">{t.sortieHint}</p>
      <div className="flex gap-2 px-4 pb-3 sm:hidden">
        <Hold label={t.sortieLeft} onDown={() => hold("left", true)} onUp={() => hold("left", false)} />
        <Hold label={t.sortieFire} onDown={() => hold("fire", true)} onUp={() => hold("fire", false)} />
        <Hold label={t.sortieRight} onDown={() => hold("right", true)} onUp={() => hold("right", false)} />
      </div>
      <p className="sr-only" aria-live="polite">
        {phase === "over" ? `${t.sortieOver} ${t.sortieScore} ${score}` : ""}
      </p>
    </div>
  );
}

function Hold({
  label,
  onDown,
  onUp,
}: {
  label: string;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="flex-1 rounded-xl border border-[#33ff66]/30 py-3 font-mono text-xs text-[#99ffaa]"
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
    >
      {label}
    </button>
  );
}
