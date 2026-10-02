"use client";

import { useMemo, useState } from "react";
import OsAppShell from "@/components/os/OsAppShell";
import { aiPracticeIntro, aiPractices } from "@/lib/ai-practices";

export default function AiPracticeApp({ embedded = false }: { embedded?: boolean }) {
  const [activeId, setActiveId] = useState(aiPractices[0]?.id ?? "");
  const active = useMemo(
    () => aiPractices.find((i) => i.id === activeId) ?? aiPractices[0],
    [activeId],
  );
  if (!active) return null;

  return (
    <OsAppShell
      embedded={embedded}
      eyebrow={aiPracticeIntro.eyebrow}
      sidebarTitle="Practice"
      items={aiPractices.map((i) => ({ id: i.id, title: i.title }))}
      activeId={active.id}
      onSelect={setActiveId}
      detailTitle={active.title}
      detailSubtitle={aiPracticeIntro.title}
      siteHref="/#practice"
      siteLabel="Open on home"
    >
      <p className="os-app__lede">{aiPracticeIntro.lede}</p>
      <p className="os-app__prose">{active.body}</p>
    </OsAppShell>
  );
}
