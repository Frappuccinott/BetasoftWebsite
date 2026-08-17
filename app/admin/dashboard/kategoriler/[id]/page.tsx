"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SeoFormFields } from "@/components/admin/SeoFormFields";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { updateCategory as updateCategoryAction } from "@/actions/admin/categories";
import { Id } from "@/convex/_generated/dataModel";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as Id<"categories">;

  const category = useQuery(api.categories.getCategoryById, { id: categoryId });
  
  // Form States
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImageUrl(category.imageUrl);
      setMetaTitle(category.metaTitle || "");
      setMetaDescription(category.metaDescription || "");
      setKeywords(category.keywords || "");
    }
  }, [category]);

  const isDirty = category ? (
    name !== category.name || 
    imageUrl !== category.imageUrl ||
    metaTitle !== (category.metaTitle || "") ||
    metaDescription !== (category.metaDescription || "") ||
    keywords !== (category.keywords || "")
  ) : false;
  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    
    setIsSubmitting(true);

    try {
      // Eski resim değişmişse (ve eskiden bir resim varsa) R2'den sil
      if (category && category.imageUrl && category.imageUrl !== imageUrl) {
        const { extractR2Key } = await import("@/lib/utils");
        const oldKey = extractR2Key(category.imageUrl);
        if (oldKey) {
          const { deleteImageFromR2 } = await import("@/actions/r2");
          await deleteImageFromR2(oldKey);
        }
      }

      const { slugify } = await import("@/lib/utils");
      const slug = slugify(name);
      
      const result = await updateCategoryAction({
        id: categoryId,
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

      toast.success("Kategori başarıyla güncellendi!");
      router.push("/admin/dashboard/kategoriler");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  if (category === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (category === null) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Kategori bulunamadı.</p>
        <Link href="/admin/dashboard/kategoriler">
          <Button variant="outline">Geri Dön</Button>
        </Link>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kategoriyi Düzenle</h1>
            <p className="text-sm text-slate-500 mt-1">{category.name} kategorisini düzenliyorsunuz.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Değişiklikleri Kaydet
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Kategori Bilgileri</CardTitle>
              <CardDescription>Kategorinin temel özelliklerini belirleyin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Kategori Adı</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Kategori Görseli</CardTitle>
              <CardDescription>Kategoriyi temsil eden görsel (Örn: Sektör veya genel konsept fotoğrafı).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ImageUploader 
                  onUploadSuccess={(url) => setImageUrl(url)} 
                  initialUrl={category.imageUrl}
                  folder="categories"
                />
                {imageUrl && imageUrl !== category.imageUrl && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700 text-sm font-medium">
                    ✓ Yeni görsel başarıyla eklendi.
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
