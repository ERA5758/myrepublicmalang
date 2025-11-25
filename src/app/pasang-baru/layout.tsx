
import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Image from 'next/image';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Promo Spesial MyRepublic Malang - Gratis Instalasi!',
  description: 'Daftar internet MyRepublic sekarang dan dapatkan gratis biaya instalasi senilai Rp500.000. Internet cepat, unlimited, dan stabil untuk warga Malang.',
  robots: {
    index: false, // Disarankan untuk tidak mengindeks halaman landing page iklan
    follow: false,
  }
};

function LandingPageHeader() {
    return (
        <header className="py-4 border-b">
            <div className="container mx-auto flex justify-between items-center">
                 <Image 
                    src="https://iconlogovector.com/uploads/images/2025/04/lg-67fd7fa2b8b25-MyRepublic.webp"
                    alt="MyRepublic Malang Logo"
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

function LandingPageFooter() {
    return (
        <footer className="bg-muted py-4 mt-8">
            <div className="container mx-auto text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} MyRepublic Malang - Penawaran Khusus Pemasaran Online.</p>
            </div>
        </footer>
    )
}

export default function PasangBaruLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseProvider>
            <LandingPageHeader />
            <main>{children}</main>
            <LandingPageFooter />
            <FloatingWhatsApp />
            <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
