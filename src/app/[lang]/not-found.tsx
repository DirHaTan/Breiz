import Link from "next/link";
import { ErmineMark } from "@/components/Logo";

// Shown when a page doesn't exist. We don't know the language here,
// so the message is in both.
export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <ErmineMark className="mx-auto h-16 w-auto" />
      <h1 className="mt-6 font-serif text-3xl font-black">N&apos;eo ket bet kavet ar bajenn</h1>
      <p className="mt-1 font-serif text-xl italic text-muted">Page introuvable</p>
      <p className="mt-8 flex justify-center gap-6">
        <Link href="/" className="underline">Distrei d&apos;an degemer</Link>
        <Link href="/fr" className="underline">Retour à l&apos;accueil</Link>
      </p>
    </main>
  );
}
