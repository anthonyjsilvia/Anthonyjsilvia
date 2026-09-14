"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import OsAppShell from "@/components/os/OsAppShell";
import { selectedWorkItems } from "@/lib/selected-work";

export default function SelectedWorkApp({ embedded = false }: { embedded?: boolean }) {
  const [activeId, setActiveId] = useState(selectedWorkItems[0]?.id ?? "");
  const active = useMemo(
    () => selectedWorkItems.find((i) => i.id === activeId) ?? selectedWorkItems[0],
    [activeId],
  );
  if (!active) return null;

  return (
    <OsAppShell
      embedded={embedded}
      eyebrow="Selected work"
      sidebarTitle="Proof"
      items={selectedWorkItems.map((i) => ({
        id: i.id,
        title: i.title,
        subtitle: `${i.eyebrow} · ${i.role}`,
      }))}
      activeId={active.id}
      onSelect={setActiveId}
      detailTitle={active.title}
      detailSubtitle={`${active.eyebrow} · ${active.role}`}
      siteHref={active.href}
      siteLabel="Open evidence"
    >
      <p className="os-app__prose">{active.context}</p>
      <Link
        href={active.href}
        className="os-app__text-link"
        target={embedded ? "_top" : undefined}
      >
        Continue on site
        <ArrowUpRight className="os-app__open-icon" aria-hidden="true" />
      </Link>
    </OsAppShell>
  );
}
