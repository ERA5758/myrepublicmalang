import type { MetadataRoute } from 'next';
import { articles } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://myrepublicmalang.net';

  // URL statis
  const staticRoutes = [
    '/',
    '/blog',
    '/register',
    '/coverage-areas',
    '/personalized-offers',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));

  // URL dinamis untuk artikel
  const articleRoutes = articles.map((article) => ({
    url: `${siteUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt).toISOString(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
