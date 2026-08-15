import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowRight } from "lucide-react";

const articlesData = [
  {
    id: 1,
    title: "Endüstri 4.0 ve Otomasyonun Geleceği",
    slug: "endustri-4-0-ve-otomasyonun-gelecegi",
    excerpt: "Üretim hatlarında yapay zeka ve IoT entegrasyonu ile Endüstri 4.0'ın getirdiği yenilikler ve verimlilik artışları hakkında her şey.",
    date: "12 Ağustos 2026",
    author: "Ahmet Yılmaz",
    category: "Teknoloji",
  },
  {
    id: 2,
    title: "PLC Programlamada Dikkat Edilmesi Gerekenler",
    slug: "plc-programlamada-dikkat-edilmesi-gerekenler",
    excerpt: "Siemens ve Inovance PLC'lerde yazılım geliştirirken sistem güvenliği ve performans için uygulamanız gereken en iyi pratikler.",
    date: "5 Ağustos 2026",
    author: "Mehmet Demir",
    category: "Yazılım",
  },
  {
    id: 3,
    title: "Servo Motor Seçim Rehberi",
    slug: "servo-motor-secim-rehberi",
    excerpt: "Makine tasarımında doğru servo motor ve sürücü seçimi nasıl yapılır? Atalet momenti, tork hesaplama ve hız profili analizi.",
    date: "28 Temmuz 2026",
    author: "Ali Veli",
    category: "Donanım",
  },
  {
    id: 4,
    title: "Ambalaj Sektöründe Yüksek Hızlı Paketleme Çözümleri",
    slug: "ambalaj-sektorunde-yuksek-hizli-paketleme",
    excerpt: "Saniyede yüzlerce ürün paketleyen modern ambalaj makinelerinin ardındaki otomasyon sırları ve sensör teknolojileri.",
    date: "15 Temmuz 2026",
    author: "Ayşe Kaya",
    category: "Sektörel",
  }
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-6 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Makaleler & Haberler</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Makaleler <span className="text-primary">& Haberler</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Sektörel gelişmeler, otomasyon teknolojilerindeki yenilikler ve uzman mühendislerimizin teknik yazılarını buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 mt-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article) => (
            <article key={article.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col h-full">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:14px_24px] opacity-50 group-hover:scale-110 transition-transform duration-700" />
                <span className="text-zinc-400 font-medium z-10 text-sm bg-white/80 px-3 py-1 rounded">
                  [Görsel Alanı]
                </span>
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded z-20">
                  {article.category}
                </span>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {article.author}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/makaleler/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                
                <p className="text-zinc-600 text-sm mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                
                <Link 
                  href={`/makaleler/${article.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mt-auto"
                >
                  Makaleyi Oku <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
