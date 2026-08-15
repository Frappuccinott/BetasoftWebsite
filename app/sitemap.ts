import { MetadataRoute } from 'next';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch all necessary data
  let articles: any[] = [];
  let categories: any[] = [];
  let machines: any[] = [];

  try {
    articles = await fetchQuery(api.articles.getActiveArticles);
    categories = await fetchQuery(api.categories.getCategories);
    machines = await fetchQuery(api.machines.getMachines);
  } catch (e) {
    console.error("Convex fetch failed for sitemap:", e);
  }

  const routes = [
    '',
    '/cozumler',
    '/makaleler',
    '/fotograf-galerisi',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${siteUrl}/makaleler/${article.slug}`,
    lastModified: new Date(article._creationTime).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/cozumler/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const machineRoutes = machines.map((machine) => ({
    url: `${siteUrl}/cozumler/${machine.categorySlug}/${machine.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...articleRoutes, ...categoryRoutes, ...machineRoutes];
}
