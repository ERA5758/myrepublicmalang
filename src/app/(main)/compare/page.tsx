'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Sparkles, Server, DollarSign, Activity, ArrowRight, Wifi } from 'lucide-react';
import Link from 'next/link';
import type { InternetComparisonOutput } from '@/ai/flows/internet-comparison-flow';
import { compareInternet } from '@/ai/flows/internet-comparison-flow';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Bandingkan Sekarang
    </Button>
  );
}

export default function ComparePage() {
  const [comparisonResult, setComparisonResult] = useState<InternetComparisonOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setComparisonResult(null);
    setError(null);
    
    const rawData = {
      currentProvider: formData.get('currentProvider') as string,
      currentPrice: formData.get('currentPrice') as string,
      speedTestResult: formData.get('speedTestResult') as string,
    };

    if (!rawData.currentProvider || !rawData.currentPrice || !rawData.speedTestResult) {
        setError("Harap isi semua kolom sebelum membandingkan.");
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await compareInternet(rawData);
      setComparisonResult(result);
    } catch (e) {
      console.error(e);
      setError("Maaf, terjadi kesalahan saat membuat perbandingan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Bandingkan & Buktikan Keunggulannya</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Lihat mengapa beralih ke MyRepublic adalah pilihan cerdas. Masukkan detail internet Anda saat ini, lakukan speed test, dan biarkan AI kami menunjukkan perbedaannya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Input and Speed Test Section */}
        <div className="space-y-8">
            <Card>
            <CardHeader>
                <CardTitle>Langkah 1: Informasi Provider Anda</CardTitle>
                <CardDescription>Isi detail paket internet yang Anda gunakan saat ini.</CardDescription>
            </CardHeader>
             <form action={handleFormSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentProvider">Nama Provider Internet Saat Ini</Label>
                         <div className="relative">
                            <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="currentProvider" name="currentProvider" placeholder="cth. IndiHome, Biznet, First Media" required className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currentPrice">Biaya Bulanan (Rupiah)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="currentPrice" name="currentPrice" type="text" placeholder="cth. 350000" required className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="speedTestResult">Hasil Tes Kecepatan</Label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="speedTestResult" name="speedTestResult" placeholder='cth. Download 20 Mbps, Upload 5 Mbps, Ping 15ms' required className="pl-10" />
                        </div>
                        <p className="text-xs text-muted-foreground">Jalankan tes di bawah dan masukkan hasilnya di sini.</p>
                    </div>
                     {error && <p className="text-sm text-destructive">{error}</p>}
                    <SubmitButton />
                </CardContent>
            </form>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Langkah 2: Lakukan Tes Kecepatan</CardTitle>
                <CardDescription>
                    Klik "Start" untuk mengukur kecepatan koneksi Anda saat ini.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="relative w-full h-[550px] overflow-hidden rounded-lg border">
                    <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src="https://speed.cloudflare.com/"
                    className="absolute top-0 left-0"
                    ></iframe>
                </div>
                </CardContent>
            </Card>
        </div>

        {/* AI Result Section */}
        <div className="lg:sticky lg:top-8">
            {isSubmitting ? (
                <Card className="w-full flex flex-col items-center justify-center text-center p-8 bg-muted/50 h-[400px]">
                    <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
                    <h3 className="font-headline text-lg font-semibold text-primary">AI sedang menganalisis...</h3>
                    <p className="text-sm text-muted-foreground">Harap tunggu sejenak.</p>
                </Card>
            ) : comparisonResult ? (
                <Card className="w-full bg-primary/5 border-primary animate-fade-in-up">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                        <Sparkles className="h-6 w-6" />
                        {comparisonResult.comparisonTitle}
                        </CardTitle>
                        <CardDescription>Inilah analisis dari AI berdasarkan data yang Anda berikan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: comparisonResult.analysis }} />
                        
                        <Card className="bg-background">
                            <CardHeader>
                                <CardTitle className='text-lg flex items-center gap-2'>
                                    <Wifi className="h-5 w-5 text-primary" />
                                    Rekomendasi Paket Untuk Anda
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-bold text-primary">{comparisonResult.recommendedPlan.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{comparisonResult.recommendedPlan.reason}</p>
                            </CardContent>
                        </Card>

                    </CardContent>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/register">
                                Beralih ke MyRepublic Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full flex flex-col items-center justify-center text-center p-8 bg-muted/50 h-[400px]">
                    <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-headline text-lg font-semibold text-muted-foreground">Hasil Analisis AI Akan Muncul di Sini</h3>
                    <p className="text-sm text-muted-foreground">Isi formulir dan klik "Bandingkan Sekarang" untuk memulai.</p>
                </Card>
            )}
        </div>

      </div>
    </div>
  );
}
