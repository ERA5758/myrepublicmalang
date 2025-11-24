import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Wifi, Zap, Shield, Infinity } from 'lucide-react';
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
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Offer } from '@/lib/definitions';


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
    // Assuming offers have a 'price' field that can be sorted numerically, or an 'order' field.
    // Let's sort by price for now. You might want to add an 'order' field for custom sorting.
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

      {/* Features Section */}
      <section id="features" className="w-full bg-background py-16 sm:py-24">
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


      {/* Offers Section */}
      <section id="offers" className="w-full bg-secondary/50 py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Penawaran Eksklusif untuk Malang
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Pilih paket sempurna yang sesuai dengan gaya hidup dan anggaran Anda. Harga spesial untuk pelanggan baru!
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                {offer.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={offer.image.imageUrl}
                      alt={offer.title}
                      fill
                      className="object-cover"
                      data-ai-hint={offer.image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-headline text-2xl">{offer.title}</CardTitle>
                    <Badge variant="default" className="bg-accent text-accent-foreground">{offer.speed}</Badge>
                  </div>
                  <p className="font-semibold text-primary text-2xl">{offer.price}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    {offer.promo && <p className="text-sm font-bold text-destructive mb-3">{offer.promo}</p>}
                    <ul className="space-y-2 text-sm">
                      {offer.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-6 w-full" asChild>
                    <Link href={`/register?plan=${offer.id}`}>Pilih Paket</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full bg-background py-16 sm:py-24">
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
