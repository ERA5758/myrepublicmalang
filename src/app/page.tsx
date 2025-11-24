import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Wifi, Zap, Shield, Infinity, ClipboardList, Wrench, CreditCard } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { faqs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Offer } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const features = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Kecepatan Simetris',
        description: 'Kecepatan upload dan download sama cepatnya, ideal untuk streaming, game, dan video call.',
    },
    {
        icon: <Infinity className="h-8 w-8 text-primary" />,
        title: 'Unlimited Kuota',
        description: 'Nikmati internet tanpa batas kuota. Tidak ada lagi kekhawatiran tentang kehabisan data di tengah bulan.',
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: 'Tahan Cuaca',
        description: 'Dengan 100% jaringan fiber optic, koneksi Anda tetap stabil dan andal bahkan saat cuaca buruk sekalipun.',
    },
];

async function getOffers(): Promise<Offer[]> {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        return [];
    }
    const offersCollection = collection(firestore, 'offers');
    const q = query(offersCollection, orderBy('price'));
    const querySnapshot = await getDocs(q);
    const offers: Offer[] = [];
    querySnapshot.forEach((doc) => {
        offers.push({ id: doc.id, ...doc.data() } as Offer);
    });
    return offers;
}


export default async function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const offers = await getOffers();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
         <div className="container relative z-10 mx-auto max-w-7xl px-4 py-24 text-center md:py-32 lg:py-40">
           <Badge variant="secondary" className="mb-4 shadow-md">
             <Wifi className="mr-2 h-4 w-4 text-primary" />
             Internet Fiber Tercepat di Malang
           </Badge>
           <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
             Rasakan <span className="text-primary">Masa Depan Internet</span>
           </h1>
           <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
             Kecepatan super cepat, data tanpa batas, dan keandalan tak tertandingi. Bergabunglah dengan jaringan MyRepublic dan tingkatkan kehidupan digital Anda. GRATIS INSTALASI!
           </p>
           <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
             <Button size="lg" asChild>
               <Link href="/register">
                 Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
               </Link>
             </Button>
             <Button size="lg" variant="outline" asChild>
               <Link href="/coverage-areas">Cek Jangkauan</Link>
             </Button>
           </div>
         </div>
          {heroImage && (
             <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/20"></div>
                <div className="absolute inset-0 bg-background/50"></div>
             </div>
        )}
      </section>

      {/* How to Subscribe Section */}
      <section id="how-to-subscribe" className="w-full bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Cara Berlangganan</h2>
             <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Tiga langkah mudah untuk menikmati internet cepat dari MyRepublic.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <ClipboardList className="h-8 w-8 text-primary"/>
                 </div>
                <CardTitle>1. Registrasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Cek area lokasi pemasangan, pilih paket, dan pilih jadwal pemasangan.</p>
                <Button asChild variant="outline">
                  <Link href="/register">Registrasi Sekarang</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Wrench className="h-8 w-8 text-primary"/>
                 </div>
                <CardTitle>2. Instalasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Lacak proses instalasi kemudian nikmati layanan MyRepublic!</p>
                <Button asChild variant="outline">
                   <Link href="#">Lacak Proses</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <CreditCard className="h-8 w-8 text-primary"/>
                 </div>
                <CardTitle>3. Bayar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Bayar tagihan dan nikmati kecepatan layanan MyRepublic.</p>
                <Button asChild variant="outline">
                   <Link href="#">Lihat Cara Bayar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-secondary/50 py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Mengapa Memilih MyRepublic?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Kami memberikan Anda koneksi internet terbaik dengan berbagai keunggulan.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
             {features.map((feature) => (
                <div key={feature.title} className="text-center">
                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                   </div>
                   <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                   <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
             ))}
          </div>
        </div>
      </section>


      {/* New Offers Section */}
      <section id="offers-new" className="w-full bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Penawaran Eksklusif untuk Warga Malang
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Pilih paket sempurna yang sesuai dengan gaya hidup dan anggaran Anda.
            </p>
          </div>
          <Tabs defaultValue="internet-only" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-fit md:mx-auto">
              <TabsTrigger value="internet-tv">Internet + TV</TabsTrigger>
              <TabsTrigger value="internet-only">Internet</TabsTrigger>
              <TabsTrigger value="gamer">MyGamer</TabsTrigger>
              <TabsTrigger value="addons">Add On</TabsTrigger>
            </TabsList>
            <TabsContent value="internet-only" className="mt-10">
               <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer) => (
                  <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <CardHeader className="text-center bg-muted/30 p-6">
                      <CardTitle className="font-headline text-2xl">{offer.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{offer.speed}</p>
                      <p className="font-bold text-primary text-3xl mt-2">{offer.price.split('/')[0]}/<span className="text-lg">bln</span></p>
                      <p className="text-xs text-muted-foreground">Harga belum termasuk PPN 11%</p>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        {offer.promo && <p className="text-sm font-bold text-destructive mb-4 text-center">{offer.promo}</p>}
                        <h4 className="font-semibold mb-2">Fitur dan Benefit</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {offer.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 space-y-2">
                        <Button className="w-full" asChild>
                          <Link href={`/register?plan=${offer.id}`}>Langganan Sekarang</Link>
                        </Button>
                         <Button className="w-full" variant="outline" asChild>
                          <Link href="https://wa.me/6285184000880" target="_blank">Chat Sales</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
             <TabsContent value="internet-tv" className="text-center py-16">
              <p className="text-muted-foreground">Konten untuk Internet + TV akan segera hadir.</p>
            </TabsContent>
            <TabsContent value="gamer" className="text-center py-16">
               <p className="text-muted-foreground">Konten untuk MyGamer akan segera hadir.</p>
            </TabsContent>
            <TabsContent value="addons" className="text-center py-16">
               <p className="text-muted-foreground">Konten untuk Add On akan segera hadir.</p>
            </TabsContent>
          </Tabs>
           <div className="text-center mt-8">
              <p className="text-xs text-muted-foreground">*Syarat dan Ketentuan berlaku.</p>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full bg-secondary/50 py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Punya pertanyaan? Kami punya jawabannya. Jika Anda tidak dapat menemukan apa yang Anda cari, jangan ragu untuk menghubungi kami.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
