
import { CoverageMap } from '@/components/coverage-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CoverageCheckPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Cek Jangkauan Kami</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Lihat daftar lengkap area yang dijangkau di halaman <Link href="/cek-area" className="text-primary hover:underline">Cek Area</Link> kami. Peta di bawah ini adalah untuk tujuan demonstrasi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peta Demonstrasi Area Layanan Malang</CardTitle>
          <CardDescription>Peta ini menunjukkan contoh area layanan kami. Untuk daftar area yang paling akurat dan terkini, silakan kunjungi halaman Cek Area kami.</CardDescription>
        </CardHeader>
        <CardContent>
          <CoverageMap />
        </CardContent>
      </Card>
    </div>
  );
}
