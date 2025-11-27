
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader, User, Phone, Mail, Map, MapPin, LocateFixed, Package, ArrowRight, Store, ShoppingCart, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { captureLead } from '@/lib/actions';
import { type LeadCaptureFormState } from '@/lib/definitions';
import { useEffect, useRef, useState, Suspense } from 'react';
import coverageData from '@/lib/coverage-area.json';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      Klaim Promo & Daftar Sekarang
    </Button>
  );
}

function PromoForm() {
  const initialState: LeadCaptureFormState = null;
  const [state, dispatch] = useActionState(captureLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

  const coverageAreas = Object.keys(coverageData).sort();

  useEffect(() => {
    if (state?.message && !state.fields) {
      toast({
        title: state.message.startsWith('Terima kasih') ? 'Pendaftaran Terkirim!' : 'Terjadi Kesalahan',
        description: state.message,
        variant: state.message.startsWith('Terima kasih') ? 'default' : 'destructive',
      });
      if(state.message.startsWith('Terima kasih')) {
        formRef.current?.reset();
        setSelectedArea("");
        setLocation(null);
        setLocationError(null);
      }
    }
  }, [state, toast]);
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLocating(false);
          toast({
            title: 'Lokasi Ditemukan!',
            description: 'Koordinat GPS Anda telah berhasil dicatat.',
          });
        },
        (error) => {
          let errorMessage = "Terjadi kesalahan saat mengambil lokasi.";
          switch (error.code) {
            case error.PERMISSION_DENIED: errorMessage = "Anda menolak izin untuk mengakses lokasi."; break;
            case error.POSITION_UNAVAILABLE: errorMessage = "Informasi lokasi tidak tersedia."; break;
            case error.TIMEOUT: errorMessage = "Waktu permintaan lokasi habis."; break;
          }
          setLocationError(errorMessage);
          setIsLocating(false);
        }
      );
    } else {
      setLocationError("Geolokasi tidak didukung oleh browser ini.");
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl py-12 px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          
          {/* Left Side - Offer Details */}
          <div className="space-y-8 lg:sticky lg:top-8">
            <div className='space-y-3'>
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">Promo Spesial UMKM Malang</h1>
                <p className="text-xl text-muted-foreground">
                    Tingkatkan bisnis Anda dengan internet super cepat plus <strong className="text-foreground">GRATIS Aplikasi Kasir Premium</strong>. Penawaran terbatas!
                </p>
            </div>
            
            <Card className="border-purple-500/50 bg-purple-500/5">
                <CardHeader>
                    <CardTitle>Paket Promo JET 20 Mbps</CardTitle>
                    <CardDescription>Bayar 12 Bulan, Gratis 3 Bulan (Total 15 Bulan)</CardDescription>
                </CardHeader>
                 <CardContent>
                    <p className='text-muted-foreground'>
                       Dapatkan koneksi internet simetris 20 Mbps yang andal, cocok untuk menunjang operasional bisnis Anda.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3 text-green-700'>
                        <Gem className="h-6 w-6"/>
                        Bonus Eksklusif Untuk Bisnis Anda
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="font-bold text-lg text-foreground">GRATIS Aplikasi Kasir Chika POS Premium (3 Bulan)</p>
                    <p className='text-muted-foreground'>
                        Kelola usaha jadi lebih mudah dengan fitur kasir canggih dan <strong className='text-foreground'>Katalog Digital</strong> untuk memamerkan produk Anda secara online. Senilai <span className='font-bold'>Rp 297.000!</span>
                    </p>
                </CardContent>
            </Card>

          </div>

          {/* Right Side - Form */}
          <Card id="form-card" className="w-full max-w-lg justify-self-center lg:justify-self-end shadow-2xl animate-fade-in-up lg:sticky lg:top-8">
            <CardHeader className="text-center">
              <Store className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="text-2xl">Lengkapi Pendaftaran Anda</CardTitle>
              <CardDescription>
                Isi formulir untuk mengamankan promo ini. Saya akan segera menghubungi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} action={dispatch} className="space-y-4">
                
                <input type="hidden" name="selectedPlan" value="jet-20mbps-12get3-umkm" />

                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap (sesuai KTP)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" placeholder="Nama Anda" required className="pl-10" />
                  </div>
                  {state?.fields?.name && <p className="text-sm text-destructive">{state.fields.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WhatsApp Aktif</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" name="phone" type="tel" placeholder="cth. 081234567890" required className="pl-10" />
                  </div>
                  {state?.fields?.phone && <p className="text-sm text-destructive">{state.fields.phone}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="email@bisnisanda.com" required className="pl-10" />
                  </div>
                  {state?.fields?.email && <p className="text-sm text-destructive">{state.fields.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area/Kelurahan</Label>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select name="area" required value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih area/kelurahan Anda" />
                      </SelectTrigger>
                      <SelectContent>
                        {coverageAreas.map(area => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {state?.fields?.area && <p className="text-sm text-destructive">{state.fields.area}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Instalasi Lengkap</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="address" name="address" placeholder="Nama jalan, nomor rumah, RT/RW" required className="pl-10" />
                  </div>
                  {state?.fields?.address && <p className="text-sm text-destructive">{state.fields.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Pin Lokasi (Wajib)</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} className="w-full">
                      {isLocating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                      Ambil Lokasi GPS Saya
                    </Button>
                  </div>
                  {location && <p className="text-sm text-green-600 font-medium">✓ Koordinat berhasil disimpan.</p>}
                  {locationError && <p className="text-sm text-destructive">{locationError}</p>}
                  {state?.fields?.locationPin && <p className="text-sm text-destructive">{state.fields.locationPin}</p>}
                </div>

                <input type="hidden" name="locationPin" value={location ? `${location.lat},${location.lon}`: ''} required />
                
                {state?.issues && state.issues.map(issue => <p key={issue} className="text-sm text-destructive">{issue}</p>)}
                
                <SubmitButton />
                <p className="text-xs text-center text-muted-foreground">Dengan mengklik, Anda setuju data Anda diproses untuk keperluan pendaftaran. Promo ini terbatas dan mungkin berubah sewaktu-waktu.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PromoPage() {
  return (
    <Suspense fallback={<div>Memuat penawaran...</div>}>
      <PromoForm />
    </Suspense>
  )
}
