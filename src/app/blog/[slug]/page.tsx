import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CircleCheckBig, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where, limit, Timestamp } from 'firebase/firestore';
import type { Article, Offer } from '@/lib/definitions';

async function getArticle(slug: string): Promise<Article | null> {
    const { firestore } = initializeFirebase();
    if (!firestore) return null;

    const articlesCollection = collection(firestore, 'articles');
    const q = query(articlesCollection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    // Convert Firestore Timestamp to string
    let publishedAt: string;
    if (data.publishedAt instanceof Timestamp) {
        publishedAt = data.publishedAt.toDate().toISOString();
    } else if (typeof data.publishedAt === 'string') {
        publishedAt = data.publishedAt;
    } else {
        publishedAt = new Date().toISOString(); // Fallback
    }

    return { 
        id: doc.id, 
        ...data,
        publishedAt,
     } as Article;
}

async function getOffers(): Promise<Offer[]> {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        return [];
    }
    const offersCollection = collection(firestore, 'offers');
    const querySnapshot = await getDocs(offersCollection);
    const offers: Offer[] = [];
    querySnapshot.forEach((doc) => {
        offers.push({ id: doc.id, ...doc.data() } as Offer);
    });
    return offers;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);
    const siteUrl = 'https://myrepublicmalang.net';

    if (!article) {
        return {
            title: 'Artikel tidak ditemukan'
        };
    }

    const url = `${siteUrl}/blog/${article.slug}`;

    return {
        title: article.title,
        description: article.summary,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: article.title,
            description: article.summary,
            url: url,
            type: 'article',
            publishedTime: article.publishedAt,
            images: [
                {
                    url: article.image.imageUrl,
                    width: 800,
                    height: 600,
                    alt: article.title,
                },
            ],
            authors: ['MyRepublic Malang'],
        },
         twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.summary,
            images: [article.image.imageUrl],
        },
    };
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  const offers = await getOffers();
  const siteUrl = 'https://myrepublicmalang.net';


  if (!article) {
    notFound();
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${article.slug}`,
    },
    headline: article.title,
    description: article.summary,
    image: article.image.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'MyRepublic Malang',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'MyRepublic Malang',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.myrepublic.co.id/wp-content/uploads/2022/12/logo-myrepublic.png',
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
  };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="container mx-auto max-w-4xl py-12 sm:py-16">
      <div className="mb-8">
        <Link href="/blog" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Blog
        </Link>
      </div>
      <article>
        <header className="mb-8">
          <div className="relative mb-6 h-64 md:h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={article.image.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <Badge variant="secondary" className="mb-2">{article.category}</Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Diposting pada {new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>
        <div
          className="prose prose-lg max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

       <aside className="mt-16">
          <h2 className="font-headline text-2xl font-bold mb-6 text-center">
            Lihat Paket Kami
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, 3).map((offer, index) => (
              <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <CardHeader className="relative text-center p-6 text-white flex flex-col space-y-1.5">
                      {offer.image && (
                        <>
                           <Image
                              src={offer.image.imageUrl}
                              alt={offer.image.description}
                              fill
                              className="object-cover"
                              data-ai-hint={offer.image.imageHint}
                           />
                           <div className="absolute inset-0 bg-black/50"></div>
                        </>
                      )}
                      <div className="relative z-10">
                         <CardTitle className="font-headline text-2xl">{offer.title}</CardTitle>
                         <p className="text-sm text-white/80">{offer.speed}</p>
                         <p className="font-bold text-3xl mt-2">{offer.price.split('/')[0]}/<span className="text-lg">bln</span></p>
                         <p className="text-xs text-white/70">Harga belum termasuk PPN 11%</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        {offer.promo && <p className="text-sm font-bold text-destructive mb-4 text-center">{offer.promo}</p>}
                        <h4 className="font-semibold mb-2">Fitur dan Benefit</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {offer.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                              <CircleCheckBig className="mr-2 h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 space-y-2">
                        <Button className="w-full" asChild>
                          <Link href={`/register?plan=${offer.id}`}>Pilih Paket</Link>
                        </Button>
                         <Button className="w-full" variant="outline" asChild>
                          <Link href="https://wa.me/6285184000880" target="_blank">Chat Sales</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
            ))}
          </div>
        </aside>
    </div>
    </>
  );
}
