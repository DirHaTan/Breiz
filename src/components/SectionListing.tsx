import Link from "next/link";
import { announcePath, localePath, otherLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ANNOUNCEMENTS_SECTION, type Section } from "@/lib/sections";
import { DEPARTMENT_SECTION, departmentPath, departments, type Department } from "@/lib/departments";
import { getArticlesBySection } from "@/lib/articles";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";

type Props = { lang: Locale; section: Section; department?: Department };

// A section page (or, inside Breiz, a department page): its name, then its articles.
export async function SectionListing({ lang, section, department }: Props) {
  const dict = getDictionary(lang);
  const other = otherLocale(lang);
  const all = await getArticlesBySection(lang, section.id);
  const articles = department ? all.filter((a) => a.department === department.id) : all;

  // In Breiz: "Breiz a-bez" plus only the departments that have an online article.
  const usedDepartments =
    section.id === DEPARTMENT_SECTION ? departments.filter((d) => all.some((a) => a.department === d.id)) : [];

  return (
    <>
      <Header
        lang={lang}
        dict={dict}
        activeSection={section.id}
        alternateHref={department ? departmentPath(other, department) : localePath(other, `/${section[other].slug}`)}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-4xl font-black">
          {section[lang].name}
          {department && <span className="font-normal"> · {department[lang].name}</span>}
        </h1>
        {section.id === ANNOUNCEMENTS_SECTION && (
          <p className="mt-4 border-2 border-ink p-4">
            <Link href={announcePath(lang)} className="font-semibold underline">
              {dict.announce.link} →
            </Link>
          </p>
        )}
        {section.id === DEPARTMENT_SECTION && (
          <nav aria-label={dict.section.departments} className="mt-4 border-y border-ink">
            <ul className="flex gap-x-6 overflow-x-auto py-2 text-sm font-semibold whitespace-nowrap">
              <li>
                <Link
                  href={localePath(lang, `/${section[lang].slug}`)}
                  aria-current={department ? undefined : "page"}
                  className="underline-offset-8 hover:underline aria-[current=page]:underline"
                >
                  {dict.section.allBreiz}
                </Link>
              </li>
              {usedDepartments.map((d) => (
                <li key={d.id}>
                  <Link
                    href={departmentPath(lang, d)}
                    aria-current={department?.id === d.id ? "page" : undefined}
                    className="underline-offset-8 hover:underline aria-[current=page]:underline"
                  >
                    {d[lang].name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {articles.length === 0 ? (
          <p className="mt-6 text-muted">{dict.section.empty}</p>
        ) : (
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
