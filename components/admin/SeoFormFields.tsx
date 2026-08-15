import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SeoFormFieldsProps {
  metaTitle: string;
  setMetaTitle: (val: string) => void;
  metaDescription: string;
  setMetaDescription: (val: string) => void;
  keywords: string;
  setKeywords: (val: string) => void;
}

export function SeoFormFields({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  keywords,
  setKeywords,
}: SeoFormFieldsProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="seo" className="border rounded-lg px-4 bg-slate-50/50">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
          SEO Ayarları (İsteğe Bağlı)
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">SEO Başlığı (Meta Title)</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Arama motorlarında görünecek başlık (Boş bırakılırsa ana başlık kullanılır)"
              maxLength={60}
            />
            <p className="text-xs text-slate-500 text-right">{metaTitle.length}/60 karakter</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metaDescription">SEO Açıklaması (Meta Description)</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Arama motorlarında başlığın altında görünecek açıklama metni"
              className="resize-none"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-slate-500 text-right">{metaDescription.length}/160 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Anahtar Kelimeler (Keywords)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Virgülle ayırarak yazın (Örn: makine, otomasyon, endüstri)"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
