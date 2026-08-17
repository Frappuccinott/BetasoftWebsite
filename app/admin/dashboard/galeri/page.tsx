"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { deleteGallery as deleteGalleryAction } from "@/actions/admin/galleries";

export default function GalleryPage() {
  const galleries = useQuery(api.galleries.getGalleries);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (gallery: any) => {
    setItemToDelete(gallery);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    
    try {
      const { _id: id, coverImage, images = [] } = itemToDelete;
      const result = await deleteGalleryAction({ id });
      
      if (!result.success) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      const allImages = [coverImage, ...images].filter(Boolean);
      
      if (allImages.length > 0) {
        const { extractR2Key } = await import("@/lib/utils");
        const { deleteImageFromR2 } = await import("@/actions/r2");
        
        for (const imageUrl of allImages) {
          if (imageUrl) {
            const key = extractR2Key(imageUrl);
            if (key) {
              await deleteImageFromR2(key);
            }
          }
        }
      }
      
      toast.success("Galeri başarıyla silindi.");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (galleries === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredGalleries = galleries.filter((g) => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fotoğraf Galerisi</h1>
          <p className="text-slate-500 mt-1">Galeri modülündeki projeleri/makineleri buradan yönetebilirsiniz.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Galeri ara..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/admin/dashboard/galeri/yeni" className="w-full sm:w-auto">
            <Button className="w-full flex items-center gap-2">
              <Plus className="w-4 h-4" /> Yeni Galeri Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900 w-16">Kapak</TableHead>
              <TableHead className="font-semibold text-slate-900">Galeri (Makine) Adı</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">Fotoğraf Sayısı</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGalleries.map((gallery) => (
              <TableRow key={gallery._id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {gallery.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={gallery.coverImage} alt={gallery.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-900">{gallery.title}</TableCell>
                <TableCell className="text-center text-slate-500">
                  <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {gallery.images.length} Fotoğraf
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/dashboard/galeri/${gallery._id}`}>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => requestDelete(gallery)} variant="ghost" size="icon" className="text-slate-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredGalleries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                  {searchQuery ? "Aramanızla eşleşen galeri bulunamadı." : "Henüz galeri eklenmedi."}
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
        title="Galeriyi Sil"
        description={`"${itemToDelete?.title}" adlı galeriyi silmek istediğinize emin misiniz? İçindeki tüm görseller sunucudan kalıcı olarak silinecektir.`}
      />
    </div>
  );
}
