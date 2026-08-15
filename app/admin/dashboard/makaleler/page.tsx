"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Image as ImageIcon, Loader2, Search, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ArticlesPage() {
  const articles = useQuery(api.articles.getArticles);
  const deleteArticle = useMutation(api.articles.deleteArticle);
  const [searchQuery, setSearchQuery] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (article: any) => {
    setItemToDelete(article);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    
    try {
      const { _id: id, imageUrl, content } = itemToDelete;
      const result = await deleteArticle({ id });
      
      if (!result.success) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      const { extractR2Key } = await import("@/lib/utils");
      const { deleteImageFromR2 } = await import("@/actions/r2");

      if (imageUrl) {
        const key = extractR2Key(imageUrl);
        if (key) await deleteImageFromR2(key);
      }
      
      if (content) {
        const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
        const matches = [...content.matchAll(markdownImageRegex)];
        const contentUrls = matches.map(m => m[1]);
        
        for (const url of contentUrls) {
          const key = extractR2Key(url);
          if (key) await deleteImageFromR2(key);
        }
      }
      
      toast.success("Makale silindi.");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (articles === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredArticles = articles.filter((a) => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Makaleler</h1>
          <p className="text-slate-500 mt-1">Blog/Makale yazılarını buradan yönetebilirsiniz.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Makale başlığı ara..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/admin/dashboard/makaleler/yeni" className="w-full sm:w-auto">
            <Button className="w-full flex items-center gap-2">
              <Plus className="w-4 h-4" /> Yeni Makale Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900 w-16">Görsel</TableHead>
              <TableHead className="font-semibold text-slate-900">Makale Başlığı</TableHead>
              <TableHead className="font-semibold text-slate-900">Bağlantı (Slug)</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">Görüntülenme</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">Durum</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article._id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {article.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-900">{article.title}</TableCell>
                <TableCell className="text-slate-500">
                  <Link href={`/makaleler/${article.slug}`} target="_blank" className="hover:text-primary hover:underline transition-colors">
                    {article.slug}
                  </Link>
                </TableCell>
                <TableCell className="text-center font-medium text-slate-700">
                  {article.views || 0}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex items-center justify-center border px-2.5 py-0.5 rounded-full text-xs font-medium ${article.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {article.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/dashboard/makaleler/${article._id}`}>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => requestDelete(article)} variant="ghost" size="icon" className="text-slate-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredArticles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  {searchQuery ? "Aramanızla eşleşen makale bulunamadı." : "Henüz makale eklenmedi."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={executeDelete}
        isLoading={isDeleting}
        title="Makaleyi Sil"
        description={`"${itemToDelete?.title}" adlı makaleyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve içerikteki tüm görseller sunucudan kalıcı olarak silinir.`}
      />
    </div>
  );
}
