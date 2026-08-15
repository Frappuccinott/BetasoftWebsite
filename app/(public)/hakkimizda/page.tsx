import Link from "next/link";
import { ChevronRight, Target, Eye, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Hero Section */}
      <div className="bg-zinc-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-8 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Hakkımızda</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Geleceği <span className="text-primary">Otomasyonla</span> İnşa Ediyoruz
          </h1>
          <p className="text-zinc-400 max-w-3xl text-lg md:text-xl leading-relaxed">
            Betasoft olarak, endüstriyel üretim hatlarını daha akıllı, daha verimli ve daha sürdürülebilir hale getirmek için yenilikçi mühendislik çözümleri sunuyoruz.
          </p>
        </div>
      </div>

      {/* Biz Kimiz Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-zinc-900">Biz Kimiz?</h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
            <p className="text-zinc-600 leading-relaxed text-lg">
              Yılların getirdiği endüstriyel tecrübe ile kurulan <strong className="text-zinc-900">Betasoft</strong>, 
              makine üreticilerinden (OEM) son kullanıcılara kadar geniş bir yelpazede anahtar teslim otomasyon sistemleri 
              tasarlayan, geliştiren ve uygulayan öncü bir teknoloji firmasıdır. 
            </p>
            <p className="text-zinc-600 leading-relaxed text-lg">
              Ambalajdan gıdaya, plastikten robotiğe kadar her sektörün dinamiklerini anlıyor, 
              ihtiyaca özel donanım ve yazılım çözümleri üretiyoruz. Siemens, Inovance, Omron gibi 
              dünya devleriyle yaptığımız iş ortaklıkları sayesinde, en güvenilir komponentleri projelerimize entegre ediyoruz.
            </p>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-400 font-medium tracking-widest uppercase">
                  [Kurumsal Görsel]
                </span>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-zinc-900 text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <div className="text-4xl font-black text-primary mb-1">15+</div>
              <div className="text-sm font-medium text-zinc-300">Yıllık Tecrübe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Misyon Vizyon Değerler */}
      <div className="container mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Misyon */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Misyonumuz</h3>
            <p className="text-zinc-600 leading-relaxed">
              Müşterilerimizin üretim süreçlerini dijitalleştirmek, enerji verimliliği sağlamak ve üretim maliyetlerini düşürmek için sürdürülebilir, güvenilir, yenilikçi otomasyon teknolojileri sunmak.
            </p>
          </div>

          {/* Vizyon */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Vizyonumuz</h3>
            <p className="text-zinc-600 leading-relaxed">
              Endüstri 4.0 ve akıllı fabrika dönüşümünde Türkiye'nin ve bölgenin en güvenilir entegratör firması olarak, endüstriyel otomasyon standartlarını belirleyen lider bir marka olmak.
            </p>
          </div>

          {/* Değerler */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Değerlerimiz</h3>
            <ul className="text-zinc-600 space-y-3">
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> İnovasyon ve Sürekli Gelişim</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Müşteri Odaklı Yaklaşım</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Mühendislikte Kusursuzluk</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Şeffaflık ve Güvenilirlik</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
