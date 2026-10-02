"use client";

import Image from "next/image";
import { aboutContent } from "@/lib/about";
import { selectedWorkItems } from "@/lib/selected-work";
import { aiPracticeIntro } from "@/lib/ai-practices";

type Props = {
  embedded?: boolean;
  onOpenApp?: (id: string) => void;
};

/** Home / Finder overview inside AnthonyOS. */
export default function HomeApp({ embedded = false, onOpenApp }: Props) {
  const shortcuts = [
    { id: "work", label: "Selected Work", appId: "work" },
    { id: "about", label: "About", appId: "about" },
    { id: "portfolio", label: "Portfolio", appId: "portfolio" },
    { id: "recommendations", label: "Kind Words", appId: "recommendations" },
  ];

  return (
    <div className={`os-app os-app--single${embedded ? " os-app--embedded" : ""}`}>
      <div className="os-app__single">
        <div className="os-app__portrait">
          <Image
            src={aboutContent.image}
            alt={aboutContent.imageAlt}
            width={200}
            height={200}
            className="os-app__portrait-img"
          />
        </div>
        <div className="os-app__single-copy">
          <p className="os-app__eyebrow">Home</p>
          <h1 className="os-app__single-title">Anthony Silvia, MBA</h1>
          <p className="os-app__prose">
            Product Designer. Complex operational workflows into clear product
            experiences, from discovery through delivery.
          </p>
          <p className="os-app__meta">{aiPracticeIntro.lede}</p>
          <div className="os-app__shortcut-grid">
            {shortcuts.map((s) => (
              <button
                key={s.id}
                type="button"
                className="os-app__shortcut"
                onClick={() => onOpenApp?.(s.appId)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <ul className="os-app__bullets">
            {selectedWorkItems.map((w) => (
              <li key={w.id}>
                <strong>{w.eyebrow}:</strong> {w.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
