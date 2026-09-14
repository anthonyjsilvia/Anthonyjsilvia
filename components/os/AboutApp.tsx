"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutContent } from "@/lib/about";

export default function AboutApp({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={`os-app os-app--single${embedded ? " os-app--embedded" : ""}`}>
      <div className="os-app__single">
        <div className="os-app__portrait">
          <Image
            src={aboutContent.image}
            alt={aboutContent.imageAlt}
            width={280}
            height={280}
            className="os-app__portrait-img"
          />
        </div>
        <div className="os-app__single-copy">
          <p className="os-app__eyebrow">{aboutContent.eyebrow}</p>
          <h1 className="os-app__single-title">{aboutContent.title}</h1>
          <p className="os-app__prose">{aboutContent.body}</p>
          <div className="os-app__actions">
            <Link
              href={aboutContent.primaryCta.href}
              className="os-app__open-link"
              target={embedded ? "_top" : undefined}
            >
              {aboutContent.primaryCta.label}
            </Link>
            <Link
              href={aboutContent.secondaryCta.href}
              className="os-app__open-link os-app__open-link--ghost"
              target={embedded ? "_top" : undefined}
            >
              {aboutContent.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
