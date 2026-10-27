// Share links for an article: plain web addresses, no scripts or trackers.
export type SharePlatform = "facebook" | "x" | "bluesky" | "whatsapp" | "linkedin" | "email";

export function shareLinks(url: string, title: string): Record<SharePlatform, string> {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://x.com/intent/post?url=${u}&text=${t}`,
    bluesky: `https://bsky.app/intent/compose?text=${t}%20${u}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    email: `mailto:?subject=${t}&body=${u}`,
  };
}
