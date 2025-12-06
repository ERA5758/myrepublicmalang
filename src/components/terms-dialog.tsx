
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

export function TermsAndConditionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary underline">
            *Syarat dan Ketentuan berlaku.
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Syarat dan Ketentuan</DialogTitle>
          <DialogDescription>
            Detail mengenai promosi dan penawaran yang berlaku.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
            <li>Promo berlaku untuk pelanggan baru.</li>
            <li>Promo berlaku untuk paket Internet Only dan Combo TV.</li>
            <li>Promo berlaku selama 12 bulan berlangganan.</li>
            <li>Promo gratis speed upgrade berlaku selama 3 bulan berlangganan.</li>
            <li>Harga sudah termasuk PPN 11%.</li>
            <li>
                Nikmati performa internet sesuai yang tertera hanya dengan koneksi kabel LAN. Lebih stabil, lebih cepat, tanpa gangguan.
            </li>
          </ul>
        </div>
        <DialogFooter>
            <DialogTrigger asChild>
                <Button variant="outline">Tutup</Button>
            </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
