// How Breiz keeps paid articles private on Sanity's Free plan.
//
// On the Free plan, every normally *published* document can be read by
// anyone. But Sanity keeps documents whose ID contains a dot private:
// only logged-in editors and our website (with its secret token) can
// read them. So instead of Sanity's Publish button, the editor has an
// "Embann" button that saves a copy of the article as "pennad.<id>",
// with the type below. The website reads only these private copies.
export const LIVE_TYPE = "liveArticle";

export function liveId(articleId: string): string {
  return `pennad.${articleId.replace(/^drafts\./, "")}`;
}
