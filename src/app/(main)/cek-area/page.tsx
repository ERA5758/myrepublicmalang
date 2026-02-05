
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import Link from 'next/link';

export default function CoverageCheckPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 sm:py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Cek Jangkauan Area Anda</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Jaringan fiber optik MyRepublic terus berkembang pesat di seluruh Indonesia. Untuk mendapatkan informasi ketersediaan layanan yang paling akurat dan terkini di lokasi Anda, cara terbaik adalah dengan menghubungi tim sales kami.
        </p>
      </div>
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Phone className="h-8 w-8 text-primary"/>
            </div>
            <CardTitle>Hubungi Kami untuk Cek Coverage</CardTitle>
            <CardDescription>
                Tim kami siap membantu memeriksa apakah alamat Anda sudah ter-cover oleh jaringan super cepat kami.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button asChild size="lg">
                <Link href="https://wa.me/6285184000800" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" />
                    Chat via WhatsApp
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Layanan 7 hari seminggu.</p>
        </CardContent>
      </Card>
    </div>
  );
}
