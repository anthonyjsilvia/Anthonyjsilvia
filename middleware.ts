import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COUNTRY_COOKIE = "site-country";

function isPublicIp(ip: string) {
  if (!ip) return false;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "0.0.0.0") return false;
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("169.254.")) return false;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return false;
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) return false;
  return true;
}

async function countryFromIp(ip: string): Promise<string> {
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(1200),
    });
    if (!response.ok) return "";
    const data = (await response.json()) as { success?: boolean; country_code?: string };
    if (data.success && data.country_code) return data.country_code.toUpperCase();
  } catch {
    /* An unknown country stays on American English. */
  }
  return "";
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  let country =
    request.cookies.get(COUNTRY_COOKIE)?.value ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    "";

  country = country.toUpperCase();
  if (country === "XX" || country === "T1") country = "";

  if (!country) {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const ip = forwarded || request.headers.get("x-real-ip") || "";
    if (isPublicIp(ip)) country = await countryFromIp(ip);
  }

  if (country) requestHeaders.set("x-site-country", country);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (country && request.cookies.get(COUNTRY_COOKIE)?.value !== country) {
    response.cookies.set(COUNTRY_COOKIE, country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
