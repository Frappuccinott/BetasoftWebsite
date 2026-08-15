"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * A hook that warns the user when they try to leave the page with unsaved changes.
 * Provides a custom UI dialog for soft navigation instead of window.confirm.
 */
export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [forceLeave, setForceLeave] = useState(false);

  const activeDirty = isDirty && !forceLeave;

  useEffect(() => {
    // Handle standard browser refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    // Attempt to handle Next.js link clicks (soft navigation)
    const handleClick = (e: MouseEvent) => {
      if (!activeDirty) return;
      
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      // If clicking a link that navigates away
      if (anchor && anchor.href && anchor.target !== "_blank" && !anchor.href.includes("javascript:void(0)")) {
        const isInternal = anchor.href.startsWith(window.location.origin);
        if (isInternal) {
          const isSamePage = anchor.href === window.location.href;
          if (!isSamePage) {
            e.preventDefault();
            e.stopPropagation();
            setPendingUrl(anchor.href.replace(window.location.origin, ""));
            setShowDialog(true);
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, [activeDirty]);

  const confirmLeave = () => {
    if (pendingUrl) {
      setForceLeave(true);
      setShowDialog(false);
      // Wait for React state to update, then push
      setTimeout(() => {
        router.push(pendingUrl);
      }, 0);
    }
  };

  const cancelLeave = () => {
    setShowDialog(false);
    setPendingUrl(null);
  };

  const UnsavedDialog = () => {
    if (!showDialog) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 m-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Kaydedilmemiş Değişiklikler</h2>
          <p className="text-slate-500 mb-8">
            Sayfadan ayrılmak istediğinize emin misiniz? Yaptığınız değişiklikler kaybolacaktır.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={cancelLeave}>
              İptal
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Evet, Ayrıl
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return { UnsavedDialog };
}
