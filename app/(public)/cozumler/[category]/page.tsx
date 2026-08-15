import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";

import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await fetchQuery(api.categories.getCategoryBySlug, { slug: resolvedParams.category });
  
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {}

  if (!category) return { title: "Kategori Bulunamadı" };

  const title = category.metaTitle || `${category.name} Makineleri`;
  const description = category.metaDescription || `Üretim süreçlerinizi hızlandıran, verimliliği artıran ve tamamen ihtiyaçlarınıza yönelik olarak tasarlanan ${category.name.toLowerCase()} çözümlerimiz.`;
  const siteName = settings?.metaTitle || settings?.siteName || "Betasoft";

  return {
    title,
    description,
    keywords: category.keywords ? category.keywords.split(',').map((k: string) => k.trim()) : undefined,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      images: category.imageUrl ? [{ url: category.imageUrl }] : [],
    },
  };
}

export default async function SolutionCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  
  // Kategori bilgilerini getir
  const category = await fetchQuery(api.categories.getCategoryBySlug, { slug: resolvedParams.category });
  
  if (!category) {
    notFound();
  }

  // Kategoriye ait makineleri getir
  const machines = await fetchQuery(api.machines.getMachinesByCategory, { categoryId: category._id });

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-center text-sm text-zinc-500 mb-6 gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/cozumler" className="hover:text-primary transition-colors">Sektörel Çözümler</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-zinc-900 font-medium">{category.name}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 text-center">
              {category.name}
            </h1>
            <div className="w-full max-w-4xl border-t border-zinc-200 pt-6">
              <p className="text-zinc-600 text-center text-lg">
                Üretim süreçlerinizi hızlandıran, verimliliği artıran ve tamamen ihtiyaçlarınıza yönelik olarak tasarlanan {category.name.toLowerCase()} çözümlerimiz.
              </p>
            </div>
            <div className="w-12 h-1 bg-zinc-200 mt-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* Machines Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {machines.map((machine) => {
            return (
              <div key={machine._id} className="flex flex-col items-center group">
                <div className="w-full h-48 bg-white border border-zinc-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                  {machine.imageUrls && machine.imageUrls.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={machine.imageUrls[0]} alt={machine.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:24px_24px]" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-zinc-700 mb-6 text-center tracking-wider h-10 flex items-center">
                  {machine.name}
                </h3>

                <Link
                  href={`/cozumler/${category.slug}/${machine.slug}`}
                  className="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors inline-block w-3/4 text-center shadow-sm"
                >
                  Detayları İncele
                </Link>
              </div>
            );
          })}
          {machines.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-500">
              Bu kategoriye henüz bir makine eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
