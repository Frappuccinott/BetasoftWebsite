import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

// Fake data for now, will be replaced with API fetch later
const fakeArticles = [
  {
    id: 1,
    title: "Endüstri 4.0 ve Otomasyonun Geleceği",
    excerpt: "Üretim hatlarında nesnelerin interneti (IoT) ve akıllı sistemlerin kullanımı ile verimlilik nasıl artırılır?",
    date: "12 Ağustos 2026",
    slug: "endustri-4-0-ve-otomasyon",
  },
  {
    id: 2,
    title: "Yeni Nesil Servo Motor Teknolojileri",
    excerpt: "Hassas konumlandırma ve yüksek hız gerektiren uygulamalarda yeni nesil servo motorların sağladığı avantajlar.",
    date: "5 Ağustos 2026",
    slug: "yeni-nesil-servo-motor-teknolojileri",
  },
  {
    id: 3,
    title: "Plastik Sektöründe Enerji Tasarrufu",
    excerpt: "Extruder ve enjeksiyon makinelerinde doğru otomasyon çözümleriyle %30'a varan enerji tasarrufu nasıl sağlanır?",
    date: "28 Temmuz 2026",
    slug: "plastik-sektorunde-enerji-tasarrufu",
  },
];

export function LatestArticlesSection() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Sektörden Haberler ve Makaleler</h2>
            <p className="text-zinc-600">En güncel teknolojik gelişmeler ve şirket haberlerimiz.</p>
          </div>
          <Link 
            href="/makaleler" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Hepsini Oku <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fakeArticles.map((article) => (
            <div 
              key={article.id} 
              className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out group cursor-pointer flex flex-col h-full"
            >
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-zinc-900 relative overflow-hidden">
                {/* A subtle grid pattern so the zoom effect is visible even when there's no real image */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:14px_24px] transition-transform duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm font-medium">
                  [Görsel Alanı]
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-zinc-600 line-clamp-3 mb-6 flex-grow">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-zinc-100">
                  <Link 
                    href={`/makaleler/${article.slug}`} 
                    className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline"
                  >
                    Devamını Oku
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
