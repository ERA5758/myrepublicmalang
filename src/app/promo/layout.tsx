
import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Image from 'next/image';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import { Footer } from '@/components/layout/footer';
import Script from 'next/script';

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Promo Spesial MyRepublic - Internet & Bonus Melimpah!',
  description: 'Dapatkan internet super cepat dengan promo bayar di muka, gratis berbulan-bulan, plus bonus Speed Boost. Promo terbatas!',
  robots: {
    index: false,
    follow: false,
  }
};

function LandingPageHeader() {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto flex h-16 justify-between items-center px-4">
                 <Image 
                    src="https://i.ibb.co/7MP29XK/Picsart-25-11-28-12-55-53-228.png"
                    alt="MyRepublic Logo"
                    width={150}
                    height={40}
                    className="object-contain"
                />
                <div className="text-right">
                    <p className="font-semibold text-foreground">Mira Velicia</p>
                    <p className="text-sm text-muted-foreground">Sales Executive</p>
                </div>
            </div>
        </header>
    )
}

export default function PromoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Google tag (gtag.js) for Promo Page */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17791377719" strategy="afterInteractive" />
      <Script id="google-tag-promo" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17791377719');
        `}
      </Script>
      <FirebaseProvider>
          <LandingPageHeader />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Toaster />
      </FirebaseProvider>
    </div>
  );
}
