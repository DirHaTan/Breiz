import type { SanityDocument } from "sanity";

// The article's own fields, without Sanity's bookkeeping (ID, revision, dates).
export function articleFields(doc: SanityDocument): Record<string, unknown> {
  const fields: Record<string, unknown> = { ...doc };
  for (const key of ["_id", "_rev", "_createdAt", "_updatedAt", "_system"]) delete fields[key];
  return fields;
}

// A short fingerprint of the article's content: every field, including the
// main image's alt text and photo credit (mainImage.credit, mainImage.creditUrl). Sanity's revision number can
// change without any edit (e.g. when the old public version is removed), so
// we compare content instead.
export function contentHash(doc: SanityDocument): string {
  const stable = (value: unknown): unknown =>
    Array.isArray(value)
      ? value.map(stable)
      : value && typeof value === "object"
        ? Object.fromEntries(
            Object.keys(value)
              .sort()
              .map((k) => [k, stable((value as Record<string, unknown>)[k])]),
          )
        : value;
  const text = JSON.stringify(stable(articleFields(doc)));
  // cyrb53: a small, fast, well-spread string hash.
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
