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
import { deleteMachine as deleteMachineAction } from "@/actions/admin/machines";

export default function MachinesPage() {
  const machines = useQuery(api.machines.getMachines);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (machine: any) => {
    setItemToDelete(machine);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    
    try {
      const { _id: id, imageUrls = [] } = itemToDelete;
      const result = await deleteMachineAction({ id });
      
      if (!result.success) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      if (imageUrls && imageUrls.length > 0) {
        for (const imageUrl of imageUrls) {
          if (imageUrl) {
            const { extractR2Key } = await import("@/lib/utils");
            const key = extractR2Key(imageUrl);
            if (key) {
              const { deleteImageFromR2 } = await import("@/actions/r2");
              await deleteImageFromR2(key);
            }
          }
        }
      }
      
      toast.success("Makine başarıyla silindi.");
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (machines === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredMachines = machines.filter((m) => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Makineler</h1>
          <p className="text-slate-500 mt-1">Sistemdeki tüm makineleri buradan yönetebilirsiniz.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Makine veya kategori ara..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/admin/dashboard/makineler/yeni" className="w-full sm:w-auto">
            <Button className="w-full flex items-center gap-2">
              <Plus className="w-4 h-4" /> Yeni Makine Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900 w-16">Görsel</TableHead>
              <TableHead className="font-semibold text-slate-900">Makine Adı</TableHead>
              <TableHead className="font-semibold text-slate-900">Kategori</TableHead>
              <TableHead className="font-semibold text-slate-900">Bağlantı (Slug)</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">Durum</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine._id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {machine.imageUrls && machine.imageUrls.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={machine.imageUrls[0]} alt={machine.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-900">{machine.name}</TableCell>
                <TableCell className="text-slate-500">{machine.categoryName}</TableCell>
                <TableCell className="text-slate-500">
                  <Link href={`/cozumler/${machine.categorySlug}/${machine.slug}`} target="_blank" className="hover:text-primary hover:underline transition-colors">
                    {machine.slug}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {machine.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/dashboard/makineler/${machine._id}`}>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => requestDelete(machine)} variant="ghost" size="icon" className="text-slate-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredMachines.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  {searchQuery ? "Aramanızla eşleşen makine bulunamadı." : "Henüz makine eklenmedi."}
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
        title="Makineyi Sil"
        description={`"${itemToDelete?.name}" adlı makineyi silmek istediğinize emin misiniz? Tüm görseller sunucudan kalıcı olarak silinecektir.`}
      />
    </div>
  );
}
