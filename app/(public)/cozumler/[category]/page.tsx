import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Fake data for the template
const categoryData = {
  ambalaj: { title: "Ambalaj ve Paketleme Makineleri", items: ["Dilimleme Makineleri", "Kağıt Kesme Makineleri", "Kese Kağıdı Makineleri", "Torba Çanta Yapım Makineleri", "Kutu Katlama Makineleri", "Gıda Paketleme Makineleri", "Gıda Dolum Makineleri"] },
  gida: { title: "Gıda İşleme Makineleri", items: ["Paketleme Makineleri", "Dolum Makineleri"] },
  plastik: { title: "Plastik ve Kauçuk İşleme Makineleri", items: ["Termoform Makineleri"] },
  "geri-donusum": { title: "Geri Dönüşüm Makineleri", items: ["Extruder Geri Dönüşüm Makineleri", "Dozajlama Makineleri", "Shredder", "Yıkama Hatları"] },
  robotik: { title: "Robotik ve Otomasyon", items: ["Robotik Kollar", "Müşteriye Özel Pano Tasarımı"] },
  tekstil: { title: "Tekstil Makineleri", items: ["Dokuma Makineleri", "İplik Makineleri", "Boyama Makineleri"] },
  hvac: { title: "Temizleme / Sterilizasyon / HVAC", items: ["Klima Sistemleri", "Soğutma Sistemleri", "Fanlar"] },
  lojistik: { title: "Lojistik ve Depolama Sistemleri", items: ["Konveyör Sistemleri", "Taşıma Bantları"] },
};

export default async function SolutionCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const categoryKey = resolvedParams.category as keyof typeof categoryData;
  const categoryInfo = categoryData[categoryKey] || { title: resolvedParams.category.toUpperCase(), items: [] };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-center text-sm text-zinc-500 mb-6 gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/cozumler" className="hover:text-primary transition-colors">Sektörel Çözümler</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-zinc-900 font-medium">{categoryInfo.title}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 text-center">
              {categoryInfo.title}
            </h1>
            <div className="w-full max-w-4xl border-t border-zinc-200 pt-6">
              <p className="text-zinc-600 text-center text-lg">
                Üretim süreçlerinizi hızlandıran, verimliliği artıran ve tamamen ihtiyaçlarınıza yönelik olarak tasarlanan {categoryInfo.title.toLowerCase()} çözümlerimiz.
              </p>
            </div>
            <div className="w-12 h-1 bg-zinc-200 mt-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* Machines Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categoryInfo.items.map((item) => {
            const itemSlug = item.toLowerCase().replace(/ /g, "-").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");

            return (
              <div key={item} className="flex flex-col items-center group">
                <div className="w-full h-48 bg-white border border-zinc-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <span className="text-zinc-400 font-medium z-10 text-sm">
                    [Görsel: {item}]
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-700 mb-6 text-center tracking-wider h-10 flex items-center">
                  {item}
                </h3>

                <Link
                  href={`/cozumler/${resolvedParams.category}/${itemSlug}`}
                  className="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors inline-block w-3/4 text-center shadow-sm"
                >
                  Detayları İncele
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
