'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader, Check, X, Star, User } from 'lucide-react';
import type { Review } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type ReviewStatus = 'pending' | 'approved' | 'rejected';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}


export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReviewStatus>('pending');
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

    setLoading(true);
    const reviewsCollection = collection(firestore, 'reviews');
    const reviewsQuery = query(
      reviewsCollection, 
      where('status', '==', activeTab), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const fetchedReviews = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString()
        } as Review
      });
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, activeTab]);

  const handleUpdateStatus = async (id: string, status: ReviewStatus) => {
    if (!firestore) return;
    try {
      const docRef = doc(firestore, 'reviews', id);
      await updateDoc(docRef, { status });
      toast({
        title: 'Sukses!',
        description: `Ulasan telah ${status === 'approved' ? 'disetujui' : 'ditolak'}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Memperbarui',
        description: 'Terjadi kesalahan saat memperbarui status ulasan.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Kelola Ulasan Pelanggan
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Setujui atau tolak ulasan, kritik, dan saran yang masuk dari pelanggan.
        </p>
        <Button asChild variant="link" className="p-0 mt-2">
          <Link href="/admin">Kembali ke dasbor</Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReviewStatus)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Menunggu Persetujuan</TabsTrigger>
          <TabsTrigger value="approved">Disetujui</TabsTrigger>
          <TabsTrigger value="rejected">Ditolak</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.length > 0 ? reviews.map(review => (
                        <Card key={review.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted rounded-full p-2">
                                            <User className="h-6 w-6 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{review.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground text-sm italic">&quot;{review.review}&quot;</p>
                            </CardContent>
                            {review.status === 'pending' && (
                                <CardFooter className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(review.id, 'rejected')}>
                                        <X className="h-4 w-4 mr-2" /> Tolak
                                    </Button>
                                    <Button size="sm" onClick={() => handleUpdateStatus(review.id, 'approved')}>
                                        <Check className="h-4 w-4 mr-2" /> Setujui
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    )) : (
                        <div className="col-span-full text-center py-16">
                            <p className="text-muted-foreground">Tidak ada ulasan dalam kategori ini.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </Tabs>
    </div>
  );
}
