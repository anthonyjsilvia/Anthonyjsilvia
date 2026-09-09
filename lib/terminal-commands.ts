/**
 * Terminal-mode command registry - the brains of the ⌘K easter egg.
 *
 * Each command is a pure function from `(args, ctx) → CommandResult`. The
 * result is a list of output lines (rendered into the terminal scrollback)
 * plus an optional `clear` flag to wipe the screen. Side-effects that change
 * the host page (navigation, theme, exit) are funnelled through the
 * `TerminalContext` so the terminal stays decoupled from Next.js specifics.
 *
 * Adding a command: drop a new entry into `COMMANDS`. Adding an alias: assign
 * `COMMANDS.alias = COMMANDS.original` after the registry is defined.
 */

import { recommendations } from "@/lib/recommendations";

export type TerminalContext = {
  /** Current pretend working directory shown in the prompt. */
  cwd: string;
  /** Updates the pretend cwd (a la `cd`). */
  setCwd: (next: string) => void;
  /** Closes the terminal and pushes the host router to `href`. */
  navigate: (href: string) => void;
  /** Closes the terminal without navigating. */
  exit: () => void;
};

export type CommandResult = {
  /** Lines to append to the scrollback. Rendered in the standard text color. */
  output?: string[];
  /** Lines to append in the error color (red) - for "command not found",
   *  "permission denied", invalid args, etc. */
  error?: string[];
  /** When true, replace the scrollback with an empty array. */
  clear?: boolean;
  /** When true, also reprint the welcome banner after clearing (i.e. `reset`). */
  banner?: boolean;
};

type CommandHandler = (args: string[], ctx: TerminalContext) => CommandResult;

/* -------------------------------------------------------------------------- */
/* Page routing map - shared by `cd`, `open`, `ls`.                            */
/* -------------------------------------------------------------------------- */

const PAGES: { name: string; path: string; href: string; description: string }[] = [
  { name: "home", path: "/", href: "/", description: "Landing page" },
  { name: "experience", path: "/experience", href: "/experience", description: "Career timeline" },
  { name: "portfolio", path: "/portfolio", href: "/portfolio", description: "Selected work" },
  { name: "evidence", path: "/evidence", href: "/evidence", description: "Evidence" },
  { name: "resume", path: "/resume", href: "/resume", description: "Downloadable resume" },
  { name: "contact", path: "/contact", href: "/contact", description: "Contact form" },
  {
    name: "recommendations",
    path: "/recommendations",
    href: "/#recommendations",
    description: "Testimonials list (on home)",
  },
];

