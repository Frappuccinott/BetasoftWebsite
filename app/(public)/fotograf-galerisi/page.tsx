import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import { PhotoGallery } from "@/components/shared/PhotoGallery";

const galeriData = [
  { 
    id: 1, 
    title: "S7-1200 PLC Pano Tasarımı", 
    images: ["pano-1", "pano-2", "pano-3"] 
  },
  { 
    id: 2, 
    title: "Ambalaj Makinesi Otomasyonu", 
    images: ["ambalaj-1", "ambalaj-2"] 
  },
  { 
    id: 3, 
    title: "Robotik Kol Entegrasyonu", 
    images: ["robot-1", "robot-2", "robot-3", "robot-4"] 
  },
  { 
    id: 4, 
    title: "Servo Sürücü Test Panosu", 
    images: ["servo-1", "servo-2"] 
  },
  { 
    id: 5, 
    title: "Gıda Paketleme Hattı", 
    images: ["gida-1", "gida-2", "gida-3"] 
  },
  { 
    id: 6, 
    title: "Termoform Makinesi Panosu", 
    images: ["termo-1", "termo-2"] 
  },
];

export default function PhotoGalleryPage() {
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
        <PhotoGallery items={galeriData} />
      </div>
    </div>
  );
}
