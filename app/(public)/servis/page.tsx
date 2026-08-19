import Link from "next/link";
import { ChevronRight, Wrench, Settings, Cpu } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servis ve Teknik Destek",
  description: "Betasoft Otomasyon Sistemleri satış sonrası servis ve teknik destek hizmetleri. Kurulum, periyodik bakım ve otomasyon çözümlerimizle yanınızdayız.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
            Servis ve Teknik Destek
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Satış sonrası hizmetlerimizle üretim hatlarınızın kesintisiz ve maksimum verimlilikle çalışmasını garanti ediyoruz.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Kurulum */}
          <Link href="/servis/kurulum" className="group">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">Kurulum ve Montaj</h2>
              <p className="text-zinc-500 mb-6 text-sm flex-1">
                Sistemlerinizin uzman mühendislerimiz tarafından standartlara uygun şekilde kurulması ve devreye alınması.
              </p>
              <span className="text-blue-600 font-semibold group-hover:underline underline-offset-4 text-sm mt-auto">
                Detayları İncele &rarr;
              </span>
            </div>
          </Link>

          {/* Bakım */}
          <Link href="/servis/bakim" className="group">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">Periyodik Bakım</h2>
              <p className="text-zinc-500 mb-6 text-sm flex-1">
                Olası arızaların önüne geçmek ve makine ömrünü uzatmak için planlı bakım ve revizyon hizmetleri.
              </p>
              <span className="text-emerald-600 font-semibold group-hover:underline underline-offset-4 text-sm mt-auto">
                Detayları İncele &rarr;
              </span>
            </div>
          </Link>

          {/* Otomasyon */}
          <Link href="/servis/otomasyon-cozumleri" className="group">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">Otomasyon Çözümleri</h2>
              <p className="text-zinc-500 mb-6 text-sm flex-1">
                Üretim süreçlerinizi hızlandıracak ve verimliliği artıracak yenilikçi otomasyon teknolojileri.
              </p>
              <span className="text-purple-600 font-semibold group-hover:underline underline-offset-4 text-sm mt-auto">
                Detayları İncele &rarr;
              </span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
