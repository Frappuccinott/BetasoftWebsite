import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ServicesSection({
  servicesImageUrl,
  worksImageUrl
}: {
  servicesImageUrl?: string;
  worksImageUrl?: string;
}) {
  return (
    <section className="w-full flex flex-col md:flex-row h-[400px] md:h-[500px]">
      {/* Hizmetlerimiz Block */}
      <Link href="/cozumler" className="relative flex-1 group overflow-hidden cursor-pointer bg-zinc-900 block">
        {/* Image Placeholder with Zoom Effect */}
        <div
          className="absolute inset-0 bg-zinc-800 transition-transform duration-700 ease-in-out group-hover:scale-110 bg-cover bg-center"
          style={servicesImageUrl ? { backgroundImage: `url(${servicesImageUrl})` } : {}}
        />

        {/* Gray Overlay that disappears on hover */}
        <div className="absolute inset-0 bg-zinc-600/80 mix-blend-multiply transition-opacity duration-500 ease-in-out group-hover:opacity-0" />

        {/* Bottom Gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        <div className="absolute bottom-10 left-10 z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Hizmetlerimiz
          </h2>
          <span className="inline-flex items-center text-zinc-200 font-medium group-hover:text-white transition-colors mt-2">
            Devam Et <ChevronRight className="w-5 h-5 ml-1 transition-transform duration-300 ease-out group-hover:translate-x-2" />
          </span>
        </div>
      </Link>

      {/* İki blok arasına eklenen dikey çizgi (Mobilde yatay) */}
      <div className="w-full h-1.5 md:w-1.5 md:h-full shrink-0" style={{ backgroundColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#e30a17' }} />

      {/* Çalışmalarımız Block */}
      <Link href="/fotograf-galerisi" className="relative flex-1 group overflow-hidden cursor-pointer bg-zinc-900 block">
        {/* Image Placeholder with Zoom Effect */}
        <div
          className="absolute inset-0 bg-zinc-800 transition-transform duration-700 ease-in-out group-hover:scale-110 bg-cover bg-center"
          style={worksImageUrl ? { backgroundImage: `url(${worksImageUrl})` } : {}}
        />

        {/* Gray Overlay that disappears on hover */}
        <div className="absolute inset-0 bg-zinc-600/80 mix-blend-multiply transition-opacity duration-500 ease-in-out group-hover:opacity-0" />

        {/* Bottom Gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        <div className="absolute bottom-10 left-10 z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Çalışmalarımız
          </h2>
          <span className="inline-flex items-center text-zinc-200 font-medium group-hover:text-white transition-colors mt-2">
            Devam Et <ChevronRight className="w-5 h-5 ml-1 transition-transform duration-300 ease-out group-hover:translate-x-2" />
          </span>
        </div>
      </Link>
    </section>
  );
}
