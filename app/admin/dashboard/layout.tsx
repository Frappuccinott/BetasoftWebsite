"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { logout } from "@/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/kategoriler", label: "Kategoriler", icon: FileText },
  { href: "/admin/dashboard/makineler", label: "Makineler", icon: Settings },
  { href: "/admin/dashboard/makaleler", label: "Makaleler", icon: FileText }, // or PenTool/FileText
  { href: "/admin/dashboard/galeri", label: "Fotoğraf Galerisi", icon: ImageIcon },
  { href: "/admin/dashboard/ayarlar", label: "Genel Ayarlar", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Masaüstü için) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/admin/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">B</span>
            Betasoft Admin
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menü
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="w-5 h-5 mr-3" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobil Header & Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2 text-slate-600">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <SheetTitle className="sr-only">Menü</SheetTitle>
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                  <Link href="/admin/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">B</span>
                    Betasoft Admin
                  </Link>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                  <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Menü
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="p-4 border-t border-slate-200 mt-auto absolute bottom-0 left-0 right-0 bg-white">
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-5 h-5 mr-3" />
                    Çıkış Yap
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <span className="ml-2 font-bold text-lg text-primary">Betasoft</span>
          </div>
          
          <div className="flex items-center justify-end w-full">
            {/* Kullanıcı Profili (Sahte) */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900">Yönetici</span>
                <span className="text-xs text-slate-500">admin@betasoft.com</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                Y
              </div>
            </div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
