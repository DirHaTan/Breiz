import type { Dictionary } from "@/i18n/dictionaries";

// Placeholder: real comments arrive in Step 3, once readers can sign in.
export function Comments({ dict }: { dict: Dictionary }) {
  return (
    <section className="mt-12 border-t-4 border-double border-ink pt-6">
      <h2 className="font-serif text-2xl font-bold">{dict.comments.title}</h2>
      <p className="mt-3 text-muted">{dict.comments.signInToComment}</p>
      <p className="mt-1 text-sm text-muted">{dict.comments.comingSoon}</p>
    </section>
  );
}
