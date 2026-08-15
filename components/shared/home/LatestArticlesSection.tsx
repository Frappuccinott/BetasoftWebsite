"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
};

const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
};

export function LatestArticlesSection() {
  const articles = useQuery(api.articles.getActiveArticles);

  if (articles === undefined) {
    return null; // Loading state (could be skeleton)
  }

  if (articles.length === 0) {
    return null;
  }

  const latestArticles = articles.slice(0, 3);

  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Sektörden Haberler ve Makaleler</h2>
            <p className="text-zinc-600">En güncel teknolojik gelişmeler ve şirket haberlerimiz.</p>
          </div>
          <Link 
            href="/makaleler" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Hepsini Oku <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <div 
              key={article._id} 
              className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out group cursor-pointer flex flex-col h-full"
            >
              {/* Image Placeholder or Real Image */}
              <div className="w-full h-48 bg-zinc-900 relative overflow-hidden">
                {article.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:14px_24px] transition-transform duration-700 ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm font-medium">
                      [Görsel Bulunamadı]
                    </div>
                  </>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(article._creationTime)}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-zinc-600 line-clamp-3 mb-6 flex-grow">
                  {stripHtml(article.content)}
                </p>
                
                <div className="mt-auto pt-4 border-t border-zinc-100">
                  <Link 
                    href={`/makaleler/${article.slug}`} 
                    className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline"
                  >
                    Devamını Oku
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
