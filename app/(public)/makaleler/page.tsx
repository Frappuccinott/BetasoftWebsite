import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowRight } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {}

  const title = "Makaleler & Haberler";
  const description = "Sektörel gelişmeler, otomasyon teknolojilerindeki yenilikler ve uzman mühendislerimizin teknik yazılarını buradan takip edebilirsiniz.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${settings?.metaTitle || settings?.siteName || "Betasoft"}`,
      description,
    },
  };
}

export default async function ArticlesPage() {
  const articles = await fetchQuery(api.articles.getActiveArticles);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-6 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Makaleler & Haberler</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Makaleler <span className="text-primary">& Haberler</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Sektörel gelişmeler, otomasyon teknolojilerindeki yenilikler ve uzman mühendislerimizin teknik yazılarını buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 mt-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article._id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col h-full">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                {article.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:14px_24px] opacity-50 group-hover:scale-110 transition-transform duration-700" />
                    <span className="text-zinc-400 font-medium z-10 text-sm bg-white/80 px-3 py-1 rounded">
                      Görsel Yok
                    </span>
                  </>
                )}
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded z-20 shadow-sm">
                  {article.category || "Blog"}
                </span>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 
                    {new Date(article._creationTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> Yönetici
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/makaleler/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                
                <p className="text-zinc-600 text-sm mb-6 line-clamp-3 flex-1">
                  {article.content.substring(0, 150)}...
                </p>
                
                <Link 
                  href={`/makaleler/${article.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mt-auto"
                >
                  Makaleyi Oku <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
          
          {articles.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500">
              Henüz yayınlanmış bir makale bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
