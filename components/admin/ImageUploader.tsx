"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getPresignedUploadUrl } from "@/actions/r2";

interface ImageUploaderProps {
  onUploadSuccess?: (url: string) => void;
  onMultiUploadSuccess?: (urls: string[]) => void;
  onRemove?: () => void;
  initialUrl?: string | null;
  folder?: string;
  resetAfterUpload?: boolean;
  multiple?: boolean;
}

export function ImageUploader({ onUploadSuccess, onMultiUploadSuccess, onRemove, initialUrl = null, folder, resetAfterUpload = false, multiple = false }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sessionUploads, setSessionUploads] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl !== undefined) {
      setPreview(initialUrl);
    }
  }, [initialUrl]);

  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context hatası"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("WebP dönüştürme başarısız"));
        }, "image/webp", 0.8);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Görsel yüklenemedi"));
      };
      img.src = url;
    });
  };

  const handleMultipleFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    const newUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const webpBlob = await convertToWebP(file);
        const fileName = `${file.name.replace(/\.[^/.]+$/, "")}-${i}.webp`;
        const { uploadUrl, publicUrl, success } = await getPresignedUploadUrl(fileName, "image/webp", folder);
        
        if (success && uploadUrl && publicUrl) {
          await fetch(uploadUrl, {
            method: "PUT",
            body: webpBlob,
            headers: { "Content-Type": "image/webp" },
          });
          newUrls.push(publicUrl);
          setSessionUploads(prev => [...prev, publicUrl]);
        }
      } catch (error) {
        console.error("Çoklu yükleme hatası:", error);
      }
    }
    
    if (onMultiUploadSuccess) {
      onMultiUploadSuccess(newUrls);
    }
    
    if (resetAfterUpload) {
      setPreview(null);
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    // Tarayıcıda (Client-side) WebP'ye Çevirme İşlemi
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const MAX_SIZE = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      setPreview(canvas.toDataURL("image/webp", 0.8)); // Önizleme
      URL.revokeObjectURL(objectUrl);
      setIsUploading(true);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsUploading(false);
          return;
        }

        try {
          const { uploadUrl, publicUrl, success } = await getPresignedUploadUrl(file.name.replace(/\.[^/.]+$/, "") + ".webp", "image/webp", folder);
          
          if (success && uploadUrl && publicUrl) {
            // Upload to S3/R2 directly
            await fetch(uploadUrl, {
              method: "PUT",
              body: blob,
              headers: {
                "Content-Type": "image/webp",
              },
            });
            if (onUploadSuccess) onUploadSuccess(publicUrl);
            setSessionUploads(prev => [...prev, publicUrl]);
            if (resetAfterUpload) {
              setPreview(null);
            }
          }
        } catch (error) {
          console.error("Resim yükleme hatası:", error);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }, "image/webp", 0.8);
    };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (multiple) {
      handleMultipleFiles(files);
    } else {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (multiple) {
        handleMultipleFiles(files);
      } else {
        const file = files[0];
        if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp") {
          handleFile(file);
        }
      }
    }
  };

  const handleRemove = async () => {
    const urlToRemove = preview;
    setPreview(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    // R2'den sil (Sadece bu oturumda yüklendiyse, DB'dekini silmemek için)
    if (urlToRemove && sessionUploads.includes(urlToRemove)) {
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
    <div className="w-full h-full">
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 transition-colors cursor-pointer h-full text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary hover:bg-slate-50"
          }`}
        >
          <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? "text-primary" : "text-slate-400"}`} />
          <p className="text-xs font-medium">Tıklayın veya sürükleyin</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 group h-full flex items-center justify-center bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Önizleme" className="w-full h-auto max-h-64 object-contain" />
          
          {isUploading ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium text-slate-700">WebP olarak optimize edilip yükleniyor...</p>
            </div>
          ) : (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="shadow-sm"
              >
                Değiştir
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
                className="shadow-sm"
              >
                Kaldır
              </Button>
            </div>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp" 
        multiple={multiple}
        className="hidden" 
      />
    </div>
  );
}
