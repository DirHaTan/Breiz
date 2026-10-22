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

type LiveCopy = { sourceRev?: string } | null;

// Watches the private online copy of an article ("pennad.<id>").
// undefined = still loading, null = not online.
function useLiveCopy(articleId: string): LiveCopy | undefined {
  const client = useClient({ apiVersion });
  const [copy, setCopy] = useState<LiveCopy | undefined>(undefined);
  useEffect(() => {
    const id = liveId(articleId);
    const load = () => client.fetch<LiveCopy>(`*[_id == $id][0]{ sourceRev }`, { id }).then(setCopy);
    load();
    const subscription = client.listen(`*[_id == $id]`, { id }, { includeResult: false }).subscribe(() => load());
    return () => subscription.unsubscribe();
  }, [client, articleId]);
  return copy;
}

// The article's own fields, without Sanity's bookkeeping (ID, revision, dates).
function articleFields(doc: SanityDocument): Record<string, unknown> {
  const fields: Record<string, unknown> = { ...doc };
  for (const key of ["_id", "_rev", "_createdAt", "_updatedAt", "_system"]) delete fields[key];
  return fields;
}

function isUpToDate(copy: LiveCopy | undefined, source: SanityDocument | null) {
  return Boolean(copy && source && copy.sourceRev === source._rev);
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
    label: busy ? "Oc'h embann…" : upToDate ? "Embannet ✓" : "Embann",
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
        sourceRev: source._rev,
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
    label: "Tennañ",
    tone: "critical",
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      tone: "critical",
      message: "Tennañ ar pennad-mañ eus al lec'hienn? (Retirer cet article du site ?)",
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

// The label at the top of the article: is it on the website?
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