function findPage(token: string) {
  const clean = token.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  if (clean === "" || clean === "~") {
    return PAGES.find((p) => p.path === "/") ?? null;
  }
  return PAGES.find((p) => p.name === clean) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Device-spec collection - used by `neofetch`, `lscpu`, `free`, `ifconfig`.   */
/*                                                                             */
/* All values are pulled synchronously from the browser environment so the     */
/* command handlers stay pure functions returning a CommandResult. The         */
/* async, high-entropy User-Agent Client Hints (architecture, model, etc.)     */
/* are intentionally skipped - they'd require a Promise-based command API      */
/* and the data here is plenty for an easter egg.                              */
/* -------------------------------------------------------------------------- */

type DeviceSpecs = {
  hostname: string;
  os: string;
  browser: string;
  engine: string;
  locale: string;
  timezone: string;
  resolution: string;
  viewport: string;
  cpuCores: string;
  memory: string;
  connection: string;
  colorScheme: string;
  reducedMotion: string;
  touch: string;
  gpu: string;
  pixelRatio: string;
  online: string;
};

function detectOS(ua: string): string {
  // navigator.userAgentData.platform is the modern, more-private signal;
  // fall back to UA-string heuristics for Safari / Firefox / older browsers.
  const uaData = (
    typeof navigator !== "undefined"
      ? (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
      : undefined
  );

  if (/Mac OS X ([\d_]+)/.test(ua)) {
    const m = /Mac OS X ([\d_]+)/.exec(ua);
    return `macOS ${m?.[1]?.replace(/_/g, ".") || ""}`.trim();
  }
  if (/Windows NT ([\d.]+)/.test(ua)) {
    const m = /Windows NT ([\d.]+)/.exec(ua);
    const ver = m?.[1] || "";
    // Windows 10 and 11 both report NT 10.0 - Microsoft made that decision,
    // not us.
    const map: Record<string, string> = {
      "10.0": "10/11",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
    };
    return `Windows ${map[ver] || ver}`;
  }
  if (/iPhone|iPad|iPod/.test(ua)) {
    const m = /OS ([\d_]+) like Mac/.exec(ua);
    return `iOS ${m?.[1]?.replace(/_/g, ".") || ""}`.trim();
  }
  if (/Android ([\d.]+)/.test(ua)) {
    const m = /Android ([\d.]+)/.exec(ua);
    return `Android ${m?.[1] || ""}`.trim();
  }
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  if (uaData?.platform) return uaData.platform;
  return "Unknown";
}

function detectBrowser(ua: string): { browser: string; engine: string } {
  let browser = "Unknown";
  let engine = "Unknown";

  if (/Edg\/([\d.]+)/.test(ua)) {
    browser = `Edge ${/Edg\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  } else if (/OPR\/([\d.]+)/.test(ua)) {
    browser = `Opera ${/OPR\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  } else if (/Firefox\/([\d.]+)/.test(ua)) {
    browser = `Firefox ${/Firefox\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  } else if (/CriOS\/([\d.]+)/.test(ua)) {
    browser = `Chrome (iOS) ${/CriOS\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  } else if (/FxiOS\/([\d.]+)/.test(ua)) {
    browser = `Firefox (iOS) ${/FxiOS\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  } else if (/Chrome\/([\d.]+)/.test(ua)) {
    browser = `Chrome ${/Chrome\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  } else if (/Version\/([\d.]+).*Safari/.test(ua)) {
    browser = `Safari ${/Version\/([\d.]+)/.exec(ua)?.[1] || ""}`.trim();
  }

  if (/Gecko\/\d/.test(ua)) engine = "Gecko";
  else if (/AppleWebKit/.test(ua))
    engine = /Chrome|CriOS|Edg|OPR/.test(ua) ? "Blink" : "WebKit";

  return { browser, engine };
}

function detectGPU(): string {
  if (typeof document === "undefined") return "Unavailable";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "Unavailable (no WebGL)";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) {
      // Safari hides the renderer behind privacy gates by default.
      return "Hidden (privacy)";
    }
    const raw = (gl.getParameter(
      (ext as { UNMASKED_RENDERER_WEBGL: number }).UNMASKED_RENDERER_WEBGL,
    ) as string) || "Unknown";
    // ANGLE wraps the real renderer like "ANGLE (Apple, Apple M1 Pro, ...)"  - 
    // pull out the inner string when it's there.
    const angle = /^ANGLE \((.+)\)$/.exec(raw);
    return angle ? angle[1].split(",").slice(0, 2).join(",").trim() : raw;
  } catch {
    return "Unavailable";
  }
}

export function getDeviceSpecs(): DeviceSpecs {
  // Server-render safety: every browser global is guarded. If the function
  // is ever called outside the browser it returns a fully-populated object
  // of "Unknown" placeholders so the formatters don't have to special-case.
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      hostname: "anthonysilvia.com",
      os: "Unknown",
      browser: "Unknown",
      engine: "Unknown",
      locale: "Unknown",
      timezone: "Unknown",
      resolution: "Unknown",
      viewport: "Unknown",
      cpuCores: "Unknown",
      memory: "Unknown",
      connection: "Unknown",
      colorScheme: "Unknown",
      reducedMotion: "Unknown",
      touch: "Unknown",
      gpu: "Unknown",
      pixelRatio: "Unknown",
      online: "Unknown",
    };
  }

  const ua = navigator.userAgent;
  const { browser, engine } = detectBrowser(ua);

  const conn = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number };
    }
  ).connection;
  const connectionParts: string[] = [];
  if (conn?.effectiveType) connectionParts.push(conn.effectiveType);
  if (conn?.downlink) connectionParts.push(`~${conn.downlink} Mbps`);
  const connection = connectionParts.length ? connectionParts.join(", ") : "Hidden";

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  return {
    hostname: window.location.hostname || "anthonysilvia.com",
    os: detectOS(ua),
    browser,
    engine,
    locale: navigator.language || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    resolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    cpuCores: String(navigator.hardwareConcurrency || "Unknown"),
    memory: deviceMemory ? `${deviceMemory} GB` : "Hidden (privacy)",
    connection,
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "yes"
      : "no",
    touch:
      navigator.maxTouchPoints > 0
        ? `yes (${navigator.maxTouchPoints} points)`
        : "no",
    gpu: detectGPU(),
    pixelRatio: `${window.devicePixelRatio}x`,
    online: navigator.onLine ? "yes" : "no",
  };
}

