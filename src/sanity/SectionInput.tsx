import { useEffect, useRef } from "react";
import { getPublishedId, useDocumentOperation, useFormValue, type StringInputProps } from "sanity";
import { ANNOUNCEMENTS_SECTION } from "@/lib/sections";

// The usual section choice, plus one rule: switching an article to
// "Embannit ganeomp" turns "Pennad digoust" on. It only happens at the moment
// of the switch, so the editor can still turn it off afterwards.
export function SectionInput(props: StringInputProps) {
  const id = getPublishedId(String(useFormValue(["_id"]) ?? ""));
  const free = useFormValue(["free"]);
  const { patch } = useDocumentOperation(id, "article");
  const previous = useRef(props.value);

  useEffect(() => {
    const switchedToAnnouncements = props.value === ANNOUNCEMENTS_SECTION && previous.current !== ANNOUNCEMENTS_SECTION;
    previous.current = props.value;
    if (switchedToAnnouncements && free !== true) patch.execute([{ set: { free: true } }]);
  }, [props.value, free, patch]);

  return props.renderDefault(props);
}
