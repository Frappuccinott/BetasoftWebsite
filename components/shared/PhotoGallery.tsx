"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface GalleryItem {
  id: number;
  title: string;
  coverImage?: string;
  images?: string[];
}

export function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  const selectedProject = selectedProjectIndex !== null ? items[selectedProjectIndex] : null;
  // Fallback to coverImage if images array doesn't exist, or just use placeholders if none
  const currentPhotos = selectedProject?.images?.length 
    ? selectedProject.images 
    : (selectedProject?.coverImage ? [selectedProject.coverImage] : []);

  const hasMultiplePhotos = currentPhotos.length > 1 || (!currentPhotos.length && selectedProject?.images !== undefined && selectedProject.images.length > 1);
  // If we don't have actual URLs (e.g. testing phase with placeholder strings), we can just mock the count 
  // based on the length of `images` array passed in the fake data.
  const photoCount = selectedProject?.images?.length || 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject !== null) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photoCount);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject !== null) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photoCount) % photoCount);
    }
  };

  const openProject = (index: number) => {
    setSelectedProjectIndex(index);
    setCurrentPhotoIndex(0);
  };

  const closeProject = () => {
    setSelectedProjectIndex(null);
    setCurrentPhotoIndex(0);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="bg-zinc-100 rounded-xl overflow-hidden group relative aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            onClick={() => openProject(index)}
          >
            {item.coverImage ? (
              <Image 
                src={item.coverImage} 
                alt={item.title} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:14px_24px] opacity-50" />
                <span className="text-zinc-400 font-medium z-10 text-sm px-4 text-center">
                  [Görsel: {item.title}]
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col justify-end p-6">
              <span className="text-primary font-semibold text-xs tracking-widest uppercase mb-1">
                {item.images?.length ? `${item.images.length} Fotoğraf` : 'Tamamlanan Proje'}
              </span>
              <h3 className="text-white font-bold text-lg leading-snug">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeProject}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); closeProject(); }}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-[60]"
          >
            <X className="w-8 h-8" />
          </button>

          {photoCount > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors z-[60]"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button 
                onClick={handleNext}
                className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors z-[60]"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          
          <div 
            className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* If we have a real image URL, render it. Otherwise, render placeholder */}
            {currentPhotos[currentPhotoIndex] && currentPhotos[currentPhotoIndex].startsWith('http') ? (
              <Image 
                src={currentPhotos[currentPhotoIndex]} 
                alt={`${selectedProject.title} - Fotoğraf ${currentPhotoIndex + 1}`} 
                fill 
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                <span className="text-zinc-500 font-medium text-lg px-6 text-center">
                  [Büyük Görsel: {selectedProject.title} - Fotoğraf {currentPhotoIndex + 1}/{photoCount}]
                </span>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Betasoft Otomasyon {photoCount > 1 && `(Fotoğraf ${currentPhotoIndex + 1} / ${photoCount})`}
                </p>
              </div>
              
              <Link 
                href={`/iletisim?subject=${encodeURIComponent(selectedProject.title)}`}
                className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-primary/90 transition-colors shrink-0 shadow-lg"
              >
                Makine Hakkında İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
