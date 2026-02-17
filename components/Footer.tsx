"use client";

export default function Footer() {
  return (
    <footer
      className="py-8 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] border-t border-[var(--border-light)]"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm">
            © 2026 Anthony Silvia. All rights reserved.
          </p>
          <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm flex items-center justify-center gap-2 flex-wrap">
            <span>Hosted by</span>
            <a
              href="https://nodeda.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
              aria-label="NodeDa Cloud (opens in new tab)"
            >
              <img
                src="https://nodeda.com/logos/NodeDa.cloud.black.svg"
                alt=""
                width={144}
                height={24}
                className="h-8 w-auto dark:hidden"
                aria-hidden
              />
              <img
                src="https://nodeda.com/logos/NodeDa.cloud.white.svg"
                alt=""
                width={144}
                height={24}
                className="h-8 w-auto hidden dark:block"
                aria-hidden
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
