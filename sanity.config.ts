"use client";

// Settings for the article editor (Sanity Studio), available at /studio.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  title: "Breiz",
  projectId,
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  plugins: [structureTool()],
});
