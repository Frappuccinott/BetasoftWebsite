"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { SeoFormFields } from "@/components/admin/SeoFormFields";
import { toast } from "sonner";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { createMachine as createMachineAction } from "@/actions/admin/machines";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function NewMachinePage() {
  const router = useRouter();
  
  const categories = useQuery(api.categories.getCategories);
  
  // Form States
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = name !== "" || categoryId !== "" || description !== "" || JSON.stringify(features) !== JSON.stringify([""]) || imageUrls.length > 0;
  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !description) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { slugify } = await import("@/lib/utils");
      const slug = slugify(name);
      
      const result = await createMachineAction({
        name,
        slug,
        categoryId: categoryId as any,
        description,
        features: features.filter(f => f.trim() !== ""),
        imageUrls,
        metaTitle,
        metaDescription,
        keywords
      });
      
      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Makine başarıyla oluşturuldu!");
      router.push("/admin/dashboard/makineler");
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
          <Link href="/admin/dashboard/makineler">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Yeni Makine Ekle</h1>
            <p className="text-sm text-slate-500 mt-1">Yeni bir makine çözümü oluşturup yayınlayın.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Kaydet ve Yayınla
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Temel Bilgiler */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Genel Bilgiler</CardTitle>
              <CardDescription>Makinenin adı, kategorisi ve genel açıklaması.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Makine Adı</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Örn: Otomatik Kutu Katlama Makinesi" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required disabled={categories === undefined}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder={categories === undefined ? "Yükleniyor..." : "Kategori Seçin"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detaylı Açıklama</Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Makinenin üretim hattındaki işlevini, hangi malzemelerle uyumlu çalıştığını vb. açıklayın..." 
                  className="min-h-[150px] resize-y"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Makine Özellikleri ve Avantajları</CardTitle>
                <CardDescription>Müşterilerinize makinenin sağladığı faydaları madde madde yazın.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddFeature} className="flex items-center gap-1">
                <Plus className="w-4 h-4" /> Madde Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <Input 
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Özellik ${index + 1}`}
                      className="bg-slate-50"
                    />
                  </div>
                  {features.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveFeature(index)}
                      className="text-slate-400 hover:text-red-600 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Sağ Sütun: Görsel ve Yayınlama */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Makine Görselleri (Galeri)</CardTitle>
              <CardDescription>Maksimum 5 fotoğraf ekleyebilirsiniz. Seçilen fotoğraflar otomatik olarak WebP formatına dönüştürülecektir.</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiImageUploader onUploadSuccess={(urls) => setImageUrls(urls)} maxImages={5} />
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
