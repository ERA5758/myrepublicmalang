'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { articles as mockArticles } from '@/lib/blog-data';
import { offers as mockOffers } from '@/lib/data';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

export default function SeedPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSeedDatabase = async () => {
        if (!firestore) {
            toast({
                title: 'Error',
                description: 'Firestore is not initialized.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        toast({
            title: 'Memulai Seeding...',
            description: 'Mengisi database dengan data awal.',
        });

        try {
            const batch = writeBatch(firestore);

            // Seed articles
            const articlesCollection = collection(firestore, 'articles');
            mockArticles.forEach(article => {
                const docRef = doc(articlesCollection, article.slug); // Use slug as document ID
                const { slug, ...articleData } = article;
                batch.set(docRef, articleData);
            });

            // Seed offers
            const offersCollection = collection(firestore, 'offers');
            mockOffers.forEach(offer => {
                const docRef = doc(offersCollection, offer.id); // Use id as document ID
                batch.set(docRef, offer);
            });
            
            await batch.commit();

            toast({
                title: 'Seeding Berhasil!',
                description: 'Database telah berhasil diisi dengan data artikel dan penawaran.',
            });
        } catch (error) {
            console.error("Error seeding database: ", error);
            toast({
                title: 'Seeding Gagal',
                description: 'Terjadi kesalahan saat mengisi database. Periksa konsol untuk detailnya.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Seed Database</CardTitle>
                    <CardDescription>
                        Klik tombol di bawah ini untuk mengisi koleksi Firestore Anda (offers, articles)
                        dengan data tiruan awal dari proyek. Ini hanya perlu dilakukan sekali.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeedDatabase} disabled={isLoading}>
                        {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Mulai Seeding'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
