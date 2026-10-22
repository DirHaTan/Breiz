# Breiz

A news and publishing website in Breton (skolveurieg orthography) and French.

- Breton is the default language: `/`, `/keleier`, `/breiz`, …
- French lives under `/fr`: `/fr/actualites`, `/fr/bretagne`, …
- Sections: Keleier, Breiz, Frans, Bed, Lennegez, Troidigez, Kevredigez.

## Progress

1. ✅ **Skeleton:** pages, sections, two languages, logo, "no zh" guard, sample articles.
2. ✅ **Sanity:** write real articles in an online editor at `/studio`.
3. ✅ **Accounts and comments** (Supabase): sign in by email link, comment, report, moderate.
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
| Database tables and rules (comments, profiles) | `supabase/schema.sql` |
| Sign-in email (Breton and French) | `supabase/email-template.html` |

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

## Connecting Supabase (reader accounts and comments)

Readers sign in with their email address: they type it, receive an email
with a button, click it, and they're signed in. No password to remember.
Until these steps are done, the site works normally but sign-in and
comments stay switched off.

**1. Create the Supabase project**
1. Go to [supabase.com](https://supabase.com) and sign up (the GitHub button is easiest).
2. Click **New project**. Name: `Breiz`. Choose a strong **database password** and keep it somewhere safe. Region: **West EU (Paris)**. Plan: **Free**.
3. Wait a minute or two while the project is created.

**2. Create the tables**
1. In the left menu, open **SQL Editor**, then click **New query**.
2. Open `supabase/schema.sql` from this repository, copy all of it, and paste it into the editor.
3. Click **Run**. You should see "Success. No rows returned".

**3. Tell Supabase where the site is**

Open **Authentication → URL Configuration**:
- **Site URL:** `https://breiz.vercel.app`
- **Redirect URLs → Add URL:** `https://breiz.vercel.app/**`

**4. Put the sign-in email in Breton and French**

Open **Authentication → Emails** (it may be called **Email Templates**). For both **Magic Link** and **Confirm signup**:
- **Subject:** `Kevreañ da Breiz · Connexion à Breiz`
- **Body:** paste everything from `supabase/email-template.html`, then **Save**.

**5. Give the keys to Vercel**

In Supabase, open **Project Settings → API Keys** (or click **Connect** at the top) and copy the **Project URL** and the **Publishable key** (it starts with `sb_publishable_`). Then in Vercel, under **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | the Project URL, like `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the Publishable key |

These two values are safe to show in the browser. The database rules in
`supabase/schema.sql` decide what each reader may do. Never put the
**secret** key (`sb_secret_…`) anywhere in this project.

**6. Try it**
1. Open https://breiz.vercel.app/kont, type your email, and click **Kas al liamm**.
2. Click the button in the email. You're signed in and back on the site.
3. Choose your name, then open an article and write a comment.

**7. Make yourself a moderator**

In **SQL Editor → New query**, run this (with your own email address):

```sql
insert into public.moderators (user_id)
select id from auth.users where email = 'your-email@example.com';
```

Moderators see **Kuzat** (hide) and **Dilemel** (delete) under every comment,
and a **Merañ ar soñjou** link on their account page, which lists reported
and hidden comments.

**Good to know**
- Supabase's built-in email service is only for testing: it sends very few emails per hour, and may only deliver to members of your Supabase team. Before opening the site to readers, connect a real email service (Step 5 covers this).
- On the free plan, a Supabase project with no activity for a week is paused. Open the Supabase dashboard to wake it up.
