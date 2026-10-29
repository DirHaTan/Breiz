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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, language, from, to, title, content } = body;

    if (action === "create_draft") {
      if (!title || typeof title !== "string" || !content || typeof content !== "string") {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
      }

      // Process with Groq: produce a French version suitable for the site.
      const frTitle = await translateContent(title, "Breton or source", "French");
      const frBody = await translateContent(content, "Breton or source", "French");

      const client = getWriteClient();
      const draftId = `drafts.article-${Date.now()}`;

      const document = {
        _id: draftId,
        _type: "article",
        section: "nevezentiou",
        publishedAt: new Date().toISOString(),
        free: false,
        br: {
          title: title.trim(),
          excerpt: (await summarizeContent(content, "br")).trim(),
          body: textToPortableText(content),
        },
        fr: {
          title: frTitle.trim(),
          excerpt: (await summarizeContent(frBody || content, "fr")).trim(),
          body: textToPortableText(frBody || content),
        },
      };

      const created = await client.create(document);

      return NextResponse.json({
        ok: true,
        id: created._id,
        message: "Draft created in Sanity. Review and click Embann in Studio.",
      });
    }

    // Existing summarize / translate actions
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
