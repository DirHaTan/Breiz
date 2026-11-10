import { defineArrayMember, defineField, defineType } from "sanity";
import { sections } from "@/lib/sections";
import { DEPARTMENT_SECTION, departments } from "@/lib/departments";
import { SectionInput } from "@/sanity/SectionInput";
import { findForbiddenWords, portableTextToString, forbiddenMessage } from "@/sanity/breton";

// Rejects Breton text that isn't in skolveurieg (see src/sanity/breton.ts).
function skolveurieg(text: string | undefined): true | string {
  const words = findForbiddenWords(text ?? "");
  return words.length ? forbiddenMessage(words) : true;
}

type Lang = "br" | "fr" | "en";
const labels = {
  body: { br: "Testenn", fr: "Texte", en: "Text" },
  group: { br: "Brezoneg", fr: "Français (optional)", en: "English (optional)" },
  title: { br: "Titl", fr: "Titre", en: "Title" },
  slug: { br: "Chomleh (URL)", fr: "Adresse (URL)", en: "Address (URL)" },
  excerpt: { br: "Berr-gomz", fr: "Chapô", en: "Summary" },
  audio: { br: "Son (MP3)", fr: "Audio (MP3)", en: "Audio (MP3)" },
  audioCredit: { br: "Mouez", fr: "Voix", en: "Voice" },
} as const;

const body = (lang: Lang) =>
  defineField({
    name: "body",
    title: labels.body[lang],
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

const text = (lang: Lang) => {
  const required = lang === "br";
  return defineField({
    name: lang,
    title: labels.group[lang],
    type: "object",
    options: { collapsible: true, collapsed: !required },
    fields: [
      defineField({
        name: "title",
        title: labels.title[lang],
        type: "string",
        validation: (r) => (required ? r.required().custom(skolveurieg) : r),
      }),
      defineField({
        name: "slug",
        title: labels.slug[lang],
        description: "Click “Generate” to create it from the title.",
        type: "slug",
        options: { source: `${lang}.title`, maxLength: 96 },
        validation: (r) => (required ? r.required().custom((v) => skolveurieg(v?.current)) : r),
      }),
      defineField({
        name: "excerpt",
        title: labels.excerpt[lang],
        description: "One or two sentences shown under the title and on the home page.",
        type: "text",
        rows: 3,
        validation: (r) => (required ? r.required().custom(skolveurieg) : r),
      }),
      body(lang),
      // Optional recording of the article, played above the text.
      defineField({
        name: "audio",
        title: labels.audio[lang],
        description: "Optional MP3 of this text read aloud. Shown to the same readers as the full text.",
        type: "file",
        options: { accept: "audio/*" },
      }),
      defineField({
        name: "audioCredit",
        title: labels.audioCredit[lang],
        description: "Who reads it, e.g. “Lennet gand Dir Ha Tan” or “Mouez IA / Voix IA / AI voice”.",
        type: "string",
        validation: (r) => r.max(120),
      }),
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
      components: { input: SectionInput },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "department",
      title: "Departamant",
      description:
        "Evid ar pennadou er rann Breiz hepken. · Uniquement pour les articles de la rubrique Breiz.",
      type: "string",
      options: { list: departments.map((d) => ({ title: `${d.br.name} – ${d.fr.name}`, value: d.id })), layout: "radio" },
      // Only shown for articles in the Breiz section.
      hidden: ({ document }) => document?.section !== DEPARTMENT_SECTION,
    }),
    defineField({
      name: "free",
      title: "Pennad digoust",
      description:
        "Diskouezet a-bez d'an holl, hep koumanant. · Article gratuit : affiché en entier à tous, sans abonnement.",
      type: "boolean",
      initialValue: false,
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
      fields: [
        defineField({ name: "alt", title: "Alternative text", type: "string" }),
        // Optional photo credit, shown under the main image on the article page.
        defineField({
          name: "credit",
          title: "Crédit photo",
          description: "Ex. : Jean Dupont, CC BY-SA 4.0, Wikimedia Commons",
          type: "string",
          validation: (r) => r.max(200),
        }),
        defineField({
          name: "creditUrl",
          title: "Lien de la source",
          description: "Page Wikimedia Commons ou page de la licence",
          type: "url",
          validation: (r) => r.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),
    text("br"),
    text("fr"),
    text("en"),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "br.title", subtitle: "section", media: "mainImage" },
  },
});