/* -------------------------------------------------------------------------- */
/* Manual pages - one per documented command. Kept terse and unix-flavoured.   */
/* -------------------------------------------------------------------------- */

const MAN_PAGES: Record<string, string[]> = {
  help: [
    "NAME",
    "       help - list available terminal commands",
    "",
    "SYNOPSIS",
    "       help",
    "",
    "DESCRIPTION",
    "       Prints a one-line summary of every command this terminal",
    "       understands, plus the inline keyboard shortcuts.",
    "",
    "SEE ALSO",
    "       man(1)",
  ],
  ls: [
    "NAME",
    "       ls - list pages and files",
    "",
    "SYNOPSIS",
    "       ls",
    "",
    "DESCRIPTION",
    "       Lists the pages and faux-files visible to this terminal.",
    "       The filesystem is a static snapshot - there is no real",
    "       directory tree behind it.",
  ],
  cd: [
    "NAME",
    "       cd - change the current page",
    "",
    "SYNOPSIS",
    "       cd <page>",
    "",
    "DESCRIPTION",
    "       Updates the prompt to point at <page>. Purely cosmetic  - ",
    "       use `open` to actually navigate the host site.",
  ],
  open: [
    "NAME",
    "       open - open a page in the regular site",
    "",
    "SYNOPSIS",
    "       open <page>",
    "",
    "DESCRIPTION",
    "       Closes terminal mode and pushes the browser router to the",
    "       given page. Valid <page> values: home, experience, portfolio,",
    "       evidence, resume, contact, recommendations.",
  ],
  cat: [
    "NAME",
    "       cat - print the contents of a file",
    "",
    "SYNOPSIS",
    "       cat <file>",
    "",
    "DESCRIPTION",
    "       Prints one of the synthetic files exposed by the terminal.",
    "       Run `ls` to see what's available.",
  ],
  reset: [
    "NAME",
    "       reset - reset the terminal",
    "",
    "SYNOPSIS",
    "       reset",
    "",
    "DESCRIPTION",
    "       Clears the scrollback and reprints the welcome banner.",
    "       Roughly equivalent to running `clear` followed by `motd`.",
  ],
  clear: [
    "NAME",
    "       clear - clear the terminal screen",
    "",
    "SYNOPSIS",
    "       clear",
    "",
    "DESCRIPTION",
    "       Empties the scrollback. Keyboard shortcut: Ctrl+L.",
  ],
  exit: [
    "NAME",
    "       exit - leave terminal mode",
    "",
    "SYNOPSIS",
    "       exit",
    "",
    "DESCRIPTION",
    "       Closes the terminal overlay and returns to the regular site.",
    "       Equivalent shortcuts: ⌘K, Ctrl+K, Esc.",
  ],
  echo: [
    "NAME",
    "       echo - write arguments to standard output",
    "",
    "SYNOPSIS",
    "       echo [string ...]",
    "",
    "DESCRIPTION",
    "       Prints its arguments back to the terminal, separated by",
    "       single spaces and followed by a newline.",
  ],
  sudo: [
    "NAME",
    "       sudo - execute a command as another user (or pretend to)",
    "",
    "SYNOPSIS",
    "       sudo <command>",
    "",
    "DESCRIPTION",
    "       In a real shell this would elevate privileges. Here it's a",
    "       coin toss between a polite refusal and a small surprise.",
  ],
  neofetch: [
    "NAME",
    "       neofetch - pretty-print the device's specs",
    "",
    "SYNOPSIS",
    "       neofetch",
    "       specs",
    "       device",
    "",
    "DESCRIPTION",
    "       Renders an ASCII logo on the left and a column of device",
    "       specs on the right: OS, browser, engine, resolution,",
    "       viewport, CPU cores, memory, GPU, connection, locale,",
    "       color scheme, reduced-motion preference, touch support.",
    "",
    "       Some values are intentionally hidden by your browser for",
    "       privacy reasons (Safari hides the WebGL renderer and",
    "       deviceMemory by default). Those are labelled `Hidden`.",
  ],
  lscpu: [
    "NAME",
    "       lscpu - display CPU information",
    "",
    "SYNOPSIS",
    "       lscpu",
    "",
    "DESCRIPTION",
    "       Prints what the browser will expose about the CPU. Modern",
    "       browsers quantise this for privacy; expect `Hidden` on most",
    "       fields except logical core count.",
  ],
  free: [
    "NAME",
    "       free - display memory usage",
    "",
    "SYNOPSIS",
    "       free",
    "",
    "DESCRIPTION",
    "       Prints the navigator.deviceMemory value (quantised to a few",
    "       discrete buckets - 0.25, 0.5, 1, 2, 4, 8 GB and above).",
    "       Used / free are not measurable from JavaScript.",
  ],
  ifconfig: [
    "NAME",
    "       ifconfig - display network interface info",
    "",
    "SYNOPSIS",
    "       ifconfig",
    "       ip",
    "",
    "DESCRIPTION",
    "       Prints a fake `ifconfig` output populated with the values",
    "       the browser exposes - connection type, downlink, and",
    "       whether the device is currently online.",
  ],
};

