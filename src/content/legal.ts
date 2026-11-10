import type { Locale } from "@/i18n/config";

// The legal pages: "Notennou lezennel" / "Mentions légales" / "Legal notice",
// "Prevezded" / "Confidentialité" / "Privacy" and "Divizou gwerza" / "CGV" / "Terms of sale".
// The French text is the reference; the English one is a translation. Each line is a paragraph;
// a line starting with "- " is a list item. Email addresses, https:// links
// and [text](https://…) links become clickable (see LegalPage).

type LegalSection = { heading: string; lines: string[] };
type LegalPageText = { slug: string; title: string; sections: LegalSection[] };
export type LegalKind = "notices" | "privacy" | "terms";

const SITE = "[www.keleierbreiz.fr](https://www.keleierbreiz.fr)";
const CONTACT = "darempred@keleierbreiz.fr";

const brFr: Record<LegalKind, Record<"br" | "fr", LegalPageText>> = {
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
        {
          heading: "Propriété intellectuelle",
          lines: [
            "Les textes publiés sur ce site sont la propriété de leurs auteurs. Toute reproduction, même partielle, est interdite sans autorisation écrite. Les photographies sont publiées avec l'accord de leurs auteurs ou sous licence libre ; leur crédit est indiqué sous chaque image.",
          ],
        },
        { heading: "Signalement", lines: [`Pour signaler un contenu, écrivez à ${CONTACT}.`] },
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
            `An divizou-mañ a ren ar c'houmanant niverel da « Keleier Breiz hag ar Bed », a ro an tu da lenn an holl bennadou embannet war ${SITE}.`,
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
            `Lezenn Frans a dalv evid an divizou-mañ. Ma vez eun tabut, skrivit da gentañ da ${CONTACT}: klasket e vo eun diskoulm a-unvan a-raok netra all.`,
          ],
        },
      ],
    },
    fr: {
      slug: "cgv",
      title: "Conditions générales de vente",
      sections: [
        {
          heading: "Objet",
          lines: [
            `Les présentes conditions régissent l'abonnement numérique à Keleier Breiz hag ar Bed, qui donne accès à tous les articles publiés sur ${SITE}.`,
          ],
        },
        {
          heading: "Vendeur",
          lines: [
            `Le paiement est traité par Stripe ; la vente est réalisée via Link (Stripe), qui collecte la TVA applicable. Le contenu est fourni par l'éditeur du site, Hocine Nedjar (voir les mentions légales). Contact : ${CONTACT}`,
          ],
        },
        {
          heading: "Prix",
          lines: [
            "- Formule mensuelle : 5 € TTC par mois.",
            "- Formule annuelle : 50 € TTC par an.",
            "Les prix incluent la TVA applicable à la presse en ligne.",
          ],
        },
        {
          heading: "Paiement",
          lines: [
            "Par carte bancaire ou par les moyens proposés sur la page de paiement sécurisée de Stripe. Le paiement est prélevé au début de chaque période.",
          ],
        },
        {
          heading: "Durée et renouvellement",
          lines: ["L'abonnement se renouvelle automatiquement à la fin de chaque période (mois ou année), jusqu'à résiliation."],
        },
        {
          heading: "Résiliation",
          lines: [
            "Vous pouvez résilier à tout moment depuis « Ma c'hont » → « Mera ma c'houmanant ». La résiliation prend effet à la fin de la période déjà payée ; vous gardez l'accès jusque-là.",
          ],
        },
        {
          heading: "Droit de rétractation et remboursement",
          lines: [
            `Vous disposez de 14 jours après votre premier paiement pour demander le remboursement de votre abonnement, sans avoir à vous justifier, en écrivant à ${CONTACT}.`,
          ],
        },
        { heading: "Service client", lines: [CONTACT] },
        {
          heading: "Litiges et droit applicable",
          lines: [
            `Les présentes conditions sont soumises au droit français. En cas de litige, écrivez d'abord à ${CONTACT} : une solution amiable sera recherchée avant toute action.`,
          ],
        },
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
            "- PayPal (skoazellou: ma rit eur skoazell, PayPal a ra war-dro ar paea hag a gas deomp hoh anv hag ho chomleh postel)",
            "- Resend (kas ar posteliou kevrea, servijerien en Iwerzon)",
            "- Vercel (herberhia al lehienn ha stadegou dizanv, hep toupin)",
            "Lod anezo a zo er-maez euz an Unaniez Europa; gwarezet eo an treuzkasou gand divizou kevratel.",
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
        { heading: "Responsable du traitement", lines: [`Hocine Nedjar — ${CONTACT}`] },
        {
          heading: "Données collectées",
          lines: [
            "- Votre adresse e-mail, pour vous connecter (lien de connexion envoyé par e-mail, sans mot de passe).",
            "- Le nom que vous choisissez d'afficher, et vos commentaires.",
            "- L'état de votre abonnement (formule, date de renouvellement).",
            "Nous ne recevons jamais vos coordonnées bancaires : le paiement est traité directement par Stripe.",
          ],
        },
        {
          heading: "Pourquoi",
          lines: [
            "Pour gérer votre compte, votre abonnement et vos commentaires. Base légale : l'exécution du contrat (abonnement) et votre consentement (commentaires).",
          ],
        },
        {
          heading: "Prestataires",
          lines: [
            "- Supabase (base de données et connexion)",
            "- Stripe et Link (paiement)",
            "- PayPal (dons : si vous faites un don, PayPal traite le paiement et nous transmet votre nom et votre adresse e-mail)",
            "- Resend (envoi des e-mails de connexion, serveurs en Irlande)",
            "- Vercel (hébergement du site et statistiques de visite anonymes, sans cookie)",
            "Certains prestataires sont situés hors de l'Union européenne ; les transferts sont encadrés par des clauses contractuelles types.",
          ],
        },
        {
          heading: "Durée de conservation",
          lines: ["Tant que votre compte existe. Les données de facturation sont conservées par Stripe selon ses obligations légales."],
        },
        {
          heading: "Cookies",
          lines: [
            "Le site n'utilise qu'un cookie technique, nécessaire pour rester connecté. Aucun cookie publicitaire ni de mesure d'audience.",
          ],
        },
        {
          heading: "Vos droits",
          lines: [
            `Vous pouvez accéder à vos données, les corriger, les supprimer ou vous opposer à leur traitement en écrivant à ${CONTACT}. Vous pouvez aussi saisir la CNIL ([www.cnil.fr](https://www.cnil.fr)).`,
          ],
        },
      ],
    },
  },
};

