import type { Locale } from "@/i18n/config";

// The legal pages: "Notennou lezennel" / "Mentions légales", "Prevezded" /
// "Confidentialité" and "Divizou gwerza" / "CGV". Each line is a paragraph;
// a line starting with "- " is a list item. Email addresses, https:// links
// and [text](https://…) links become clickable (see LegalPage).

type LegalSection = { heading: string; lines: string[] };
type LegalPageText = { slug: string; title: string; sections: LegalSection[] };
export type LegalKind = "notices" | "privacy" | "terms";

const SITE = "[www.keleierbreiz.fr](https://www.keleierbreiz.fr)";
const CONTACT = "darempred@keleierbreiz.fr";

export const legalPages: Record<LegalKind, Record<Locale, LegalPageText>> = {
  notices: {
    br: {
      slug: "notennou-lezennel",
      title: "Notennou lezennel",
      sections: [
        {
          heading: "Embanner al lehienn",
          lines: [`Lehienn ${SITE} a zo embannet gand Hocine Nedjar, den prevez.`, `Darempred: ${CONTACT}`],
        },
        { heading: "Rener an embann", lines: ["Hocine Nedjar"] },
        {
          heading: "Herberhier",
          lines: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Stadou-Unanet — https://vercel.com"],
        },
        {
          heading: "Gwiriou an oberourien",
          lines: [
            "An testennou embannet war al lehienn-mañ a zo d'o oberourien. Difennet eo o adembann, zoken eul lodenn anezo, hep aotre skrivet. Ar skeudennou a zo embannet gand aotre o oberourien pe dindan eun aotre frank; anv an oberour a zo merket dindan pep skeudenn.",
          ],
        },
        { heading: "Darempred", lines: [`Evid kemenn eun danvez na zere ket, skrivit da ${CONTACT}.`] },
      ],
    },
    fr: {
      slug: "mentions-legales",
      title: "Mentions légales",
      sections: [
        {
          heading: "Éditeur du site",
          lines: [`Le site ${SITE} est édité par Hocine Nedjar, particulier.`, `Contact : ${CONTACT}`],
        },
        { heading: "Directeur de la publication", lines: ["Hocine Nedjar"] },
        {
          heading: "Hébergeur",
          lines: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — https://vercel.com"],
        },
        { heading: "Propriété intellectuelle", lines: ["[TEXTE À VENIR]"] },
        { heading: "Contact", lines: ["darempred@keleierbreiz.fr"] },
      ],
    },
  },
  terms: {
    br: {
      slug: "divizou-gwerza",
      title: "Divizou gwerza",
      sections: [
        {
          heading: "Pal",
          lines: [
            `An diviziou-mañ a ren ar c'houmanant niverel da Geleier Breiz hag ar Bed, a ro an tu da lenn an holl bennadou embannet war ${SITE}.`,
          ],
        },
        {
          heading: "Gwerzer",
          lines: [
            `Stripe a ra war-dro ar paea; ar werz a vez graet dre Link (Stripe), a zastum an TVA. Danvez al lehienn a zo pourchaset gand embanner al lehienn, Hocine Nedjar (gwelit an notennou lezennel). Darempred: ${CONTACT}`,
          ],
        },
        { heading: "Priz", lines: ["- Bep miz: 5 € (TVA ebarz).", "- Bep bloaz: 50 € (TVA ebarz)."] },
        {
          heading: "Paea",
          lines: [
            "Gand eur gartenn-vank pe gand an doareou all kinniget war bajenn baea suraet Stripe. Paeet e vez e penn kentañ pep mare.",
          ],
        },
        {
          heading: "Padelez hag adneveza",
          lines: ["Ar c'houmanant a vez adnevezet ent emgefre e fin pep mare (miz pe bloaz), betek ma vo paouezet."],
        },
        {
          heading: "Paouez ar c'houmanant",
          lines: [
            "Gellout a rit paouez pa garit, dre « Ma c'hont » → « Mera ma c'houmanant ». Paouez a ra ar c'houmanant e fin ar mare paeet dija; mirout a rit an tu da lenn betek neuze.",
          ],
        },
        {
          heading: "Gwir da zilezel",
          lines: [
            `Pevarzek devez hoh eus goude ho paeamant kentañ evid goulenn ma vo distaolet deoh hoh arhant, hep rei abeg ebet, o skriva da ${CONTACT}.`,
          ],
        },
        { heading: "Darempred", lines: [CONTACT] },
        {
          heading: "Lezenn",
          lines: [
            `Lezenn Frans a dalv evid an diviziou-mañ. Ma vez eun tabut, skrivit da gentañ da ${CONTACT}: klasket e vo eun diskoulm a-unvan a-raok netra all.`,
          ],
        },
      ],
    },
    fr: {
      slug: "cgv",
      title: "Conditions générales de vente",
      sections: [
        { heading: "Vendeur", lines: ["[NOM OU RAISON SOCIALE DU VENDEUR]", "[ADRESSE POSTALE]", "darempred@keleierbreiz.fr", "[NUMÉRO SIRET si applicable]"] },
        { heading: "Objet", lines: ["[TEXTE À VENIR]"] },
        { heading: "Prix", lines: ["[TEXTE À VENIR]"] },
        { heading: "Paiement", lines: ["[TEXTE À VENIR]"] },
        { heading: "Durée et renouvellement", lines: ["[TEXTE À VENIR]"] },
        { heading: "Résiliation", lines: ["[TEXTE À VENIR]"] },
        { heading: "Droit de rétractation", lines: ["[TEXTE À VENIR]"] },
        { heading: "Service client", lines: ["darempred@keleierbreiz.fr"] },
        { heading: "Litiges et droit applicable", lines: ["[TEXTE À VENIR]"] },
      ],
    },
  },
  privacy: {
    br: {
      slug: "prevezded",
      title: "Prevezded",
      sections: [
        { heading: "Piou a zo atebeg?", lines: [`Hocine Nedjar — ${CONTACT}`] },
        {
          heading: "An titouriou dastumet",
          lines: [
            "- Ho chomleh postel, evid kevrea (eul liamm a vez kaset deoh dre bostel, hep ger-tremen).",
            "- An anv a zibabit da ziskouez, hag ho soñjou.",
            "- Stad ho koumanant (doare, deiz adneveza).",
            "Biskoaz ne resevom titouriou ho kartenn-vank: Stripe a ra war-dro ar paea.",
          ],
        },
        { heading: "Perag e vezont dastumet?", lines: ["Evid mera ho kont, ho koumanant hag ho soñjou."] },
        {
          heading: "Piou a c'hell o gwelet?",
          lines: [
            "- Supabase (diaz-roadennou ha kevrea)",
            "- Stripe ha Link (paea)",
            "- Resend (kas ar posteliou kevrea, servijerien en Iwerzon)",
            "- Vercel (herberia al lehienn ha stadegou dizanv, hep toupin)",
            "Lod anezo a zo er-maez euz an Unaniez Europa; gwarezet eo an treuzkasou gand diviziou kevratel.",
          ],
        },
        {
          heading: "Pegeit e vezont miret?",
          lines: ["E-pad ma vez ho kont. An titouriou paea a vez miret gand Stripe hervez al lezenn."],
        },
        {
          heading: "Toupinou",
          lines: ["Al lehienn na implij nemet eun toupin teknikel, ret evid chom kevreet. Toupin all ebet."],
        },
        {
          heading: "Ho kwiriou",
          lines: [
            `Gellout a rit gwelet, reiza pe dilemel ho titouriou, pe enebi ouz o implij, o skriva da ${CONTACT}. Gellout a rit ive skriva d'ar CNIL ([www.cnil.fr](https://www.cnil.fr)).`,
          ],
        },
      ],
    },
    fr: {
      slug: "confidentialite",
      title: "Politique de confidentialité",
      sections: [
        { heading: "Responsable du traitement", lines: ["[NOM DU DIRECTEUR DE LA PUBLICATION]", "darempred@keleierbreiz.fr"] },
        { heading: "Données collectées", lines: ["[TEXTE À VENIR]"] },
        { heading: "Finalités", lines: ["[TEXTE À VENIR]"] },
        { heading: "Durée de conservation", lines: ["[TEXTE À VENIR]"] },
        { heading: "Destinataires et sous-traitants", lines: ["[TEXTE À VENIR]"] },
        { heading: "Vos droits", lines: ["[TEXTE À VENIR]"] },
        { heading: "Cookies", lines: ["[TEXTE À VENIR]"] },
        { heading: "Contact", lines: ["darempred@keleierbreiz.fr"] },
      ],
    },
  },
};
