import { useEffect, useState } from "react";
import {
  useClient,
  useValidationStatus,
  type DocumentActionComponent,
  type DocumentActionProps,
  type DocumentBadgeComponent,
  type SanityDocument,
} from "sanity";
import { apiVersion } from "./env";
import { LIVE_TYPE, liveId } from "./live";
import { articleFields, contentHash } from "./contentHash";

type LiveCopy = { sourceHash?: string } | null;

// Watches the private online copy of an article ("pennad.<id>").
// undefined = still loading, null = not online.
function useLiveCopy(articleId: string): LiveCopy | undefined {
  const client = useClient({ apiVersion });
  const [copy, setCopy] = useState<LiveCopy | undefined>(undefined);
  useEffect(() => {
    const id = liveId(articleId);
    client.fetch<LiveCopy>(`*[_id == $id][0]{ sourceHash }`, { id }).then(setCopy);
    // Use the document sent with each change, rather than asking again:
    // a query sent right after a change can still see the old version.
    const subscription = client.listen(`*[_id == $id]`, { id }, { includeResult: true }).subscribe((event) => {
      if (event.type !== "mutation") return;
      const result = event.result as { sourceHash?: string } | undefined;
      setCopy(event.transition === "disappear" || !result ? null : { sourceHash: result.sourceHash });
    });
    return () => subscription.unsubscribe();
  }, [client, articleId]);
  return copy;
}

function isUpToDate(copy: LiveCopy | undefined, source: SanityDocument | null) {
  return Boolean(copy?.sourceHash && source && copy.sourceHash === contentHash(source));
}

// "Embann" (publish): saves a private copy of the article, which the website shows.
export const EmbannAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const client = useClient({ apiVersion });
  const copy = useLiveCopy(props.id);
  const { validation, isValidating } = useValidationStatus(props.id, props.type, false);
  const [busy, setBusy] = useState(false);

  const source = props.draft ?? props.published;
  const hasErrors = validation.some((marker) => marker.level === "error");
  // An old-style public version still exists: Embann stays clickable so
  // one click makes the article private.
  const upToDate = isUpToDate(copy, source) && !props.published;

  return {
    label: busy ? "Oh embann…" : upToDate ? "Embannet ✓" : "Embann",
    tone: "positive",
    disabled: !source || busy || isValidating || hasErrors || upToDate,
    title: hasErrors ? "Fix the errors in red first." : undefined,
    onHandle: async () => {
      if (!source) return;
      setBusy(true);
      const tx = client.transaction().createOrReplace({
        ...articleFields(source),
        _id: liveId(props.id),
        _type: LIVE_TYPE,
        sourceId: props.id,
        draftId: `drafts.${props.id}`,
        sourceHash: contentHash(source),
        liveAt: new Date().toISOString(),
      });
      // An article published the old way is public: keep it as a private
      // draft and remove the public version.
      if (props.published) {
        tx.createIfNotExists({ ...props.published, _id: `drafts.${props.id}` }).delete(props.id);
      }
      try {
        await tx.commit();
      } finally {
        setBusy(false);
        props.onComplete();
      }
    },
  };
};
EmbannAction.action = "publish";

// "Tennañ" (unpublish): removes the private copy, so the article leaves the website.
export const TennanAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const client = useClient({ apiVersion });
  const copy = useLiveCopy(props.id);
  const [confirming, setConfirming] = useState(false);
  if (!copy) return null;
  return {
    label: "Tenna",
    tone: "critical",
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      tone: "critical",
      message: "Tenna ar pennad-mañ eus al lehienn? (Retirer cet article du site ?)",
      onCancel: () => setConfirming(false),
      onConfirm: async () => {
        await client.delete(liveId(props.id));
        setConfirming(false);
        props.onComplete();
      },
    },
  };
};
TennanAction.action = "unpublish";

// The label at the bottom of the article: is it on the website?
// Uses exactly the same check as the Embann button, so they always agree.
export const OnlineBadge: DocumentBadgeComponent = (props) => {
  const copy = useLiveCopy(props.id);
  if (!copy) return null;
  if (isUpToDate(copy, props.draft ?? props.published)) {
    return { label: "Enlinenn", title: "Online / En ligne", color: "success" };
  }
  return {
    label: "Enlinenn – kemmou nevez",
    title: "Online, but your latest changes are not published yet. Click Embann.",
    color: "warning",
  };
};
