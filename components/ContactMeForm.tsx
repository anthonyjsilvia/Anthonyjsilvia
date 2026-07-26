"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import GlowButton from "@/components/GlowButton";
import GlowLink from "@/components/GlowLink";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General" },
  { value: "technical", label: "Technical" },
  { value: "feature_request", label: "Feature request" },
  { value: "account", label: "Account" },
  { value: "billing", label: "Billing" },
  { value: "other", label: "Other" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

type Props = {
  /** Shown when the support API key is not configured (mailto fallback). */
  fallbackEmail: string;
};

export default function ContactMeForm({ fallbackEmail }: Props) {
  const [configChecked, setConfigChecked] = useState(false);
  const [formEnabled, setFormEnabled] = useState(true);

  const [requesterName, setRequesterName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/support/ticket", { method: "GET" });
        const data = (await res.json().catch(() => ({}))) as {
          configured?: boolean;
        };
        if (!cancelled) {
          setFormEnabled(data.configured === true);
          setConfigChecked(true);
        }
      } catch {
        if (!cancelled) {
          setFormEnabled(false);
          setConfigChecked(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reset = useCallback(() => {
    setRequesterName("");
    setContactEmail("");
    setSubject("");
    setCategory("general");
    setBody("");
    setStatus("idle");
    setErrorMessage("");
    setTicketId(null);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setTicketId(null);
    setStatus("submitting");

    let relatedUrl: string | undefined;
    if (typeof window !== "undefined") {
      relatedUrl = window.location.href;
    }

    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName: requesterName.trim() || undefined,
          contactEmail: contactEmail.trim(),
          subject: subject.trim(),
          category,
          body: body.trim(),
          priority: "medium",
          relatedUrl,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ticketId?: string;
      };

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      if (data.ticketId) setTicketId(data.ticketId);
      setStatus("success");
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--border-light)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] focus:ring-offset-2 dark:focus:ring-offset-[var(--background)]";

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]");

  if (configChecked && !formEnabled) {
    const mailto = `mailto:${fallbackEmail}`;
    return (
      <div
        className="rounded-2xl border border-[var(--border-light)] bg-[var(--background)] p-6 md:p-8 shadow-sm"
        aria-labelledby="contact-me-heading"
      >
        <h3
          id="contact-me-heading"
          className="text-xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]"
        >
          Contact me
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
          The on-site form is not active on this deployment yet. You can still reach me by email.
        </p>
        <GlowLink
          href={mailto}
          variant="primary"
          className="mt-5 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Email {fallbackEmail}
        </GlowLink>
        {isLocalhost ? (
          <div className="mt-6 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] p-4 text-left text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              Developer: enable the form
            </p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              <li>
                In the project root (same folder as <code className="text-xs">package.json</code>), create{" "}
                <code className="text-xs">.env.local</code>.
              </li>
              <li>
                Add: <code className="break-all text-xs">NROVA_SUPPORT_API_KEY=your_nrov_live_…_secret</code>
              </li>
              <li>
                Optional alias: <code className="text-xs">NROVA_API_KEY</code> is also read.
              </li>
              <li>Stop and restart <code className="text-xs">npm run dev</code> so Next.js reloads env.</li>
            </ol>
            <p className="mt-3 text-xs text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
              On Vercel: Project → Settings → Environment Variables → add{" "}
              <code className="text-xs">NROVA_SUPPORT_API_KEY</code> for Production (and Preview if needed), then redeploy.
            </p>
          </div>
        ) : (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-amber-600/50 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/35 dark:text-amber-100"
          >
            <span className="font-semibold">Configuration error:</span> the contact form is not configured on
            the server. Please use the email button above while this is fixed.
          </p>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-[var(--border-light)] bg-[var(--background)] p-8 text-center shadow-sm"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
          Message sent
        </p>
        <p className="mt-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
          Thanks for reaching out. I&apos;ll get back to you at{" "}
          <span className="font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">
            {contactEmail.trim()}
          </span>
          .
        </p>
        {ticketId ? (
          <p className="mt-3 text-sm text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
            Reference: <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">{ticketId}</code>
          </p>
        ) : null}
        <GlowButton
          type="button"
          onClick={reset}
          variant="primary"
          className="mt-6 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
        >
          Send another message
        </GlowButton>
      </div>
    );
  }

  if (!configChecked) {
    return (
      <div
        className="flex min-h-[200px] items-center justify-center rounded-2xl border border-[var(--border-light)] bg-[var(--background)] p-8 shadow-sm"
        aria-busy="true"
        aria-label="Loading contact form"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" aria-hidden />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--border-light)] bg-[var(--background)] p-6 md:p-8 shadow-sm"
      aria-labelledby="contact-me-heading"
      noValidate
    >
      <h3
        id="contact-me-heading"
        className="text-xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]"
      >
        Contact me
      </h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
        Send a message through this site. I&apos;ll reply by email.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="contact-name" className="sr-only">
            Your name (optional)
          </label>
          <input
            id="contact-name"
            name="requesterName"
            type="text"
            autoComplete="name"
            placeholder="Your name (optional)"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            maxLength={200}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className="sr-only">
            Email (required)
          </label>
          <input
            id="contact-email"
            name="contactEmail"
            type="email"
            required
            autoComplete="email"
            placeholder="Email *"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            maxLength={254}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className="sr-only">
            Subject (required)
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="Subject *"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={300}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2 sm:max-w-xs">
          <label htmlFor="contact-category" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
            Category
          </label>
          <select
            id="contact-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-body" className="sr-only">
            Message (required)
          </label>
          <textarea
            id="contact-body"
            name="body"
            required
            rows={5}
            placeholder="Your message *"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={20000}
            className={`${inputClass} resize-y min-h-[120px]`}
          />
        </div>
      </div>

      {status === "error" && errorMessage ? (
        <p
          className="mt-4 rounded-lg border border-red-600/40 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <GlowButton
          type="submit"
          disabled={status === "submitting"}
          variant="primary"
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Send message
            </>
          )}
        </GlowButton>
      </div>
    </form>
  );
}
