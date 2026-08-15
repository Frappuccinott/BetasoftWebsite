import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {}

  const title = "Fotoğraf Galerisi";
  const description = "Daha önce tamamladığımız projelere, makinelerimize ve otomasyon çözümlerimize ait fotoğrafları galerimizden inceleyebilirsiniz.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${settings?.metaTitle || settings?.siteName || "Betasoft"}`,
      description,
    },
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
