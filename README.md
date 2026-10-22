# Breiz

A news and publishing website in Breton (skolveurieg orthography) and French.

- Breton is the default language: `/`, `/keleier`, `/breiz`, …
- French lives under `/fr`: `/fr/actualites`, `/fr/bretagne`, …
- Sections: Keleier, Breiz, Frans, Bed, Lennegez, Troidigez, Kevredigez.

## Progress

1. ✅ **Skeleton:** pages, sections, two languages, logo, "no zh" guard, sample articles.
2. ✅ **Sanity:** write real articles in an online editor at `/studio`.
3. ⬜ **Accounts and comments** (Supabase).
4. ⬜ **Subscriptions** at €5/week (Stripe).
5. ⬜ **Final polish:** legal pages, social-media previews, publishing guide.

## Where things are

| What | File |
|---|---|
| Interface text in Breton (menus, buttons…) | `src/i18n/dictionaries/br.json` |
| Interface text in French | `src/i18n/dictionaries/fr.json` |
| Section names and addresses | `src/lib/sections.ts` |
| Sample articles (shown until Sanity is connected) | `src/content/sample-articles.json` |
| Article form in the editor | `src/sanity/schemaTypes/article.ts` |
| Logo | `src/components/Logo.tsx`, `src/app/icon.svg` |
| Colours and fonts | `src/app/globals.css` |
| Pages | `src/app/[lang]/…` |

## The "no zh" guard

Breiz never uses the zh spelling. In the editor, an article whose Breton
text contains a "zh" word can't be published: the field turns red and says
which word is wrong. Before each build,
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

## Connecting Sanity (the article editor)

Do these steps once. Until they're done, the site shows the sample articles.
Once Sanity is connected, it shows only the articles you write there.

**1. Create the Sanity project**
1. Go to [sanity.io](https://www.sanity.io) and sign up (with Google, GitHub or email).
2. Open [sanity.io/manage](https://www.sanity.io/manage) and create a new project called **Breiz**, with a dataset called **production**.
3. On the project page, copy the **Project ID** (a short code like `a1b2c3d4`).

**2. Make the articles private**

Articles are for subscribers, so nobody should be able to read them straight from Sanity.
- In the project, open **Datasets**, find **production**, and set its visibility to **Private**.

**3. Let the website talk to Sanity**
- **API → CORS origins → Add CORS origin:** enter `https://breiz.vercel.app` and tick **Allow credentials**. Save.
- **API → Tokens → Add API token:** name it `Breiz website` and choose the **Viewer** permission. Copy the token straight away; it's only shown once.

**4. Give the keys to Vercel**

In Vercel, open the **breiz** project, then **Settings → Environment Variables**, and add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | the token from step 3 |
| `NEXT_PUBLIC_SITE_URL` | `https://breiz.vercel.app` |

Then go to **Deployments**, click **⋯** next to the latest one, and choose **Redeploy**.

**5. Write your first article**
1. Open https://breiz.vercel.app/studio and log in with your Sanity account.
2. Create an **Author** (your name).
3. Create an **Article**: choose the section, fill in the **Brezoneg** part (title, click **Generate** for the address, summary, text) and, if you have it, the **Français** part.
4. Click **Publish**. The article appears on the site within a minute or two.
