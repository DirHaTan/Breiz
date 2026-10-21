import "server-only";
import type { Locale } from "./config";
import br from "./dictionaries/br.json";
import fr from "./dictionaries/fr.json";

// All the interface text (menus, buttons...). To change a word, edit
// src/i18n/dictionaries/br.json or fr.json.
export type Dictionary = typeof br;

const dictionaries: Record<Locale, Dictionary> = { br, fr };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
