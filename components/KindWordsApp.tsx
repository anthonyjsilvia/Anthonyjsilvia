"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { recommendations, type Recommendation } from "@/lib/recommendations";

/**
 * Kind Words - AnthonyOS-native recommendations browser.
 * Reads exclusively from `lib/recommendations` (same source as the homepage
 * section and `/recommendations/[slug]` detail pages).
 */
export default function KindWordsApp({
  embedded = false,
}: {
  /** True when rendered inside AnthonyOS / `?embed=1`. */
  embedded?: boolean;
}) {
  const list = recommendations;
  const [activeSlug, setActiveSlug] = useState(list[0]?.slug ?? "");
  const active: Recommendation | undefined = useMemo(
    () => list.find((r) => r.slug === activeSlug) ?? list[0],
    [list, activeSlug],
  );

  if (!active) {
    return (
      <div className="kw-app">
        <p className="kw-app__empty">No recommendations yet.</p>
      </div>
    );
  }

  const paragraphs = active.testimonial.split("\n\n").filter(Boolean);
  const detailHref = `/recommendations/${active.slug}`;

  return (
    <div className={`kw-app${embedded ? " kw-app--embedded" : ""}`}>
      <aside className="kw-app__sidebar" aria-label="Recommenders">
        <header className="kw-app__sidebar-head">
          <p className="kw-app__eyebrow">Kind Words</p>
          <h1 className="kw-app__sidebar-title">Recommendations</h1>
          <p className="kw-app__sidebar-count">
            {list.length} {list.length === 1 ? "note" : "notes"}
          </p>
        </header>

        <ul className="kw-app__list" role="listbox" aria-label="People">
          {list.map((rec) => {
            const selected = rec.slug === active.slug;
            return (
              <li key={rec.slug} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`kw-app__row${selected ? " is-selected" : ""}`}
                  onClick={() => setActiveSlug(rec.slug)}
                >
                  <span className="kw-app__avatar">
                    <Image
                      src={rec.image}
                      alt=""
                      width={44}
                      height={44}
                      className="kw-app__avatar-img"
                    />
                  </span>
                  <span className="kw-app__row-copy">
                    <span className="kw-app__row-name">{rec.name}</span>
                    <span className="kw-app__row-role">{rec.role}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section
        className="kw-app__detail"
        aria-label={`Recommendation from ${active.name}`}
      >
        <header className="kw-app__detail-head">
          <div className="kw-app__detail-identity">
            <span className="kw-app__detail-avatar">
              <Image
                src={active.image}
                alt=""
                width={72}
                height={72}
                className="kw-app__detail-avatar-img"
              />
            </span>
            <div>
              <h2 className="kw-app__detail-name">{active.name}</h2>
              <p className="kw-app__detail-role">{active.role}</p>
            </div>
          </div>
          <Link
            href={detailHref}
            className="kw-app__open-link"
            target={embedded ? "_top" : undefined}
            rel={embedded ? "noopener" : undefined}
          >
            Open full page
            <ArrowUpRight className="kw-app__open-icon" aria-hidden="true" />
          </Link>
        </header>

        <div className="kw-app__quote">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
