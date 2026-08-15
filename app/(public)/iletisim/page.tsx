import { Phone, Mail, MapPin } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function IletisimPage() {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {
    console.error("Convex fetch failed:", e);
  }

  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || "0538 061 75 32";
  const email = settings?.email || process.env.NEXT_PUBLIC_EMAIL || "info@betasoft.com";
  const address = settings?.address || process.env.NEXT_PUBLIC_ADDRESS || "İkitelli OSB, Triko center sanayi sit. M1 Blok No:22 BAŞAKŞEHİR / İSTANBUL";
  const mapUrl = settings?.mapLink || process.env.NEXT_PUBLIC_MAP_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.79327429156!2d28.871754026367353!3d41.00549580977239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str";

  return (
    <div className="min-h-screen bg-zinc-50 pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Left Column: Contact Info */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-16">
              Bizimle İletişime Geçin
            </h1>

            <div className="space-y-10 flex-grow">
              
              {/* Phone Row */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex flex-col text-zinc-700 font-medium text-lg">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              {/* Email Row */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex flex-col text-zinc-700 font-medium text-lg">
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </div>

              {/* Address Row */}
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex flex-col text-zinc-700 font-medium text-base md:text-lg">
                  <span className="whitespace-pre-line leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>

            </div>

            {/* Social Media Row */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-zinc-100">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 7.1C2.6 5.8 3.5 4.9 4.8 4.7 6.9 4.4 12 4.4 12 4.4s5.1 0 7.2.3c1.3.2 2.2 1.1 2.3 2.4.3 2.3.3 4.9.3 4.9s0 2.6-.3 4.9c-.1 1.3-1 2.2-2.3 2.4-2.1.3-7.2.3-7.2.3s-5.1 0-7.2-.3c-1.3-.2-2.2-1.1-2.3-2.4-.3-2.3-.3-4.9-.3-4.9s0-2.6.3-4.9z"/><path d="m10 15 5-3-5-3v6z"/></svg>
                </a>
              )}
              {settings?.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Google Maps */}
          <div className="flex-1 w-full min-h-[400px] lg:min-h-full relative bg-zinc-200">
            <iframe
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}
