import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Wifi } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { faqs, offers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
             />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="container relative mx-auto max-w-7xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">
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
      </section>

      {/* Offers Section */}
      <section id="offers" className="w-full bg-background py-16 sm:py-24">
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
              <Card key={offer.id} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
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
                  <p className="font-semibold text-primary text-lg">{offer.price}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    {offer.promo && <p className="text-sm font-bold text-destructive mb-2">{offer.promo}</p>}
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
                    <Link href="/register">Pilih Paket</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
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
