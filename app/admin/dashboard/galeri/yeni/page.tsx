"use client";

import { useState } from "react";
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

import { createGallery as createGalleryAction } from "@/actions/admin/galleries";
import { api } from "@/convex/_generated/api";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function NewGalleryPage() {
  const router = useRouter();
  
  // Form States
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = title !== "" || coverImage !== "" || images.length > 0;
  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !coverImage) {
      toast.error("Lütfen galeri adını ve kapak resmini boş bırakmayın.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createGalleryAction({
        title,
        coverImage,
        images,
        order: 0,
      });
      
      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Galeri başarıyla oluşturuldu!");
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Yeni Galeri Ekle</h1>
              <p className="text-sm text-slate-500 mt-1">Makine veya projeniz için yeni bir galeri oluşturun.</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Kaydet
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
                <MultiImageUploader onUploadSuccess={(urls) => setImages(urls)} />
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
                <ImageUploader onUploadSuccess={(url) => setCoverImage(url)} />
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
