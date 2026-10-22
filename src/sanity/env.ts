// Sanity settings, read from environment variables (set in Vercel).
// Until they are set, the site keeps showing the sample articles.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-10-01";

export const isSanityConfigured = projectId !== "";
