"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { SeoFormFields } from "@/components/admin/SeoFormFields";
import { toast } from "sonner";
import { createArticle as createArticleAction } from "@/actions/admin/articles";
import { api } from "@/convex/_generated/api";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function NewArticlePage() {
  const router = useRouter();
  
  // Form States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [category, setCategory] = useState("Blog");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = title !== "" || content !== "" || imageUrl !== null;
  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Başlık ve içerik alanları zorunludur.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { slugify } = await import("@/lib/utils");
      const slug = slugify(title);
      
      const result = await createArticleAction({
        title,
        slug,
        content,
        imageUrl,
        status,
        category,
        metaTitle,
        metaDescription,
        keywords,
      });

      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Makale başarıyla oluşturuldu!");
      router.push("/admin/dashboard/makaleler");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UnsavedDialog />
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/makaleler">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Yeni Makale Ekle</h1>
              <p className="text-sm text-slate-500 mt-1">Blog kısmında yayınlanacak yeni bir yazı oluşturun (Markdown destekler).</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Kaydet ve Yayınla
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-slate-200 shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="text-lg">İçerik Editörü</CardTitle>
                <CardDescription>Makalenin başlığını ve içeriğini belirleyin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Makale Başlığı</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Örn: Yeni Nesil Ambalaj Teknolojileri" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">İçerik (Markdown)</Label>
                  <MarkdownEditor 
                    value={content} 
                    onChange={setContent} 
                    placeholder="Makale içeriğini Markdown formatında yazın (örn: **kalın**, # Başlık)..." 
                    folder="articles"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Kapak Görseli</CardTitle>
                <CardDescription>Makalenin başında ve listelerde görünecek fotoğraf.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} folder="articles" />
                  {imageUrl && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700 text-sm font-medium">
                      ✓ Görsel başarıyla optimize edildi.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Yayın Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input 
                    id="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="Örn: Blog, Haberler, Teknik" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Yayın Durumu</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Yayında (Aktif)</SelectItem>
                      <SelectItem value="Taslak">Taslak</SelectItem>
                    </SelectContent>
                  </Select>
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
