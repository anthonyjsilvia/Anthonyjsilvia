import { NextRequest, NextResponse } from "next/server";

/** Env is read at request time; avoids any build-time snapshot of an empty key. */
export const dynamic = "force-dynamic";

const DEFAULT_BASE =
  "https://us-central1-nrovallc.cloudfunctions.net/crmSupportApi";
const DEFAULT_ORG_ID = "DmByfTTUdCs0ecp2MMoQ";

const CATEGORIES = new Set([
  "billing",
  "technical",
  "account",
  "feature_request",
  "general",
  "other",
]);

const PRIORITIES = new Set(["low", "medium", "high", "urgent"]);

const MAX = {
  requesterName: 200,
  contactEmail: 254,
  subject: 300,
  body: 20000,
  relatedUrl: 2000,
  applicationName: 200,
} as const;

function trimString(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  if (s.length > max) return null;
  return s;
}

function isValidEmail(email: string): boolean {
  if (email.length > MAX.contactEmail) return false;
  // pragmatic RFC-ish check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Strip whitespace and UTF-8 BOM (common if the key was pasted from certain editors). */
function normalizeSecret(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const t = value.trim().replace(/^\uFEFF/, "");
  return t.length > 0 ? t : undefined;
}

function getSupportApiKey(): string | undefined {
  return (
    normalizeSecret(process.env.NROVA_SUPPORT_API_KEY) ??
    normalizeSecret(process.env.NROVA_API_KEY)
  );
}

export async function GET() {
  const configured = Boolean(getSupportApiKey());
  return NextResponse.json({ configured });
}

export async function POST(req: NextRequest) {
  const apiKey = getSupportApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured. Set NROVA_SUPPORT_API_KEY on the server.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;

  const contactEmail = trimString(o.contactEmail, MAX.contactEmail);
  if (!contactEmail || !isValidEmail(contactEmail)) {
    return NextResponse.json(
      { error: "A valid contact email is required." },
      { status: 400 },
    );
  }

  const subject = trimString(o.subject, MAX.subject);
  if (!subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }

  const messageBody = trimString(o.body, MAX.body);
  if (!messageBody) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const requesterName = trimString(o.requesterName, MAX.requesterName);
  const relatedUrl = trimString(o.relatedUrl, MAX.relatedUrl);

  let category = trimString(o.category, 64)?.toLowerCase() ?? "general";
  if (!CATEGORIES.has(category)) category = "general";

  let priority = trimString(o.priority, 32)?.toLowerCase() ?? "medium";
  if (!PRIORITIES.has(priority)) priority = "medium";

  const applicationName =
    trimString(o.applicationName, MAX.applicationName) ??
    process.env.NROVA_APPLICATION_NAME?.trim() ??
    "Anthony Silvia Portfolio";

  const base =
    process.env.NROVA_SUPPORT_API_BASE_URL?.trim() || DEFAULT_BASE;
  const orgId =
    process.env.NROVA_ORGANIZATION_ID?.trim() || DEFAULT_ORG_ID;

  const url = `${base.replace(/\/$/, "")}/v1/organizations/${orgId}/support/tickets`;

  const payload: Record<string, string | undefined> = {
    contactEmail: contactEmail.toLowerCase(),
    applicationName,
    subject,
    body: messageBody,
    priority,
    category,
    channel: "web",
    environment: "production",
  };

  if (requesterName) payload.requesterName = requesterName;
  if (relatedUrl) payload.relatedUrl = relatedUrl;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach support service. Try again later." },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!upstream.ok) {
    const message =
      parsed &&
      typeof parsed === "object" &&
      "error" in parsed &&
      typeof (parsed as { error: unknown }).error === "string"
        ? (parsed as { error: string }).error
        : parsed &&
            typeof parsed === "object" &&
            "message" in parsed &&
            typeof (parsed as { message: unknown }).message === "string"
          ? (parsed as { message: string }).message
          : "Ticket could not be created.";

    return NextResponse.json(
      { error: message },
      { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
    );
  }

  const ticketId =
    parsed &&
    typeof parsed === "object" &&
    parsed !== null &&
    "id" in parsed &&
    typeof (parsed as { id: unknown }).id === "string"
      ? (parsed as { id: string }).id
      : parsed &&
          typeof parsed === "object" &&
          parsed !== null &&
          "ticketId" in parsed &&
          typeof (parsed as { ticketId: unknown }).ticketId === "string"
        ? (parsed as { ticketId: string }).ticketId
        : undefined;

  return NextResponse.json(
    { ok: true, ticketId, raw: parsed },
    { status: 201 },
  );
}
