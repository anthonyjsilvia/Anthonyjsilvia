"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import OsAppShell from "@/components/os/OsAppShell";
import { contactChannels, contactInfo, nodedaLinks } from "@/lib/contact";
import ContactMeForm from "@/components/ContactMeForm";

export default function ContactApp({ embedded = false }: { embedded?: boolean }) {
  const items = [
    ...contactChannels.map((c) => ({
      id: c.id,
      title: c.label,
      subtitle: c.description,
    })),
    { id: "form", title: "Message", subtitle: "Send a note through the site form" },
    { id: "nodeda", title: "NodeDa", subtitle: "Consulting via NodeDa" },
  ];
  const [activeId, setActiveId] = useState(items[0]?.id ?? "email");
  const channel = useMemo(
    () => contactChannels.find((c) => c.id === activeId),
    [activeId],
  );

  return (
    <OsAppShell
      embedded={embedded}
      eyebrow="Contact"
      sidebarTitle="Inbox"
      items={items}
      activeId={activeId}
      onSelect={setActiveId}
      detailTitle={
        activeId === "form"
          ? "Send a message"
          : activeId === "nodeda"
            ? "NodeDa"
            : (channel?.label ?? "Contact")
      }
      detailSubtitle={
        activeId === "form"
          ? "I usually reply within a day"
          : activeId === "nodeda"
            ? "Product strategy & experience design"
            : channel?.description
      }
      siteHref="/contact"
    >
      {activeId === "form" ? (
        <div className="os-app__form">
          <ContactMeForm fallbackEmail={contactInfo.email} />
        </div>
      ) : activeId === "nodeda" ? (
        <div className="os-app__actions">
          <a
            href={nodedaLinks.requestService}
            className="os-app__open-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request a service
            <ArrowUpRight className="os-app__open-icon" aria-hidden="true" />
          </a>
          <a
            href={nodedaLinks.homepage}
            className="os-app__open-link os-app__open-link--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit nodeda.com
          </a>
        </div>
      ) : channel ? (
        <>
          <p className="os-app__prose">{channel.value}</p>
          <Link
            href={channel.href}
            className="os-app__text-link"
            target={channel.external ? "_blank" : undefined}
            rel={channel.external ? "noopener noreferrer" : undefined}
          >
            {channel.label}
            <ArrowUpRight className="os-app__open-icon" aria-hidden="true" />
          </Link>
        </>
      ) : null}
    </OsAppShell>
  );
}
