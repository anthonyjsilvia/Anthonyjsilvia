"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  Briefcase,
  FileText,
  FolderOpen,
  Home,
  LayoutGrid,
  Mail,
  Maximize2,
  MessageSquareQuote,
  Minus,
  Power,
  Sparkles,
  Terminal,
  User,
  Layers,
  X,
} from "lucide-react";
import TerminalMode from "@/components/TerminalMode";
import { renderOsAppContent } from "@/components/os/renderOsAppContent";
import { OS_APPS, OS_DOCK_APPS, type OsApp } from "@/lib/os-apps";
import { cineEase, dur } from "@/lib/motion";
import {
  getOsSurfaceStyle,
  type OsSurfaceStyle,
} from "@/lib/platform";
import type { AccessibilitySettings } from "@/lib/accessibility-settings";

type Props = {
  open: boolean;
  onClose: () => void;
  terminalLaunchToken?: number;
  accessibilitySettings: AccessibilitySettings;
  onAccessibilitySettingsChange: (settings: AccessibilitySettings) => void;
};

type WinState = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore?: { x: number; y: number; w: number; h: number };
};

const ICONS = {
  home: Home,
  briefcase: Briefcase,
  layout: LayoutGrid,
  evidence: FolderOpen,
  sparkles: Sparkles,
  file: FileText,
  mail: Mail,
  quote: MessageSquareQuote,
  terminal: Terminal,
  accessibility: Accessibility,
  work: Layers,
  about: User,
  user: User,
} as const;

const MIN_W = 320;
const MIN_H = 240;
const MOBILE_MQ = "(max-width: 768px)";

function defaultGeometry(index: number): Pick<WinState, "x" | "y" | "w" | "h"> {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const w = Math.min(920, Math.max(MIN_W, vw - 56));
  const h = Math.min(640, Math.max(MIN_H, vh - 140));
  const cascade = (index % 6) * 28;
  return {
    w,
    h,
    x: Math.max(16, Math.round((vw - w) / 2) + cascade - 40),
    y: Math.max(16, Math.round((vh - h) / 2) + cascade - 60),
  };
}

function AppGlyph({ app, size = "md" }: { app: OsApp; size?: "sm" | "md" }) {
  const Icon = ICONS[app.icon] ?? Home;
  const dim = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const pad = size === "sm" ? "h-10 w-10" : "h-14 w-14";
  return (
    <span className={`os-app-icon ${pad}`} style={{ background: app.tint }} aria-hidden="true">
      <Icon className={`${dim} text-white`} strokeWidth={1.75} />
    </span>
  );
}

function OsAppWindow({
  app,
  win,
  focused,
  isMobile,
  shouldReduceMotion,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onNavigateAway,
  onOpenApp,
  accessibilitySettings,
  onAccessibilitySettingsChange,
}: {
  app: OsApp;
  win: WinState;
  focused: boolean;
  isMobile: boolean;
  shouldReduceMotion: boolean | null;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onNavigateAway: (href: string) => void;
  onOpenApp: (id: string) => void;
  accessibilitySettings: AccessibilitySettings;
  onAccessibilitySettingsChange: (settings: AccessibilitySettings) => void;
}) {
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const maximized = isMobile || win.maximized;

  const onTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    onFocus();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onTitlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    onMove(drag.origX + (e.clientX - drag.startX), drag.origY + (e.clientY - drag.startY));
  };

  const onTitlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
  };

  if (win.minimized) return null;

  const style = maximized
    ? {
        left: isMobile ? 0 : 12,
        top: isMobile ? 0 : 12,
        width: isMobile ? "100%" : ("calc(100% - 24px)" as const),
        height: isMobile ? "calc(100% - 5.5rem)" : ("calc(100% - 96px)" as const),
        zIndex: win.z,
      }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  const native = renderOsAppContent(app.id, {
    onOpenApp,
    accessibilitySettings,
    onAccessibilitySettingsChange,
  });

  return (
    <motion.div
      role="dialog"
      aria-label={`${app.name} window`}
      className={`os-window${focused ? " is-focused" : ""}${isMobile ? " is-mobile" : ""}`}
      style={style}
      onMouseDown={onFocus}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: isMobile ? 1 : 0.96, y: isMobile ? 24 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: isMobile ? 24 : 8 }}
      transition={{ duration: shouldReduceMotion ? 0 : dur.md, ease: cineEase }}
    >
      <div
        className="os-window__titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
      >
        <p className="os-window__title">{app.name}</p>
        <div className="os-window__controls" role="toolbar" aria-label="Window controls">
          <button
            type="button"
            className="os-window__ctrl os-window__ctrl--min"
            aria-label={`Minimize ${app.name}`}
            onClick={onMinimize}
          >
            <Minus className="os-window__ctrl-icon" strokeWidth={2.25} aria-hidden="true" />
          </button>
          {!isMobile ? (
            <button
              type="button"
              className="os-window__ctrl os-window__ctrl--max"
              aria-label={
                win.maximized ? `Restore ${app.name}` : `Expand ${app.name}`
              }
              onClick={onToggleMaximize}
            >
              <Maximize2 className="os-window__ctrl-icon" strokeWidth={2.25} aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            className="os-window__ctrl os-window__ctrl--close"
            aria-label={`Close ${app.name}`}
            onClick={onClose}
          >
            <X className="os-window__ctrl-icon" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="os-window__content">
        {app.action === "terminal" ? (
          <TerminalMode open variant="embedded" onClose={onClose} onNavigate={onNavigateAway} />
        ) : (
          native
        )}
      </div>
    </motion.div>
  );
}

