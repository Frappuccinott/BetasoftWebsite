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
import { SeoFormFields } from "@/components/admin/SeoFormFields";
import { toast } from "sonner";
import { createCategory as createCategoryAction } from "@/actions/admin/categories";
import { api } from "@/convex/_generated/api";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function NewCategoryPage() {
  const router = useRouter();
  
  // Form States
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = name !== "" || imageUrl !== null;
  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setIsSubmitting(true);

    try {
      const { slugify } = await import("@/lib/utils");
      const slug = slugify(name);
      
      const result = await createCategoryAction({
        name,
        slug,
        imageUrl,
        metaTitle,
        metaDescription,
        keywords,
      });

      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Kategori başarıyla oluşturuldu!");
      router.push("/admin/dashboard/kategoriler");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UnsavedDialog />
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/kategoriler">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Yeni Kategori Ekle</h1>
            <p className="text-sm text-slate-500 mt-1">Sektörel çözümler menüsü için yeni bir ana kategori oluşturun.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Kaydet ve Yayınla
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Genel Bilgiler</CardTitle>
              <CardDescription>Kategorinin adını belirleyin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Kategori Adı</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Örn: Gıda İşleme Makineleri" 
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Kategori Görseli (İsteğe Bağlı)</CardTitle>
              <CardDescription>Bu kategoriyi temsil edecek bir fotoğraf ekleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} folder="categories" />
                {imageUrl && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700 text-sm font-medium">
                    ✓ Görsel başarıyla optimize edildi.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <SeoFormFields 
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            keywords={keywords}
            setKeywords={setKeywords}
          />
        </div>
      </form>
    </div>
    </>
  );
}
