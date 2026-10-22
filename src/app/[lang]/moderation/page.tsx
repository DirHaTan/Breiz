import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, moderationPath, otherLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";
import { getModerationQueue, type Comment } from "@/lib/comments";
import { articlePath, getAllArticles } from "@/lib/articles";
import { Header } from "@/components/Header";
import { CommentItem } from "@/components/comments/CommentItem";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Moderation", robots: { index: false } };

// For moderators: reported comments and hidden comments, with buttons to act on them.
export default async function ModerationPage({ params }: PageProps<"/[lang]/moderation">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={moderationPath(otherLocale(lang))} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-serif text-4xl font-black">{dict.moderation.title}</h1>
        <Suspense fallback={<p className="mt-6 text-muted">…</p>}>
          <Queue lang={lang} dict={dict} />
        </Suspense>
      </main>
    </>
  );
}

async function Queue({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.moderation;
  const user = await getCurrentUser();
  if (!user?.isModerator) return <p className="mt-6">{t.forbidden}</p>;

  const [{ reported, hidden }, articles] = await Promise.all([getModerationQueue(), getAllArticles()]);
  if (reported.length === 0 && hidden.length === 0) return <p className="mt-6 text-muted">{t.nothing}</p>;

  // Link each comment to its article, in the language it was written for if possible.
  const linkFor = (comment: Comment) => {
    const article = articles.find((a) => a.id === comment.articleId);
    const text = article?.[lang] ?? article?.br;
    if (!article || !text) return null;
    const articleLang = article[lang] ? lang : "br";
    return { title: text.title, href: articlePath({ ...article, ...text, lang: articleLang }) };
  };

  return (
    <>
      <Group title={t.reported} lang={lang} dict={dict} user={user} linkFor={linkFor}
        items={reported.map(({ comment, reports }) => ({ comment, note: `${reports} ${t.reports}` }))} />
      <Group title={t.hidden} lang={lang} dict={dict} user={user} linkFor={linkFor}
        items={hidden.map((comment) => ({ comment }))} />
    </>
  );
}

type GroupProps = {
  title: string;
  items: { comment: Comment; note?: string }[];
  lang: Locale;
  dict: Dictionary;
  user: CurrentUser;
  linkFor: (c: Comment) => { title: string; href: string } | null;
};

function Group({ title, items, lang, dict, user, linkFor }: GroupProps) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-bold">{title}</h2>
      <div className="mt-2">
        {items.map(({ comment, note }) => {
          const link = linkFor(comment);
          return (
            <div key={comment.id}>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest">
                {link ? <Link href={link.href} className="hover:underline">{link.title}</Link> : comment.articleId}
                {note && <span className="ml-2 font-normal normal-case tracking-normal text-red-700">{note}</span>}
              </p>
              <ul>
                <CommentItem comment={comment} user={user} lang={lang} dict={dict} />
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