/* -------------------------------------------------------------------------- */
/* Command registry                                                            */
/* -------------------------------------------------------------------------- */

const COMMANDS: Record<string, CommandHandler> = {
  help: () => ({
    output: [
      "Available commands:",
      "",
      "  help              Show this help screen",
      "  man <command>     Show the manual entry for <command>",
      "  about             Anthony's bio",
      "  whoami            Current identity",
      "  uname [-a]        Print system / build info",
      "  uptime            Print fake system uptime",
      "  ls                List pages and files on this site",
      "  cd <page>         Move to a page inside the terminal",
      "  pwd               Print current path",
      "  cat <file>        Print the contents of a file (see `ls`)",
      "  open <page>       Open a page in the regular site (exits terminal)",
      "",
      "  neofetch, specs   Pretty-print your device specs",
      "  lscpu             Print CPU info",
      "  free              Print memory info",
      "  ifconfig, ip      Print network interface info",
      "",
      "  experience        Career timeline",
      "  portfolio         Selected work",
      "  evidence          Evidence (decision evidence)",
      "  reco              Recommendations",
      "  contact           Contact info",
      "  resume            Resume page",
      "  echo <text>       Print text",
      "  date              Current date and time",
      "  history           Show this session's command history",
      "  motd              Show the welcome message",
      "  clear, cls        Clear the screen (also Ctrl+L)",
      "  reset             Clear the screen and reprint the welcome banner",
      "  exit, quit        Leave terminal mode (or press ⌘K / Ctrl+K)",
      "",
      "Inline shortcuts: ↑/↓ history · Tab autocomplete · Ctrl+C interrupt",
      "                  Ctrl+U clear line · Ctrl+W delete word",
      "",
      "There are also a handful of hidden commands. Try sudo, vim, matrix,",
      "coffee, ssh, or just look around - you might find them by mistake.",
    ],
  }),

  about: () => ({
    output: [
      "Anthony Silvia",
      "Product Experience Manager - Charlotte Metro",
      "",
      "Hybrid of product management and UX: discovery, prioritization,",
      "and shipped experience - AI-accelerated for higher efficiency",
      "and output, with judgment owning what ships.",
      "",
      "Currently Product Designer at Lowe's Companies, Inc.",
      "Principal Consultant at NodeDa.",
    ],
  }),

  whoami: () => ({ output: ["guest"] }),

  ls: () => ({
    output: [
      "about.txt          contact.txt        evidence/",
      "experience/        portfolio/         recommendations/",
      "resume.pdf         secrets.txt*",
      "",
      "* hint: try `sudo cat secrets.txt`",
    ],
  }),

  cd: (args, ctx) => {
    const target = args[0] ?? "";
    if (target === "" || target === "~" || target === "/") {
      ctx.setCwd("/");
      return { output: [] };
    }
    const page = findPage(target);
    if (!page) {
      return { error: [`cd: ${target}: no such page (try \`ls\`)`] };
    }
    ctx.setCwd(page.path);
    return { output: [] };
  },

  pwd: (_args, ctx) => ({ output: [ctx.cwd] }),

  open: (args, ctx) => {
    const target = args[0] ?? "";
    const page = findPage(target);
    if (!page) {
      return { error: [`open: unknown page \`${target}\` (try \`ls\`)`] };
    }
    ctx.navigate(page.href);
    return { output: [`Opening ${page.href}…`] };
  },

  experience: () => ({
    output: [
      "Lowe's Companies, Inc. - 7 years",
      "  · Product Designer    Oct 2022 – Present",
      "  · Earlier Roles                 Feb 2019 – Sep 2022",
      "",
      "NodeDa - 8 years 9 months",
      "  · Principal Consultant          May 2017 – Present",
      "",
      "Run `open experience` for the full timeline.",
    ],
  }),

  portfolio: () => ({
    output: [
      "Selected work:",
      "",
      "  · Kinlily           Cloud-based cookbook ecosystem (NodeDa)",
      "  · Herbswift         Design lead across web + mobile",
      "  · Lowe's internal   Operational tools (confidential)",
      "",
      "Run `open portfolio` to view the case studies in the regular site.",
    ],
  }),

  evidence: () => ({
    output: [
      "Evidence - Product Experience Manager decision proof:",
      "",
      "  · Trade-offs          Scope, ship, feasibility",
      "  · Complexity→Clarity  Structure for ops workflows",
      "  · Ambiguity           Discovery → success criteria",
      "  · Systems thinking    Upstream / downstream impact",
      "  · How I've changed    Delivery ownership + PM partnership",
      "",
      "Projects: Lowe's Return Space · Pro Supply",
      "Run `open evidence` for the full narrative.",
    ],
  }),

  reco: () => {
    if (recommendations.length === 0) {
      return { output: ["No recommendations on file."] };
    }
    return {
      output: [
        "Recommendations:",
        "",
        ...recommendations.map((r) => `  · ${r.name} - ${r.role}`),
        "",
        "Run `open recommendations` to read the full quotes.",
      ],
    };
  },

  contact: () => ({
    output: [
      "contact@anthonysilvia.com",
      "https://linkedin.com/in/anthonyjsilvia",
      "",
      "Run `open contact` to use the contact form.",
    ],
  }),

  resume: () => ({
    output: [
      "Resume available at /resume.",
      "Run `open resume` to view.",
    ],
  }),

  echo: (args) => ({ output: [args.join(" ")] }),

  date: () => ({ output: [new Date().toString()] }),

  // `history` is wired by TerminalMode at call time - see below.
  history: () => ({ output: ["(history is rendered by the terminal - see scrollback)"] }),

  clear: () => ({ clear: true }),

  // `reset` is `clear` with the welcome banner reprinted afterwards - the
  // behaviour of reset(1) in a real terminal, minus the literal tty reset.
  reset: () => ({ clear: true, banner: true }),

  exit: (_args, ctx) => {
    ctx.exit();
    return { output: ["Goodbye."] };
  },

  /* ---------------- realer-feeling shell commands ---------------- */

  uname: (args) => {
    if (args.includes("-a")) {
      const buildDate = new Date().toUTCString();
      return {
        output: [
          `anthonysilvia.com 1.0.0 next-16.2.4 react-18.3.1 #1 ${buildDate} webkit`,
        ],
      };
    }
    return { output: ["anthonysilvia.com"] };
  },

  uptime: () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    return {
      output: [
        ` ${hh}:${mm}  up since boot, 1 user, load average: 0.42, 0.31, 0.27`,
      ],
    };
  },

  cat: (args) => {
    const file = args[0] ?? "";
    if (!file) return { error: ["cat: usage: cat <file>"] };
    const files: Record<string, string[]> = {
      "about.txt": [
        "Anthony Silvia",
        "Product Experience Manager - Charlotte Metro",
        "",
        "Hybrid of product management and UX.",
        "AI-accelerated efficiency and output.",
        "Currently Product Designer at Lowe's Companies, Inc.",
        "Principal Consultant at NodeDa.",
      ],
      "contact.txt": [
        "contact@anthonysilvia.com",
        "https://linkedin.com/in/anthonyjsilvia",
      ],
      "resume.pdf": [
        "%PDF-1.7",
        "[binary data - run `open resume` to download]",
      ],
      "secrets.txt": [
        "Permission denied. Try `sudo cat secrets.txt`.",
      ],
    };
    const content = files[file];
    if (!content) return { error: [`cat: ${file}: No such file or directory`] };
    return { output: content };
  },

  motd: () => ({
    output: [
      "----------------------------------------------------------------",
      "  Welcome to anthonysilvia.com",
      "  Built with Next.js, TypeScript, Tailwind, and a lot of coffee.",
      "  Type `help` for the command reference, or `man <cmd>` for a",
      "  manual entry on a specific command.",
      "----------------------------------------------------------------",
    ],
  }),

  last: () => {
    const now = new Date();
    const fmt = (d: Date) =>
      d.toString().replace(/ GMT.*/, "").replace(/^[A-Za-z]{3} /, (m) => m);
    return {
      output: [
        `guest    ttys001        ${fmt(now)}    still logged in`,
        `guest    ttys000        ${fmt(new Date(now.getTime() - 3600_000))}    - ${fmt(now)}`,
        "",
        "wtmp begins on this site.",
      ],
    };
  },

  man: (args) => {
    const cmd = (args[0] ?? "").toLowerCase();
    if (!cmd) return { error: ["What manual page do you want?"] };
    const page = MAN_PAGES[cmd];
    if (!page) return { error: [`No manual entry for ${cmd}`] };
    return { output: page };
  },

  /* ---------------- device specs (neofetch + friends) ---------------- */

  neofetch: () => {
    const s = getDeviceSpecs();
    // Per-character ASCII logo of the SILVIA wordmark. Kept identical in
    // width across rows so the side-by-side layout aligns cleanly.
    const logo = [
      "    _____ _ _       _       ",
      "   / ____(_) |     (_)      ",
      "  | (___  _| |_   ___  __ _ ",
      "   \\___ \\| | \\ \\ / / |/ _` |",
      "   ____) | | |\\ V /| | (_| |",
      "  |_____/|_|_| \\_/ |_|\\__,_|",
      "                            ",
    ];
    const hostLine = `guest@${s.hostname}`;
    const specs = [
      hostLine,
      "-".repeat(hostLine.length),
      `OS:             ${s.os}`,
      `Browser:        ${s.browser}`,
      `Engine:         ${s.engine}`,
      `Resolution:     ${s.resolution} @ ${s.pixelRatio} DPR`,
      `Viewport:       ${s.viewport}`,
      `CPU Cores:      ${s.cpuCores}`,
      `Memory:         ${s.memory}`,
      `GPU:            ${s.gpu}`,
      `Connection:     ${s.connection} (${s.online === "yes" ? "online" : "offline"})`,
      `Locale:         ${s.locale} (${s.timezone})`,
      `Color Scheme:   ${s.colorScheme}`,
      `Reduced Motion: ${s.reducedMotion}`,
      `Touch:          ${s.touch}`,
    ];
    const padBlank = " ".repeat(30);
    const rows = Math.max(logo.length, specs.length);
    const output: string[] = [];
    for (let i = 0; i < rows; i++) {
      const left = (logo[i] ?? padBlank).padEnd(30);
      const right = specs[i] ?? "";
      output.push(`${left}   ${right}`);
    }
    return { output };
  },

  lscpu: () => {
    const s = getDeviceSpecs();
    // Architecture / vendor are best-effort - they require async high-entropy
    // UA hints that aren't available in a sync handler, so we either show the
    // inferred Apple-Silicon hint (via the GPU string) or fall back to
    // "Hidden". This mirrors how Safari throttles the same info on Linux.
    const inferredArch = /Apple M\d/.test(s.gpu)
      ? "arm64 (Apple Silicon, inferred)"
      : "Hidden (UA-CH required)";
    return {
      output: [
        `Architecture:           ${inferredArch}`,
        `CPU(s):                 ${s.cpuCores}`,
        `Thread(s) per core:     Hidden`,
        `Core(s):                ${s.cpuCores}`,
        `Vendor ID:              ${/Apple/.test(s.gpu) ? "Apple" : "Hidden"}`,
        `Model name:             ${s.gpu.includes("Apple M") ? s.gpu : "Hidden"}`,
        `Byte order:             Little Endian`,
      ],
    };
  },

  free: () => {
    const s = getDeviceSpecs();
    // The Memory API only exposes a coarse, privacy-quantised total. There's
    // no `used` / `free` split available in the browser, so we annotate the
    // header to make that honest.
    const total = s.memory === "Hidden (privacy)" ? "Hidden" : s.memory;
    return {
      output: [
        "              total        used        free      shared",
        `Mem:    ${total.padStart(11)}         n/a         n/a         n/a`,
        "",
        "Note: browsers only expose a privacy-quantised total - `used` and",
        "`free` are not measurable from JavaScript.",
      ],
    };
  },

  ifconfig: () => {
    const s = getDeviceSpecs();
    return {
      output: [
        "lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384",
        "        inet 127.0.0.1 netmask 0xff000000",
        "        inet6 ::1 prefixlen 128",
        "",
        "en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500",
        `        host: ${s.hostname}`,
        `        type: ${s.connection}`,
        `        status: ${s.online === "yes" ? "active" : "inactive"}`,
      ],
    };
  },

  /* -------------------- easter eggs -------------------- */

  vim: () => ({
    output: [
      "vim: opened a buffer. To save and quit, press :wq",
      "(Just kidding - there's no actual buffer. Type `exit` to leave.)",
    ],
  }),

  emacs: () => ({
    output: ["emacs: too heavy for this terminal. Try `vim`."],
  }),

  sudo: (args) => {
    const joined = args.join(" ");
    if (!joined) return { error: ["sudo: a command is required"] };
    if (/rm\s+-rf/i.test(joined)) {
      return { error: ["sudo: nope. nice try."] };
    }
    if (/sandwich/i.test(joined)) {
      return {
        output: [
          "Okay, I made you a sandwich.",
          "",
          "    .--------.",
          "   /  🥬🧀🥓 /|",
          "  /________/ |",
          "  |  🍞🥪   | /",
          "  |________|/",
        ],
      };
    }
    if (/cat\s+secrets\.txt/i.test(joined)) {
      return {
        output: [
          "secrets.txt:",
          "",
          "  1. Coffee, not Diet Coke.",
          "  2. The 3D tilt is a `transform: preserve-3d` parent.",
          "  3. The liquid pill in the nav is one motion.div, not five.",
          "  4. The hover ball glow is a CSS custom property, no React re-renders.",
          "  5. This terminal is keyboard-only on purpose.",
        ],
      };
    }
    return {
      error: [`sudo: ${joined}: permission denied (you are guest, not root).`],
    };
  },

  matrix: () => ({
    output: [
      "Wake up, Neo...",
      "",
      "01001000 01100101 01101100 01101100 01101111",
      "01010111 01101111 01110010 01101100 01100100",
      "01000001 01101110 01110100 01101000 01101111 01101110 01111001",
      "",
      "There is no spoon.",
    ],
  }),

  coffee: () => ({
    output: [
      "      (   )   (",
      "       )   (   )",
      "      (   )   (",
      "    .-\"~~~~~~~~~\"-.",
      "    \\               /",
      "     `.           .'",
      "       `--------'",
      "",
      "Pour one for the late-night sessions.",
    ],
  }),

  silvia: () => ({
    output: [
      "    _____ _ _       _       ",
      "   / ____(_) |     (_)      ",
      "  | (___  _| |_   ___  __ _ ",
      "   \\___ \\| | \\ \\ / / |/ _` |",
      "   ____) | | |\\ V /| | (_| |",
      "  |_____/|_|_| \\_/ |_|\\__,_|",
      "",
      "Anthony Silvia · anthonysilvia.com",
    ],
  }),

  rm: () => ({
    output: ["rm: don't. seriously."],
  }),

  exec: () => ({
    output: ["exec: not in this terminal."],
  }),

  ssh: (args) => {
    const host = args[0] ?? "localhost";
    return {
      output: [`ssh: connection to ${host} closed by remote host.`],
    };
  },
};

