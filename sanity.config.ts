"use client";

// Settings for the article editor (Sanity Studio), available at /studio.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { LIVE_TYPE } from "@/sanity/live";
import { EmbannAction, OnlineBadge, TennanAction } from "@/sanity/liveArticleActions";

// Article actions kept from Sanity. Its Publish/Unpublish buttons would make
// the text public, so they're replaced by Embann/Tennañ (see src/sanity/live.ts).
const keptActions = new Set(["delete", "duplicate", "restore", "discardChanges"]);

export default defineConfig({
  basePath: "/studio",
  title: "Breiz",
  projectId,
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Breiz")
          .items([
            S.listItem()
              .title("Pennadou enlinenn · Online articles")
              .child(
                S.documentList()
                  .title("Pennadou enlinenn")
                  .schemaType("article")
                  .filter(`_type == "article" && (_id in *[_type == "${LIVE_TYPE}"].sourceId || _id in *[_type == "${LIVE_TYPE}"].draftId)`)
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
              ),
            S.documentTypeListItem("article").title("Holl bennadou · All articles"),
            S.divider(),
            S.documentTypeListItem("author").title("Skrivagnerien · Authors"),
          ]),
    }),
  ],
  document: {
    actions: (prev, context) =>
      context.schemaType === "article"
        ? [EmbannAction, TennanAction, ...prev.filter((a) => a.action && keptActions.has(a.action))]
        : prev,
    badges: (prev, context) => (context.schemaType === "article" ? [OnlineBadge, ...prev] : prev),
  },
  // These features could publish an article publicly behind our back.
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  scheduledPublishing: { enabled: false },
});
