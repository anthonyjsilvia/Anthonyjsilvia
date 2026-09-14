"use client";

import { useMemo, useState } from "react";
import OsAppShell from "@/components/os/OsAppShell";
import { evidenceSections } from "@/lib/evidence";

export default function EvidenceApp({ embedded = false }: { embedded?: boolean }) {
  const [activeId, setActiveId] = useState(evidenceSections[0]?.id ?? "");
  const active = useMemo(
    () => evidenceSections.find((i) => i.id === activeId) ?? evidenceSections[0],
    [activeId],
  );
  if (!active) return null;

  return (
    <OsAppShell
      embedded={embedded}
      eyebrow="Evidence"
      sidebarTitle="How I work"
      items={evidenceSections.map((i) => ({
        id: i.id,
        title: i.title,
        subtitle: i.intro,
      }))}
      activeId={active.id}
      onSelect={setActiveId}
      detailTitle={active.title}
      detailSubtitle={active.intro}
      siteHref={`/evidence#${active.id}`}
    >
      {active.projects.map((project) => (
        <article key={project.name} className="os-app__block">
          <h3 className="os-app__block-title">{project.name}</h3>
          <ul className="os-app__bullets">
            {project.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </OsAppShell>
  );
}