// Aliases - defined after the registry so they reference real handlers.
COMMANDS.cls = COMMANDS.clear;
COMMANDS.quit = COMMANDS.exit;
COMMANDS.recommendations = COMMANDS.reco;
COMMANDS["?"] = COMMANDS.help;
COMMANDS.specs = COMMANDS.neofetch;
COMMANDS.device = COMMANDS.neofetch;
COMMANDS.fastfetch = COMMANDS.neofetch;
COMMANDS.ip = COMMANDS.ifconfig;

/**
 * Parse a raw line of input and dispatch to the matching handler. Returns a
 * `CommandResult` with output lines (and optionally a `clear` flag). Unknown
 * commands resolve to a `command not found` line - never throw.
 */
export function runCommand(input: string, ctx: TerminalContext): CommandResult {
  const tokens = input.trim().split(/\s+/);
  const name = tokens[0]?.toLowerCase() ?? "";
  const args = tokens.slice(1);

  if (!name) return {};

  const handler = COMMANDS[name];
  if (!handler) {
    return {
      error: [`${name}: command not found. Type \`help\` for a list of commands.`],
    };
  }

  return handler(args, ctx);
}

export const COMMAND_NAMES = Object.keys(COMMANDS).sort();

/**
 * Welcome banner shown on terminal open and on `reset`. Built dynamically so
 * the "Last login" timestamp is fresh every session - the small touch that
 * makes the easter egg feel like a real tty.
 */
export function buildBanner(): string[] {
  const now = new Date();
  // Mon Jan  1 23:42:00 2026
  const last = now
    .toString()
    .replace(/ GMT.*/, "")
    .replace(/ \d{4}/, (m) => m);
  return [
    `Last login: ${last} on ttys001`,
    "",
    "anthonysilvia.com - terminal v1.0",
    "Type `help` for a list of commands. Press ⌘K / Ctrl+K (or `exit`) to leave.",
    "",
  ];
}
