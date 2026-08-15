"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getPresignedUploadUrl } from "@/actions/r2";

interface MultiImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  maxImages?: number;
  initialUrls?: string[];
}

export function MultiImageUploader({ onUploadSuccess, maxImages = 5, initialUrls = [] }: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);
  const [sessionUploads, setSessionUploads] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Canvas context oluşturulamadı"));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("WebP dönüştürme başarısız"));
          },
          'image/webp',
          0.8
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Görsel yüklenemedi"));
      };
      
      img.src = url;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (previewUrls.length + files.length > maxImages) {
      toast.error(`En fazla ${maxImages} adet resim yükleyebilirsiniz.`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [...previewUrls];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Convert to WebP blob
        const webpBlob = await convertToWebP(file);
        
        // 2. Upload to R2
        const fileName = `${file.name.replace(/\.[^/.]+$/, "")}-${i}.webp`;
        const { uploadUrl, publicUrl, success } = await getPresignedUploadUrl(fileName, "image/webp", "galleries");
        
        if (success && uploadUrl && publicUrl) {
          await fetch(uploadUrl, {
            method: "PUT",
            body: webpBlob,
            headers: {
              "Content-Type": "image/webp",
            },
          });
          newUrls.push(publicUrl);
          setSessionUploads(prev => [...prev, publicUrl]);
        } else {
          toast.error(`${file.name} yüklenirken hata oluştu.`);
        }
      }
      
      setPreviewUrls(newUrls);
      onUploadSuccess(newUrls);
      if (newUrls.length > previewUrls.length) {
         toast.success("Görseller başarıyla eklendi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Görsel işlenirken veya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const urlToRemove = previewUrls[indexToRemove];
    const newUrls = previewUrls.filter((_, idx) => idx !== indexToRemove);
    setPreviewUrls(newUrls);
    onUploadSuccess(newUrls);
    
    // R2'den sil (Sadece bu oturumda yüklendiyse, DB'dekini silmemek için)
    if (sessionUploads.includes(urlToRemove)) {
      try {
        const { extractR2Key } = await import("@/lib/utils");
        const { deleteImageFromR2 } = await import("@/actions/r2");
        const key = extractR2Key(urlToRemove);
        if (key) {
          await deleteImageFromR2(key);
        }
      } catch (e) {
        console.error("Resim R2'den silinirken hata:", e);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {previewUrls.length < maxImages && (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
            ${isUploading ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-slate-500">İşleniyor ve yükleniyor...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-900">Görseller seçmek için tıklayın</p>
              <p className="text-xs text-slate-500">Maksimum {maxImages} resim. Otomatik WebP'ye dönüştürülür.</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      )}

      {/* Gallery Preview */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
