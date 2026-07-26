import type { ReactNode } from "react";
import FluentReveal from "@/components/FluentReveal";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** @deprecated No longer applied — kept so existing call sites type-check. */
  max?: number;
  /** @deprecated No longer applied */
  lift?: number;
  /** @deprecated No longer applied */
  scale?: number;
  /** @deprecated No longer applied */
  glare?: boolean;
  /** @deprecated No longer applied */
  disabled?: boolean;
  roundedClassName?: string;
}

/**
 * Layout shell for former tilt cards. Applies Fluent Reveal hover instead of
 * 3D perspective tracking.
 */
export default function Tilt3D({
  children,
  className = "",
  containerClassName = "",
  roundedClassName = "",
}: Tilt3DProps) {
  return (
    <div className={containerClassName || undefined}>
      <FluentReveal
        intensity="card"
        className={[className, roundedClassName].filter(Boolean).join(" ") || undefined}
      >
        {children}
      </FluentReveal>
    </div>
  );
}
