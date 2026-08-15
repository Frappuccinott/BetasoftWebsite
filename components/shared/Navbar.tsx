"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const sectoralSolutions = [
  { id: "ambalaj", title: "Ambalaj ve Paketleme Makineleri", items: ["Dilimleme Makineleri", "Kağıt Kesme Makineleri", "Kese Kağıdı Makineleri", "Torba Çanta Yapım Makineleri", "Kutu Katlama Makineleri", "Gıda Paketleme Makineleri", "Gıda Dolum Makineleri"] },
  { id: "gida", title: "Gıda İşleme Makineleri", items: ["Paketleme Makineleri", "Dolum Makineleri"] },
  { id: "plastik", title: "Plastik ve Kauçuk İşleme Makineleri", items: ["Termoform Makineleri"] },
  { id: "geri-donusum", title: "Geri Dönüşüm Makineleri", items: ["Extruder Geri Dönüşüm Makineleri", "Dozajlama Makineleri", "Shredder", "Yıkama Hatları"] },
  { id: "robotik", title: "Robotik ve Otomasyon", items: ["Robotik Kollar", "Müşteriye Özel Pano Tasarımı"] },
  { id: "tekstil", title: "Tekstil Makineleri", items: ["Dokuma Makineleri", "İplik Makineleri", "Boyama Makineleri"] },
  { id: "hvac", title: "Temizleme / Sterilizasyon / HVAC", items: ["Klima Sistemleri", "Soğutma Sistemleri", "Fanlar"] },
  { id: "lojistik", title: "Lojistik ve Depolama Sistemleri", items: ["Konveyör Sistemleri", "Taşıma Bantları"] },
];

const productCategories = [
  { id: "plc", name: "PLC", brands: ["Siemens", "Inovance", "Omron"] },
  { id: "hmi", name: "HMI", brands: ["Siemens", "Inovance", "Omron"] },
  { id: "asenkron", name: "Asenkron Sürücü", brands: ["Siemens", "Inovance"] },
  { id: "servo", name: "Servo Sürücü ve Motor", brands: ["Panasonic", "Omron"] },
  { id: "io", name: "I/O Üniteleri", brands: [] },
  { id: "uzak-erisim", name: "Uzak Erişim Cihazı", brands: [] },
];

export function Navbar() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Betasoft";
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full border-b bg-white relative z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-3xl tracking-tight text-primary">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">


              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="text-base font-medium hover:text-primary focus:text-primary data-[state=open]:text-primary"
                  onClick={() => router.push("/cozumler")}
                >
                  Sektörel Çözümler
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-2">
                    {sectoralSolutions.map((solution) => (
                      <li key={solution.id} className="group/item relative">
                        <Link
                          href={`/cozumler/${solution.id}`}
                          className="flex items-center justify-between select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-50 hover:text-primary focus:bg-zinc-50 focus:text-primary cursor-pointer text-sm font-medium text-zinc-900 group-hover/item:text-primary"
                        >
                          <span>{solution.title}</span>
                          {solution.items.length > 0 && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-400 transition-colors group-hover/item:text-primary"><path d="m9 18 6-6-6-6" /></svg>
                          )}
                        </Link>

                        {solution.items.length > 0 && (
                          <ul className="absolute left-full top-0 hidden w-[250px] bg-white rounded-lg shadow-lg border group-hover/item:block ml-1 p-2 space-y-1 z-50">
                            {solution.items.map((item) => {
                              // Generate a simple slug for the item
                              const itemSlug = item.toLowerCase().replace(/ /g, "-").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
                              return (
                                <ListItem
                                  key={item}
                                  href={`/cozumler/${solution.id}/${itemSlug}`}
                                  title={item}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium hover:text-primary focus:text-primary data-[state=open]:text-primary">
                  Servis ve Teknik Destek
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-1 p-2">
                    <ListItem href="/servis/kurulum" title="Kurulum ve Montaj" />
                    <ListItem href="/servis/bakim" title="Periyodik Bakım" />
                    <ListItem href="/servis/otomasyon-cozumleri" title="Otomasyon Çözümleri" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base font-medium hover:text-primary focus:text-primary`}>
                  <Link href="/hakkimizda">
                    Hakkımızda
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base font-medium hover:text-primary focus:text-primary`}>
                  <Link href="/makaleler">
                    Makaleler
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base font-medium hover:text-primary focus:text-primary`}>
                  <Link href="/fotograf-galerisi">
                    Fotoğraf Galerisi
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base font-medium hover:text-primary focus:text-primary`}>
                  <Link href="/iletisim">
                    Bize Ulaşın
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto bg-zinc-50">
              <SheetTitle className="sr-only">Mobil Menü</SheetTitle>
              <div className="flex flex-col py-6">
                <Link href="/" className="px-6 mb-6" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-3xl tracking-tight text-primary">
                    {siteName}
                  </span>
                </Link>

                <Accordion type="single" collapsible className="w-full">


                  <AccordionItem value="cozumler" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-100 font-bold text-zinc-600 text-sm tracking-wide">
                      SEKTÖREL ÇÖZÜMLER
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 bg-zinc-100/50">
                      {sectoralSolutions.map((sol) => (
                        <div key={sol.id} className="mb-4 last:mb-0">
                          <div className="font-bold text-zinc-900 mb-2 uppercase text-xs">{sol.title}</div>
                          <div className="flex flex-col space-y-2 pl-2">
                            {sol.items.map(item => {
                              const itemSlug = item.toLowerCase().replace(/ /g, "-").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
                              return (
                                <Link 
                                  key={item} 
                                  href={`/cozumler/${sol.id}/${itemSlug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-zinc-600 hover:text-primary transition-colors text-sm"
                                >
                                  {item}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="servis" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-100 font-bold text-zinc-600 text-sm tracking-wide">
                      SERVİS VE TEKNİK DESTEK
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 bg-zinc-100/50 flex flex-col space-y-3">
                      <Link href="/servis/kurulum" onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-primary">Kurulum ve Montaj</Link>
                      <Link href="/servis/bakim" onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-primary">Periyodik Bakım</Link>
                      <Link href="/servis/otomasyon-cozumleri" onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-primary">Otomasyon Çözümleri</Link>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <div className="px-6 py-4 hover:bg-zinc-100 border-b">
                    <Link href="/hakkimizda" onClick={() => setIsOpen(false)} className="font-bold text-zinc-600 text-sm tracking-wide block">
                      HAKKIMIZDA
                    </Link>
                  </div>
                  
                  <div className="px-6 py-4 hover:bg-zinc-100 border-b">
                    <Link href="/makaleler" onClick={() => setIsOpen(false)} className="font-bold text-zinc-600 text-sm tracking-wide block">
                      MAKALELER
                    </Link>
                  </div>

                  <div className="px-6 py-4 hover:bg-zinc-100 border-b">
                    <Link href="/fotograf-galerisi" onClick={() => setIsOpen(false)} className="font-bold text-zinc-600 text-sm tracking-wide block">
                      FOTOĞRAF GALERİSİ
                    </Link>
                  </div>

                  <div className="px-6 py-4 hover:bg-zinc-100 border-b">
                    <Link href="/iletisim" onClick={() => setIsOpen(false)} className="font-bold text-zinc-600 text-sm tracking-wide block">
                      BİZE ULAŞIN
                    </Link>
                  </div>
                </Accordion>

                <div className="px-6 mt-8">
                  <p className="text-sm text-zinc-500">Müşteri Hizmetleri: 0212 549 03 75</p>
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || "#"}
          ref={ref as any}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-primary focus:bg-accent focus:text-primary ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