// English translations of the French pages.
const en: Record<LegalKind, LegalPageText> = {
  notices: {
    slug: "legal-notice",
    title: "Legal notice",
    sections: [
      {
        heading: "Publisher",
        lines: [`The website ${SITE} is published by Hocine Nedjar, a private individual.`, `Contact: ${CONTACT}`],
      },
      { heading: "Publication director", lines: ["Hocine Nedjar"] },
      {
        heading: "Host",
        lines: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States — https://vercel.com"],
      },
      {
        heading: "Intellectual property",
        lines: [
          "The texts published on this website belong to their authors. Any reproduction, even partial, is forbidden without written permission. Photographs are published with their authors' permission or under a free licence; their credit is shown under each picture.",
        ],
      },
      { heading: "Reporting content", lines: [`To report content, write to ${CONTACT}.`] },
      { heading: "Language", lines: ["This page is a translation. In case of difference, the French version prevails."] },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of sale",
    sections: [
      {
        heading: "Purpose",
        lines: [
          `These terms govern the digital subscription to Keleier Breiz hag ar Bed, which gives access to every article published on ${SITE}.`,
        ],
      },
      {
        heading: "Seller",
        lines: [
          `Payment is handled by Stripe; the sale is made through Link (Stripe), which collects the applicable VAT. The content is provided by the website's publisher, Hocine Nedjar (see the legal notice). Contact: ${CONTACT}`,
        ],
      },
      {
        heading: "Prices",
        lines: [
          "- Monthly plan: €5 a month, VAT included.",
          "- Yearly plan: €50 a year, VAT included.",
          "Prices include the VAT that applies to online press.",
        ],
      },
      {
        heading: "Payment",
        lines: [
          "By bank card or by the other means offered on Stripe's secure payment page. Payment is taken at the start of each period.",
        ],
      },
      {
        heading: "Length and renewal",
        lines: ["The subscription renews automatically at the end of each period (month or year) until it is cancelled."],
      },
      {
        heading: "Cancellation",
        lines: [
          "You can cancel at any time from “My account” → “Manage my subscription”. Cancellation takes effect at the end of the period already paid for; you keep access until then.",
        ],
      },
      {
        heading: "Right of withdrawal and refunds",
        lines: [
          `You have 14 days after your first payment to ask for a refund of your subscription, without giving a reason, by writing to ${CONTACT}.`,
        ],
      },
      { heading: "Customer service", lines: [CONTACT] },
      {
        heading: "Disputes and applicable law",
        lines: [
          `These terms are governed by French law. In case of a dispute, please write to ${CONTACT} first: an amicable solution will be sought before any action.`,
          "This page is a translation. In case of difference, the French version prevails.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy policy",
    sections: [
      { heading: "Data controller", lines: [`Hocine Nedjar — ${CONTACT}`] },
      {
        heading: "Data collected",
        lines: [
          "- Your email address, so you can sign in (a sign-in link is sent by email, with no password).",
          "- The name you choose to display, and your comments.",
          "- The state of your subscription (plan, renewal date).",
          "We never receive your bank details: payment is handled directly by Stripe.",
        ],
      },
      {
        heading: "Why",
        lines: [
          "To manage your account, your subscription and your comments. Legal basis: performance of the contract (subscription) and your consent (comments).",
        ],
      },
      {
        heading: "Service providers",
        lines: [
          "- Supabase (database and sign-in)",
          "- Stripe and Link (payment)",
          "- PayPal (donations: if you make a donation, PayPal handles the payment and sends us your name and email address)",
          "- Resend (sending sign-in emails, servers in Ireland)",
          "- Vercel (website hosting and anonymous visit statistics, without cookies)",
          "Some providers are located outside the European Union; these transfers are covered by standard contractual clauses.",
        ],
      },
      {
        heading: "How long we keep your data",
        lines: ["For as long as your account exists. Billing data is kept by Stripe according to its legal obligations."],
      },
      {
        heading: "Cookies",
        lines: [
          "The website only uses one technical cookie, needed to keep you signed in. No advertising or audience-measurement cookies.",
        ],
      },
      {
        heading: "Your rights",
        lines: [
          `You can access, correct or delete your data, or object to its use, by writing to ${CONTACT}. You can also contact the CNIL, the French data protection authority ([www.cnil.fr](https://www.cnil.fr)).`,
          "This page is a translation. In case of difference, the French version prevails.",
        ],
      },
    ],
  },
};

export const legalPages: Record<LegalKind, Record<Locale, LegalPageText>> = {
  notices: { ...brFr.notices, en: en.notices },
  terms: { ...brFr.terms, en: en.terms },
  privacy: { ...brFr.privacy, en: en.privacy },
};
