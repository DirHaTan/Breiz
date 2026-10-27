"use client";

import { useEffect, useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { shareLinks, type SharePlatform } from "@/lib/share";

type Props = {
  url: string;
  title: string;
  labels: { heading: string; copy: string; copied: string; native: string; email: string };
};

const button =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1.5 border border-ink/20 px-2 text-muted hover:border-ink hover:text-ink";

// "Ranna ar pennad-mañ": links to share an article on social networks, by
// email, by copying the link, or (on phones) with the phone's own share menu.
export function ShareLinks({ url, title, labels }: Props) {
  const headingId = useId();
  const links = shareLinks(url, title);
  const [copied, setCopied] = useState(false);
  // False on the server and while the page loads, so both render the same HTML.
  const canShare = useSyncExternalStore(noSubscribe, phoneCanShare, () => false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers: copy through a hidden text field.
      const field = document.createElement("textarea");
      field.value = url;
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
  }

  const external: { id: Exclude<SharePlatform, "email">; label: string }[] = [
    { id: "facebook", label: "Facebook" },
    { id: "x", label: "X" },
    { id: "bluesky", label: "Bluesky" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  return (
    <section aria-labelledby={headingId} className="mt-4">
      <h2 id={headingId} className="text-xs font-bold uppercase tracking-widest text-muted">
        {labels.heading}
      </h2>
      <ul className="mt-2 flex flex-wrap items-center gap-2">
        {canShare && (
          <li>
            <button type="button" className={button} onClick={() => navigator.share({ title, url }).catch(() => {})}>
              {icons.share}
              <span className="text-sm">{labels.native}</span>
            </button>
          </li>
        )}
        {external.map(({ id, label }) => (
          <li key={id}>
            <a
              href={links[id]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={button}
            >
              {icons[id]}
            </a>
          </li>
        ))}
        <li>
          <a href={links.email} aria-label={labels.email} title={labels.email} className={button}>
            {icons.email}
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} className={button}>
            {icons.link}
            <span className="text-sm" aria-live="polite">
              {copied ? labels.copied : labels.copy}
            </span>
          </button>
        </li>
      </ul>
    </section>
  );
}

const noSubscribe = () => () => {};

// The phone's own share menu: only on touch screens that have one.
function phoneCanShare(): boolean {
  return typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;
}

// Small monochrome icons drawn with the text colour.
function Icon({ children, filled = false }: { children: ReactNode; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const icons = {
  facebook: (
    <Icon filled>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8z" />
    </Icon>
  ),
  x: (
    <Icon filled>
      <path d="M17.7 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.5 4.7H5.6z" />
    </Icon>
  ),
  bluesky: (
    <Icon filled>
      <path d="M12 11.1C10.9 9 8 5 5.3 3.1 2.8 1.3 1.8 1.6 1.2 1.9.4 2.2.3 3.4.3 4.1c0 .7.4 5.6.6 6.4.9 2.7 3.8 3.7 6.5 3.4-4 .6-7.5 2-2.9 7.1 5 5.2 6.9-1.1 7.9-4.3.9 3.2 2 9.4 7.7 4.3 4.3-4.3 1.2-6.5-2.8-7.1 2.7.3 5.6-.6 6.5-3.4.3-.8.6-5.7.6-6.4 0-.7-.1-1.9-.9-2.2-.6-.3-1.6-.6-4.1 1.2C16 5 13.1 9 12 11.1z" />
    </Icon>
  ),
  whatsapp: (
    <Icon>
      <path d="M3.5 20.5l1.3-4.2a8.5 8.5 0 1 1 3.1 3z" />
      <path d="M9 8.2c-.4 2.9 3.6 6.9 6.6 6.6l1-1.4-2.1-1-.9.9c-1.1-.4-2.3-1.6-2.8-2.8l.9-.9-1-2.1z" />
    </Icon>
  ),
  linkedin: (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10.5V17M8 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1-2.7 2.4-2.7s2.1 1 2.1 2.7V17" />
    </Icon>
  ),
  email: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </Icon>
  ),
  link: (
    <Icon>
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </Icon>
  ),
  share: (
    <Icon>
      <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5" />
      <path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12" />
    </Icon>
  ),
};
