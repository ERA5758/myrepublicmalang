'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Article } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

function ArticleSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function BlogIndexPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        async function fetchArticles() {
            if (!firestore) return;
            setLoading(true);
            const articlesCollection = collection(firestore, 'articles');
            const q = query(articlesCollection, orderBy('publishedAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedArticles: Article[] = [];
            querySnapshot.forEach(doc => {
                fetchedArticles.push({
                    id: doc.id,
                    ...doc.data()
                } as Article);
            });
            setArticles(fetchedArticles);
            setLoading(false);
        }
        fetchArticles();
    }, [firestore]);

  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Blog MyRepublic Malang
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Wawasan, tips, dan pembaruan terbaru tentang internet cepat di Malang.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
            Array.from({ length: 3 }).map((_, i) => <ArticleSkeleton key={i} />)
        ) : (
            articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} passHref>
                <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative h-48 w-full">
                    <Image
                    src={article.image.imageUrl}
                    alt={article.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={article.image.imageHint}
                    />
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-xl leading-snug hover:text-primary">
                    {article.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-grow">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                        <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <Badge variant="outline">{article.category}</Badge>
                    </div>
                </CardContent>
                </Card>
            </Link>
            ))
        )}
      </div>
    </div>
  );
}
