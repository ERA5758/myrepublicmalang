

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CircleCheckBig, ClipboardList, CreditCard, Headphones, Infinity, Shield, Tv, Wrench, Zap, Gauge, CloudOff } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { faqs } from '@/lib/data';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Offer, OfferTV, AddOn, CarouselSlide, Article } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TermsAndConditionsDialog } from '@/components/terms-dialog';
import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { FlashSaleBanner } from '@/components/promo-banner';


const whyChooseUsFeatures = [
    {
        icon: <Infinity className="h-8 w-8 text-primary" />,
        title: 'Internet Bebas Tanpa Kuota',
        description: 'No FUP (Fair Usage Policy)',
    },
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: 'Gratis Biaya Instalasi',
        description: 'Hemat senilai Rp500.000',
    },
    {
        icon: <CloudOff className="h-8 w-8 text-primary" />,
        title: 'Koneksi Bebas Gangguan Cuaca',
        description: 'Full Fiber Optic',
    },
     {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Upload & Download Sama Cepat',
        description: 'Simetris 1:1',
    },
    {
        icon: <Gauge className="h-8 w-8 text-primary" />,
        title: 'Koneksi Stabil Anti Lag',
        description: 'Low Latency',
    },
    {
        icon: <Headphones className="h-8 w-8 text-primary" />,
        title: 'Layanan Pengaduan 24/7 Gratis',
        description: 'Customer Call (Web Call)',
    },
];

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersTV, setOffersTV] = useState<OfferTV[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const firestore = useFirestore();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    async function getData() {
      if (!firestore) return;
      
      // Fetch Offers (Internet Only)
      const offersCollection = collection(firestore, 'offers');
      const offersQuery = query(offersCollection, orderBy('price'));
      const offersSnapshot = await getDocs(offersQuery);
      const fetchedOffers: Offer[] = [];
      offersSnapshot.forEach((doc) => {
          fetchedOffers.push({ id: doc.id, ...doc.data() } as Offer);
      });
      setOffers(fetchedOffers);

      // Fetch Offers (Internet + TV)
      const offersTVCollection = collection(firestore, 'offersTV');
      const offersTVQuery = query(offersTVCollection, orderBy('price'));
      const offersTVSnapshot = await getDocs(offersTVQuery);
      const fetchedOffersTV: OfferTV[] = [];
      offersTVSnapshot.forEach((doc) => {
          fetchedOffersTV.push({ id: doc.id, ...doc.data() } as OfferTV);
      });
      setOffersTV(fetchedOffersTV);

      // Fetch AddOns
      const addOnsCollection = collection(firestore, 'addOns');
      const addOnsSnapshot = await getDocs(addOnsCollection);
      const fetchedAddOns: AddOn[] = [];
      addOnsSnapshot.forEach((doc) => {
        fetchedAddOns.push({ id: doc.id, ...doc.data() } as AddOn);
      });
      setAddOns(fetchedAddOns);

      // Fetch Carousel Slides
      const carouselCollection = collection(firestore, 'carouselSlides');
      const carouselSnapshot = await getDocs(carouselCollection);
      const fetchedSlides: CarouselSlide[] = [];
      carouselSnapshot.forEach((doc) => {
        fetchedSlides.push({ id: doc.id, ...doc.data() } as CarouselSlide);
      });
      setCarouselSlides(fetchedSlides);

      // Fetch Articles
        const articlesCollection = collection(firestore, 'articles');
        const q = query(articlesCollection, orderBy('publishedAt', 'desc'));
        const articlesSnapshot = await getDocs(q);
        const fetchedArticles: Article[] = [];
        articlesSnapshot.forEach(doc => {
            const data = doc.data();
            let publishedAt: string;
            if (data.publishedAt instanceof Timestamp) {
                publishedAt = data.publishedAt.toDate().toISOString();
            } else {
                publishedAt = new Date().toISOString();
            }
            fetchedArticles.push({
                id: doc.id,
                ...data,
                publishedAt,
            } as Article);
        });
        setArticles(fetchedArticles);
    }
    getData();
  }, [firestore]);


  const addOnPerangkat = addOns.filter(a => a.category === 'perangkat');
  const addOnTV = addOns.filter(a => a.category === 'tv');
  const addOnSmartHome = addOns.filter(a => a.category === 'smart-home');
  const addOnSpeedBooster = addOns.filter(a => a.category === 'speed-booster');

  return (
    <div className="flex flex-col">
      <FlashSaleBanner />
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <Carousel
          plugins={[autoplayPlugin.current]}
          className="w-full"
          onMouseEnter={autoplayPlugin.current.stop}
          onMouseLeave={autoplayPlugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {carouselSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                  <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
                    <Badge variant="secondary" className="mb-4 shadow-md animate-fade-in-down">
                      <Zap className="mr-2 h-4 w-4 text-primary" />
                      Internet Fiber Tercepat di Malang
                    </Badge>
                    <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-down animation-delay-200">
                      {slide.title}
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-lg text-white md:text-xl animate-fade-in-down animation-delay-400">
                      {slide.description}
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-600">
                      <Button size="lg" asChild>
                        <Link href="/register">
                          Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/cek-area">Cek Jangkauan</Link>
                      </Button>
                    </div>
                  </div>
                  {slide.image && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={slide.image.imageUrl}
                        alt={slide.image.description}
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint={slide.image.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent"></div>
                      <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex" />
        </Carousel>
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
            <Card className="text-center animate-fade-in-up">
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
            <Card className="text-center animate-fade-in-up animation-delay-200">
              <CardHeader>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Wrench className="h-8 w-8 text-primary"/>
                 </div>
                <CardTitle>2. Instalasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Lacak proses instalasi kemudian nikmati layanan MyRepublic!</p>
                <Button asChild variant="outline">
                   <Link href="https://wa.me/6285184000880" target="_blank">Lacak Proses</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center animate-fade-in-up animation-delay-400">
              <CardHeader>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <CreditCard className="h-8 w-8 text-primary"/>
                 </div>
                <CardTitle>3. Bayar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Bayar tagihan dan nikmati kecepatan layanan MyRepublic.</p>
                <Button asChild variant="outline">
                   <Link href="/payment-methods">Lihat Cara Bayar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="w-full bg-secondary/50 py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Kenapa Harus Pilih MyRepublic?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Kami memberikan Anda koneksi internet terbaik dengan berbagai keunggulan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
             {whyChooseUsFeatures.map((feature, index) => (
                <div key={feature.title} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                      {feature.icon}
                   </div>
                   <h3 className="font-headline text-lg font-bold">{feature.title}</h3>
                   <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
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
            <TabsList className="grid w-full grid-cols-3 md:w-fit md:mx-auto">
              <TabsTrigger value="internet-tv">Internet + TV</TabsTrigger>
              <TabsTrigger value="internet-only">Internet</TabsTrigger>
              <TabsTrigger value="addons">Add On</TabsTrigger>
            </TabsList>
            <TabsContent value="internet-only" className="mt-10">
               <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer, index) => (
                  <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
             <TabsContent value="internet-tv" className="mt-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {offersTV.map((offer, index) => (
                    <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
            <TabsContent value="addons" className="mt-10 space-y-12">
              <div>
                <h3 className="font-headline text-2xl font-bold mb-6 text-center">Add On Perangkat</h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {addOnPerangkat.map((addon) => (
                    <Card key={addon.id} className="flex flex-col text-center bg-muted/50">
                      <CardHeader>
                        <CardTitle className="font-headline text-xl">{addon.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="font-bold text-2xl">{addon.price}</p>
                        <p className="text-xs text-muted-foreground">Harga belum termasuk PPN 11%</p>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Button className="w-full" variant="outline" asChild>
                          <Link href="https://wa.me/6285184000880" target="_blank">Chat Sales</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold mb-6 text-center">Add On TV</h3>
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {addOnTV.map((addon) => (
                      <Card key={addon.id} className="flex flex-col text-center bg-muted/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{addon.title}</CardTitle>
                            {addon.notes && <p className="text-xs text-muted-foreground">{addon.notes}</p>}
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="font-bold text-2xl">{addon.price}</p>
                            <p className="text-xs text-muted-foreground">Harga belum termasuk PPN 11%</p>
                            {addon.features && (
                                <>
                                <h4 className="font-semibold mt-4 mb-2">Fitur dan Benefit</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    {addon.features.map(feature => <li key={feature}>{feature}</li>)}
                                </ul>
                                </>
                            )}
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button className="w-full" variant="outline" asChild>
                            <Link href="https://wa.me/6285184000880" target="_blank">Chat Sales</Link>
                            </Button>
                        </div>
                      </Card>
                    ))}
                 </div>
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold mb-6 text-center">Add On Smart Home</h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {addOnSmartHome.map((addon) => (
                      <Card key={addon.id} className="flex flex-col text-center bg-muted/50">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl">{addon.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <div className="flex justify-center items-baseline gap-2">
                            {addon.discount && <Badge variant="destructive">{addon.discount}</Badge>}
                            {addon.oldPrice && <p className="text-sm text-muted-foreground line-through">{addon.oldPrice}</p>}
                           </div>
                           <p className="font-bold text-2xl mt-1">{addon.price}</p>
                           <p className="text-xs text-muted-foreground">Harga belum termasuk PPN 11%</p>
                           <div className="text-left mt-4">
                            <p className="font-semibold text-sm">Fitur dan Benefit:</p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 mt-1">
                                {addon.features?.map(f => <li key={f}>{f}</li>)}
                            </ul>
                            <p className="font-semibold text-sm mt-2">Deskripsi:</p>
                            <p className="text-xs text-muted-foreground">{addon.description}</p>
                           </div>
                        </CardContent>
                         <div className="p-6 pt-0">
                            <Button className="w-full" variant="outline" asChild>
                            <Link href="https://wa.me/6285184000880" target="_blank">Chat Sales</Link>
                            </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
              <div>
                 <h3 className="font-headline text-2xl font-bold mb-6 text-center">Add On Speed Booster</h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {addOnSpeedBooster.map((addon) => (
                    <Card key={addon.id} className="flex flex-col text-center bg-muted/50">
                      <CardHeader>
                        <CardTitle className="font-headline text-xl">{addon.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                        {addon.notes && <p className="text-xs text-primary font-semibold">{addon.notes}</p>}
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="font-bold text-2xl">{addon.price}</p>
                        <p className="text-xs text-muted-foreground">Harga belum termasuk PPN 11%</p>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Button className="w-full" variant="outline" asChild>
                          <Link href="https://wa.me/6285184000880" target="_blank">Chat Sales</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
           <div className="text-center mt-8">
              <TermsAndConditionsDialog />
           </div>
        </div>
      </section>

      {/* Blog Section */}
      {articles.length > 0 && (
        <section id="blog" className="w-full bg-secondary/50 py-16 sm:py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                        Baca Blog Kami
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Dapatkan wawasan, tips, dan pembaruan terbaru dari dunia internet.
                    </p>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {articles.map((article) => (
                            <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Link href={`/blog/${article.slug}`} passHref>
                                        <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                            <div className="relative h-40 w-full">
                                                <Image
                                                    src={article.image.imageUrl}
                                                    alt={article.image.description}
                                                    fill
                                                    className="object-cover"
                                                    data-ai-hint={article.image.imageHint}
                                                />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="font-headline text-lg leading-snug hover:text-primary line-clamp-2">
                                                    {article.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col justify-between flex-grow">
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                    {article.summary}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                                    <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}</span>
                                                    <Badge variant="outline">{article.category}</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
                <div className="text-center mt-12">
                    <Button asChild>
                        <Link href="/blog">
                            Lihat Semua Artikel
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
      )}

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
