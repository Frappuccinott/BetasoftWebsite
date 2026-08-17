import { Phone, Mail } from "lucide-react";

export function Topbar({ settings }: { settings?: any }) {
  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || "0534 916 36 45";
  const phone2 = settings?.phone2 || "0536 709 59 37";
  const email = settings?.email || process.env.NEXT_PUBLIC_EMAIL || "info@betasoft.com";

  return (
    <div className="bg-primary text-white text-sm py-2 px-4 flex flex-wrap justify-end items-center gap-6">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        <a href={`mailto:${email}`} className="hover:underline">
          {email}
        </a>
      </div>
      <div className="flex items-center gap-4 font-medium flex-wrap">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span className="opacity-90">Müşteri Hizmetleri:</span>
        </div>
        
        <div className="flex items-center gap-3">
          {phone && (
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:underline">
              {phone}
            </a>
          )}
          {phone && phone2 && <span className="opacity-50 text-xs">|</span>}
          {phone2 && (
            <a href={`tel:${phone2.replace(/\s+/g, "")}`} className="hover:underline">
              {phone2}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
