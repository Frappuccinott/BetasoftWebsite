import Link from "next/link";
import { ChevronRight, CheckCircle2, Cog } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { LightboxGallery } from "@/components/shared/LightboxGallery";

import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; machine: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const machine = await fetchQuery(api.machines.getMachineBySlug, { slug: resolvedParams.machine });
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {}

  if (!machine) return { title: "Makine Bulunamadı" };

  const title = machine.metaTitle || `${machine.name} | ${machine.categoryName}`;
  const description = machine.metaDescription || machine.description.substring(0, 150).replace(/\n/g, ' ') + '...';
  const siteName = settings?.metaTitle || settings?.siteName || "Betasoft";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title,
    description,
    keywords: machine.keywords ? machine.keywords.split(',').map((k: string) => k.trim()) : undefined,
    alternates: {
      canonical: `${siteUrl}/cozumler/${machine.categorySlug}/${machine.slug}`,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "article",
      images: machine.imageUrls?.[0] ? [{ url: machine.imageUrls[0] }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: machine.imageUrls?.[0] ? [machine.imageUrls[0]] : [],
    },
  };
}

export default async function MachineShowcasePage({
  params,
}: {
  params: Promise<{ category: string; machine: string }>;
}) {
  const resolvedParams = await params;
  
  const machine = await fetchQuery(api.machines.getMachineBySlug, { slug: resolvedParams.machine });
  
  if (!machine || machine.categorySlug !== resolvedParams.category) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": machine.name,
    "image": machine.imageUrls || [],
    "description": machine.metaDescription || machine.description,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/cozumler/${machine.categorySlug}/${machine.slug}`,
    "brand": {
      "@type": "Brand",
      "name": "Betasoft"
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero / Header Section */}
      <div className="bg-zinc-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-8 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cozumler" className="hover:text-white transition-colors">Sektörel Çözümler</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/cozumler/${machine.categorySlug}`} className="hover:text-white transition-colors">
              {machine.categoryName}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{machine.name}</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-zinc-300 text-sm font-semibold uppercase tracking-widest rounded-md mb-6">
              <Cog className="w-4 h-4" />
              Özel Makine Üretimi
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-primary">{machine.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed whitespace-pre-line break-words">
              {machine.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 md:p-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Features */}
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Makine Özellikleri ve Avantajları</h3>
              <ul className="space-y-4">
                {machine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-700 font-medium leading-relaxed break-words flex-1">{feature}</span>
                  </li>
                ))}
                {machine.features.length === 0 && (
                  <p className="text-zinc-500">Bu makine için henüz özellik eklenmemiş.</p>
                )}
              </ul>
            </div>

            {/* Right Column: Visual Showcase (Gallery) */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Makine Görselleri</h3>
              <LightboxGallery images={machine.imageUrls} machineName={machine.name} />
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
