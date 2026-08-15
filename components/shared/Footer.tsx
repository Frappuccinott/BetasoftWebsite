import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Betasoft";
  const phone = process.env.NEXT_PUBLIC_PHONE || "0212 549 65 73";
  const email = process.env.NEXT_PUBLIC_EMAIL || "info@betasoft.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "Organize Sanayi Bölgesi, 1. Cadde No:5, Başakşehir / İstanbul";

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-3xl tracking-tight text-white">
                {siteName}
              </span>
            </Link>
            <p className="text-white/80 text-sm mb-6">
              Endüstriyel otomasyon ve makine çözümlerinde güvenilir iş ortağınız.
            </p>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <p className="whitespace-pre-line">{address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/hakkimizda" className="hover:text-white hover:underline transition-all">Hakkımızda</Link></li>
              <li><Link href="/servis" className="hover:text-white hover:underline transition-all">Servis ve Teknik Destek</Link></li>
              <li><Link href="/makaleler" className="hover:text-white hover:underline transition-all">Makaleler</Link></li>
              <li><Link href="/fotograf-galerisi" className="hover:text-white hover:underline transition-all">Fotoğraf Galerisi</Link></li>
              <li><Link href="/iletisim" className="hover:text-white hover:underline transition-all">Bize Ulaşın</Link></li>
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Sektörel Çözümler</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/cozumler/ambalaj" className="hover:text-white hover:underline transition-all">Ambalaj ve Paketleme</Link></li>
              <li><Link href="/cozumler/gida" className="hover:text-white hover:underline transition-all">Gıda İşleme</Link></li>
              <li><Link href="/cozumler/plastik" className="hover:text-white hover:underline transition-all">Plastik & Kauçuk</Link></li>
              <li><Link href="/cozumler/robotik" className="hover:text-white hover:underline transition-all">Robotik ve Otomasyon</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Bültene Kayıt Olun</h3>
            <p className="text-white/80 text-sm mb-4">
              Yeni ürünlerimizden ve sektörel haberlerden ilk siz haberdar olun.
            </p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
              <button 
                type="button"
                className="bg-primary text-white text-sm font-medium py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Kayıt Ol
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="/gizlilik" className="hover:text-white">Gizlilik Politikası</Link>
            <Link href="/cerezler" className="hover:text-white">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
