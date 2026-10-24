import type { Locale } from "@/i18n/config";

// The legal pages ("Mentions légales" and "Politique de confidentialité").
// Text in [BRACKETS] is a placeholder to be replaced with the final text.

type LegalSection = { heading: string; lines: string[] };
type LegalPageText = { slug: string; title: string; sections: LegalSection[] };
export type LegalKind = "notices" | "privacy";

const HOST = [
  "Vercel Inc.",
  "440 N Barranca Ave #4133, Covina, CA 91723, USA",
  "https://vercel.com",
];

export const legalPages: Record<LegalKind, Record<Locale, LegalPageText>> = {
  notices: {
    br: {
      slug: "notennou-lezennel",
      title: "Notennou lezennel",
      sections: [
        {
          heading: "Embanner al lehienn",
          lines: ["[NOM OU RAISON SOCIALE DE L'ÉDITEUR]", "[ADRESSE POSTALE]", "[ADRESSE E-MAIL DE CONTACT]", "[NUMÉRO SIRET si applicable]"],
        },
        { heading: "Rener an embann", lines: ["[NOM DU DIRECTEUR DE LA PUBLICATION]"] },
        { heading: "Herberhier", lines: HOST },
        { heading: "Gwiriou an oberourien", lines: ["[TEXTE À VENIR]"] },
        { heading: "Darempred", lines: ["[ADRESSE E-MAIL DE CONTACT]"] },
      ],
    },
    fr: {
      slug: "mentions-legales",
      title: "Mentions légales",
      sections: [
        {
          heading: "Éditeur du site",
          lines: ["[NOM OU RAISON SOCIALE DE L'ÉDITEUR]", "[ADRESSE POSTALE]", "[ADRESSE E-MAIL DE CONTACT]", "[NUMÉRO SIRET si applicable]"],
        },
        { heading: "Directeur de la publication", lines: ["[NOM DU DIRECTEUR DE LA PUBLICATION]"] },
        { heading: "Hébergeur", lines: HOST },
        { heading: "Propriété intellectuelle", lines: ["[TEXTE À VENIR]"] },
        { heading: "Contact", lines: ["[ADRESSE E-MAIL DE CONTACT]"] },
      ],
    },
  },
  privacy: {
    br: {
      slug: "prevezded",
      title: "Prevezded",
      sections: [
        { heading: "Piou a zo atebeg?", lines: ["[NOM DU DIRECTEUR DE LA PUBLICATION]", "[ADRESSE E-MAIL DE CONTACT]"] },
        { heading: "An titouriou dastumet", lines: ["[TEXTE À VENIR]"] },
        { heading: "Perak e vezont dastumet?", lines: ["[TEXTE À VENIR]"] },
        { heading: "Pegeit e vezont miret?", lines: ["[TEXTE À VENIR]"] },
        { heading: "Piou a c'hell o gwelet?", lines: ["[TEXTE À VENIR]"] },
        { heading: "Ho kwiriou", lines: ["[TEXTE À VENIR]"] },
        { heading: "Toupinou", lines: ["[TEXTE À VENIR]"] },
        { heading: "Darempred", lines: ["[ADRESSE E-MAIL DE CONTACT]"] },
      ],
    },
    fr: {
      slug: "confidentialite",
      title: "Politique de confidentialité",
      sections: [
        { heading: "Responsable du traitement", lines: ["[NOM DU DIRECTEUR DE LA PUBLICATION]", "[ADRESSE E-MAIL DE CONTACT]"] },
        { heading: "Données collectées", lines: ["[TEXTE À VENIR]"] },
        { heading: "Finalités", lines: ["[TEXTE À VENIR]"] },
        { heading: "Durée de conservation", lines: ["[TEXTE À VENIR]"] },
        { heading: "Destinataires et sous-traitants", lines: ["[TEXTE À VENIR]"] },
        { heading: "Vos droits", lines: ["[TEXTE À VENIR]"] },
        { heading: "Cookies", lines: ["[TEXTE À VENIR]"] },
        { heading: "Contact", lines: ["[ADRESSE E-MAIL DE CONTACT]"] },
      ],
    },
  },
};
