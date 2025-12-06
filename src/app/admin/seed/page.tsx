'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedOffers, seedOffersTV, seedAddOns, seedCarouselSlides, seedMyGamerPackages } from '@/lib/seed';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

type SeedOperation = 'offers' | 'offersTV' | 'addOns' | 'carousel' | 'myGamer';

export default function SeedPage() {
  const [loading, setLoading] = useState<SeedOperation | null>(null);
  const { toast } = useToast();

  const handleSeed = async (operation: SeedOperation) => {
    setLoading(operation);
    try {
        let count = 0;
        switch (operation) {
            case 'offers':
                count = await seedOffers();
                break;
            case 'offersTV':
                count = await seedOffersTV();
                break;
            case 'addOns':
                count = await seedAddOns();
                break;
            case 'carousel':
                count = await seedCarouselSlides();
                break;
            case 'myGamer':
                count = await seedMyGamerPackages();
                break;
        }
      toast({
        title: 'Sukses!',
        description: `Berhasil memasukkan ${count} dokumen ke koleksi ${operation}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal melakukan seeding!',
        description: error.message || 'Terjadi kesalahan yang tidak diketahui.',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 sm:py-16">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Database Seeding
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Gunakan halaman ini untuk mengisi koleksi Firestore Anda dengan data awal (mock data).
        </p>
         <Button asChild variant="link" className="p-0 mt-2">
            <Link href="/admin">Kembali ke dasbor</Link>
        </Button>
      </div>

       <Alert className="mb-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Penting!</AlertTitle>
            <AlertDescription>
                Operasi ini akan <span className="font-bold">menimpa</span> data yang ada di dalam koleksi. Gunakan dengan hati-hati.
            </AlertDescription>
        </Alert>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seed Penawaran Internet</CardTitle>
            <CardDescription>
                Isi koleksi `offers` dengan paket internet saja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSeed('offers')}
              disabled={!!loading}
              className="w-full"
            >
              {loading === 'offers' ? <Loader className="animate-spin" /> : 'Seed Penawaran Internet'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seed Penawaran Internet + TV</CardTitle>
            <CardDescription>
                Isi koleksi `offersTV` dengan paket combo internet dan TV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSeed('offersTV')}
              disabled={!!loading}
              className="w-full"
            >
              {loading === 'offersTV' ? <Loader className="animate-spin" /> : 'Seed Penawaran TV'}
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Seed Paket MyGamer</CardTitle>
            <CardDescription>
                Isi koleksi `myGamerPackages` dengan paket khusus gamer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSeed('myGamer')}
              disabled={!!loading}
              className="w-full"
            >
              {loading === 'myGamer' ? <Loader className="animate-spin" /> : 'Seed Paket MyGamer'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seed Add-Ons</CardTitle>
            <CardDescription>
                Isi koleksi `addOns` dengan semua produk tambahan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSeed('addOns')}
              disabled={!!loading}
              className="w-full"
            >
              {loading === 'addOns' ? <Loader className="animate-spin" /> : 'Seed Add-Ons'}
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Seed Slide Carousel</CardTitle>
            <CardDescription>
                Isi koleksi `carouselSlides` dengan data untuk hero carousel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSeed('carousel')}
              disabled={!!loading}
              className="w-full"
            >
              {loading === 'carousel' ? <Loader className="animate-spin" /> : 'Seed Carousel Slides'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
