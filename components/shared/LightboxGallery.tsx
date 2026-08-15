"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxGalleryProps {
  images: string[];
  machineName: string;
}

export function LightboxGallery({ images, machineName }: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-8 text-center mb-6 relative overflow-hidden">
        <ImageIcon className="w-16 h-16 text-zinc-300 mb-4" />
        <h4 className="text-xl font-bold text-zinc-400 mb-2">Görsel Bulunmuyor</h4>
        <p className="text-sm text-zinc-500">Bu makine için henüz görsel yüklenmemiştir.</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Modal açıldığında arkadaki scroll'u kilitle
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Ana Resim */}
        <div 
          className="w-full aspect-[4/3] bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden relative shadow-sm cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={images[0]} 
            alt={machineName} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium transition-opacity">
              Büyüt
            </span>
          </div>
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.slice(1).map((url, idx) => (
              <div 
                key={idx} 
                className="aspect-square bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden shadow-sm cursor-pointer relative group"
                onClick={() => openLightbox(idx + 1)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={url} 
                  alt={`${machineName} - ${idx + 2}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white">
              <h2 className="text-xl md:text-2xl font-bold">{machineName}</h2>
              <p className="text-zinc-400 font-medium">Fotoğraf {currentIndex + 1} / {images.length}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeLightbox}
              className="text-white hover:bg-white/20 rounded-full h-12 w-12"
            >
              <X className="w-8 h-8" />
            </Button>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors z-10 focus:outline-none"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Current Image */}
          <div 
            className="w-full h-full p-4 md:p-20 flex items-center justify-center cursor-default"
            onClick={closeLightbox} // Dışarı tıklanınca kapansın
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={images[currentIndex]} 
              alt={`${machineName} - ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()} // Resme tıklanınca kapanmasın
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors z-10 focus:outline-none"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
