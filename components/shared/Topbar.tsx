import { Phone, Mail } from "lucide-react";

export function Topbar({ settings }: { settings?: any }) {
  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || "0212 549 65 73";
  const email = settings?.email || process.env.NEXT_PUBLIC_EMAIL || "info@betasoft.com";

  return (
    <div className="bg-primary text-white text-sm py-2 px-4 flex justify-end items-center gap-6">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        <a href={`mailto:${email}`} className="hover:underline">
          {email}
        </a>
      </div>
      <div className="flex items-center gap-2 font-medium">
        <Phone className="w-4 h-4" />
        <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:underline">
          Müşteri Hizmetleri: {phone}
        </a>
      </div>
    </div>
  );
}
