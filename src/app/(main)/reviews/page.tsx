
'use client';

import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { useFirestore, initializeFirebase } from '@/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader, Star, User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import type { Review, ReviewFormState } from '@/lib/definitions';
import { ReviewSchema } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

async function submitReview(
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = ReviewSchema.safeParse({
        ...rawData,
        rating: Number(rawData.rating),
        status: 'pending',
        createdAt: new Date(),
    });

    if (!validatedFields.success) {
        return {
            isSuccess: false,
            message: 'Data tidak valid. Silakan periksa kembali isian Anda.',
            fields: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const { firestore } = initializeFirebase();
        if (!firestore) throw new Error("Firestore not initialized");

        const reviewsCollection = collection(firestore, 'reviews');
        
        const { status, createdAt, ...dataToSave } = validatedFields.data;

        await addDoc(reviewsCollection, {
            ...dataToSave,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

        return { isSuccess: true, message: 'Terima kasih! Ulasan Anda telah dikirim dan akan kami tinjau.' };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { isSuccess: false, message: 'Gagal mengirim ulasan. Silakan coba lagi nanti.' };
    }
}


function StarRating({ rating, setRating, readOnly = false }: { rating: number; setRating?: (rating: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 transition-colors ${
            !readOnly ? 'cursor-pointer' : ''
          } ${
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
                <div className="flex justify-between items-start">
                    <div className='flex items-center gap-3'>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-28" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </CardContent>
        </Card>
    );
}

function ReviewForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [rating, setRating] = useState(0);

    const initialState: ReviewFormState = null;
    const [state, dispatch] = useActionState(submitReview, initialState);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.isSuccess ? 'Sukses!' : 'Gagal!',
                description: state.message,
                variant: state.isSuccess ? 'default' : 'destructive',
            });
            if (state.isSuccess) {
                formRef.current?.reset();
                setRating(0);
                setDialogOpen(false);
            }
        }
    }, [state, toast, setDialogOpen]);

    return (
        <form ref={formRef} action={dispatch}>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name-dialog">Nama Anda</Label>
                    <Input id="name-dialog" name="name" placeholder="cth. Budi" required />
                    {state?.fields?.name && <p className="text-sm text-destructive">{state.fields.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="review-dialog">Ulasan, Kritik, atau Saran</Label>
                    <Textarea id="review-dialog" name="review" placeholder="Layanan sangat memuaskan..." required />
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
    );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const firestore = useFirestore();
  
  useEffect(() => {
    async function fetchReviews() {
      if (!firestore) return;
      setLoading(true);
      try {
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
      } catch (error) {
        console.error("Gagal mengambil ulasan:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (firestore) {
        fetchReviews();
    }
  }, [firestore, isDialogOpen]); 
  

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="container mx-auto max-w-4xl py-12 sm:py-16">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Ulasan Pelanggan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Lihat apa kata mereka tentang layanan MyRepublic di Malang.
          </p>
        </div>
         <div className="mb-8 text-center">
            <DialogTrigger asChild>
                <Button>Berikan Ulasan Anda</Button>
            </DialogTrigger>
        </div>

        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-center">Ulasan Terbaru</h2>
             {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReviewSkeleton />
                    <ReviewSkeleton />
                </div>
            ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                 <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                    <p className="font-semibold">Belum Ada Ulasan</p>
                    <p className="text-sm mt-1">Jadilah yang pertama memberikan ulasan!</p>
                </div>
            )}
        </div>
         <div className="mt-12 text-center">
            <DialogTrigger asChild>
                <Button>Punya Ulasan? Bagikan di Sini</Button>
            </DialogTrigger>
        </div>
      </div>
      
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Bagikan Pengalaman Anda</DialogTitle>
              <DialogDescription>
                  Ulasan, kritik, atau saran Anda sangat berarti bagi kami untuk menjadi lebih baik.
              </DialogDescription>
          </DialogHeader>
          <ReviewForm setDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}

    

    
