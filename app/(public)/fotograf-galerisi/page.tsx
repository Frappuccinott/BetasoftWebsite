"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PhotoGallery } from "@/components/shared/PhotoGallery";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function PhotoGalleryPage() {
  const galleries = useQuery(api.galleries.getGalleries);

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
              <span className="text-zinc-900 font-medium">Fotoğraf Galerisi</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 text-center">
              Fotoğraf Galerisi
            </h1>
            <div className="w-full max-w-4xl border-t border-zinc-200 pt-6">
              <p className="text-zinc-600 text-center text-lg">
                Daha önce tamamladığımız projelere, makinelerimize ve otomasyon çözümlerimize ait fotoğrafları galerimizden inceleyebilirsiniz.
              </p>
            </div>
            <div className="w-12 h-1 bg-zinc-200 mt-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4">
        {galleries === undefined ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Henüz Galeri Bulunmuyor</h2>
            <p className="text-zinc-500">Çok yakında yeni projelerimizle burada olacağız.</p>
          </div>
        ) : (
          <PhotoGallery items={galleries.map(g => ({
            id: g._id as unknown as number, // The component expects a number, but strings work for keys. We will cast it.
            title: g.title,
            coverImage: g.coverImage,
            images: g.images,
          }))} />
        )}
      </div>
    </div>
  );
}
