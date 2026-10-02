"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import OsAppShell from "@/components/os/OsAppShell";
import { portfolioProjects } from "@/lib/portfolio";

export default function PortfolioApp({ embedded = false }: { embedded?: boolean }) {
  const [activeId, setActiveId] = useState(portfolioProjects[0]?.id ?? "");
  const active = useMemo(
    () => portfolioProjects.find((i) => i.id === activeId) ?? portfolioProjects[0],
    [activeId],
  );
  if (!active) return null;

  const isExternal = Boolean(active.link?.startsWith("http"));

  return (
    <OsAppShell
      embedded={embedded}
      eyebrow="Portfolio"
      sidebarTitle="Projects"
      items={portfolioProjects.map((i) => ({
        id: i.id,
        title: i.title,
        subtitle: i.subtitle,
      }))}
      activeId={active.id}
      onSelect={setActiveId}
      detailTitle={active.title}
      detailSubtitle={active.subtitle}
      siteHref="/portfolio"
    >
      {active.image ? (
        <div className="relative mb-4 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg">
          <Image
            src={active.image}
            alt=""
            fill
            className="object-cover"
            sizes="280px"
            style={{
              objectPosition: active.imagePosition ?? "top center",
              transform: active.imageZoom
                ? `scale(${active.imageZoom})`
                : undefined,
            }}
          />
        </div>
      ) : null}
      <p className="os-app__meta">{active.category}</p>
      <p className="os-app__prose">{active.description}</p>
      <div className="os-app__tags">
        {active.technologies.map((t) => (
          <span key={t} className="os-app__tag">
            {t}
          </span>
        ))}
      </div>
      {active.companyStatus ? (
        <p className="os-app__meta">{active.companyStatus}</p>
      ) : null}
      {active.link ? (
        <Link
          href={active.link}
          className="os-app__text-link"
          target={isExternal || embedded ? "_blank" : embedded ? "_top" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {active.linkText ?? "Open"}
          <ArrowUpRight className="os-app__open-icon" aria-hidden="true" />
        </Link>
      ) : null}
    </OsAppShell>
  );
}
