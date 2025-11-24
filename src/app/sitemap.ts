
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import type { MetadataRoute } from 'next';
import { initializeFirebase } from '@/firebase';
import type { Article } from '@/lib/definitions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://myrepublicmalang.net';

  // Static routes
  const staticRoutes = [
    '/',
    '/blog',
    '/register',
    '/cek-area',
    '/personalized-offers',
    '/payment-methods',
    '/reviews',
    '/hubungi-kami',
    '/speed-test',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));

  // Dynamic routes for articles from Firestore
  const { firestore } = initializeFirebase();
  let articleRoutes: MetadataRoute.Sitemap = [];
  
  if (firestore) {
      try {
        const articlesCollection = collection(firestore, 'articles');
        const q = query(articlesCollection, orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        articleRoutes = querySnapshot.docs.map(doc => {
            const data = doc.data();

            // Reliably handle Firestore Timestamp on the server
            const publishedAt = data.publishedAt && typeof (data.publishedAt as any).toDate === 'function'
              ? ((data.publishedAt as any).toDate() as Date).toISOString()
              : new Date().toISOString();
            
            return {
                url: `${siteUrl}/blog/${data.slug}`,
                lastModified: publishedAt,
                changeFrequency: 'monthly' as 'monthly',
                priority: 0.7,
            };
        });
      } catch (error) {
        console.error("Failed to generate sitemap for articles:", error);
      }
  }


  return [...staticRoutes, ...articleRoutes];
}
