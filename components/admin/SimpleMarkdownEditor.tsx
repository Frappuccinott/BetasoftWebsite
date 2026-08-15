"use client";

import React, { useRef, useState } from "react";
import { Bold, Italic, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SimpleMarkdownEditor({ value, onChange, placeholder }: SimpleMarkdownEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 5)
      );
    }, 0);
  };

  const ToolbarButton = ({ icon: Icon, onClick, title }: { icon: any, onClick: () => void, title: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-slate-500 hover:text-slate-900"
      onClick={onClick}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col bg-white relative">
      <div className="flex items-center justify-between p-1 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Bold} title="Kalın (Ctrl+B)" onClick={() => insertText("**", "**")} />
          <ToolbarButton icon={Italic} title="İtalik (Ctrl+I)" onClick={() => insertText("*", "*")} />
        </div>
        
        <div className="pr-2">
          <Button 
            type="button" 
            variant={previewMode ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="h-7 gap-1.5 text-xs bg-white"
          >
            {previewMode ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {previewMode ? "Düzenle" : "Önizle"}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="min-h-[150px] p-4 bg-slate-50 prose prose-slate max-w-none overflow-y-auto">
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
            placeholder={placeholder || "İçeriği yazın..."}
            className="min-h-[150px] font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 rounded-none resize-y p-4"
          />
        </div>
      )}
    </div>
  );
}
