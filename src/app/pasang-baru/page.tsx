
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowRight, Globe, Loader, Mail, MapPin, Phone, User, LocateFixed, Package, Map, Award, BadgeCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { captureLead } from '@/lib/actions';
import { type LeadCaptureFormState, type Offer, type OfferTV } from '@/lib/definitions';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import coverageData from '@/lib/coverage-area.json';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Zap className="mr-2 h-4 w-4" />
      )}
      Daftar & Dapatkan Promonya!
    </Button>
  );
}

function PasangBaruForm() {
  const initialState: LeadCaptureFormState = null;
  const [state, dispatch] = useActionState(captureLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get('plan');
  
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPlanValue, setSelectedPlanValue] = useState(preselectedPlan || "");
  const [selectedArea, setSelectedArea] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersTV, setOffersTV] = useState<OfferTV[]>([]);
  const firestore = useFirestore();

  const coverageAreas = Object.keys(coverageData).sort();

  useEffect(() => {
    async function fetchPackages() {
        if (!firestore) return;
        
        const offersCollection = collection(firestore, 'offers');
        const offersQuery = query(offersCollection, orderBy('price'));
        const offersSnapshot = await getDocs(offersQuery);
        const fetchedOffers: Offer[] = [];
        offersSnapshot.forEach(doc => {
            fetchedOffers.push({ id: doc.id, ...doc.data() } as Offer);
        });
        setOffers(fetchedOffers);
        
        const offersTVCollection = collection(firestore, 'offersTV');
        const offersTVQuery = query(offersTVCollection, orderBy('price'));
        const offersTVSnapshot = await getDocs(offersTVQuery);
        const fetchedOffersTV: OfferTV[] = [];
        offersTVSnapshot.forEach(doc => {
            fetchedOffersTV.push({ id: doc.id, ...doc.data() } as OfferTV);
        });
        setOffersTV(fetchedOffersTV);
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
        setSelectedPlanValue("");
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
            case error.PERMISSION_DENIED:
              errorMessage = "Anda menolak izin untuk mengakses lokasi.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Informasi lokasi tidak tersedia.";
              break;
            case error.TIMEOUT:
              errorMessage = "Waktu permintaan lokasi habis.";
              break;
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
    <div className="container mx-auto max-w-6xl py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">Promo Spesial MyRepublic Malang!</h1>
          <p className="text-xl text-muted-foreground">
            Khusus untuk Anda yang melihat iklan ini, pasang internet fiber super cepat sekarang dan dapatkan <strong className="text-foreground">GRATIS BIAYA INSTALASI</strong> senilai Rp500.000!
          </p>
           <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-headline text-2xl font-semibold text-center lg:text-left">Kenapa Pilih MyRepublic?</h2>
            <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span>Internet <strong>100% UNLIMITED</strong> tanpa FUP.</span>
                </li>
                <li className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span>Kecepatan simetris 1:1, upload secepat download.</span>
                </li>
                <li className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span>Jaringan <strong>full fiber optic</strong> stabil & tahan cuaca.</span>
                </li>
                 <li className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span>Layanan pelanggan prioritas langsung dari saya, sales executive Anda.</span>
                </li>
            </ul>
          </div>
           <div className="text-center lg:text-left">
             <p className="text-sm text-muted-foreground">Saya, <span className="font-bold text-foreground">Mira Velicia (Sales Executive)</span>, akan membantu proses pendaftaran Anda sampai tuntas.</p>
           </div>
        </div>
        <Card className="w-full max-w-lg justify-self-center lg:justify-self-end shadow-2xl animate-fade-in-up">
          <CardHeader className="text-center">
            <Award className="mx-auto h-12 w-12 text-yellow-500" />
            <CardTitle className="text-2xl">Klaim Promo Anda Sekarang!</CardTitle>
            <CardDescription>
              Isi formulir di bawah ini. Saya akan segera menghubungi Anda untuk konfirmasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="Nama sesuai KTP" required className="pl-10" />
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
                  <Input id="email" name="email" type="email" placeholder="email@anda.com" required className="pl-10" />
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
                <Label htmlFor="selectedPlan">Paket yang Dipilih</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select name="selectedPlan" required value={selectedPlanValue} onValueChange={setSelectedPlanValue}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Pilih paket terbaik untuk Anda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Internet Saja (Paling Laris)</SelectLabel>
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
                <Label>Pin Lokasi (Wajib untuk verifikasi jangkauan)</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} className="w-full">
                    {isLocating ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="mr-2 h-4 w-4" />
                    )}
                    Ambil Lokasi GPS Saya
                  </Button>
                </div>
                {location && (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Koordinat berhasil disimpan: {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
                  </p>
                )}
                {locationError && <p className="text-sm text-destructive">{locationError}</p>}
                {state?.fields?.locationPin && <p className="text-sm text-destructive">{state.fields.locationPin}</p>}
              </div>

              <input type="hidden" name="locationPin" value={location ? `${location.lat},${location.lon}`: ''} required />
              
              {state?.issues && state.issues.map(issue => <p key={issue} className="text-sm text-destructive">{issue}</p>)}
              
              <SubmitButton />
              <p className="text-xs text-center text-muted-foreground">Dengan mengklik, Anda setuju data Anda diproses untuk keperluan pendaftaran. Saya akan menghubungi Anda melalui nomor yang tertera.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PasangBaruPage() {
  return (
    <Suspense fallback={<div>Memuat formulir...</div>}>
      <PasangBaruForm />
    </Suspense>
  )
}
