
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader, User, Phone, Mail, Map, MapPin, LocateFixed, Package, ArrowRight, Store, ShoppingCart, Gem, CircleCheckBig, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { captureLead } from '@/lib/actions';
import { type LeadCaptureFormState, type Offer, type OfferTV } from '@/lib/definitions';
import { useEffect, useRef, useState, Suspense } from 'react';
import coverageData from '@/lib/coverage-area.json';
import { useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountdownTimer } from '@/components/countdown-timer';


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
  const [selectedPlanValue, setSelectedPlanValue] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersTV, setOffersTV] = useState<OfferTV[]>([]);
  const firestore = useFirestore();
  const [promoEndTime, setPromoEndTime] = useState<string | null>(null);


  const coverageAreas = Object.keys(coverageData).sort();

  useEffect(() => {
    // Logic for the 6-hour timer, consistent with the flash banner
    const promoEndTimeStr = localStorage.getItem('promoEndTime');
    let endTime: number;

    if (promoEndTimeStr) {
      endTime = parseInt(promoEndTimeStr, 10);
    } else {
      endTime = Date.now() + 6 * 60 * 60 * 1000; // 6 hours from now
      localStorage.setItem('promoEndTime', String(endTime));
    }
    
    if (new Date(endTime) > new Date()) {
        setPromoEndTime(new Date(endTime).toISOString());
    }


    async function fetchPackages() {
        if (!firestore) return;
        const offersCollection = collection(firestore, 'offers');
        const offersTVCollection = collection(firestore, 'offersTV');

        const offersQuery = query(offersCollection, orderBy('price'));
        const offersTVSnapshot = await getDocs(offersTVCollection);
        const offersSnapshot = await getDocs(offersQuery);

        const fetchedOffers: Offer[] = [];
        offersSnapshot.forEach(doc => {
            fetchedOffers.push({ id: doc.id, ...doc.data() } as Offer);
        });
        setOffers(fetchedOffers);

        const fetchedOffersTV: OfferTV[] = [];
        offersTVSnapshot.forEach(doc => {
          fetchedOffersTV.push({ id: doc.id, ...doc.data() } as OfferTV);
        });
        setOffersTV(fetchedOffersTV);
        
        // Pre-select UMKM promo if available
        if (fetchedOffers.some(o => o.id === 'jet-20mbps-12get3-umkm')) {
            setSelectedPlanValue('jet-20mbps-12get3-umkm');
        }
    }
    fetchPackages();
  }, [firestore]);

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
                    Tingkatkan bisnis Anda dengan internet super cepat plus <strong className="text-foreground">GRATIS Aplikasi Kasir Premium</strong> untuk setiap pembayaran di muka.
                </p>
            </div>
            
            {promoEndTime && (
                <Card>
                    <CardHeader>
                        <CardTitle className='text-center text-lg'>PROMO BERAKHIR DALAM</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CountdownTimer targetDate={promoEndTime} />
                    </CardContent>
                </Card>
            )}


            <Card className="border-purple-500/50 bg-purple-500/5">
                <CardHeader>
                    <CardTitle>Promo Bayar di Muka</CardTitle>
                    <CardDescription>Pilih skema pembayaran di muka untuk paket apapun dan nikmati gratis langganan berbulan-bulan.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        <li><span className="font-semibold text-foreground">Bayar 5 Bulan, Gratis 1 Bulan</span> (Khusus paket 30 Mbps ke atas)</li>
                        <li><span className="font-semibold text-foreground">Bayar 9 Bulan, Gratis 3 Bulan</span> (Khusus paket 30 Mbps ke atas)</li>
                        <li><span className="font-semibold text-foreground">Bayar 12 Bulan, Gratis 6 Bulan</span> (Khusus paket 30 Mbps ke atas)</li>
                        <li><span className="font-semibold text-foreground">Bayar 12 Bulan, Gratis 3 Bulan</span> (Khusus paket 20 Mbps)</li>
                    </ul>
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
                        Kelola usaha jadi lebih mudah dengan fitur kasir canggih dan <strong className='text-foreground'>Katalog Digital</strong> untuk memamerkan produk Anda secara online. Senilai <span className='font-bold'>Rp 450.000!</span>
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="font-headline text-2xl font-bold">Pilih Paket Terbaik Anda</h2>
               <Tabs defaultValue="internet-only" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="internet-only">Internet Saja</TabsTrigger>
                  <TabsTrigger value="internet-tv">Internet + TV</TabsTrigger>
                </TabsList>
                <TabsContent value="internet-only" className="mt-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                      {offers.map((offer) => (
                      <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                          <CardHeader className="relative text-center p-6 text-white flex flex-col space-y-1.5">
                          {offer.image && (
                              <>
                              <Image
                                  src={offer.image.imageUrl}
                                  alt={offer.image.description}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={offer.image.imageHint}
                              />
                              <div className="absolute inset-0 bg-black/50"></div>
                              </>
                          )}
                          <div className="relative z-10">
                              <CardTitle className="font-headline text-2xl">{offer.title}</CardTitle>
                              <p className="text-sm text-white/80">{offer.speed}</p>
                              <p className="font-bold text-3xl mt-2">{offer.price.split('/')[0]}/<span className="text-lg">bln</span></p>
                              <p className="text-xs text-white/70">Harga belum termasuk PPN 11%</p>
                          </div>
                          </CardHeader>
                          <CardContent className="flex flex-1 flex-col justify-between p-6">
                          <div>
                              {offer.promo && <p className="text-sm font-bold text-destructive mb-4 text-center">{offer.promo}</p>}
                              <ul className="space-y-2 text-sm text-muted-foreground">
                              {offer.features.map((feature) => (
                                  <li key={feature} className="flex items-center">
                                  <CircleCheckBig className="mr-2 h-4 w-4 text-green-500" />
                                  <span>{feature}</span>
                                  </li>
                              ))}
                              </ul>
                          </div>
                          <div className="mt-6">
                              <Button className="w-full" variant="outline" onClick={() => {
                                  setSelectedPlanValue(offer.id);
                                  document.getElementById('form-card')?.scrollIntoView({ behavior: 'smooth' });
                              }}>
                                  Pilih Paket Ini
                              </Button>
                          </div>
                          </CardContent>
                      </Card>
                      ))}
                  </div>
                </TabsContent>
                 <TabsContent value="internet-tv" className="mt-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                      {offersTV.map((offer) => (
                      <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                          <CardHeader className="relative text-center p-6 text-white flex flex-col space-y-1.5">
                          {offer.image && (
                              <>
                              <Image
                                  src={offer.image.imageUrl}
                                  alt={offer.image.description}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={offer.image.imageHint}
                              />
                              <div className="absolute inset-0 bg-black/50"></div>
                              </>
                          )}
                          <div className="relative z-10">
                              <CardTitle className="font-headline text-2xl">{offer.title}</CardTitle>
                              <p className="text-sm text-white/80">{offer.speed}</p>
                              <p className="font-bold text-3xl mt-2">{offer.price.split('/')[0]}/<span className="text-lg">bln</span></p>
                              <p className="text-xs text-white/70">Harga belum termasuk PPN 11%</p>
                          </div>
                          </CardHeader>
                          <CardContent className="flex flex-1 flex-col justify-between p-6">
                          <div>
                              <div className="text-center mb-4">
                                <h4 className="font-semibold">Channel TV</h4>
                                <p className="text-muted-foreground text-sm flex items-center justify-center gap-2"><Tv className="h-4 w-4" /> {offer.channels}</p>
                                <p className="text-muted-foreground text-xs">{offer.stb}</p>
                              </div>
                              {offer.promo && <p className="text-sm font-bold text-destructive mb-4 text-center">{offer.promo}</p>}
                              <h4 className="font-semibold mb-2">Fitur dan Benefit</h4>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {offer.features.map((feature) => (
                                  <li key={feature} className="flex items-center">
                                    <CircleCheckBig className="mr-2 h-4 w-4 text-green-500" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                          </div>
                          <div className="mt-6">
                              <Button className="w-full" variant="outline" onClick={() => {
                                  setSelectedPlanValue(offer.id);
                                  document.getElementById('form-card')?.scrollIntoView({ behavior: 'smooth' });
                              }}>
                                  Pilih Paket Ini
                              </Button>
                          </div>
                          </CardContent>
                      </Card>
                      ))}
                  </div>
                 </TabsContent>
              </Tabs>
            </div>
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
                
                <div className="space-y-2">
                  <Label htmlFor="selectedPlan">Paket yang Dipilih</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select name="selectedPlan" required value={selectedPlanValue} onValueChange={setSelectedPlanValue}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih paket terbaik untuk Anda" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectGroup>
                          <SelectLabel>Internet Saja</SelectLabel>
                          {offers.map(offer => (
                            <SelectItem key={offer.id} value={offer.id}>
                              {offer.title} - {offer.speed} ({offer.price})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                         <SelectGroup>
                          <SelectLabel>Internet + TV</SelectLabel>
                           {offersTV.map(offer => (
                            <SelectItem key={offer.id} value={offer.id}>
                              {offer.title} - {offer.speed} ({offer.price})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {state?.fields?.selectedPlan && <p className="text-sm text-destructive">{state.fields.selectedPlan}</p>}
                </div>

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
