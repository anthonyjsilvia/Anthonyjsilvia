"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type OsListItem = {
  id: string;
  title: string;
  subtitle?: string;
};

type Props = {
  embedded?: boolean;
  eyebrow: string;
  sidebarTitle: string;
  items: OsListItem[];
  activeId: string;
  onSelect: (id: string) => void;
  detailTitle: string;
  detailSubtitle?: string;
  siteHref?: string;
  siteLabel?: string;
  children: ReactNode;
};

/**
 * Shared AnthonyOS master-detail chrome (Kind Words pattern).
 */
export default function OsAppShell({
  embedded = false,
  eyebrow,
  sidebarTitle,
  items,
  activeId,
  onSelect,
  detailTitle,
  detailSubtitle,
  siteHref,
  siteLabel = "Open full page",
  children,
}: Props) {
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  return (
    <div
      className={`os-app${embedded ? " os-app--embedded" : ""}${mobileShowDetail ? " os-app--detail" : ""}`}
    >
      <aside className="os-app__sidebar" aria-label={sidebarTitle}>
        <header className="os-app__sidebar-head">
          <p className="os-app__eyebrow">{eyebrow}</p>
          <h1 className="os-app__sidebar-title">{sidebarTitle}</h1>
          <p className="os-app__sidebar-count">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </header>

        <ul className="os-app__list" role="listbox" aria-label={sidebarTitle}>
          {items.map((item) => {
            const selected = item.id === activeId;
            return (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`os-app__row${selected ? " is-selected" : ""}`}
                  onClick={() => {
                    onSelect(item.id);
                    setMobileShowDetail(true);
                  }}
                >
                  <span className="os-app__row-copy">
                    <span className="os-app__row-name">{item.title}</span>
                    {item.subtitle ? (
                      <span className="os-app__row-role">{item.subtitle}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="os-app__detail" aria-label={detailTitle}>
        <header className="os-app__detail-head">
          <button
            type="button"
            className="os-app__back"
            onClick={() => setMobileShowDetail(false)}
          >
            ← Library
          </button>
          <div className="os-app__detail-identity">
            <div>
              <h2 className="os-app__detail-name">{detailTitle}</h2>
              {detailSubtitle ? (
                <p className="os-app__detail-role">{detailSubtitle}</p>
              ) : null}
            </div>
          </div>
          {siteHref ? (
            <Link
              href={siteHref}
              className="os-app__open-link"
              target={embedded ? "_top" : undefined}
              rel={embedded ? "noopener" : undefined}
            >
              {siteLabel}
              <ArrowUpRight className="os-app__open-icon" aria-hidden="true" />
            </Link>
          ) : null}
        </header>
        <div className="os-app__body">{children}</div>
      </section>
    </div>
  );
}
