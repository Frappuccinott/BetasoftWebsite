"use client";

import React, { useRef, useState } from "react";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Eye, Edit3, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { getPresignedUploadUrl } from "@/actions/r2";
import { toast } from "sonner";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  folder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, folder }: MarkdownEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let replacement = "";
    if (selectedText) {
      replacement = `${prefix}${selectedText}${suffix}`;
    } else {
      replacement = `${prefix}metin${suffix}`;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Seçimi yeni metne odakla
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 5)
      );
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Satır başını bul
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }

    const newValue = value.substring(0, lineStart) + prefix + " " + value.substring(lineStart);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length + 1, end + prefix.length + 1);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen sadece görsel (resim) dosyası seçin.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Görsel boyutu en fazla 5MB olabilir.");
      return;
    }

    try {
      setIsUploading(true);
      const { uploadUrl, publicUrl, success } = await getPresignedUploadUrl(file.name, file.type, folder);
      
      if (success && uploadUrl && publicUrl) {
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        
        // Görsel yüklendikten sonra textareaya markdown olarak ekle
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart || value.length;
        const end = textarea?.selectionEnd || value.length;
        
        const replacement = `![Görsel](${publicUrl})`;
        const newValue = value.substring(0, start) + replacement + value.substring(end);
        
        onChange(newValue);
        toast.success("Görsel başarıyla eklendi.");
        
        setTimeout(() => {
          if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
          }
        }, 0);
      } else {
        toast.error("Görsel yüklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Görsel yükleme hatası:", error);
      toast.error("Görsel yüklenemedi.");
    } finally {
      setIsUploading(false);
      // Input'u sıfırla ki aynı dosyayı tekrar seçebilsin
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, title, disabled = false }: { icon: any, onClick: () => void, title: string, disabled?: boolean }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-slate-500 hover:text-slate-900"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col bg-white relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-1 border-b border-slate-200 bg-slate-50 flex-wrap gap-1">
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Bold} title="Kalın (Ctrl+B)" onClick={() => insertText("**", "**")} disabled={isUploading} />
          <ToolbarButton icon={Italic} title="İtalik (Ctrl+I)" onClick={() => insertText("*", "*")} disabled={isUploading} />
          <ToolbarButton icon={Strikethrough} title="Üstü Çizili" onClick={() => insertText("~~", "~~")} disabled={isUploading} />
          <div className="w-px h-5 bg-slate-300 mx-1" />
          <ToolbarButton icon={Heading2} title="Başlık 2" onClick={() => insertLinePrefix("##")} disabled={isUploading} />
          <ToolbarButton icon={Heading3} title="Başlık 3" onClick={() => insertLinePrefix("###")} disabled={isUploading} />
          <div className="w-px h-5 bg-slate-300 mx-1" />
          <ToolbarButton icon={List} title="Madde İşaretli Liste" onClick={() => insertLinePrefix("-")} disabled={isUploading} />
          <ToolbarButton icon={ListOrdered} title="Numaralı Liste" onClick={() => insertLinePrefix("1.")} disabled={isUploading} />
          <ToolbarButton icon={Quote} title="Alıntı" onClick={() => insertLinePrefix(">")} disabled={isUploading} />
          <div className="w-px h-5 bg-slate-300 mx-1" />
          <ToolbarButton icon={LinkIcon} title="Bağlantı Ekle" onClick={() => insertText("[", "](url-buraya)")} disabled={isUploading} />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-900 relative"
            onClick={() => fileInputRef.current?.click()}
            title="Görsel Yükle"
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <ImageIcon className="w-4 h-4" />}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="pr-2">
          <Button 
            type="button" 
            variant={previewMode ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="h-7 gap-1.5 text-xs bg-white"
            disabled={isUploading}
          >
            {previewMode ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {previewMode ? "Düzenle" : "Önizle"}
          </Button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      {previewMode ? (
        <div className="min-h-[400px] p-6 bg-slate-50 prose prose-slate max-w-none overflow-y-auto">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-slate-400 italic">Henüz içerik girilmedi...</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <Textarea 
            ref={textareaRef}
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder || "Makale içeriğini yazın..."}
            className="min-h-[400px] font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 rounded-none resize-y p-4"
            required
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
