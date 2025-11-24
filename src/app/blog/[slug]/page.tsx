import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Wifi } from 'lucide-react';
import { articles } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { offers } from '@/lib/data';

// Dummy function to fetch article by slug
async function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);

    if (!article) {
        return {};
    }

    const url = `/blog/${article.slug}`;

    return {
        title: `${article.title} | MyRepublic Malang`,
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
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
    };
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://myrepublic-malang-demo.web.app/blog/${article.slug}`,
    },
    headline: article.title,
    description: article.summary,
    image: article.image.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'MyRepublic Malang',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MyRepublic Malang',
      logo: {
        '@type': 'ImageObject',
        url: 'https://myrepublic.co.id/wp-content/uploads/2022/12/logo-myrepublic.png',
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {offers.slice(0, 3).map((offer) => (
              <Card key={offer.id} className="flex flex-col text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                         <Wifi className="h-6 w-6 text-primary"/>
                    </div>
                  <CardTitle className="font-headline text-xl mt-2">{offer.title}</CardTitle>
                   <p className="font-semibold text-primary text-lg pt-2">{offer.price}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {offer.features.map((feature) => (
                        <li key={feature} className="flex items-center justify-center">
                            <span>{feature}</span>
                        </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                        <Link href={`/register?plan=${offer.id}`}>Pilih Paket</Link>
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        </aside>
    </div>
    </>
  );
}
