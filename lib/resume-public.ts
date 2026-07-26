/**
 * NodeDa Resume — public embed API client (`nrova.resume.public.v1`).
 * Host: resume.nodeda.com (local: http://resume.localhost:{port}).
 * Auth: opaque share token in the path only — no API key.
 */

export const RESUME_PUBLIC_SCHEMA = "nrova.resume.public.v1" as const;

export type ResumeBasics = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedinUrl?: string;
  summary: string;
};

export type ResumeExperience = {
  id: string;
  title: string;
  company: string;
  location?: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  current: boolean;
  description: string;
};

export type ResumeEducation = {
  id: string;
  school: string;
  degree?: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  description?: string;
};

export type ResumeCertification = {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
};

export type ResumeProject = {
  id: string;
  name: string;
  url?: string;
  description?: string;
};

export type ResumeProfile = {
  basics: ResumeBasics;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
};

export type ResumePublicUrls = {
  page: string;
  json: string;
  pdf: string;
};

export type ResumePublicPayload = {
  schema: typeof RESUME_PUBLIC_SCHEMA | string;
  title: string;
  updatedAt: string | null;
  profile: ResumeProfile | null;
  bodyMarkdown: string;
  html: string;
  urls: ResumePublicUrls;
};

export type ResumePublicConfig = {
  siteUrl: string;
  token: string;
};

export class ResumePublicError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ResumePublicError";
    this.status = status;
    this.code = code;
  }
}

const DEFAULT_SITE_URL = "https://resume.nodeda.com";
/** Public share token from Resume → Share link (safe to embed; rotate if leaked). */
const DEFAULT_SHARE_TOKEN = "nrv_rsm_ZeWGYBffr14-ZswkJk76xEbYdvt_7_f6";

export function getResumePublicConfig(): ResumePublicConfig {
  const siteUrl = (
    process.env.NEXT_PUBLIC_RESUME_SITE_URL?.trim() || DEFAULT_SITE_URL
  ).replace(/\/$/, "");
  const token =
    process.env.NEXT_PUBLIC_RESUME_SHARE_TOKEN?.trim() || DEFAULT_SHARE_TOKEN;
  return { siteUrl, token };
}

export function resumePublicJsonUrl(
  config: ResumePublicConfig = getResumePublicConfig(),
): string {
  return `${config.siteUrl}/api/resume/public/${encodeURIComponent(config.token)}`;
}

export function resumePublicPdfUrl(
  config: ResumePublicConfig = getResumePublicConfig(),
): string {
  return `${resumePublicJsonUrl(config)}/pdf`;
}

export function resumePublicPageUrl(
  config: ResumePublicConfig = getResumePublicConfig(),
): string {
  return `${config.siteUrl}/r/${encodeURIComponent(config.token)}`;
}

/**
 * Fetch the latest shared resume snapshot.
 * Works in browser (CORS *) and on the server. Pass `next: { revalidate: 60 }`
 * from a Server Component to match the API's ~60s cache.
 */
export async function fetchPublicResume(
  init?: RequestInit,
  config: ResumePublicConfig = getResumePublicConfig(),
): Promise<ResumePublicPayload> {
  const url = resumePublicJsonUrl(config);
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let code = "request_failed";
    let message = `Resume API returned ${res.status}`;
    if (isJson) {
      try {
        const body = (await res.json()) as { error?: string; message?: string };
        if (body.error) code = body.error;
        if (body.message) message = body.message;
      } catch {
        /* ignore parse errors */
      }
    }
    throw new ResumePublicError(message, res.status, code);
  }

  if (!isJson) {
    throw new ResumePublicError(
      "Resume API did not return JSON (is the Resume host reachable?).",
      res.status,
      "invalid_response",
    );
  }

  return (await res.json()) as ResumePublicPayload;
}

/* ---------------------------------------------------------------------------
   Mapping helpers — turn flat API experience into company-grouped UI entries
   --------------------------------------------------------------------------- */

export type MonthYear = { year: number; month: number };

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_LOOKUP: Record<string, number> = Object.fromEntries([
  ...MONTH_NAMES.map((name, i) => [name.toLowerCase(), i + 1] as const),
  ...MONTH_NAMES.map(
    (name, i) => [name.slice(0, 3).toLowerCase(), i + 1] as const,
  ),
  ...Array.from({ length: 12 }, (_, i) => [String(i + 1), i + 1] as const),
  ...Array.from(
    { length: 12 },
    (_, i) => [String(i + 1).padStart(2, "0"), i + 1] as const,
  ),
]);

export function parseMonthYear(
  month: string | undefined,
  year: string | undefined,
): MonthYear | null {
  const y = Number.parseInt(String(year ?? "").trim(), 10);
  if (!Number.isFinite(y) || y < 1900 || y > 2100) return null;
  const raw = String(month ?? "").trim().toLowerCase();
  const m = MONTH_LOOKUP[raw] ?? (raw ? undefined : 1);
  if (!m) return null;
  return { year: y, month: m };
}

