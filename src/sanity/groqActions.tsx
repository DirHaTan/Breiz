import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useDocumentOperation } from "sanity";
import { portableTextToString } from "./breton";

// Converts plain text into simple Portable Text blocks (one paragraph per block).
function textToPortableText(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, i) => ({
    _type: "block",
    _key: `groq-${Date.now()}-${i}`,
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

async function callGroq(body: Record<string, unknown>) {
  const res = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Groq request failed (${res.status})`);
  }
  const data = await res.json();
  return data.result as string;
}

// Breton → French translation of title, excerpt and body.
export const TranslateToFrenchAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [busy, setBusy] = useState(false);

  const doc = props.draft ?? props.published;
  const br = doc?.br as { title?: string; excerpt?: string; body?: unknown } | undefined;

  return {
    label: busy ? "O treiñ…" : "Treiñ e galleg · Traduire en français",
    disabled: busy || !br?.body,
    title: "Treïñ an testenn vrezonek e galleg gant Groq · Traduire le texte breton en français avec Groq",
    onHandle: async () => {
      if (!br) return;
      setBusy(true);
      try {
        const bodyText = portableTextToString(br.body);

        const [frTitle, frExcerpt, frBody] = await Promise.all([
          br.title ? callGroq({ action: "translate", text: br.title, from: "Breton", to: "French" }) : Promise.resolve(""),
          br.excerpt ? callGroq({ action: "translate", text: br.excerpt, from: "Breton", to: "French" }) : Promise.resolve(""),
          bodyText ? callGroq({ action: "translate", text: bodyText, from: "Breton", to: "French" }) : Promise.resolve(""),
        ]);

        const patches: Array<{ set: Record<string, unknown> }> = [];

        if (frTitle) patches.push({ set: { "fr.title": frTitle.trim() } });
        if (frExcerpt) patches.push({ set: { "fr.excerpt": frExcerpt.trim() } });
        if (frBody) patches.push({ set: { "fr.body": textToPortableText(frBody) } });

        if (patches.length) {
          patch.execute(patches);
        }
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Translation failed");
      } finally {
        setBusy(false);
        props.onComplete();
      }
    },
  };
};

// Generate short summaries (excerpts) in both languages from the Breton body.
export const SummarizeAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [busy, setBusy] = useState(false);

  const doc = props.draft ?? props.published;
  const br = doc?.br as { body?: unknown; excerpt?: string } | undefined;

  return {
    label: busy ? "O sevel berradenn…" : "Berradenn · Résumé",
    disabled: busy || !br?.body,
    title: "Sevel ur verr-gomz e brezoneg hag e galleg · Générer un chapô en breton et en français",
    onHandle: async () => {
      if (!br) return;
      setBusy(true);
      try {
        const bodyText = portableTextToString(br.body);
        if (!bodyText) return;

        const [brSummary, frSummary] = await Promise.all([
          callGroq({ action: "summarize", text: bodyText, language: "br" }),
          callGroq({ action: "summarize", text: bodyText, language: "fr" }),
        ]);

        const patches: Array<{ set: Record<string, unknown> }> = [];
        if (brSummary) patches.push({ set: { "br.excerpt": brSummary.trim() } });
        if (frSummary) patches.push({ set: { "fr.excerpt": frSummary.trim() } });

        if (patches.length) {
          patch.execute(patches);
        }
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Summarization failed");
      } finally {
        setBusy(false);
        props.onComplete();
      }
    },
  };
};
