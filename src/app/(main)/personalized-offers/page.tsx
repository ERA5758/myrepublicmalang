
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Loader, Sparkles, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getPersonalizedOffer } from '@/lib/actions';
import { type PersonalizedOfferFormState } from '@/lib/definitions';
import Link from 'next/link';
import { useActionState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Dapatkan Rekomendasi Saya
    </Button>
  );
}

export default function PersonalizedOffersPage() {
  const initialState: PersonalizedOfferFormState = {};
  const [state, dispatch] = useActionState(getPersonalizedOffer, initialState);

  return (
    <div className="container mx-auto max-w-4xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Temukan Paket Sempurna Anda</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Biarkan asisten AI kami menemukan paket MyRepublic yang ideal untuk Anda. Cukup jawab dua pertanyaan sederhana untuk mendapatkan rekomendasi yang dipersonalisasi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Berbasis AI</CardTitle>
            <CardDescription>Beri tahu kami tentang kebutuhan Anda.</CardDescription>
          </CardHeader>
          <form action={dispatch}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Anda di Malang</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="cth., Jl. Veteran, Malang"
                  required
                />
                {state?.fields?.address && <p className="text-sm text-destructive">{state.fields.address}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="internetUsageHabits">Bagaimana Anda menggunakan internet?</Label>
                <Textarea
                  id="internetUsageHabits"
                  name="internetUsageHabits"
                  placeholder="cth., Bermain game berat, streaming film 4K, bekerja dari rumah dengan panggilan video, dll."
                  required
                />
                {state?.fields?.internetUsageHabits && <p className="text-sm text-destructive">{state.fields.internetUsageHabits}</p>}
              </div>
              {state?.message && !state.recommendation && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <div className="flex items-center justify-center">
        {state?.recommendation ? (
            <Card className="w-full bg-primary/10 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Wifi className="h-6 w-6 text-primary" />
                  Rekomendasi Kami Untuk Anda
                </CardTitle>
                <CardDescription>Berdasarkan masukan Anda, inilah paket terbaik untuk Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">{state.recommendation.recommendedPlanName}</h3>
                <p className="text-muted-foreground">{state.recommendation.recommendedPlanDescription}</p>
              </CardContent>
              <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/register">Daftar Sekarang</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="w-full flex flex-col items-center justify-center text-center p-8 bg-muted/50 h-full">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-headline text-lg font-semibold text-muted-foreground">Rekomendasi Anda akan muncul di sini</h3>
                <p className="text-sm text-muted-foreground">Isi formulir untuk memulai.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