/** Split a freeform description into bullets when it looks like a list. */
export function descriptionToContent(description: string): {
  bullets?: string[];
  description?: string;
} {
  const trimmed = description.trim();
  if (!trimmed) return {};
  const lines = trimmed
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length <= 1) return { description: trimmed };
  const bulletish = lines.filter((l) => /^[-•*]\s+/.test(l)).length;
  if (bulletish >= Math.ceil(lines.length / 2)) {
    return {
      bullets: lines.map((l) => l.replace(/^[-•*]\s+/, "").trim()).filter(Boolean),
    };
  }
  return { description: trimmed };
}

export type MappedRole = {
  title: string;
  start: MonthYear;
  end?: MonthYear;
  location: string;
  bullets?: string[];
  description?: string;
};

export type MappedExperienceEntry = {
  company: string;
  roles: MappedRole[];
  projects?: { name: string; href: string; ariaLabel: string }[];
};

export type MappedEducationEntry = {
  institution: string;
  degree: string;
  period: string;
  description?: string;
};

export type MappedCertification = {
  name: string;
  issuer: string;
  date: string;
  description?: string;
  url: string;
};

export type MappedProject = {
  name: string;
  href?: string;
  description?: string;
  ariaLabel: string;
};

/** Detect high-school rows so they stay in the badge strip, not college cards. */
export function isHighSchoolEducation(e: ResumeEducation): boolean {
  const school = e.school.trim().toLowerCase();
  const degree = (e.degree ?? "").trim().toLowerCase();
  if (!school) return false;
  if (degree.includes("high school") || school.includes("high school")) return true;
  if (/wasilla high|south anchorage high/.test(school)) return true;
  const isCollegeDegree =
    /bachelor|master|mba|associate|doctor|phd|certificate|diploma/.test(degree) &&
    !degree.includes("high school");
  if (isCollegeDegree) return false;
  if (/\bhigh\b/.test(school) && /school/.test(school)) return true;
  return false;
}

/**
 * Group flat API experience rows by company (preserving first-seen order).
 */
export function mapExperienceFromProfile(
  profile: ResumeProfile,
): MappedExperienceEntry[] {
  const order: string[] = [];
  const byCompany = new Map<string, MappedRole[]>();

  for (const row of profile.experience) {
    const company = row.company.trim() || "Experience";
    const start =
      parseMonthYear(row.startMonth, row.startYear) ??
      ({ year: new Date().getFullYear(), month: 1 } as MonthYear);
    const end = row.current
      ? undefined
      : parseMonthYear(row.endMonth, row.endYear) ?? undefined;
    const content = descriptionToContent(row.description);
    const role: MappedRole = {
      title: row.title.trim() || "Role",
      start,
      end,
      location: row.location?.trim() || "",
      ...content,
    };
    if (!byCompany.has(company)) {
      byCompany.set(company, []);
      order.push(company);
    }
    byCompany.get(company)!.push(role);
  }

  return order.map((company) => ({
    company,
    roles: byCompany.get(company)!,
  }));
}

export function mapCollegeFromProfile(
  profile: ResumeProfile,
): MappedEducationEntry[] {
  return profile.education
    .filter((e) => !isHighSchoolEducation(e))
    .map((e) => {
      const degreeParts = [e.degree, e.field].map((s) => s?.trim()).filter(Boolean);
      const years = [e.startYear, e.endYear].map((s) => s?.trim()).filter(Boolean);
      const description = e.description?.trim() || undefined;
      return {
        institution: e.school.trim() || "School",
        degree: degreeParts.join(", ") || description || "",
        period: years.join(" – "),
        description:
          description && degreeParts.length > 0 ? description : undefined,
      };
    });
}

/** @deprecated Prefer mapCollegeFromProfile — kept for callers that want every row. */
export function mapEducationFromProfile(
  profile: ResumeProfile,
): MappedEducationEntry[] {
  return profile.education.map((e) => {
    const degreeParts = [e.degree, e.field].map((s) => s?.trim()).filter(Boolean);
    const years = [e.startYear, e.endYear].map((s) => s?.trim()).filter(Boolean);
    return {
      institution: e.school.trim() || "School",
      degree: degreeParts.join(", ") || e.description?.trim() || "",
      period: years.join(" – "),
      description: e.description?.trim() || undefined,
    };
  });
}

export function mapCertificationsFromProfile(
  profile: ResumeProfile,
  fallbackUrl = "https://www.credly.com/users/anthony-silvia",
): MappedCertification[] {
  return profile.certifications
    .filter((c) => c.name.trim())
    .map((c) => ({
      name: c.name.trim(),
      issuer: c.issuer?.trim() || "",
      date: c.year?.trim() || "",
      url: fallbackUrl,
    }));
}

export function mapProjectsFromProfile(profile: ResumeProfile): MappedProject[] {
  return profile.projects
    .filter((p) => p.name.trim())
    .map((p) => {
      const name = p.name.trim();
      const href = p.url?.trim() || undefined;
      return {
        name,
        href,
        description: p.description?.trim() || undefined,
        ariaLabel: href
          ? `Visit ${name} (opens in new tab)`
          : name,
      };
    });
}

export function mapSkillsFromProfile(profile: ResumeProfile): string[] {
  return profile.skills.map((s) => s.trim()).filter(Boolean);
}

/** Absolute http(s) URL for optional website / LinkedIn fields. */
export function normalizeExternalUrl(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(v) || v.toLowerCase().startsWith("www.")) {
    return `https://${v.replace(/^\/\//, "")}`;
  }
  return null;
}
