import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Fake data for the template
const sectoralSolutions = [
  { id: "ambalaj", title: "Ambalaj ve Paketleme Makineleri", count: 7 },
  { id: "gida", title: "Gıda İşleme Makineleri", count: 2 },
  { id: "plastik", title: "Plastik ve Kauçuk İşleme Makineleri", count: 1 },
  { id: "geri-donusum", title: "Geri Dönüşüm Makineleri", count: 4 },
  { id: "robotik", title: "Robotik ve Otomasyon", count: 2 },
  { id: "tekstil", title: "Tekstil Makineleri", count: 3 },
  { id: "hvac", title: "Temizleme / Sterilizasyon / HVAC", count: 3 },
  { id: "lojistik", title: "Lojistik ve Depolama Sistemleri", count: 2 },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
            Sektörel Çözümlerimiz
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Farklı endüstrilerin zorlu ihtiyaçlarına yönelik, yüksek verimli ve yenilikçi makine üretim çözümleri sunuyoruz.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectoralSolutions.map((solution) => (
            <div key={solution.id} className="flex flex-col items-center group">
              {/* Image Box */}
              <div className="w-full h-64 bg-white border border-zinc-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:24px_24px]" />
                <span className="text-zinc-400 font-medium z-10 text-center px-4">[Görsel: {solution.title}]</span>
              </div>
              
              {/* Info */}
              <h3 className="text-xl font-bold text-zinc-900 mb-2 text-center h-14 flex items-center justify-center">
                {solution.title}
              </h3>
              <p className="text-sm text-zinc-500 mb-6 text-center">
                {solution.count} Farklı Makine Çözümü
              </p>
              
              {/* Button */}
              <Link
                href={`/cozumler/${solution.id}`}
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors inline-block"
              >
                Makineleri İncele
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
