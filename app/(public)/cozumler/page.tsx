import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {}

  const title = "Sektörel Çözümlerimiz & Makinelerimiz";
  const description = "Farklı endüstrilerin zorlu ihtiyaçlarına yönelik, yüksek verimli ve yenilikçi makine üretim çözümleri sunuyoruz.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${settings?.metaTitle || settings?.siteName || "Betasoft"}`,
      description,
    },
  };
}

export default async function SolutionsPage() {
  const categories = await fetchQuery(api.categories.getCategories);

  // Makinelerin sayılarını bulmak için makineleri de çekebiliriz
  // Şimdilik sadece kategorileri listeliyoruz.
  const machines = await fetchQuery(api.machines.getMachines);

  // Kategori id'sine göre makine sayılarını hesaplayalım
  const categoryCounts = machines.reduce((acc, machine) => {
    acc[machine.categoryId] = (acc[machine.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
            Sektörel Çözümlerimiz
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Farklı endüstrilerin zorlu ihtiyaçlarına yönelik, yüksek verimli ve yenilikçi makine üretim çözümleri sunuyoruz.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category._id} className="flex flex-col items-center group">
              {/* Image Box */}
              <div className="w-full h-64 bg-white border border-zinc-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                {category.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:24px_24px]" />
                )}
              </div>
              
              {/* Info */}
              <h3 className="text-xl font-bold text-zinc-900 mb-2 text-center h-14 flex items-center justify-center">
                {category.name}
              </h3>
              <p className="text-sm text-zinc-500 mb-6 text-center">
                {categoryCounts[category._id] || 0} Farklı Makine Çözümü
              </p>
              
              {/* Button */}
              <Link
                href={`/cozumler/${category.slug}`}
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors inline-block"
              >
                Makineleri İncele
              </Link>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-500">
              Henüz bir kategori eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
