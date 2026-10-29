import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { summarizeContent, translateContent } from "@/lib/groq";
import { projectId, dataset, apiVersion } from "@/sanity/env";

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId) {
    throw new Error("SANITY_API_WRITE_TOKEN or project ID is not set");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

function textToPortableText(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, i) => ({
    _type: "block",
    _key: `block-${i}-${Date.now()}`,
    style: "normal",
    children: [
      {
        _type: "span",
        _key: `span-${i}`,
        text: paragraph.replace(/\n/g, " "),
        marks: [],
      },
    ],
    markDefs: [],
  }));
}

// Simple slug generator (ASCII, lowercase, hyphens). Good enough for drafts.
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "pennad";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, language, from, to, title, content } = body;

    if (action === "create_draft") {
      if (!title || typeof title !== "string" || !content || typeof content !== "string") {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
      }

      const originalTitle = title.trim();
      const originalContent = content.trim();

      // Breton fields only = original input (assumed to be in Skolveurieg).
      // French translation is disabled; fr fields are left empty.
      const brTitle = originalTitle;
      const brExcerpt = (await summarizeContent(originalContent, "br")).trim();
      const brBody = textToPortableText(originalContent);
      const brSlug = slugify(brTitle);

      const client = getWriteClient();
      const draftId = `drafts.article-${Date.now()}`;

      const document = {
        _id: draftId,
        _type: "article",
        section: "nevezentiou",
        publishedAt: new Date().toISOString(),
        free: false,
        br: {
          title: brTitle,
          slug: { _type: "slug", current: brSlug },
          excerpt: brExcerpt,
          body: brBody,
        },
        // fr intentionally omitted — no automatic French translation
      };

      const created = await client.create(document);

      return NextResponse.json({
        ok: true,
        id: created._id,
        message: "Draft created with Breton original only. Review in Studio and click Embann.",
      });
    }

    // Existing summarize / translate actions (still available for manual use)
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
    }

    let result: string;

    if (action === "summarize") {
      result = await summarizeContent(text, language || "br");
    } else if (action === "translate") {
      if (!from || !to) {
        return NextResponse.json({ error: "Missing from/to languages" }, { status: 400 });
      }
      result = await translateContent(text, from, to);
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'summarize', 'translate', or 'create_draft'" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Groq / Sanity API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 },
    );
  }
}
