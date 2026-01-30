"use client";

export default function Footer() {
  return (
    <footer
      className="py-8 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] border-t border-[var(--border-light)]"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm">
            © 2026 Anthony Silvia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
