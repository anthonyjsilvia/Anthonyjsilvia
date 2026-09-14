"use client";

import { useMemo, useState } from "react";
import OsAppShell from "@/components/os/OsAppShell";
import { experienceRoles } from "@/lib/experience-summary";

export default function ExperienceApp({ embedded = false }: { embedded?: boolean }) {
  const [activeId, setActiveId] = useState(experienceRoles[0]?.id ?? "");
  const active = useMemo(
    () => experienceRoles.find((i) => i.id === activeId) ?? experienceRoles[0],
    [activeId],
  );
  if (!active) return null;

  return (
    <OsAppShell
      embedded={embedded}
      eyebrow="Experience"
      sidebarTitle="Career"
      items={experienceRoles.map((i) => ({
        id: i.id,
        title: i.title,
        subtitle: `${i.company} · ${i.period}`,
      }))}
      activeId={active.id}
      onSelect={setActiveId}
      detailTitle={active.title}
      detailSubtitle={`${active.company} · ${active.period}`}
      siteHref="/experience"
    >
      <p className="os-app__meta">{active.location}</p>
      <p className="os-app__prose">{active.summary}</p>
      {active.bullets?.length ? (
        <ul className="os-app__bullets">
          {active.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}
    </OsAppShell>
  );
}
