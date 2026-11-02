import { useEffect, useRef } from "react";
import { getPublishedId, useDocumentOperation, useFormValue, type StringInputProps } from "sanity";
import { ANNOUNCEMENTS_SECTION } from "@/lib/sections";
import { SECTION_AUTHORS } from "./sectionAuthors";

// The usual section choice, plus two rules that only apply at the moment the
// section is changed, so the editor can still undo them by hand:
// - switching to "Embannit ganeomp" turns "Pennad digoust" on;
// - if the article has no author yet, the section's pen name is filled in
//   (Kelenner for Deskadurez, Barz Koz for Istor…, see sectionAuthors.ts).
export function SectionInput(props: StringInputProps) {
  const id = getPublishedId(String(useFormValue(["_id"]) ?? ""));
  const free = useFormValue(["free"]);
  const author = useFormValue(["author"]) as { _ref?: string } | undefined;
  const { patch } = useDocumentOperation(id, "article");
  const previous = useRef(props.value);

  useEffect(() => {
    const changed = props.value !== previous.current;
    previous.current = props.value;
    if (!changed || !props.value) return;
    const set: Record<string, unknown> = {};
    if (props.value === ANNOUNCEMENTS_SECTION && free !== true) set.free = true;
    const authorId = SECTION_AUTHORS[props.value];
    if (authorId && !author?._ref) set.author = { _type: "reference", _ref: authorId };
    if (Object.keys(set).length > 0) patch.execute([{ set }]);
  }, [props.value, free, author, patch]);

  return props.renderDefault(props);
}
