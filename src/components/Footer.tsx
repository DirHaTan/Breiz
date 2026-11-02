import Link from "next/link";
import { ErmineMark } from "@/components/Logo";
import { announcePath, donatePath, legalPath, localePath, type Locale } from "@/i18n/config";
import { sections } from "@/lib/sections";
import { legalPages } from "@/content/legal";
import type { Dictionary } from "@/i18n/dictionaries";

// The year is worked out once and cached, so pages can be built ahead of time.
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = await currentYear();
  return (
    <footer className="mt-16 bg-ink text-paper">
      <nav aria-label={dict.footer.sections} className="mx-auto max-w-[90rem] border-b border-paper/20 px-4 pt-8 pb-6 lg:px-6 xl:px-8">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wider">
          {sections.map((s) => (
            <li key={s.id}>
              <Link href={localePath(lang, `/${s[lang].slug}`)} className="hover:underline">
                {s[lang].name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-4 lg:px-6 xl:px-8 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <ErmineMark className="h-5 w-auto" />
          {dict.footer.about}
        </p>
        <ul className="flex flex-col gap-1 sm:items-center">
          <li>
            <Link href={announcePath(lang)} className="font-semibold underline underline-offset-4 hover:opacity-80">
              {dict.announce.link}
            </Link>
          </li>
          <li>
            <Link href={donatePath(lang)} className="font-semibold underline underline-offset-4 hover:opacity-80">
              {dict.donate.link}
            </Link>
          </li>
          <li>
            <Link href={legalPath("notices", lang)} className="underline underline-offset-4 hover:opacity-80">
              {legalPages.notices[lang].title}
            </Link>
          </li>
          <li>
            <Link href={legalPath("privacy", lang)} className="underline underline-offset-4 hover:opacity-80">
              {legalPages.privacy[lang].title}
            </Link>
          </li>
          <li>
            <Link href={legalPath("terms", lang)} className="underline underline-offset-4 hover:opacity-80">
              {legalPages.terms[lang].title}
            </Link>
          </li>
        </ul>
        <p className="opacity-70">
          © {year} {dict.site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
