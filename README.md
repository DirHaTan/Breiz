# Breiz

A news and publishing website in Breton (skolveurieg orthography) and French.

- Breton is the default language: `/`, `/keleier`, `/breiz`, …
- French lives under `/fr`: `/fr/actualites`, `/fr/bretagne`, …
- Sections: Keleier, Breiz, Frans, Bed, Lennegez, Troidigez, Kevredigez.

## Progress

1. ✅ **Skeleton:** pages, sections, two languages, logo, "no zh" guard, sample articles.
2. ⬜ **Sanity:** write real articles in an online editor.
3. ⬜ **Accounts and comments** (Supabase).
4. ⬜ **Subscriptions** at €5/week (Stripe).
5. ⬜ **Final polish:** legal pages, social-media previews, publishing guide.

## Where things are

| What | File |
|---|---|
| Interface text in Breton (menus, buttons…) | `src/i18n/dictionaries/br.json` |
| Interface text in French | `src/i18n/dictionaries/fr.json` |
| Section names and addresses | `src/lib/sections.ts` |
| Sample articles (replaced by Sanity in Step 2) | `src/content/sample-articles.json` |
| Logo | `src/components/Logo.tsx`, `src/app/icon.svg` |
| Colours and fonts | `src/app/globals.css` |
| Pages | `src/app/[lang]/…` |

## The "no zh" guard

Breiz never uses the zh spelling. Before each build,
`scripts/check-breton.mjs` checks the site's text. If it finds a word
containing "zh", the build stops and shows the file and line. You can
run it yourself:

```bash
npm run check:breton
```

## Running it on your computer (optional)

1. Install [Node.js](https://nodejs.org) (the "LTS" version).
2. In a terminal, inside this folder:
   ```bash
   npm install      # downloads the tools (once)
   npm run dev      # starts the site
   ```
3. Open http://localhost:3000 in your browser.

## Putting it online with Vercel

1. Go to [vercel.com](https://vercel.com) and choose **Sign up → Continue with GitHub**.
2. Click **Add New… → Project**, then **Import** the `Breiz` repository.
3. Leave all the settings as they are and click **Deploy**.
4. After about a minute you get an address like `breiz-xxxx.vercel.app`.

From then on, every change pushed to GitHub updates the site automatically.
