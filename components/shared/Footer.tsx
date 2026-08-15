import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer({ settings }: { settings?: any }) {
  const siteName = settings?.siteName || process.env.NEXT_PUBLIC_SITE_NAME || "Betasoft";
  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || "0212 549 65 73";
  const email = settings?.email || process.env.NEXT_PUBLIC_EMAIL || "info@betasoft.com";
  const address = settings?.address || process.env.NEXT_PUBLIC_ADDRESS || "Organize Sanayi Bölgesi, 1. Cadde No:5, Başakşehir / İstanbul";

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
            
            {/* Social Media */}
            {(settings?.instagram || settings?.youtube || settings?.linkedin) && (
              <div className="flex gap-4 mt-6">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                )}
                {settings.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                )}
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                )}
              </div>
            )}
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
