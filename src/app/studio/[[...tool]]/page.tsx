import { NextStudio } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "80px auto", padding: 16 }}>
        <h1>The editor is not connected yet</h1>
        <p>
          Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in Vercel (Project → Settings → Environment Variables), then
          redeploy. The README explains each step.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
