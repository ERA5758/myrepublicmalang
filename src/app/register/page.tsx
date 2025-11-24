
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowRight, Globe, Loader, Mail, MapPin, Phone, User, LocateFixed, Package, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { captureLead } from '@/lib/actions';
import { type LeadCaptureFormState, type Offer, type OfferTV } from '@/lib/definitions';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/data';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import coverageData from '@/lib/coverage-area.json';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="mr-2 h-4 w-4" />
      )}
      Kirim Pendaftaran
    </Button>
  );
}

function RegisterForm() {
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
        
        // Fetch Internet Only offers
        const offersCollection = collection(firestore, 'offers');
        const offersQuery = query(offersCollection, orderBy('price'));
        const offersSnapshot = await getDocs(offersQuery);
        const fetchedOffers: Offer[] = [];
        offersSnapshot.forEach(doc => {
            fetchedOffers.push({ id: doc.id, ...doc.data() } as Offer);
        });
        setOffers(fetchedOffers);
        
        // Fetch Internet + TV offers
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
        title: state.message.startsWith('Terima kasih') ? 'Sukses!' : 'Uh oh!',
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
            description: 'Koordinat GPS Anda telah dicatat.',
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Anda menolak permintaan untuk Geolokasi.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Informasi lokasi tidak tersedia.");
              break;
            case error.TIMEOUT:
              setLocationError("Permintaan untuk mendapatkan lokasi pengguna timed out.");
              break;
            default:
              setLocationError("Terjadi kesalahan yang tidak diketahui.");
              break;
          }
          setIsLocating(false);
        }
      );
    } else {
      setLocationError("Geolokasi tidak didukung oleh browser ini.");
    }
  };


  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Bergabunglah dengan Revolusi</h1>
          <p className="text-xl text-muted-foreground">
            Anda selangkah lagi untuk merasakan internet tercepat di Malang. Isi formulir untuk memulai, dan kami akan menangani sisanya.
          </p>
           <div className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold">Belum Yakin?</h2>
            <p className="text-muted-foreground">
              Lihat daftar lengkap <Link href="/cek-area" className="text-primary hover:underline">area jangkauan</Link> kami atau lihat pertanyaan yang sering diajukan di bawah ini.
            </p>
             <Accordion type="single" collapsible className="w-full">
              {faqs.slice(0,3).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <Card className="w-full max-w-lg justify-self-center lg:justify-self-end">
          <CardHeader>
            <CardTitle>Daftarkan Minat Anda</CardTitle>
            <CardDescription>
              Kirim detail Anda, dan tim kami akan menghubungi Anda untuk instalasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="cth. Budi Santoso" required className="pl-10" />
                </div>
                {state?.fields?.name && <p className="text-sm text-destructive">{state.fields.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="anda@contoh.com" required className="pl-10" />
                </div>
                 {state?.fields?.email && <p className="text-sm text-destructive">{state.fields.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" name="phone" type="tel" placeholder="081234567890" required className="pl-10" />
                </div>
                {state?.fields?.phone && <p className="text-sm text-destructive">{state.fields.phone}</p>}
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
                  <Input id="address" name="address" placeholder="cth. Jl. Ijen No. 25, RT 01/RW 02" required className="pl-10" />
                </div>
                {state?.fields?.address && <p className="text-sm text-destructive">{state.fields.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="selectedPlan">Paket yang Dipilih</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select name="selectedPlan" required value={selectedPlanValue} onValueChange={setSelectedPlanValue}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Pilih paket Anda" />
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
                <Label>Pin Lokasi/Koordinat GPS</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} className="w-full">
                    {isLocating ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="mr-2 h-4 w-4" />
                    )}
                    Dapatkan Lokasi Saya
                  </Button>
                </div>
                {location && (
                  <p className="text-sm text-muted-foreground">
                    Koordinat: {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                  </p>
                )}
                {locationError && <p className="text-sm text-destructive">{locationError}</p>}
                {state?.fields?.locationPin && <p className="text-sm text-destructive">{state.fields.locationPin}</p>}
              </div>

              <input type="hidden" name="locationPin" value={location ? `${location.lat},${location.lon}`: ''} required />
              
              {state?.issues && state.issues.map(issue => <p key={issue} className="text-sm text-destructive">{issue}</p>)}
              
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
