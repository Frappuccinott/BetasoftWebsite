import Link from "next/link";
import { ChevronRight, Wrench, Settings, Cpu } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const serviceData: Record<string, { title: string; desc: string; icon: any; content: string[] }> = {
  "kurulum": {
    title: "Kurulum ve Montaj",
    desc: "Sistemlerinizin uzman mühendislerimiz tarafından kurulması ve devreye alınması.",
    icon: Wrench,
    content: [
      "Elektrik panosu ve saha montaj işlemleri.",
      "Sistem senkronizasyonu ve haberleşme (Profinet, EtherCAT vb.) ayarları.",
      "İlk çalıştırma, test senaryolarının uygulanması ve operatör eğitimleri."
    ]
  },
  "bakim": {
    title: "Periyodik Bakım",
    desc: "Arızaların önüne geçmek ve makine ömrünü uzatmak için planlı bakım hizmetleri.",
    icon: Settings,
    content: [
      "Sistemin genel kondisyon ve aşınma testleri.",
      "Termal kamera ile pano ve motor sıcaklık ölçümleri.",
      "Yazılım yedeklerinin alınması ve revizyon planlaması."
    ]
  },
  "otomasyon-cozumleri": {
    title: "Otomasyon Çözümleri",
    desc: "Üretim süreçlerinizi hızlandıracak ve verimliliği artıracak yenilikçi otomasyon teknolojileri.",
    icon: Cpu,
    content: [
      "PLC, HMI ve SCADA sistemleri yazılımı ve tasarımı.",
      "Mevcut makinelerin revizyonu ve modernizasyonu (Retrofit).",
      "Endüstri 4.0 ve veri toplama (IoT) sistemleri entegrasyonu."
    ]
  }
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = await params;
  const data = serviceData[resolvedParams.type];

  if (!data) {
    notFound();
  }

  const Icon = data.icon;
  const settings = await fetchQuery(api.settings.getSettings);
  
  let imageUrl = null;
  if (resolvedParams.type === "kurulum") {
    imageUrl = settings?.installationImageUrl;
  } else if (resolvedParams.type === "bakim") {
    imageUrl = settings?.maintenanceImageUrl;
  } else if (resolvedParams.type === "otomasyon-cozumleri") {
    imageUrl = settings?.automationImageUrl;
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-6 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/servis" className="hover:text-white transition-colors">Servis ve Destek</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{data.title}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 flex items-center gap-4">
            <Icon className="w-10 h-10 text-primary hidden sm:block" />
            {data.title}
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            {data.desc}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 md:p-16 max-w-4xl mx-auto">
          
          <div className="mb-12">
            <div className="w-full aspect-video bg-zinc-100 rounded-xl flex items-center justify-center relative overflow-hidden border border-zinc-200">
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={data.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
                  <span className="text-zinc-400 font-medium z-10">
                    [Görsel: {data.title}]
                  </span>
                </>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Hizmet Kapsamı</h2>
          <ul className="space-y-4">
            {data.content.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-zinc-700">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold">{idx + 1}</span>
                </div>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-zinc-900 mb-1">Desteğe mi ihtiyacınız var?</h3>
              <p className="text-zinc-500 text-sm">Uzman ekibimizle hemen iletişime geçin.</p>
            </div>
            <Link 
              href="/iletisim"
              className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              İletişim Kurun
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
