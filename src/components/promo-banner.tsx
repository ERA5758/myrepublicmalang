'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlarmClock, ArrowRight, Tag } from 'lucide-react';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold text-primary tracking-tighter">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

export function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const promoEndTimeStr = localStorage.getItem('promoEndTime');
    let endTime: number;

    if (promoEndTimeStr) {
      endTime = parseInt(promoEndTimeStr, 10);
    } else {
      endTime = Date.now() + 6 * 60 * 60 * 1000; // 6 hours from now
      localStorage.setItem('promoEndTime', String(endTime));
    }

    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();
      if (difference > 0) {
        setIsVisible(true);
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setIsVisible(false);
        // Optional: clear the item when the promo is over
        // localStorage.removeItem('promoEndTime');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) {
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
              <li><span className="font-semibold">GRATIS Aplikasi Kasir POS Premium</span> selama 3 bulan (khusus UMKM).</li>
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
                <div className="grid grid-cols-3 gap-4">
                    <TimeUnit value={timeLeft.hours} label="Jam" />
                    <TimeUnit value={timeLeft.minutes} label="Menit" />
                    <TimeUnit value={timeLeft.seconds} label="Detik" />
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
