import Link from "next/link";
import { ChevronRight, CheckCircle2, Cog } from "lucide-react";

// Fake showcase data
const showcaseData = {
  description: "Özel olarak tasarladığımız bu makine çözümü, üretim hattınızda maksimum verimlilik ve minimum fire ile çalışmak üzere mühendislerimiz tarafından geliştirilmiştir. Entegre edilen üst düzey otomasyon donanımları sayesinde sisteminizin uzun yıllar sorunsuz hizmet vermesi garanti altına alınmıştır.",
  features: [
    "İhtiyaca özel tasarım ve kapasite optimizasyonu",
    "Enerji tasarrufu sağlayan verimli motor altyapısı",
    "Gelişmiş güvenlik sensörleri ve acil durdurma sistemleri",
    "Kolay kullanılabilir HMI (Dokunmatik) kontrol paneli",
    "7/24 Uzaktan erişim ve arıza tespit imkanı"
  ]
};

export default async function MachineShowcasePage({
  params,
}: {
  params: Promise<{ category: string; machine: string }>;
}) {
  const resolvedParams = await params;
  
  // Format the slugs back to readable text (mock logic)
  const categoryName = resolvedParams.category.toUpperCase().replace("-", " ");
  
  // Basic un-slugify for machine name
  const machineWords = resolvedParams.machine.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1));
  const machineName = machineWords.join(" ");

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      
      {/* Hero / Header Section */}
      <div className="bg-zinc-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-8 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cozumler" className="hover:text-white transition-colors">Sektörel Çözümler</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/cozumler/${resolvedParams.category}`} className="hover:text-white transition-colors">
              {categoryName}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{machineName}</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-zinc-300 text-sm font-semibold uppercase tracking-widest rounded-md mb-6">
              <Cog className="w-4 h-4" />
              Özel Makine Üretimi
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-primary">{machineName}</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
              {showcaseData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 md:p-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Features */}
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Makine Özellikleri ve Avantajları</h3>
              <ul className="space-y-4">
                {showcaseData.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-700 font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Visual Showcase */}
            <div>
              <div className="w-full aspect-[4/3] bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-8 text-center mb-6 relative overflow-hidden">
                <Cog className="w-16 h-16 text-zinc-200 mb-4 animate-[spin_10s_linear_infinite]" />
                <h4 className="text-xl font-bold text-zinc-400 mb-2">3D Makine Modeli</h4>
                <p className="text-sm text-zinc-500">Makinelerimizin örnek görselleri, üretim alanında çekilmiş fotoğrafları veya 3D tasarımları burada sergilenecektir.</p>
              </div>
            </div>

          </div>



        </div>
      </div>

    </div>
  );
}
