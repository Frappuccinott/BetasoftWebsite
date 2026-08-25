import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";

import { ArticleViewTracker } from "@/components/shared/ArticleViewTracker";
import { Id } from "@/convex/_generated/dataModel";

import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchQuery(api.articles.getArticleBySlug, { slug: resolvedParams.slug });
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {}

  if (!article) return { title: "Makale Bulunamadı" };

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.content.substring(0, 150).replace(/\n/g, ' ') + '...';
  const siteName = settings?.metaTitle || settings?.siteName || "Betasoft";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title,
    description,
    keywords: article.keywords ? article.keywords.split(',').map((k: string) => k.trim()) : undefined,
    alternates: {
      canonical: `${siteUrl}/makaleler/${article.slug}`,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "article",
      publishedTime: new Date(article._creationTime).toISOString(),
      authors: ["Betasoft"],
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const article = await fetchQuery(api.articles.getArticleBySlug, { slug: resolvedParams.slug });

  if (!article || article.status !== "Aktif") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.metaTitle || article.title,
    "image": article.imageUrl ? [article.imageUrl] : [],
    "datePublished": new Date(article._creationTime).toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "Betasoft",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }],
    "description": article.metaDescription || article.content.substring(0, 150).replace(/\n/g, ' ') + '...'
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleViewTracker articleId={article._id as Id<"articles">} />
      {/* Article Header (Hero) */}
      <div className="bg-white border-b border-zinc-200 py-16 mb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center text-sm text-zinc-500 mb-8 gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/makaleler" className="hover:text-primary transition-colors">Makaleler</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900 font-medium truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 mb-6 font-medium">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {article.category || "Blog"}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article._creationTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" /> Yönetici
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight mb-8">
            {article.title}
          </h1>

          {/* Cover Image */}
          <div className="w-full aspect-[21/9] bg-zinc-100 rounded-2xl flex items-center justify-center relative overflow-hidden border border-zinc-200">
            {article.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
                <span className="text-zinc-400 font-medium z-10">
                  Görsel Yok
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Markdown Content rendered via react-markdown + Tailwind Typography */}
      <div className="container mx-auto px-4 max-w-6xl">
        <article className="prose prose-zinc prose-lg mx-auto w-full max-w-none break-words prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <ReactMarkdown>
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Back Button */}
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <Link
            href="/makaleler"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Tüm Makalelere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
