import { defineArrayMember, defineField, defineType } from "sanity";
import { sections } from "@/lib/sections";
import { findForbiddenWords, portableTextToString, forbiddenMessage } from "@/sanity/breton";

// Rejects Breton text that isn't in skolveurieg (see src/sanity/breton.ts).
function skolveurieg(text: string | undefined): true | string {
  const words = findForbiddenWords(text ?? "");
  return words.length ? forbiddenMessage(words) : true;
}

const body = (lang: "br" | "fr") =>
  defineField({
    name: "body",
    title: lang === "br" ? "Testenn" : "Texte",
    type: "array",
    of: [
      defineArrayMember({
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "Titre / Titl", value: "h2" },
          { title: "Sous-titre / Is-titl", value: "h3" },
          { title: "Citation / Arroud", value: "blockquote" },
        ],
      }),
      defineArrayMember({
        type: "image",
        options: { hotspot: true },
        fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
      }),
    ],
    validation: (r) => (lang === "br" ? r.required().custom((v) => skolveurieg(portableTextToString(v))) : r),
  });

const text = (lang: "br" | "fr") => {
  const required = lang === "br";
  return defineField({
    name: lang,
    title: lang === "br" ? "Brezoneg" : "Français (optional)",
    type: "object",
    options: { collapsible: true, collapsed: !required },
    fields: [
      defineField({
        name: "title",
        title: lang === "br" ? "Titl" : "Titre",
        type: "string",
        validation: (r) => (required ? r.required().custom(skolveurieg) : r),
      }),
      defineField({
        name: "slug",
        title: lang === "br" ? "Chomlec'h (URL)" : "Adresse (URL)",
        description: "Click “Generate” to create it from the title.",
        type: "slug",
        options: { source: `${lang}.title`, maxLength: 96 },
        validation: (r) => (required ? r.required().custom((v) => skolveurieg(v?.current)) : r),
      }),
      defineField({
        name: "excerpt",
        title: lang === "br" ? "Berr-gomz" : "Chapô",
        description: "One or two sentences shown under the title and on the home page.",
        type: "text",
        rows: 3,
        validation: (r) => (required ? r.required().custom(skolveurieg) : r),
      }),
      body(lang),
    ],
  });
};

export const article = defineType({
  name: "article",
  title: "Article / Pennad",
  type: "document",
  fields: [
    defineField({
      name: "section",
      title: "Section / Rann",
      type: "string",
      options: { list: sections.map((s) => ({ title: `${s.br.name} – ${s.fr.name}`, value: s.id })), layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", title: "Author / Skrivagner", type: "reference", to: [{ type: "author" }] }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    text("br"),
    text("fr"),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "br.title", subtitle: "section", media: "mainImage" },
  },
});
