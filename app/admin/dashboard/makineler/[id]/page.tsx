"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function EditMachinePage() {
  const router = useRouter();
  const params = useParams();
  const machineId = params.id as Id<"machines">;
  
  const categories = useQuery(api.categories.getCategories);
  const machine = useQuery(api.machines.getMachineById, { id: machineId });
  const updateMachine = useMutation(api.machines.updateMachine);
  
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

  useEffect(() => {
    if (machine) {
      setName(machine.name);
      setCategoryId(machine.categoryId);
      setDescription(machine.description);
      setFeatures(machine.features.length > 0 ? machine.features : [""]);
      setImageUrls(machine.imageUrls || []);
      setMetaTitle(machine.metaTitle || "");
      setMetaDescription(machine.metaDescription || "");
      setKeywords(machine.keywords || "");
    }
  }, [machine]);

  const isDirty = machine ? (
    name !== machine.name ||
    categoryId !== machine.categoryId ||
    description !== machine.description ||
    JSON.stringify(features) !== JSON.stringify(machine.features.length > 0 ? machine.features : [""]) ||
    JSON.stringify(imageUrls) !== JSON.stringify(machine.imageUrls || []) ||
    metaTitle !== (machine.metaTitle || "") ||
    metaDescription !== (machine.metaDescription || "") ||
    keywords !== (machine.keywords || "")
  ) : false;
  
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
    if (!name || !categoryId || !description || !machine) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Find deleted images (images that were in the original machine but are not in the current imageUrls state)
      const originalUrls = machine.imageUrls || [];
      const imagesToDelete = originalUrls.filter(url => !imageUrls.includes(url));
      
      if (imagesToDelete.length > 0) {
        for (const key of imagesToDelete) {
          const { extractR2Key } = await import("@/lib/utils");
          const r2Key = extractR2Key(key);
          if (r2Key) {
            const { deleteImageFromR2 } = await import("@/actions/r2");
            await deleteImageFromR2(r2Key);
          }
        }
      }

      const { slugify } = await import("@/lib/utils");
      const slug = slugify(name);
      
      const result = await updateMachine({
        id: machineId,
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
      
      toast.success("Makine başarıyla güncellendi!");
      router.push("/admin/dashboard/makineler");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  if (machine === undefined || categories === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (machine === null) {
    return <div className="text-center py-12">Makine bulunamadı.</div>;
  }

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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Makine Düzenle</h1>
            <p className="text-sm text-slate-500 mt-1">{machine.name} makinesini düzenliyorsunuz.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Değişiklikleri Kaydet
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
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Kategori Seçin" />
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
              <MultiImageUploader 
                onUploadSuccess={(urls) => setImageUrls(urls)} 
                maxImages={5} 
                initialUrls={machine.imageUrls}
              />
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
