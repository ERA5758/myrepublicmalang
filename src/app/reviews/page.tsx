'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader, Star, User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import type { Review } from '@/lib/definitions';
import { ReviewSchema, type ReviewFormState } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

async function submitReview(
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
    const validatedFields = ReviewSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            message: 'Data tidak valid. Silakan periksa kembali isian Anda.',
            fields: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const { firestore } = await import('@/firebase').then(m => m.initializeFirebase());
        if (!firestore) throw new Error("Firestore not initialized");

        const reviewsCollection = collection(firestore, 'reviews');
        await addDoc(reviewsCollection, {
            ...validatedFields.data,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

        return { message: 'Terima kasih! Ulasan Anda telah dikirim dan akan kami tinjau.' };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { message: 'Gagal mengirim ulasan. Silakan coba lagi nanti.' };
    }
}


function StarRating({ rating, setRating, readOnly = false }: { rating: number; setRating?: (rating: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => !readOnly && setRating && setRating(star)}
        />
      ))}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Kirim Ulasan'}
    </Button>
  );
}

function ReviewSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className='flex items-center gap-2'>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
        </Card>
    );
}


export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);

  const initialState: ReviewFormState = null;
  const [state, dispatch] = useActionState(submitReview, initialState);
  
  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message.startsWith('Terima kasih') ? 'Sukses!' : 'Gagal!',
        description: state.message,
        variant: state.message.startsWith('Terima kasih') ? 'default' : 'destructive',
      });
      if (state.message.startsWith('Terima kasih')) {
        formRef.current?.reset();
        setRating(0);
      }
    }
  }, [state, toast]);

  useEffect(() => {
    async function fetchReviews() {
      if (!firestore) return;
      setLoading(true);
      const reviewsCollection = collection(firestore, 'reviews');
      const q = query(reviewsCollection, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedReviews: Review[] = [];
      querySnapshot.forEach(doc => {
          const data = doc.data();
          let createdAt: string;
            if (data.createdAt instanceof Timestamp) {
                createdAt = data.createdAt.toDate().toISOString();
            } else {
                createdAt = new Date().toISOString();
            }
        fetchedReviews.push({ id: doc.id, ...data, createdAt } as Review);
      });
      setReviews(fetchedReviews);
      setLoading(false);
    }
    fetchReviews();
  }, [firestore]);
  

  return (
    <div className="container mx-auto max-w-4xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Ulasan Pelanggan
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Lihat apa kata mereka tentang layanan MyRepublic di Malang.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Ulasan Terbaru</h2>
             {loading ? (
                <div className="space-y-4">
                    <ReviewSkeleton />
                    <ReviewSkeleton />
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-4">
                {reviews.map(review => (
                    <Card key={review.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="bg-muted rounded-full p-2">
                                    <User className="h-6 w-6 text-muted-foreground"/>
                                </div>
                                <div>
                                    <p className="font-semibold">{review.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                             </div>
                            <StarRating rating={review.rating} readOnly />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground italic">&quot;{review.review}&quot;</p>
                    </CardContent>
                    </Card>
                ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">Belum ada ulasan yang disetujui.</p>
            )}
        </div>
        <Card className="w-full max-w-lg justify-self-center lg:justify-self-start">
            <CardHeader>
                <CardTitle>Bagikan Pengalaman Anda</CardTitle>
                <CardDescription>
                Ulasan, kritik, atau saran Anda sangat berarti bagi kami untuk menjadi lebih baik.
                </CardDescription>
            </CardHeader>
            <form ref={formRef} action={dispatch}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Anda</Label>
                        <Input id="name" name="name" placeholder="cth. Budi" required />
                        {state?.fields?.name && <p className="text-sm text-destructive">{state.fields.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="review">Ulasan, Kritik, atau Saran</Label>
                        <Textarea id="review" name="review" placeholder="Layanan sangat memuaskan..." required />
                         {state?.fields?.review && <p className="text-sm text-destructive">{state.fields.review}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Rating Anda</Label>
                        <StarRating rating={rating} setRating={setRating} />
                        <input type="hidden" name="rating" value={rating} />
                         {state?.fields?.rating && <p className="text-sm text-destructive">{state.fields.rating}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
      </div>
    </div>
  );
}
