"use client";

import Link from "next/link";
import {
  ResumePublicProvider,
  usePublicResume,
} from "@/components/ResumePublicProvider";
import { normalizeExternalUrl } from "@/lib/resume-public";

const DOWNLOAD_PDF_PATH = "/api/resume/pdf?download=1";
const FALLBACK_PDF_PATH = "/resume.pdf";

function ResumeAppInner({ embedded = false }: { embedded?: boolean }) {
  const { status, data, error, refresh } = usePublicResume();
  const basics = data?.profile?.basics;
  const profile = data?.profile;
  const downloadPdfUrl = status === "ready" ? DOWNLOAD_PDF_PATH : FALLBACK_PDF_PATH;
  const websiteUrl = normalizeExternalUrl(basics?.website);
  const linkedinUrl = normalizeExternalUrl(basics?.linkedinUrl);

  return (
    <div className={`os-app os-app--single${embedded ? " os-app--embedded" : ""}`}>
      <div className="os-app__resume">
        <header className="os-app__resume-head">
          <div>
            <p className="os-app__eyebrow">Resume</p>
            <h1 className="os-app__single-title">
              {basics?.fullName || data?.title || "Anthony Silvia, MBA"}
            </h1>
            {basics?.headline ? (
              <p className="os-app__meta">{basics.headline}</p>
            ) : null}
            <p className="os-app__meta">
              {status === "loading"
                ? "Loading live resume…"
                : status === "error"
                  ? `Live resume unavailable${error ? ` (${error})` : ""}`
                  : data?.updatedAt
                    ? `Updated ${new Date(data.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}`
                    : "Live NodeDa resume snapshot"}
            </p>
          </div>
          <div className="os-app__actions">
            <a
              href={downloadPdfUrl}
              download="Anthony-Silvia-Resume.pdf"
              className="os-app__open-link"
            >
              Download PDF
            </a>
            <Link
              href="/resume"
              className="os-app__open-link os-app__open-link--ghost"
              target={embedded ? "_top" : undefined}
            >
              Open on site
            </Link>
            {status === "error" ? (
              <button type="button" className="os-app__open-link os-app__open-link--ghost" onClick={refresh}>
                Retry
              </button>
            ) : null}
          </div>
        </header>

        {status === "loading" ? (
          <p className="os-app__prose" role="status">
            Loading resume…
          </p>
        ) : null}

        {status === "ready" && data?.html ? (
          <article
            className="os-app__resume-doc"
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        ) : null}

        {status === "ready" && !data?.html && profile ? (
          <div className="os-app__resume-doc">
            {basics?.summary ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Summary</h2>
                <p className="os-app__prose">{basics.summary}</p>
              </section>
            ) : null}

            {basics ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Contact</h2>
                <ul className="os-app__bullets">
                  {basics.email ? <li>{basics.email}</li> : null}
                  {basics.phone ? <li>{basics.phone}</li> : null}
                  {basics.location ? <li>{basics.location}</li> : null}
                  {linkedinUrl ? (
                    <li>
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </li>
                  ) : null}
                  {websiteUrl ? (
                    <li>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    </li>
                  ) : null}
                </ul>
              </section>
            ) : null}

            {profile.experience.length ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Experience</h2>
                {profile.experience.map((job) => (
                  <div key={job.id} className="os-app__resume-item">
                    <h3 className="os-app__resume-item-title">
                      {job.title} · {job.company}
                    </h3>
                    <p className="os-app__meta">
                      {job.startMonth} {job.startYear}
                      {" – "}
                      {job.current
                        ? "Present"
                        : `${job.endMonth ?? ""} ${job.endYear ?? ""}`.trim()}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    {job.description ? (
                      <p className="os-app__prose">{job.description}</p>
                    ) : null}
                  </div>
                ))}
              </section>
            ) : null}

            {profile.education.length ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Education</h2>
                {profile.education.map((ed) => (
                  <div key={ed.id} className="os-app__resume-item">
                    <h3 className="os-app__resume-item-title">{ed.school}</h3>
                    <p className="os-app__meta">
                      {[ed.degree, ed.field].filter(Boolean).join(" · ")}
                      {ed.endYear ? ` · ${ed.endYear}` : ""}
                    </p>
                    {ed.description ? (
                      <p className="os-app__prose">{ed.description}</p>
                    ) : null}
                  </div>
                ))}
              </section>
            ) : null}

            {profile.skills.length ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Skills</h2>
                <div className="os-app__tags">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="os-app__tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {profile.certifications.length ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Certifications</h2>
                <ul className="os-app__bullets">
                  {profile.certifications.map((c) => (
                    <li key={c.id}>
                      {c.name}
                      {c.issuer ? ` · ${c.issuer}` : ""}
                      {c.year ? ` (${c.year})` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {profile.projects.length ? (
              <section className="os-app__block">
                <h2 className="os-app__block-title">Projects</h2>
                {profile.projects.map((p) => (
                  <div key={p.id} className="os-app__resume-item">
                    <h3 className="os-app__resume-item-title">{p.name}</h3>
                    {p.description ? (
                      <p className="os-app__prose">{p.description}</p>
                    ) : null}
                  </div>
                ))}
              </section>
            ) : null}
          </div>
        ) : null}

        {status === "error" ? (
          <p className="os-app__prose">
            You can still download the PDF fallback above, or open the full
            resume page on the site.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Full live resume browser for AnthonyOS. */
export default function ResumeApp({ embedded = false }: { embedded?: boolean }) {
  return (
    <ResumePublicProvider>
      <ResumeAppInner embedded={embedded} />
    </ResumePublicProvider>
  );
}
