"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { toast } from "sonner";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const gallery = useQuery(api.galleries.getGalleryById, { id: resolvedParams.id as Id<"galleries"> });
  const updateGallery = useMutation(api.galleries.updateGallery);
  
  // Form States
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (gallery && !isInitialized) {
      setTitle(gallery.title || "");
      setCoverImage(gallery.coverImage || "");
      setImages(gallery.images || []);
      setIsInitialized(true);
    }
  }, [gallery, isInitialized]);

  const isDirty = (() => {
    if (!gallery || !isInitialized) return false;
    
    return (
      title !== (gallery.title || "") ||
      coverImage !== (gallery.coverImage || "") ||
      JSON.stringify(images) !== JSON.stringify(gallery.images || [])
    );
  })();

  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  if (gallery === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (gallery === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Galeri Bulunamadı</h2>
        <p className="text-slate-500 mt-2 mb-6">İstediğiniz galeri silinmiş veya taşınmış olabilir.</p>
        <Link href="/admin/dashboard/galeri">
          <Button>Galerilere Dön</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !coverImage) {
      toast.error("Lütfen galeri adını ve kapak resmini boş bırakmayın.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updateGallery({
        id: resolvedParams.id as Id<"galleries">,
        title,
        coverImage,
        images,
        order: gallery.order,
      });
      
      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Galeri başarıyla güncellendi!");
      router.push("/admin/dashboard/galeri");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UnsavedDialog />
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/galeri">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Galeriyi Düzenle</h1>
              <p className="text-sm text-slate-500 mt-1">{title} adlı galeriyi güncelliyorsunuz.</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Değişiklikleri Kaydet
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Genel Bilgiler</CardTitle>
                <CardDescription>Galeride görünecek makine veya projenin adı.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Galeri / Makine Adı</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Örn: S7-1200 PLC Pano Tasarımı" 
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Galeri Görselleri (Çoklu)</CardTitle>
                <CardDescription>Galeriye tıklandığında açılacak slider için birden fazla fotoğraf seçin.</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiImageUploader initialUrls={images} onUploadSuccess={(urls) => setImages(urls)} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Kapak Resmi</CardTitle>
                <CardDescription>Galeriler sayfasında kartın üzerinde görünecek ana fotoğraf.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader initialUrl={coverImage} onUploadSuccess={(url) => setCoverImage(url)} />
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
