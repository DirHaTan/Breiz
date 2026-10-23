import { ErmineMark } from "@/components/Logo";
import type { Dictionary } from "@/i18n/dictionaries";

// The year is worked out once and cached, so pages can be built ahead of time.
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ dict }: { dict: Dictionary }) {
  const year = await currentYear();
  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <ErmineMark className="h-5 w-auto" />
          {dict.footer.about}
        </p>
        <p className="opacity-70">
          © {year} {dict.site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
