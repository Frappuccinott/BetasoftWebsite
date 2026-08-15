"use client";

import { useState, useEffect, use } from "react";
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
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const articleId = resolvedParams.id as Id<"articles">;
  
  const article = useQuery(api.articles.getArticleById, { id: articleId });
  const updateArticle = useMutation(api.articles.updateArticle);
  
  // Form States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Taslak");
  const [category, setCategory] = useState("Blog");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (article && !isInitialized) {
      setTitle(article.title);
      setContent(article.content);
      setStatus(article.status);
      setCategory(article.category || "Blog");
      setImageUrl(article.imageUrl);
      setMetaTitle(article.metaTitle || "");
      setMetaDescription(article.metaDescription || "");
      setKeywords(article.keywords || "");
      setIsInitialized(true);
    }
  }, [article, isInitialized]);

  const isDirty = Boolean(
    isInitialized && 
    (title !== article?.title || 
    content !== article?.content || 
    status !== article?.status || 
    category !== (article?.category || "Blog") || 
    imageUrl !== article?.imageUrl ||
    metaTitle !== (article?.metaTitle || "") ||
    metaDescription !== (article?.metaDescription || "") ||
    keywords !== (article?.keywords || ""))
  );

  const { UnsavedDialog } = useUnsavedChanges(isDirty && !isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Başlık ve içerik alanları zorunludur.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (article && article.imageUrl && article.imageUrl !== imageUrl) {
        const { extractR2Key } = await import("@/lib/utils");
        const oldKey = extractR2Key(article.imageUrl);
        if (oldKey) {
          const { deleteImageFromR2 } = await import("@/actions/r2");
          await deleteImageFromR2(oldKey);
        }
      }

      // İçerikten silinen markdown görsellerini R2'den temizle
      if (article && article.content) {
        const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
        
        const oldMatches = [...article.content.matchAll(markdownImageRegex)];
        const oldUrls = oldMatches.map(m => m[1]);
        
        const newMatches = [...content.matchAll(markdownImageRegex)];
        const newUrls = newMatches.map(m => m[1]);
        
        const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));
        
        if (deletedUrls.length > 0) {
          const { extractR2Key } = await import("@/lib/utils");
          const { deleteImageFromR2 } = await import("@/actions/r2");
          
          for (const url of deletedUrls) {
            const key = extractR2Key(url);
            if (key) await deleteImageFromR2(key);
          }
        }
      }

      const { slugify } = await import("@/lib/utils");
      const slug = slugify(title);
      
      const result = await updateArticle({
        id: articleId,
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

      toast.success("Makale başarıyla güncellendi!");
      router.push("/admin/dashboard/makaleler");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  if (article === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (article === null) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Makale bulunamadı.</p>
        <Link href="/admin/dashboard/makaleler">
          <Button variant="outline">Geri Dön</Button>
        </Link>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Makaleyi Düzenle</h1>
              <p className="text-sm text-slate-500 mt-1">{article.title} adlı yazıyı düzenliyorsunuz.</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Değişiklikleri Kaydet
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">İçerik (Markdown)</Label>
                  <MarkdownEditor 
                    value={content} 
                    onChange={setContent} 
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
                  <ImageUploader 
                    onUploadSuccess={(url) => setImageUrl(url)} 
                    initialUrl={article.imageUrl}
                    folder="articles"
                  />
                  {imageUrl && imageUrl !== article.imageUrl && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700 text-sm font-medium">
                      ✓ Yeni görsel başarıyla yüklendi. (Eskisi kaydedince silinecek)
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
