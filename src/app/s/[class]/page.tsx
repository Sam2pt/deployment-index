import type { Metadata } from "next";
import DeploymentIndex from "@/components/DeploymentIndex";
import { ARCHETYPES, ARCHETYPE_ORDER } from "@/lib/archetypes";
import type { ArchetypeKey } from "@/lib/types";

// Shareable per-class entry point. Humans who open it just play the game;
// social scrapers (LinkedIn, X, iMessage) read the per-class Open Graph card
// and metadata so the shared link shows the right class, not a blank box.

export function generateStaticParams() {
  return ARCHETYPE_ORDER.map((key) => ({ class: key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ class: string }>;
}): Promise<Metadata> {
  const { class: raw } = await params;
  const key = raw as ArchetypeKey;
  const a = key in ARCHETYPES ? ARCHETYPES[key] : null;

  if (!a) {
    return { alternates: { canonical: "/" } };
  }

  const title = `I'm ${a.name} · The Deployment Index`;
  const description = `${a.tagline} Which AI marketing leader are you? Find out in 60 seconds.`;

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: `https://deploymentindex.2pt.ai/s/${key}`,
      siteName: "The Deployment Index",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function SharePage() {
  return <DeploymentIndex />;
}