export default function OsMode({
  open,
  onClose,
  terminalLaunchToken = 0,
  accessibilitySettings,
  onAccessibilitySettingsChange,
}: Props) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const titleId = useId();
  const desktopRef = useRef<HTMLDivElement>(null);
  const zCounter = useRef(10);

  const [windows, setWindows] = useState<WinState[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  // Default material until hydrated so non-Apple devices never flash glass blur.
  const [surfaceStyle, setSurfaceStyle] = useState<OsSurfaceStyle>("material");

  const openIds = new Set(windows.map((w) => w.id));
  const windowsRef = useRef(windows);
  const focusIdRef = useRef(focusId);
  windowsRef.current = windows;
  focusIdRef.current = focusId;

  useEffect(() => {
    setSurfaceStyle(getOsSurfaceStyle());
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const bringToFront = useCallback((id: string) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
    setFocusId(id);
  }, []);

  const openApp = useCallback(
    (app: OsApp) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === app.id);
        if (existing) {
          zCounter.current += 1;
          setFocusId(app.id);
          return prev.map((w) =>
            w.id === app.id ? { ...w, z: zCounter.current, minimized: false } : w,
          );
        }
        zCounter.current += 1;
        const geo = defaultGeometry(prev.length);
        setFocusId(app.id);
        return [
          ...prev,
          {
            id: app.id,
            ...geo,
            z: zCounter.current,
            minimized: false,
            maximized: isMobile,
          },
        ];
      });
    },
    [isMobile],
  );

  const openAppById = useCallback(
    (id: string) => {
      const app = OS_APPS.find((a) => a.id === id);
      if (app) openApp(app);
    },
    [openApp],
  );

  const closeApp = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocusId((cur) => (cur === id ? null : cur));
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setFocusId((cur) => (cur === id ? null : cur));
  }, []);

  const toggleMaximize = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          if (w.maximized && w.restore) {
            return {
              ...w,
              maximized: false,
              x: w.restore.x,
              y: w.restore.y,
              w: w.restore.w,
              h: w.restore.h,
              restore: undefined,
            };
          }
          return {
            ...w,
            maximized: true,
            restore: { x: w.x, y: w.y, w: w.w, h: w.h },
          };
        }),
      );
      bringToFront(id);
    },
    [bringToFront],
  );

  const moveApp = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const onNavigateAway = useCallback(
    (href: string) => {
      onClose();
      requestAnimationFrame(() => router.push(href));
    },
    [onClose, router],
  );

  const onDockClick = useCallback(
    (app: OsApp) => {
      const win = windows.find((w) => w.id === app.id);
      if (!win) {
        openApp(app);
        return;
      }
      if (win.minimized) {
        bringToFront(app.id);
        return;
      }
      if (focusId === app.id) {
        minimizeApp(app.id);
        return;
      }
      bringToFront(app.id);
    },
    [bringToFront, focusId, minimizeApp, openApp, windows],
  );

  useEffect(() => {
    if (!open) {
      setWindows([]);
      setFocusId(null);
      setExitConfirmOpen(false);
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => desktopRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(".terminal-mode")) return;
      e.preventDefault();
      if (exitConfirmOpen) {
        setExitConfirmOpen(false);
        return;
      }
      const focused = focusIdRef.current;
      if (focused) {
        closeApp(focused);
        return;
      }
      const top = [...windowsRef.current]
        .filter((w) => !w.minimized)
        .sort((a, b) => b.z - a.z)[0];
      if (top) {
        closeApp(top.id);
        return;
      }
      setExitConfirmOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeApp, exitConfirmOpen]);

  useEffect(() => {
    if (!open || !terminalLaunchToken) return;
    const terminal = OS_APPS.find((a) => a.id === "terminal");
    if (terminal) openApp(terminal);
  }, [terminalLaunchToken, open, openApp]);

  const visibleWindows = windows.filter((w) => !w.minimized);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="anthony-os"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`os-shell os-shell--${surfaceStyle}${isMobile ? " os-shell--mobile" : ""}`}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : dur.md, ease: cineEase }}
        >
          <div className="os-wallpaper" aria-hidden="true" />
          <h2 id={titleId} className="sr-only">
            AnthonyOS
          </h2>

          <div ref={desktopRef} className="os-desktop" tabIndex={-1}>
            <AnimatePresence>
              {visibleWindows.map((win) => {
                const app = OS_APPS.find((a) => a.id === win.id);
                if (!app) return null;
                return (
                  <OsAppWindow
                    key={win.id}
                    app={app}
                    win={win}
                    focused={focusId === win.id}
                    isMobile={isMobile}
                    shouldReduceMotion={shouldReduceMotion}
                    onFocus={() => bringToFront(win.id)}
                    onClose={() => closeApp(win.id)}
                    onMinimize={() => minimizeApp(win.id)}
                    onToggleMaximize={() => toggleMaximize(win.id)}
                    onMove={(x, y) => moveApp(win.id, x, y)}
                    onNavigateAway={onNavigateAway}
                    onOpenApp={openAppById}
                    accessibilitySettings={accessibilitySettings}
                    onAccessibilitySettingsChange={onAccessibilitySettingsChange}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          <nav className="os-dock" aria-label="Dock">
            <ul className="os-dock__list">
              {OS_DOCK_APPS.map((app) => {
                const isOpen = openIds.has(app.id);
                const win = windows.find((w) => w.id === app.id);
                const isActive = isOpen && !win?.minimized && focusId === app.id;
                return (
                  <li key={app.id} className="os-dock__slot">
                    <button
                      type="button"
                      className={`os-dock__item${isActive ? " is-active" : ""}${isOpen ? " is-open" : ""}`}
                      aria-label={isOpen ? `${app.name}, open` : app.name}
                      onClick={() => onDockClick(app)}
                    >
                      <span className="os-dock__tooltip">{app.name}</span>
                      <AppGlyph app={app} size="sm" />
                      {isOpen ? (
                        <span className="os-dock__dot" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
              <li className="os-dock__sep" aria-hidden="true" />
              <li className="os-dock__slot">
                <button
                  type="button"
                  className="os-dock__item os-dock__item--power"
                  aria-label="Exit AnthonyOS"
                  onClick={() => setExitConfirmOpen(true)}
                >
                  <span className="os-dock__tooltip">Exit</span>
                  <span
                    className="os-app-icon h-10 w-10"
                    style={{ background: "rgb(180, 50, 50)" }}
                  >
                    <Power
                      className="h-5 w-5 text-white"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          <AnimatePresence>
            {exitConfirmOpen ? (
              <motion.div
                key="os-exit-confirm"
                className="os-exit"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="os-exit-title"
                aria-describedby="os-exit-desc"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              >
                <button
                  type="button"
                  className="os-exit__backdrop"
                  aria-label="Dismiss exit confirmation"
                  onClick={() => setExitConfirmOpen(false)}
                />
                <motion.div
                  className="os-exit__card"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 10 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, scale: 0.98, y: 8 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : dur.md,
                    ease: cineEase,
                  }}
                >
                  <p className="os-exit__eyebrow">AnthonyOS</p>
                  <h3 id="os-exit-title" className="os-exit__title">
                    Exit to anthonysilvia.com?
                  </h3>
                  <p id="os-exit-desc" className="os-exit__desc">
                    You&apos;re about to leave AnthonyOS and return to the main
                    website. Open windows will close.
                  </p>
                  <div className="os-exit__actions">
                    <button
                      type="button"
                      className="os-exit__btn"
                      onClick={() => setExitConfirmOpen(false)}
                    >
                      Stay in AnthonyOS
                    </button>
                    <button
                      type="button"
                      className="os-exit__btn os-exit__btn--danger"
                      onClick={() => {
                        setExitConfirmOpen(false);
                        onClose();
                      }}
                    >
                      Exit to website
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
