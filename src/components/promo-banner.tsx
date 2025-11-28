
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlarmClock, ArrowRight, Tag } from 'lucide-react';
import { CountdownTimer } from './countdown-timer';

export function FlashSaleBanner() {
  const [promoEndTime, setPromoEndTime] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a fixed end date for the promotion for all users.
    // Example: End of the current month.
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    // You can replace this with any fixed future date.
    const targetDate = endOfMonth;

    if (targetDate > now) {
      setPromoEndTime(targetDate.toISOString());
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible || !promoEndTime) {
    return null;
  }

  return (
    <section className="w-full bg-primary/10 py-6 sm:py-8 border-b border-primary/20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Tag className="h-6 w-6 text-primary" />
              <h2 className="font-headline text-2xl font-bold tracking-tight text-primary">
                PROMO KILAT UNTUK BISNIS ANDA!
              </h2>
            </div>
            <p className="text-muted-foreground">
              Daftar sekarang dan dapatkan bonus eksklusif untuk UMKM! Promo ini hanya berlaku dalam waktu terbatas.
            </p>
            <ul className="space-y-2 text-sm list-inside list-disc text-foreground/80 pl-2">
              <li><span className="font-semibold">Promo Bayar di Muka:</span> Dapatkan gratis langganan hingga 6 bulan.</li>
              <li><span className="font-semibold">GRATIS Aplikasi Kasir POS Premium*</span> selama 3 bulan (inisiatif pribadi).</li>
              <li><span className="font-semibold">GRATIS Langganan Bulan Pertama*</span> (khusus UMKM, maks. Rp 150rb, inisiatif pribadi).</li>
            </ul>
             <Button asChild className="mt-4 animate-fade-in-up">
                <Link href="/promo">
                  Klaim Promo Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
          
          <Card className="bg-background/70 shadow-lg">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                 <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <AlarmClock className="h-4 w-4" />
                    <span>Penawaran Berakhir Dalam:</span>
                </div>
                <CountdownTimer targetDate={promoEndTime} />
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
