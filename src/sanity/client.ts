import "server-only";
import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

// The dataset is private (so nobody can read paid articles directly from
// Sanity). The site reads it with a secret token that only the server knows.
export const client = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  useCdn: false,
  // "raw" lets the site see drafts too. It needs that to check that an
  // online article still exists in the editor (where articles are drafts).
  // Only the queries in src/lib/articles.ts decide what is shown.
  perspective: "raw",
  token: process.env.SANITY_API_READ_TOKEN,
});

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

export function imageUrl(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
