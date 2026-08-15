"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Settings, Activity, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const articles = useQuery(api.articles.getArticles);
  const machines = useQuery(api.machines.getMachines);
  const galleries = useQuery(api.galleries.getGalleries);
  const statsData = useQuery(api.analytics.getSiteStats);

  if (articles === undefined || machines === undefined || galleries === undefined || statsData === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate stats
  const totalArticles = articles.length;
  const totalMachines = machines.length;
  
  // Total gallery photos (sum of all arrays + cover images)
  const totalGalleryPhotos = galleries.reduce((acc, gallery) => {
    return acc + (gallery.coverImage ? 1 : 0) + (gallery.images?.length || 0);
  }, 0);

  // Latest 5 articles
  const latestArticles = [...articles]
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, 5);

  const stats = [
    {
      title: "Toplam Makale",
      value: totalArticles.toString(),
      icon: FileText,
      trend: `${statsData.totalArticleViews} Toplam Okunma`,
      trendUp: true,
    },
    {
      title: "Galeri Fotoğrafları",
      value: totalGalleryPhotos.toString(),
      icon: ImageIcon,
      trend: `${galleries.length} Farklı Galeri`,
      trendUp: true,
    },
    {
      title: "Site Ziyaretleri",
      value: statsData.totalSiteViews.toString(),
      icon: Activity,
      trend: "Tüm sayfa görüntülenmeleri",
      trendUp: true,
    },
    {
      title: "Kayıtlı Makineler",
      value: totalMachines.toString(),
      icon: Settings,
      trend: "Sistemde ekli çözümler",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hoş Geldiniz</h1>
        <p className="text-slate-500 mt-1">Betasoft yönetim paneli üzerinden sitenizi yönetebilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className={`text-xs mt-1 font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200 min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Son Yüklenen Makaleler</CardTitle>
          </CardHeader>
          <CardContent>
            {latestArticles.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg m-6 mt-0">
                Henüz içerik yüklenmedi.
              </div>
            ) : (
              <div className="space-y-4">
                {latestArticles.map((article) => (
                  <div key={article._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-slate-200 flex-shrink-0 overflow-hidden">
                        {article.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 line-clamp-1">{article.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {new Date(article._creationTime).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Eye className="w-3.5 h-3.5" />
                            {article.views || 0}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            article.status === 'Aktif' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {article.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/admin/dashboard/makaleler/${article._id}`}>
                      <button className="text-sm font-medium text-primary hover:underline">Düzenle</button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/dashboard/makaleler/yeni" className="block w-full">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-primary">Yeni Makale Yaz</p>
                  <p className="text-xs text-slate-500 mt-0.5">Blog için yeni içerik oluştur</p>
                </div>
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary" />
              </button>
            </Link>
            
            <Link href="/admin/dashboard/galeri/yeni" className="block w-full">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-primary">Yeni Galeri Oluştur</p>
                  <p className="text-xs text-slate-500 mt-0.5">Makine için fotoğraf galerisi ekle</p>
                </div>
                <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-primary" />
              </button>
            </Link>

            <Link href="/admin/dashboard/makineler/yeni" className="block w-full">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-primary">Yeni Makine Ekle</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sisteme yeni bir makine çözümü ekle</p>
                </div>
                <Settings className="w-5 h-5 text-slate-400 group-hover:text-primary" />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
