import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };
  
  const mappedText = text.replace(/[çÇğĞıİöÖşŞüÜ]/g, match => trMap[match]);
  
  return mappedText
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Alfanumerik olmayan karakterleri kaldır (boşluk ve tire hariç)
    .replace(/[\s_-]+/g, '-') // Boşlukları ve alt çizgileri tireye çevir
    .replace(/^-+|-+$/g, ''); // Baştaki ve sondaki tireleri kaldır
}

export function extractR2Key(url: string): string {
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
  if (publicUrl && url.startsWith(publicUrl)) {
    let key = url.replace(publicUrl, "");
    if (key.startsWith("/")) key = key.substring(1);
    return key;
  }
  return url.split("/").pop() || url;
}
